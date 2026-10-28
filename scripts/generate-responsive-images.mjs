import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Run after changing public product photos or certificate previews.
// Full certificate documents and original product images are never overwritten.
const sourceDirectories = [
  'public/photos/modele',
  'public/photos/modele/kolory',
  'public/certificates'
];
const manifest = {};
let originalBytes = 0;
let previewBytes = 0;

for (const directory of sourceDirectories) {
  const filenames = (await readdir(directory)).filter((name) => name.endsWith('.webp')).sort();
  for (const filename of filenames) {
    const source = path.join(directory, filename);
    const { width, height } = await sharp(source).metadata();
    if (!width || !height) throw new Error(`Missing image dimensions: ${source}`);
    const image = { width, height, variants: [] };
    const isCertificate = directory === 'public/certificates';
    const isColorImage = directory.endsWith('/kolory');
    const widths = isCertificate ? [480, 720, 1040] : isColorImage ? [240, 480, 720] : [];

    for (const targetWidth of widths.filter((candidate) => candidate <= width)) {
      const targetDirectory = path.join(directory, 'responsive');
      await mkdir(targetDirectory, { recursive: true });
      const target = path.join(targetDirectory, `${path.parse(filename).name}-${targetWidth}.webp`);
      const result = await sharp(source)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: isCertificate ? 80 : 82, effort: 6 })
        .toFile(target);
      image.variants.push({ src: `/${target.replace(/^public\//, '')}`, width: result.width });
      if (isCertificate && targetWidth === 720) previewBytes += result.size;
    }

    // Certificate previews stay separate from the full documents linked by each card.
    if (!isCertificate) image.variants.push({ src: `/${source.replace(/^public\//, '')}`, width });
    if (isCertificate) originalBytes += (await stat(source)).size;
    manifest[`/${source.replace(/^public\//, '')}`] = image;
  }
}

await writeFile('src/config/responsive-images.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Certificate previews (720px): ${previewBytes} B; originals: ${originalBytes} B.`);
