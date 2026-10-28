import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import worker, { isPanelPath } from '../worker/panel-auth.mjs';

const username = 'test-operator';
const password = 'example-for-tests-only:with-colon';
const basic = (user = username, pass = password) => `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
function fixture(overrides = {}) {
  const calls = [];
  const env = {
    PANEL_USERNAME: username, PANEL_PASSWORD: password,
    ASSETS: { fetch: async (request) => {
      calls.push(request);
      return new Response('protected fixture', { headers: { 'Cache-Control': 'public, max-age=3600', 'Content-Type': 'text/html' } });
    } },
    ...overrides
  };
  return { env, calls };
}
const request = (path = '/panel/oferty/', authorization, options = {}) => new Request(`https://example.invalid${path}`, {
  ...options, headers: authorization ? { Authorization: authorization } : {}
});

test('public website assets remain available without panel secrets', async () => {
  const { env, calls } = fixture({ PANEL_USERNAME: undefined, PANEL_PASSWORD: undefined });
  const response = await worker.fetch(request('/klimatyzatory-gree/pular/'), env);
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=3600');
  assert.equal(response.headers.get('X-Robots-Tag'), null);
});

test('every static HTML alias and normalized panel path requires server authentication', async () => {
  const aliases = ['/panel', '/panel/', '/panel.html', '/panel/index.html', '/panel/oferty', '/panel/oferty/',
    '/panel/oferty.html', '/panel/oferty/index.html', '/panel/oferty/index', '/panel//oferty/',
    '/%70anel/oferty/', '/%2570anel/oferty/', '/panel%2Foferty%2Findex.html', '//panel/oferty/',
    '/folder%2f..%2fpanel/oferty/', '/panel%5coferty%5cindex.html', '/PANEL/oferty/',
    '/oferty', '/oferty/', '/oferty.html', '/oferty/index.html', '/%6fferty/', '/OFERTY/'];
  for (const path of aliases) {
    const { env, calls } = fixture();
    assert.equal(isPanelPath(new URL(`https://example.invalid${path}`).pathname), true, path);
    const response = await worker.fetch(request(path), env);
    assert.equal(response.status, 401, path);
    assert.equal(calls.length, 0, `${path}: must not fetch a static asset`);
    assert.match(response.headers.get('WWW-Authenticate'), /^Basic /);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.match(response.headers.get('X-Robots-Tag'), /noindex, nofollow/);
  }
});

test('offer shortcut redirects to the protected panel only after authentication', async () => {
  for (const path of ['/oferty', '/oferty/', '/oferty/index.html', '/oferty.html', '/%6fferty/']) {
    const { env, calls } = fixture();
    const result = await worker.fetch(request(path + '?view=preview', basic()), env);
    assert.equal(result.status, 302);
    assert.equal(result.headers.get('Location'), '/panel/oferty/?view=preview');
    assert.match(result.headers.get('Cache-Control'), /private, no-store/);
    assert.match(result.headers.get('X-Robots-Tag'), /noindex/);
    assert.equal(calls.length, 0);
    assert.equal((await worker.fetch(request(path), fixture({ PANEL_PASSWORD: undefined }).env)).status, 503);
  }
});

test('missing server secrets always fail closed, even with an otherwise valid header', async () => {
  const cases = [
    [{ PANEL_USERNAME: undefined }, /PANEL_USERNAME/, 'missing-panel-username'],
    [{ PANEL_PASSWORD: undefined }, /PANEL_PASSWORD/, 'missing-panel-password'],
    [{ PANEL_PASSWORD: '' }, /PANEL_PASSWORD/, 'missing-panel-password'],
    [{ PANEL_USERNAME: 'invalid:username' }, /nie może zawierać dwukropka/, 'invalid-panel-username']
  ];
  for (const [overrides, message, code] of cases) {
    const { env, calls } = fixture(overrides);
    const response = await worker.fetch(request('/panel/oferty/', basic()), env);
    assert.equal(response.status, 503);
    assert.equal(calls.length, 0);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.equal(response.headers.get('X-Panel-Config-Error'), code);
    assert.match(await response.text(), message);
  }
});

test('malformed and incorrect authorization never reaches static panel HTML', async () => {
  const headers = ['Bearer token', 'Basic invalid', 'Basic !!!!', 'Basic YQ==', 'Basic ' + Buffer.from('user:').toString('base64'),
    'Basic ' + Buffer.from(':password').toString('base64'), basic('wrong', password), basic(username, 'wrong'),
    'Basic  ' + basic().slice(6), basic() + ',extra', 'Basic /w=='];
  for (const authorization of headers) {
    const { env, calls } = fixture();
    const response = await worker.fetch(request('/panel/oferty/', authorization), env);
    assert.equal(response.status, 401);
    assert.equal(calls.length, 0);
  }
});

test('authenticated panel responses override public cache headers and prohibit indexing', async () => {
  const { env, calls } = fixture();
  const response = await worker.fetch(request('/panel/oferty/', basic()), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'protected fixture');
  assert.equal(calls.length, 1);
  assert.match(response.headers.get('Cache-Control'), /private, no-store/);
  assert.equal(response.headers.get('CDN-Cache-Control'), 'no-store');
  assert.match(response.headers.get('X-Robots-Tag'), /noindex, nofollow/);
  assert.equal(response.headers.get('Vary'), 'Authorization');
  assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
});

test('production panel rejects HTTP while local Wrangler development permits loopback HTTP', async () => {
  for (const host of ['example.invalid', 'localhost.example.invalid', '127.0.0.1.example.invalid']) {
    const { env, calls } = fixture();
    const response = await worker.fetch(new Request(`http://${host}/panel/oferty/`, { headers: { Authorization: basic() } }), env);
    assert.equal(response.status, 403);
    assert.equal(calls.length, 0);
  }
  for (const host of ['localhost:8787', '127.0.0.1:8787', '[::1]:8787']) {
    const { env, calls } = fixture();
    const response = await worker.fetch(new Request(`http://${host}/panel/oferty/`, { headers: { Authorization: basic() } }), env);
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
  }
});

test('panel does not forward unsupported methods or unprocessable encoded paths', async () => {
  const { env, calls } = fixture();
  const methodResponse = await worker.fetch(request('/panel/oferty/', basic(), { method: 'POST' }), env);
  assert.equal(methodResponse.status, 405);
  assert.equal(methodResponse.headers.get('Allow'), 'GET, HEAD');
  for (const path of ['/panel/%ff', '/panel/%00', '/%25252525252525252570anel/oferty/']) {
    const response = await worker.fetch(request(path, basic()), env);
    assert.equal(response.status, 400, path);
  }
  assert.equal(calls.length, 0);
});

test('deployment routes requests through authentication before serving static assets', async () => {
  const configuration = await readFile(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.match(configuration, /^main\s*=\s*"worker\/panel-auth\.mjs"/m);
  assert.match(configuration, /\[assets\][\s\S]*binding\s*=\s*"ASSETS"/);
  assert.match(configuration, /\[assets\][\s\S]*run_worker_first\s*=\s*true/);
});
