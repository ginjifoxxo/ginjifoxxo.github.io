"""Generate local WebP derivatives; never modify original gallery images.

Run: python scripts/generate-gallery-previews.py (requires Pillow).
Content-derived names make repeat runs cheap and invalidate changed sources.
"""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageOps

PUBLIC = Path(__file__).resolve().parents[1] / 'public'
DATA = PUBLIC / 'data/gallery.json'
VARIANTS = (('preview', 'previews', 1200, 80),
            ('smallPreview', 'previews-small', 600, 75))


def generate():
    records = json.loads(DATA.read_text(encoding='utf-8'))
    for item in records:
        source = (PUBLIC / item['src']).resolve()
        category = item['category']
        expected = (PUBLIC / 'assets/gallery' / category).resolve()
        if category not in ('art', 'fursuit') or source.parent != expected:
            raise ValueError(f'Unexpected original path: {source}')
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        # Include original path to keep distinct records collision-free.
        identity = hashlib.sha256((item['src'] + digest).encode()).hexdigest()[:24]
        with Image.open(source) as original:
            oriented = ImageOps.exif_transpose(original)
            image = oriented.convert('RGBA' if 'A' in oriented.getbands() or 'transparency' in oriented.info else 'RGB')
            for key, folder, edge, quality in VARIANTS:
                relative = f'assets/gallery/{folder}/{category}/{identity}-{edge}-q{quality}.webp'
                target = PUBLIC / relative
                thumb = image.copy()
                thumb.thumbnail((edge, edge), Image.Resampling.LANCZOS)
                target.parent.mkdir(parents=True, exist_ok=True)
                if not target.exists():
                    # Save atomically, stripping EXIF after applying orientation.
                    temporary = target.with_suffix('.webp.tmp')
                    thumb.save(temporary, format='WEBP', quality=quality, method=6)
                    temporary.replace(target)
                with Image.open(target) as generated:
                    generated.verify()
                item[key + 'Src'] = relative
                item[key + 'Width'], item[key + 'Height'] = thumb.size
    content = json.dumps(records, ensure_ascii=False, indent=2) + '\n'
    if DATA.read_text(encoding='utf-8') != content:
        temporary = DATA.with_suffix('.json.tmp')
        temporary.write_text(content, encoding='utf-8', newline='\n')
        temporary.replace(DATA)
    print(f'Validated {len(records)} originals; medium and small WebPs ready.')


if __name__ == '__main__':
    generate()
