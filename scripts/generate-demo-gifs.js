/*
 * Records three demo GIFs of the running app (dev server on :3000) for the About panel:
 *   1. collapsible-status.gif — the collapsible Question Status (expand, jump, collapse)
 *   2. focus-mode.gif         — typing a keyword and getting a highlighted topic drill
 *   3. responsive.gif         — the layout reflowing as the screen narrows
 *
 * Real screenshots are captured with Playwright, downscaled with sharp for crisp text,
 * and encoded to GIF with gifenc. Output -> public/demos/
 *
 * Prereq: dev server running (npm run dev) and:
 *   npm i -D playwright gifenc sharp && npx playwright install chromium
 * Run:  node scripts/generate-demo-gifs.js
 */
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')
const sharp = require('sharp')
const { GIFEncoder, quantize, applyPalette } = require('gifenc')

const BASE = 'http://localhost:3000'
const OUT = path.join(__dirname, '..', 'public', 'demos')
fs.mkdirSync(OUT, { recursive: true })

const HIDE_CSS = `
  [aria-label="About this page"] { display: none !important; }  /* floating About pill */
`

// Dismiss the cookie banner and hide the floating About pill so frames are clean.
async function prep(page) {
  try {
    await page.getByRole('button', { name: 'Decline All' }).click({ timeout: 2500 })
  } catch { /* already dismissed */ }
  await page.addStyleTag({ content: HIDE_CSS })
}

// A GIF builder that keeps a fixed frame size and lets each frame set its own delay.
function makeGif() {
  const enc = GIFEncoder()
  return {
    async add(pngBuffer, { width, delay = 1000 }) {
      const { data, info } = await sharp(pngBuffer)
        .resize({ width })
        .flatten({ background: '#ffffff' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true })
      const rgba = new Uint8Array(data)
      const palette = quantize(rgba, 256, { format: 'rgba4444' })
      const index = applyPalette(rgba, palette, 'rgba4444')
      enc.writeFrame(index, info.width, info.height, { palette, delay })
    },
    save(file) {
      enc.finish()
      fs.writeFileSync(file, Buffer.from(enc.bytes()))
      const kb = (fs.statSync(file).size / 1024).toFixed(0)
      console.log(`  saved ${path.relative(process.cwd(), file)} (${kb} KB)`)
    },
  }
}

const ENCODE_W = 760 // display width inside the ~720px About popup (a touch of headroom)

async function main() {
  const only = process.env.DEMO // 'collapsible' | 'focus' | 'responsive' — omit to record all
  const browser = await chromium.launch()

  /* ---------- 1) Collapsible Question Status (test mode) ---------- */
  if (!only || only === 'collapsible') {
    console.log('Recording: collapsible Question Status')
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 880 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/test`, { waitUntil: 'networkidle' })
    await page.getByText('Question Status').waitFor({ timeout: 15000 })
    await prep(page)
    const gif = makeGif()
    const shot = async (delay) => gif.add(await page.screenshot(), { width: ENCODE_W, delay })

    await shot(1700)                                   // collapsed — question + Next visible
    await page.getByText('Question Status').click()    // expand
    await page.waitForTimeout(280)
    await shot(1700)                                   // grid revealed
    await page.getByRole('button', { name: '8', exact: true }).click()  // jump to Q8
    await page.waitForTimeout(250)
    await shot(1600)
    await page.getByRole('button', { name: '17', exact: true }).click() // jump to Q17
    await page.waitForTimeout(250)
    await shot(1600)
    await page.getByText('Question Status').click()    // collapse again
    await page.waitForTimeout(280)
    await shot(1700)
    gif.save(path.join(OUT, 'collapsible-status.gif'))
    await ctx.close()
  }

  /* ---------- 2) Focus Mode ---------- */
  if (!only || only === 'focus') {
    console.log('Recording: Focus Mode')
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 660 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/focus`, { waitUntil: 'networkidle' })
    await prep(page)
    const gif = makeGif()
    const shot = async (delay) => gif.add(await page.screenshot(), { width: ENCODE_W, delay })

    await shot(1500)                                            // landing
    await page.getByPlaceholder('e.g. Parliament or 1918').click()
    await page.getByPlaceholder('e.g. Parliament or 1918').type('Parliament', { delay: 90 })
    await shot(1300)                                            // keyword typed
    await page.getByRole('button', { name: 'Start Focus' }).click()
    await page.getByText('Question Status').waitFor({ timeout: 15000 })
    await prep(page)
    await page.waitForTimeout(300)
    await shot(1900)                                            // drill built, keyword highlighted
    await page.locator('div.space-y-3 > button').first().click()  // pick an answer
    await page.waitForTimeout(200)
    await shot(1000)
    await page.getByRole('button', { name: 'Check' }).click()   // instant feedback
    await page.waitForTimeout(300)
    await shot(2200)                                            // result + highlighted explanation
    gif.save(path.join(OUT, 'focus-mode.gif'))
    await ctx.close()
  }

  /* ---------- 3) Responsive layout ---------- */
  if (!only || only === 'responsive') {
    console.log('Recording: responsive layout')
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    // Set up an answered focus question so both columns have content to reflow.
    await page.goto(`${BASE}/focus`, { waitUntil: 'networkidle' })
    await prep(page)
    await page.getByPlaceholder('e.g. Parliament or 1918').fill('Parliament')
    await page.getByRole('button', { name: 'Start Focus' }).click()
    await page.getByText('Question Status').waitFor({ timeout: 15000 })
    await prep(page)
    await page.locator('div.space-y-3 > button').first().click()
    await page.getByRole('button', { name: 'Check' }).click()
    await page.waitForTimeout(300)

    // Composite each width as a centered "screen" on a fixed canvas so frames stay same-size.
    const CANVAS_W = 760
    const CANVAS_H = 540
    const BG = { r: 226, g: 232, b: 242, alpha: 1 } // slate-200-ish, matches brand neutral
    const gif = makeGif()

    const widths = [1000, 1000, 900, 800, 768, 680, 560, 460, 390, 390, 460, 560, 680, 768, 900, 1000]
    for (let i = 0; i < widths.length; i++) {
      const w = widths[i]
      await page.setViewportSize({ width: w, height: 820 })
      await page.waitForTimeout(120)
      const shot = await page.screenshot({ fullPage: true })
      // Fit the full page into the canvas (contain) — wide pages cap on width, narrow on height.
      const inner = await sharp(shot)
        .resize({ width: CANVAS_W - 48, height: CANVAS_H - 48, fit: 'inside', withoutEnlargement: true })
        .flatten({ background: '#ffffff' })
        .toBuffer()
      const frame = await sharp({ create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: BG } })
        .composite([{ input: inner, gravity: 'center' }])
        .png()
        .toBuffer()
      const isEnd = i === 0 || i === widths.length - 1
      const isHold = w === 390 && (widths[i - 1] === 390 || widths[i + 1] === 390)
      await gif.add(frame, { width: CANVAS_W, delay: isEnd ? 1400 : isHold ? 1200 : 420 })
    }
    gif.save(path.join(OUT, 'responsive.gif'))
    await ctx.close()
  }

  await browser.close()
  console.log('All demo GIFs generated ->', path.relative(process.cwd(), OUT))
}

main().catch((e) => { console.error(e); process.exit(1) })
