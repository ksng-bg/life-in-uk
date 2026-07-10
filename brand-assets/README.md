# KS is Building — Brand Assets

Icon: **concept 01, "Monogram Tile"** — white `KS` on the site's blue gradient
(`#2f6bff → #1e40af`).

## Masters (edit these, then regenerate)
- `ks-icon-rounded.svg` — rounded-corner tile, transparent corners. App icon / favicon.
- `ks-icon-square.svg` — full-bleed square (no rounding). Base for profile pictures.

## PNGs — `png/`
| File | Use |
|---|---|
| `ks-icon-1024/512/256.png` | App icon, store listings, general use (transparent corners) |
| `ks-icon-192/180.png` | PWA icon / Apple touch icon |
| `ks-icon-48/32/16.png` | Favicon raster sizes |
| `ks-profile-square-1024/512.png` | Profile pic where the platform crops to a circle itself (fills the frame) |
| `ks-profile-circle-1024/512.png` | Ready-made circular avatar (transparent outside the circle) |

- `favicon.ico` — multi-size (16/32/48) icon.

**Profile picture tip:** most platforms (GitHub, LinkedIn, X) crop a square to a circle
themselves — upload `ks-profile-square-1024.png` for those. Use `ks-profile-circle-1024.png`
only where you need a pre-cut transparent circle.

## Live site
`generate-brand-assets.js` also copies the live-referenced files into `public/`:
`favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`. The SVG favicon
lives at `public/icon.svg` and is wired into `app/layout.tsx`.

## Regenerate
```bash
npm i -D sharp png-to-ico     # one-time (build-only deps)
node scripts/generate-brand-assets.js
```
