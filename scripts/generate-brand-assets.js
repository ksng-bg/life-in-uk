/*
 * Generates the "KS is Building" brand assets (concept 01 — Monogram Tile)
 * from SVG masters: PNGs at multiple sizes, a favicon.ico, an Apple touch icon,
 * and both full-bleed-square and true-circle versions for profile pictures.
 *
 * Run:  node scripts/generate-brand-assets.js
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const pngToIco = require('png-to-ico').default

const ROOT = path.join(__dirname, '..')
const BRAND = path.join(ROOT, 'brand-assets')
const PNG = path.join(BRAND, 'png')
const PUBLIC = path.join(ROOT, 'public')

for (const dir of [BRAND, PNG]) fs.mkdirSync(dir, { recursive: true })

const GRAD = `
  <defs>
    <linearGradient id="ksTile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f6bff"/>
      <stop offset="1" stop-color="#1e40af"/>
    </linearGradient>
  </defs>`

const KS_TEXT = `
  <text x="60" y="64" text-anchor="middle" dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif" font-weight="bold"
        font-size="56" letter-spacing="-3" fill="#ffffff">KS</text>`

// Rounded-corner tile (transparent corners) — the app icon / favicon.
const tileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${GRAD}
  <rect width="120" height="120" rx="28" fill="url(#ksTile)"/>${KS_TEXT}
</svg>`

// Full-bleed square (no rounding) — safe for circular profile crops.
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${GRAD}
  <rect width="120" height="120" fill="url(#ksTile)"/>${KS_TEXT}
</svg>`

// Save the SVG masters.
fs.writeFileSync(path.join(BRAND, 'ks-icon-rounded.svg'), tileSvg)
fs.writeFileSync(path.join(BRAND, 'ks-icon-square.svg'), squareSvg)

const render = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size, { fit: 'contain' }).png()

// Circular mask at a given size (transparent outside the circle).
const circleMask = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  )

async function main() {
  const out = []

  // Rounded app-icon / favicon PNGs (transparent corners).
  for (const size of [1024, 512, 256, 192, 180, 48, 32, 16]) {
    const file = path.join(PNG, `ks-icon-${size}.png`)
    await render(tileSvg, size).toFile(file)
    out.push(path.relative(ROOT, file))
  }

  // Full-bleed square profile PNGs (fill the frame; crop-safe).
  for (const size of [1024, 512]) {
    const file = path.join(PNG, `ks-profile-square-${size}.png`)
    await render(squareSvg, size).toFile(file)
    out.push(path.relative(ROOT, file))
  }

  // True-circle profile PNGs (transparent outside the circle).
  for (const size of [1024, 512]) {
    const base = await render(squareSvg, size).toBuffer()
    const file = path.join(PNG, `ks-profile-circle-${size}.png`)
    await sharp(base)
      .composite([{ input: circleMask(size), blend: 'dest-in' }])
      .png()
      .toFile(file)
    out.push(path.relative(ROOT, file))
  }

  // favicon.ico (16/32/48 packed).
  const icoBufs = await Promise.all(
    [16, 32, 48].map((s) => render(tileSvg, s).toBuffer())
  )
  const icoFile = path.join(BRAND, 'favicon.ico')
  fs.writeFileSync(icoFile, await pngToIco(icoBufs))
  out.push(path.relative(ROOT, icoFile))

  // Copy the assets the live site actually references into /public.
  fs.copyFileSync(icoFile, path.join(PUBLIC, 'favicon.ico'))
  fs.copyFileSync(path.join(PNG, 'ks-icon-180.png'), path.join(PUBLIC, 'apple-touch-icon.png'))
  fs.copyFileSync(path.join(PNG, 'ks-icon-192.png'), path.join(PUBLIC, 'icon-192.png'))
  fs.copyFileSync(path.join(PNG, 'ks-icon-512.png'), path.join(PUBLIC, 'icon-512.png'))
  out.push('public/favicon.ico', 'public/apple-touch-icon.png', 'public/icon-192.png', 'public/icon-512.png')

  console.log('Generated:\n  ' + out.join('\n  '))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
