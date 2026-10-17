# Gallery assets

ART: add drawings, illustrations, commissions, fanart and character artwork to `art/`.
FURSUIT: add real suit portraits, fursuit photography and event/studio/outdoor photos to `fursuit/`.

Current supplied collection: 23 Art images and 18 Fursuit photos (41 total). Original filenames and files are preserved.
`.gitkeep` keeps the upload directories available.

Add one record per supplied image in `public/data/gallery.json` (currently 41 records):

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
Dimensions must describe the real source. Generated `previewSrc` and
`smallPreviewSrc` point to separate WebPs; `previewWidth`/`previewHeight` and
`smallPreviewWidth`/`smallPreviewHeight` describe their actual encoded sizes.
The full source is loaded on lightbox open. Keep descriptions factual; do not
invent captions for missing images. JPEG/PNG/WebP/AVIF/GIF are supported.

The gallery reads this one JSON source; it does not scan upload folders.
Filters activate automatically when it contains valid records. All keeps the
five `featuredOrder: 1` through `featuredOrder: 5` records. Art/Fursuit use five
explicit `categoryPreviewOrder` values within each category, excluding All's
featured sources from previews only. All full collections keep their data order.
Keep each rank unique; ordinary additions omit these fields. Nothing is shuffled.

`moreOrder: { "all": 1, "art": 2 }` gives an image a stable rank (1–4) for each
View more background it belongs to. Four unique matching images form a 2×2
mini-collage under a cool dark overlay; none overlap that filter's five previews.
There is no remaining-image count. The button still opens the complete collection.

Optional `previewPosition: "50% 30%"` sets object-position only for cropped
preview and mini images. Full gallery and lightbox keep natural/contain rendering.
Original files are never cropped or rewritten. Desktop All retains its approved
composition; Art uses a tall left portrait, two square panels and two landscapes
plus a wide View more strip. Fursuit uses a landscape lead, two portraits, a
close-up and a wide garden photo. Tablet simplifies grids; mobile uses two
columns, switching to one below 360px. All share the same outer gallery width.

Current featured order: `f444739072.jpg`,
`1D0B7C4632D45BF540CB873C7D2F38CA.png`, `1-10.jpg` (Fursuit),
`2025-04-23-19-28-25-019.jpg`, `98270F26C29495430D81591E6AB18146.png`.

## Local preview generation

After adding an original and its JSON record, run:

```powershell
python -m pip install Pillow
python scripts/generate-gallery-previews.py
node --test tests/*.test.cjs
```

The offline helper uses Pillow to apply EXIF orientation, preserve alpha,
and resize without upscaling. Originals are never modified. Medium WebPs:
`previews/{art,fursuit}/`, long edge <=1200, quality 80. Small WebPs:
`previews-small/{art,fursuit}/`, long edge <=600, quality 75. Both use method 6.
Names hash the original path and bytes and include output settings. Unchanged
outputs are verified and reused; changed sources receive new names. Review
obsolete derivatives manually rather than deleting originals or assets blindly.

Commit the derivatives and updated JSON together. The generator does not scan
folders, so add metadata first. No build framework or cloud conversion is needed.
The collage and on-demand full dialog use lazy/async, low-priority previews;
responsive srcset can choose the small variant. View more uses only small WebPs.
Only an image lightbox requests the original, and closes by removing its source.
Closing the full dialog clears its cards. No Gallery image preloads are added.

The collage retains fade/scale but has no CSS blur. Other content keeps its
existing reversible reveal. No permanent GPU layers or paint containment are
added: containment would clip the approved outer shadows/focus outlines.

Performance snapshot before the latest addition (40 images; decimal MB, five medium + four small after):

| Filter | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| All | 29.564641 MB | 0.584306 MB | 98.02% |
| Art | 12.066334 MB | 0.462836 MB | 96.16% |
| Fursuit | 33.757663 MB | 0.529030 MB | 98.43% |

Original total: 95,807,114 bytes (40). Medium total: 2,893,234 bytes (40).
Small total: 982,922 bytes (40). Srcset/cache can reduce actual transfers further.

## Art preview

- `comm Nhật Võ.png` — focus `50% 70%`.
- `1.png` — focus `50% 28%`.
- `IMG_1627.png` — focus `50% 30%`.
- `522984271_1820757332193958_2115214187605010279_n.jpg` — focus `50% 45%`.
- `Không Có Tiêu Đề2411_20241223004842.png` — focus `50% 48%`.

## Fursuit preview

- `DSCF0526.jpg` — focus `50% 50%`.
- `f442952192.jpg` — focus `50% 58%`.
- `DSC09709.jpg` — focus `50% 28%`.
- `DSC00346.JPG` — focus `55% 38%`.
- `IMG_6261.JPG` — focus `50% 45%`.

## All View more

- `art/AF1D8EA6830A2BC5B7BA8E108FD5744E.png`.
- `art/w effects.PNG`.
- `fursuit/DSC09760a.jpg`.
- `fursuit/IMG_6218.JPG`.

## Art View more

- `art/486995934_626312330320504_7868608711666537376_n.jpg`.
- `art/AF1D8EA6830A2BC5B7BA8E108FD5744E.png`.
- `art/IMG_0754.PNG`.
- `art/w effects.PNG`.

## Fursuit View more

- `fursuit/1-11.jpg`.
- `fursuit/DSC00287.JPG`.
- `fursuit/DSC07340-Enhanced-NR.jpg`.
- `fursuit/IMG_6218.JPG`.
