# Gallery assets

ART: add drawings, illustrations, commissions, fanart and character artwork to `art/`.
FURSUIT: add real suit portraits, fursuit photography and event/studio/outdoor photos to `fursuit/`.

Both folders currently contain zero images. `.gitkeep` only preserves empty directories.

Add one record per supplied image in `public/data/gallery.json` (currently `[]`):

```json
{
  "src": "assets/gallery/art/your-file.webp",
  "category": "art",
  "alt": "Write an accurate description after inspecting the real image",
  "width": 1200,
  "height": 1600
}
```

The example is a schema, not a real image record. Use category `fursuit` with the
`assets/gallery/fursuit/` folder for photos. No filename-based category guessing.
Dimensions must describe the real source. Optional `previewSrc` can point to a
smaller version in the same category folder; it should keep the same aspect ratio.
The full source is loaded on lightbox open. Keep descriptions factual; do not
invent captions for missing images. JPEG/PNG/WebP/AVIF/GIF are supported.

The gallery reads this one JSON source. Filters activate automatically when it
contains valid records. Up to five previews are shown per filter; extra records
produce a +N continuation tile and a scrollable dialog. Images retain their ratios.
