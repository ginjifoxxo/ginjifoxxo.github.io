# Gallery assets

ART: add drawings, illustrations, commissions, fanart and character artwork to `art/`.
FURSUIT: add real suit portraits, fursuit photography and event/studio/outdoor photos to `fursuit/`.

Current supplied collection: 23 Art images and 17 Fursuit photos (40 total). Original filenames and files are preserved.
`.gitkeep` keeps the upload directories available.

Add one record per supplied image in `public/data/gallery.json` (currently 40 records):

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

The gallery reads this one JSON source; it does not scan upload folders.
Filters activate automatically when it contains valid records. The All preview
uses the five records with `featuredOrder: 1` through `featuredOrder: 5`, in that
order. Keep those values unique; omit the field on ordinary additions. Art and
Fursuit show their first five records in stable data order. Nothing is shuffled.
More than five matching records adds a label-only View more tile opening the
complete collection. Five images plus this tile form a responsive asymmetric
collage; preview images may crop conservatively. The full collection and
individual lightbox preserve natural image proportions without cropping.

Current featured order: `f444739072.jpg`,
`1D0B7C4632D45BF540CB873C7D2F38CA.png`, `1-10.jpg` (Fursuit),
`2025-04-23-19-28-25-019.jpg`, `98270F26C29495430D81591E6AB18146.png`.
