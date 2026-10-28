import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Static HTML cannot use per-request nonces. Hash the actual executable inline
// scripts after Astro has bundled/minified them; JSON-LD is inert data.
export function createSecurityHeaders(template, documents) {
  const hashes = new Set();
  for (const html of documents) {
    for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      if (/\bsrc\s*=/i.test(attributes)) continue;
      const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (type && !['module', 'text/javascript', 'application/javascript'].includes(type)) continue;
      if (body.trim()) hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
    }
  }
  if (!/script-src 'self'[^;]*;/.test(template)) throw new Error('Missing CSP script-src template');
  const headers = template.replace(/script-src 'self'([^;]*);/, `script-src 'self' ${[...hashes].sort().join(' ')}$1;`);
  if (headers.split('\n').some((line) => line.length > 2000)) {
    throw new Error('Cloudflare _headers line exceeds 2000 characters; split out inline scripts before deploying.');
  }
  return headers;
}

async function readDocuments(directory) {
  const documents = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) documents.push(...await readDocuments(path));
    else if (entry.name.endsWith('.html')) documents.push(await readFile(path, 'utf8'));
  }
  return documents;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = fileURLToPath(new URL('../dist/', import.meta.url));
  const template = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');
  const documents = await readDocuments(output);
  await writeFile(resolve(output, '_headers'), createSecurityHeaders(template, documents));
  console.log(`Security headers generated for ${documents.length} HTML documents.`);
}
