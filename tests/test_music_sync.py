import importlib.util
import unittest
import copy
import json
import tempfile
import subprocess
from unittest.mock import patch
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'scripts/sync-youtube-playlist.py'
spec = importlib.util.spec_from_file_location('music_sync', path)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def sample(self):
        return sync.normalize({'entries': [{'id': 'T9xeQoG9-J8', 'title': 'Test metadata'}]})

    def test_atomic_validation_and_unchanged_timestamp(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'music.json'
            data = self.sample()
            self.assertTrue(sync.write_dataset(output, data))
            original = output.read_bytes()
            data['syncedAt'] = 'a later timestamp'
            self.assertFalse(sync.write_dataset(output, data))
            self.assertEqual(output.read_bytes(), original)
            invalid = [[], {}, {'tracks': []}]
            for mutation in ['empty', 'duplicate', 'id', 'url', 'title', 'root']:
                bad = copy.deepcopy(data)
                if mutation == 'empty': bad['tracks'] = []
                if mutation == 'duplicate': bad['tracks'] *= 2
                if mutation == 'id': bad['tracks'][0]['id'] = 'bad'
                if mutation == 'url': bad['tracks'][0]['youtubeUrl'] = 'https://music.youtube.com/'
                if mutation == 'title': bad['tracks'][0]['title'] = ''
                if mutation == 'root': bad['version'] = 99
                invalid.append(bad)
            for bad in invalid:
                with self.assertRaises(ValueError): sync.write_dataset(output, bad)
                self.assertEqual(output.read_bytes(), original)
            data['tracks'][0]['title'] = 'Changed metadata'
            self.assertTrue(sync.write_dataset(output, data))
            self.assertFalse(sync.write_dataset(output, data))
            self.assertEqual(list(Path(directory).glob('*.tmp')), [])

    def test_network_and_malformed_json_failure_preserve_production(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'music.json'
            sync.write_dataset(output, self.sample())
            original = output.read_bytes()
            for failure in [subprocess.CalledProcessError(1, 'yt-dlp'),
                            subprocess.CompletedProcess([], 0, stdout='{broken', stderr='')]:
                kwargs = {'side_effect': failure} if isinstance(failure, Exception) else {'return_value': failure}
                with patch.object(sync.sys, 'argv', ['sync', '--output', str(output)]), patch.object(sync.subprocess, 'run', **kwargs):
                    self.assertEqual(sync.main(), 1)
                self.assertEqual(output.read_bytes(), original)

    def test_conservative_title_and_artist(self):
        self.assertEqual(sync.clean_title('Stylized - Title (Official Video)'), 'Stylized - Title')
        self.assertEqual(sync.clean_title('Lyrics of my life'), 'Lyrics of my life')
        self.assertEqual(sync.clean_title('Song [LIVE / remix]'), 'Song [LIVE / remix]')
        metadata = {'entries': [{'id': 'T9xeQoG9-J8', 'title': 'Artist - Title', 'channel': 'Uploader'}]}
        track = sync.normalize(metadata)['tracks'][0]
        self.assertEqual(track['artist'], '')
        self.assertEqual(track['rawTitle'], 'Artist - Title')
        self.assertEqual(track['channel'], 'Uploader')

    def test_dedup_exclusions_and_manual_rarity(self):
        item = {'id': 'T9xeQoG9-J8', 'title': 'Test metadata only'}
        metadata = {'entries': [item, item, {'id': 'n0FWlMWVMBg', 'title': '[Private video]'}, None]}
        existing = {'tracks': [{'id': item['id'], 'rarity': 'epic', 'tags': ['manual']}]}
        data = sync.normalize(metadata, existing)
        self.assertEqual(data['report']['validTracks'], 1)
        self.assertEqual(data['report']['duplicatesRemoved'], 1)
        self.assertEqual(data['report']['unavailableReturned'], 2)
        self.assertEqual(data['tracks'][0]['rarity'], 'epic')
        self.assertEqual(data['tracks'][0]['tags'], ['manual'])
        self.assertEqual(sync.stable_rarity(item['id']), sync.stable_rarity(item['id']))


if __name__ == '__main__':
    unittest.main()
