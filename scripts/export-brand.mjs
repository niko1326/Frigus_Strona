import fs from 'node:fs/promises';
import sharp from 'sharp';
const wordmark = await fs.readFile('public/brand/frigac-wordmark.svg', 'utf8');
const word = wordmark.match(/<g[\s\S]*<\/g>/)[0];
const symbol = `<rect x="5" y="5" width="54" height="20" rx="7" stroke="#101820" stroke-width="4"/><g fill="none" stroke-width="4" stroke-linecap="round"><path d="M18 36Q25 45 18 54" stroke="#83cbbb"/><path d="M32 36Q39 45 32 54" stroke="#85c7da"/><path d="M46 36Q53 45 46 54" stroke="#83cbbb"/></g>`;
const lockup = `<svg x="0" y="11" width="102" height="22.023" viewBox="5 24.5 264 57">${word}</svg><svg x="110" y="8" width="34" height="32" viewBox="0 0 64 60" fill="none">${symbol}</svg>`;
const svg = (w,h,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
await fs.writeFile('public/brand/frigac-logo.svg', svg(144,44,lockup));
await fs.writeFile('public/favicon.svg', svg(64,64,`<g transform="translate(0 2)" fill="none">${symbol}</g>`));
await sharp(Buffer.from(svg(180,180,`<rect width="180" height="180" rx="36" fill="white"/><g transform="translate(18 20) scale(2.25)" fill="none">${symbol}</g>`))).png().toFile('public/apple-touch-icon.png');
// Central lockup stays clear of edge crops and profile-picture overlays.
const cover = svg(1702,630,`<rect width="1702" height="630" fill="white"/><g transform="translate(491 185) scale(5)">${lockup}</g>`);
await fs.writeFile('output/brand/frigac-facebook-cover.svg',cover);
await sharp(Buffer.from(cover)).png().toFile('output/brand/frigac-facebook-cover.png');
await sharp(Buffer.from(cover)).resize(851,315).png().toFile('output/brand/frigac-facebook-cover-851x315.png');
// Vector source for the social preview, retaining the existing copy and size.
const og = svg(1200,630,`<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1015"/><stop offset="1" stop-color="#17212b"/></linearGradient><linearGradient id="shell" x2="0" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#dce4ed"/></linearGradient><radialGradient id="air"><stop stop-color="#337da4" stop-opacity=".5"/><stop offset="1" stop-color="#337da4" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><g transform="translate(80 64) scale(1.85)">${lockup.replaceAll('#0d1f29','#ffffff').replaceAll('#101820','#ffffff')}</g><ellipse cx="1060" cy="358" rx="290" ry="180" fill="url(#air)"/><rect x="780" y="90" width="540" height="190" rx="40" fill="url(#shell)"/><rect x="814" y="238" width="480" height="24" rx="12" fill="#cdd6e1"/><g fill="white" font-family="Arial, sans-serif"><text x="80" y="310" font-size="72">Montaż klimatyzacji.</text><text x="80" y="386" font-size="72" font-weight="700">Czysto, w jeden dzień.</text><text x="80" y="548" font-size="40" font-weight="700" fill="#49afff">od 3499 zł z urządzeniem</text><text x="600" y="548" font-size="27" fill="#aebac9">Bydgoszcz · Toruń · Trójmiasto</text></g>`);
await fs.mkdir('source-assets/brand', {recursive:true});
await fs.writeFile('source-assets/brand/frigac-og.svg', og);
await sharp(Buffer.from(og)).png().toFile('public/og/frigac-og.png');
