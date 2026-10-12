import importlib.util
import unittest
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'scripts/sync-youtube-playlist.py'
spec = importlib.util.spec_from_file_location('music_sync', path)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
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
