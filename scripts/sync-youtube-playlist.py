#!/usr/bin/env python3
"""Sync public YouTube playlist metadata. Never download audio or video."""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

PLAYLIST_ID = "PLF_QC1tSP8yo"
OUTPUT = Path(__file__).resolve().parents[1] / "public/data/music.json"
RARITIES = {"common", "rare", "legendary", "epic"}
NOISE = r"(?:official (?:music video|mv|video|audio)|lyric(?:s| video)?)"


def clean_title(raw):
    # Only remove a recognized, bracketed suffix; preserve stylized song names.
    return re.sub(r"\s*[\[(]\s*" + NOISE + r"\s*[\])]\s*$", "", raw,
                  flags=re.I).strip() or raw


def stable_rarity(video_id):
    score = int.from_bytes(hashlib.sha256(video_id.encode()).digest()[:4], "big") / 2**32
    return "common" if score < .50 else "rare" if score < .78 else "legendary" if score < .94 else "epic"


def normalize(metadata, existing=None):
    old = {t["id"]: t for t in (existing or {}).get("tracks", []) if isinstance(t, dict) and "id" in t}
    entries = metadata.get("entries") or []
    tracks, seen, excluded, duplicates = [], set(), [], []
    for index, entry in enumerate(entries, 1):
        entry = entry if isinstance(entry, dict) else {}
        video_id, raw = entry.get("id", ""), entry.get("title") or ""
        reason = None
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
            reason = "missing/invalid videoId"
        elif not raw or raw.lower().strip("[] ") in {"private video", "deleted video", "unavailable video"}:
            reason = "unavailable/private/deleted title"
        elif entry.get("availability") in {"private", "premium_only", "subscriber_only", "needs_auth", "unavailable"}:
            reason = "availability: " + entry["availability"]
        if reason:
            excluded.append({"playlistIndex": index, "id": video_id, "rawTitle": raw, "reason": reason})
            continue
        if video_id in seen:
            duplicates.append({"playlistIndex": index, "id": video_id, "rawTitle": raw})
            continue
        seen.add(video_id)
        previous = old.get(video_id, {})
        images = [t for t in entry.get("thumbnails", []) if isinstance(t, dict) and t.get("url", "").startswith("https://")]
        image = min(images, key=lambda t: abs((t.get("width") or 336) - 336)) if images else {}
        # Only explicit artist metadata counts as confident; never infer from a dash or channel.
        artist = entry.get("artist") or ", ".join(entry.get("artists") or [])
        tracks.append({
            "id": video_id, "playlistIndex": entry.get("playlist_index") or index,
            "title": clean_title(raw), "rawTitle": raw, "artist": artist,
            "channel": entry.get("channel") or entry.get("uploader") or "",
            "youtubeUrl": "https://www.youtube.com/watch?v=" + video_id,
            "thumbnail": image.get("url", ""), "duration": entry.get("duration") or 0,
            "rarity": previous.get("rarity") if previous.get("rarity") in RARITIES else stable_rarity(video_id),
            "tags": previous.get("tags") if isinstance(previous.get("tags"), list) else [],
        })
    report = {"totalReturned": len(entries), "youtubePlaylistCount": metadata.get("playlist_count"),
              "validTracks": len(tracks), "duplicatesRemoved": len(duplicates),
              "unavailableReturned": len(excluded), "unknownArtist": sum(not t["artist"] for t in tracks),
              "rarityCounts": dict(Counter(t["rarity"] for t in tracks)),
              "duplicates": duplicates, "excluded": excluded}
    return {"version": 1, "playlistId": metadata.get("id") or PLAYLIST_ID,
            "playlistTitle": metadata.get("title") or "", "syncedAt": datetime.now(timezone.utc).isoformat(),
            "report": report, "tracks": tracks}


def validate(data):
    if not isinstance(data, dict) or data.get('version') != 1 or not isinstance(data.get('playlistId'), str):
        raise ValueError('Invalid playlist root structure')
    tracks = data.get('tracks')
    if not isinstance(tracks, list) or not tracks:
        raise ValueError('Playlist must contain at least one valid track')
    seen = set()
    for track in tracks:
        if not isinstance(track, dict):
            raise ValueError('Invalid track structure')
        video_id = track.get('id')
        if not isinstance(video_id, str) or not re.fullmatch(r'[A-Za-z0-9_-]{11}', video_id) or video_id in seen:
            raise ValueError('Invalid or duplicate video ID')
        seen.add(video_id)
        if track.get('youtubeUrl') != 'https://www.youtube.com/watch?v=' + video_id:
            raise ValueError('Invalid canonical YouTube URL')
        if not isinstance(track.get('title'), str) or not track['title'].strip():
            raise ValueError('Missing track title')


def write_dataset(output, data):
    validate(data)
    existing = json.loads(output.read_text(encoding='utf-8')) if output.exists() else None
    # A new sync timestamp alone must never create a weekly commit.
    comparable = lambda value: {k: v for k, v in value.items() if k != 'syncedAt'}
    if existing is not None and comparable(existing) == comparable(data):
        return False
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=output.parent,
                                         prefix=output.name + '.', suffix='.tmp', delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
        validate(json.loads(temporary.read_text(encoding='utf-8')))
        temporary.replace(output)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--playlist", default=PLAYLIST_ID, help="Playlist ID or URL")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    parser.add_argument("--input", type=Path, help="Normalize a previous yt-dlp JSON export without network")
    args = parser.parse_args()
    try:
        if args.input:
            metadata = json.loads(args.input.read_text(encoding="utf-8-sig"))
        else:
            url = args.playlist if args.playlist.startswith("https://") else "https://www.youtube.com/playlist?list=" + args.playlist
            executable = shutil.which("yt-dlp")
            command = [executable] if executable else [sys.executable, "-m", "yt_dlp"]
            result = subprocess.run(command + ["--flat-playlist", "--dump-single-json", "--skip-download",
                                               "--socket-timeout", "20", "--retries", "1", url],
                                    capture_output=True, text=True, encoding="utf-8", timeout=180, check=True)
            if result.stderr:
                print(result.stderr, file=sys.stderr)
            metadata = json.loads(result.stdout)
        if not isinstance(metadata, dict) or not isinstance(metadata.get("entries"), list):
            raise ValueError("Playlist response has no entries array")
        existing = json.loads(args.output.read_text(encoding="utf-8")) if args.output.exists() else None
        data = normalize(metadata, existing)
        changed = write_dataset(args.output, data)
        print('Dataset updated.' if changed else 'Dataset unchanged.')
        print(json.dumps(data["report"], ensure_ascii=False, indent=2))
        print("Metadata only. No audio/video downloaded.")
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        detail = getattr(error, "stderr", None) or str(error)
        print("Sync failed; existing data was not changed: " + detail, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
