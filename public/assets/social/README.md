# Social logo sources

Downloaded 2026-10-08. Website profile URLs are unchanged.

- Facebook, TikTok, Discord, Telegram, X: SVG geometry from [Simple Icons](https://github.com/simple-icons/simple-icons/tree/develop/icons), distributed under [CC0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). Original files: facebook.svg, tiktok.svg, discord.svg, telegram.svg, x.svg. Their viewBoxes and paths are unchanged.
- BARQ! (updated 2026-10-09): verified against the official [Google Play listing for Android package com.furryapp](https://play.google.com/store/apps/details?id=com.furryapp&hl=en-US). Its [240px PNG app icon](https://play-lh.googleusercontent.com/8mbBTBQ9y4zXHenWeLnkXKXj57qYXzjim3HjAHgNZk-3Dj2RGx1zB9wjvfVUTA6oUP6oKQRksaYbyEKuJa3HrQ=w240-h480) is embedded unchanged in barq.svg as a luminance mask; no tracing, cropping or geometric approximation. Source PNG SHA-256: 0df85e657ae5dc75359aa6870f35a583068178eb86ab074a2152b1669f78142f. This supersedes the previous marketing small-mark vector.
- Bump (amo, Android co.amo.android.location): verified against [amo's homepage](https://amo.co/) and [Bump landing page](https://get.amo.co/en/bump). Official [PNG app icon](https://static.amo.co/shared/images/app-icons/location/20250123-167x167.png) is embedded unchanged inside bump.svg and used as a luminance mask. No verified official vector/monochrome version was found. This preserves the source geometry and tonal detail without tracing or inventing a replacement. The SVG is a raster-backed mask, not a vector redraw.

Facebook, TikTok, Discord, Telegram and X remain local monochrome CSS masks with `background: currentColor`.

## Pending approved image replacements (2026-10-12)

The approved transparent BARQ! artwork and Bump cutout are **not present in this workspace**. The existing local `barq.svg` and `bump.svg` masks are retained temporarily; they are not the final approved appearance. No replacement was fabricated or regenerated.

- BARQ!: awaiting the user-provided speech-bubble/wordmark artwork, with orange background removed, pale icy front bubble and indigo/blue-grey wordmark and rear bubble. Once supplied, serve the transparent local image directly, without a currentColor mask.
- Bump: awaiting the approved transparent cutout retaining its original colours. Once supplied, serve the local image directly, without a monochrome mask or square app background.

Current assets are all served locally, with no remote icon requests or runtime icon library. Logos remain trademarks of their respective owners; no affiliation or endorsement is implied.
