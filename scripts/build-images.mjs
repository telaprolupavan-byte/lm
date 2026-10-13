// Builds the site's image assets into public/assets.
//
// Always: the 1200x630 social share image (og-image.jpg).
// When photos are present in the project root:
//   pic1.jpeg = high-resolution source, pic.png = background-removed cutout (same framing).
//   The cutout's alpha mask is upscaled and applied to the high-res photo so the face stays sharp,
//   then exported as responsive WebP portraits (portrait-420/720/1100.webp).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

// librsvg finds fonts through fontconfig, so point it at the bundled Bebas Neue (scripts/fonts, OFL licence)
// before sharp loads — the share image then uses the site's display face instead of a system fallback.
const fontConf = join(tmpdir(), 'portfolio-fonts.conf');
writeFileSync(
  fontConf,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${resolve('scripts/fonts')}</dir><include ignore_missing="yes">/etc/fonts/fonts.conf</include></fontconfig>`,
);
process.env.FONTCONFIG_FILE = fontConf;
const { default: sharp } = await import('sharp');

const OUT = 'public/assets';
mkdirSync(OUT, { recursive: true });

let cutout = null;
if (existsSync('pic1.jpeg') && existsSync('pic.png')) {
  const { width, height } = await sharp('pic1.jpeg').metadata();
  const alpha = await sharp('pic.png')
    .ensureAlpha()
    .extractChannel('alpha')
    .resize(width, height, { kernel: 'lanczos3' })
    .blur(0.8)
    .raw()
    .toBuffer();

  const rgb = await sharp('pic1.jpeg').removeAlpha().raw().toBuffer();
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = alpha[i];
  }
  cutout = await sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();

  // Never upscale: a size wider than the source is written at the source width.
  for (const w of [1100, 720, 420]) {
    await sharp(cutout).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toFile(`${OUT}/portrait-${w}.webp`);
  }
  console.log('portraits built');
} else {
  console.log('no pic1.jpeg + pic.png found — skipping portraits, using the data-art share image');
}

// Rising bar chart used when there's no portrait.
const bars = [150, 205, 175, 250, 228, 300, 270, 345, 318, 392, 365, 430, 470]
  .map((h, i) => {
    const x = 690 + i * 36;
    const hh = h * 1.05;
    return `<rect x="${x}" y="${600 - hh}" width="24" height="${hh}" rx="4" fill="url(#b)"/><rect x="${x}" y="${600 - hh}" width="24" height="3" fill="#ff8a9a"/>`;
  })
  .join('');

const layers = [
  {
    input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g" cx="78%" cy="45%" r="45%"><stop offset="0" stop-color="#e5132b" stop-opacity="0.45"/><stop offset="1" stop-color="#e5132b" stop-opacity="0"/></radialGradient>
        <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff3d5a" stop-opacity="0.95"/><stop offset="1" stop-color="#3a0710" stop-opacity="0.15"/></linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#g)"/>
      ${cutout ? '' : bars}
    </svg>`),
  },
];
if (cutout) layers.push({ input: await sharp(cutout).resize({ height: 600 }).png().toBuffer(), gravity: 'southeast' });
layers.push({
  input: Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <text x="70" y="250" font-family="'Bebas Neue', Impact, sans-serif" font-size="150" fill="#f4f1ec" letter-spacing="4">LIKITHA</text>
    <text x="72" y="372" font-family="'Bebas Neue', Impact, sans-serif" font-size="150" fill="#f4f1ec" letter-spacing="4">MAGHAM</text>
    <text x="76" y="430" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="24" fill="#ff3d5a" letter-spacing="8">DATA ANALYST · MEIJER</text>
    <text x="76" y="480" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="18" fill="#a7a6ad" letter-spacing="4">SQL • PYTHON • POWER BI • SNOWFLAKE</text>
  </svg>`),
});

await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#07070a' } })
  .composite(layers)
  .jpeg({ quality: 85 })
  .toFile(`${OUT}/og-image.jpg`);
console.log('share image built');
