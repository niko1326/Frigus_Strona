import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { ENERGY_MODELS } from '../src/config/lineups.ts';

// Read pixels to measure display bounds only. Original assets are never modified.
const paths = [...new Set(ENERGY_MODELS.flatMap(model => [model.image, ...(model.product?.colors ?? []).map(color => color.image)]))];
const bounds = {};
for (const path of paths) {
  const source = new URL('../public' + path, import.meta.url);
  const { hasAlpha } = await sharp(source.pathname).metadata();
  const { data, info } = await sharp(source.pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const index = (y * info.width + x) * 4;
    if (data[index + 3] > 32 && (hasAlpha || Math.min(data[index], data[index + 1], data[index + 2]) < 240)) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right <= left || bottom <= top) throw new Error(`No product bounds: ${path}`);
  bounds[path] = { left, top, width: right - left + 1, height: bottom - top + 1, sourceWidth: info.width, sourceHeight: info.height };
}
await writeFile(new URL('../src/config/offer-image-bounds.json', import.meta.url), JSON.stringify(bounds, null, 2) + '\n');
console.log(`Measured ${paths.length} product photos; inspect offer previews after changing source assets.`);
