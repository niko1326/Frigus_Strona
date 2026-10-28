import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createSecurityHeaders } from '../scripts/build-security-headers.mjs';

const template = "/*\n  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com;\n";

test('CSP authorizes exact inline scripts without allowing arbitrary inline execution', () => {
  const body = '\nwindow.example = "klimatyzacja";\n';
  const expected = createHash('sha256').update(body).digest('base64');
  const html = `<script>${body}</script><script type="module">${body}</script>`;
  const result = createSecurityHeaders(template, [html, html]);
  assert.ok(result.includes(`'sha256-${expected}'`));
  assert.equal(result.match(/sha256-/g)?.length, 1);
  assert.ok(!result.includes("'unsafe-inline'"));
  assert.ok(result.includes('https://www.googletagmanager.com'));
  const changed = createSecurityHeaders(template, [html.replaceAll('klimatyzacja', 'ogrzewanie')]);
  assert.notEqual(changed, result);
});

test('CSP ignores inert JSON data and external script elements', () => {
  const result = createSecurityHeaders(template, ['<script type="application/ld+json">{"name":"FRIGAC"}</script><script src="/app.js"></script>']);
  assert.ok(!result.includes('sha256-'));
});

test('CSP generation fails if Cloudflare would reject its header line', () => {
  const documents = Array.from({ length: 45 }, (_, i) => `<script>window.example=${i}</script>`);
  assert.throws(() => createSecurityHeaders(template, documents), /2000 characters/);
});
