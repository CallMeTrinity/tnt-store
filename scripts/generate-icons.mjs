// Generates the PWA PNG icons (blaze-orange tile, "TNT" lettering, hazard
// stripe) without any image dependency: pixels are drawn into an RGBA buffer
// and encoded as PNG by hand. Run with `npm run icons`.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

const BG = [0xff, 0x5c, 0x00, 0xff] // blaze-500
const FG = [0x0e, 0x0c, 0x0a, 0xff] // coal-950

// 5x7 bitmap glyphs
const GLYPHS = {
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
}
const TEXT = 'TNT'
const COLS = TEXT.length * 5 + (TEXT.length - 1) // 1-cell gap between glyphs
const ROWS = 7

const CRC_TABLE = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[n] = c >>> 0
}

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const out = Buffer.alloc(body.length + 8)
  out.writeUInt32BE(data.length, 0)
  body.copy(out, 4)
  out.writeUInt32BE(crc32(body), body.length + 4)
  return out
}

function encodePng(size, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr.set([8, 6, 0, 0, 0], 8) // 8-bit RGBA
  const stride = 1 + size * 4
  const raw = Buffer.alloc(size * stride)
  for (let y = 0; y < size; y++) pixels.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function textPixelOn(col, row) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false
  const glyphIndex = Math.floor(col / 6)
  const glyphCol = col % 6
  if (glyphCol === 5) return false // gap column
  return GLYPHS[TEXT[glyphIndex]][row][glyphCol] === '1'
}

function drawIcon(size, padRatio) {
  const px = Buffer.alloc(size * size * 4)
  const cell = Math.floor((size * (1 - 2 * padRatio)) / COLS)
  const textW = COLS * cell
  const textH = ROWS * cell
  const stripeTop = Math.round(size * 0.84)
  const x0 = Math.round((size - textW) / 2)
  const y0 = Math.round((stripeTop - textH) / 2)
  const stripeW = Math.max(8, Math.round(size * 0.07))

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let color = BG
      if (y >= stripeTop) {
        // hazard band along the bottom edge
        if (Math.floor((x + (y - stripeTop)) / stripeW) % 2 === 0) color = FG
      } else if (textPixelOn(Math.floor((x - x0) / cell), Math.floor((y - y0) / cell))) {
        color = FG
      }
      px.set(color, (y * size + x) * 4)
    }
  }
  return encodePng(size, px)
}

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, 'icon-192.png'), drawIcon(192, 0.12))
writeFileSync(join(OUT_DIR, 'icon-512.png'), drawIcon(512, 0.12))
writeFileSync(join(OUT_DIR, 'icon-maskable-512.png'), drawIcon(512, 0.2)) // extra padding for the mask safe zone
writeFileSync(join(OUT_DIR, 'apple-touch-icon.png'), drawIcon(180, 0.12))
console.log(`PWA icons written to ${OUT_DIR}`)
