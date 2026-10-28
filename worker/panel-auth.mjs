const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const privateHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Vary': 'Authorization'
};

/** Normalize every path before allowing the static asset service to handle it. */
export function normalizedAssetPath(pathname) {
  let path = pathname;
  for (let attempt = 0; attempt < 8; attempt++) {
    const decoded = decodeURIComponent(path);
    if (decoded === path) {
      if (/[\u0000-\u001f\u007f]/u.test(decoded)) throw new URIError('Invalid path');
      const parts = [];
      for (const part of decoded.replaceAll('\\', '/').split('/')) {
        if (!part || part === '.') continue;
        if (part === '..') parts.pop();
        else parts.push(part);
      }
      return '/' + parts.join('/');
    }
    path = decoded;
  }
  throw new URIError('Excessive path encoding');
}

export function isPanelPath(pathname) {
  const path = normalizedAssetPath(pathname).toLowerCase();
  return path === '/panel' || path.startsWith('/panel/') || path.startsWith('/panel.') || isOfferShortcut(path);
}

function isOfferShortcut(pathname) {
  return ['/oferty', '/oferty.html', '/oferty/index', '/oferty/index.html'].includes(normalizedAssetPath(pathname).toLowerCase());
}

function response(message, status, extraHeaders = {}) {
  return new Response(message, {
    status,
    headers: {
      ...privateHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      ...extraHeaders
    }
  });
}

function parseBasicCredentials(authorization) {
  if (!authorization || authorization.length > 8192) return null;
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(authorization);
  if (!match || match[1].length % 4 !== 0) return null;
  try {
    const decoded = atob(match[1]);
    // Reject alternate / malformed encodings instead of accepting partial data.
    if (btoa(decoded) !== match[1]) return null;
    const credentials = decoder.decode(Uint8Array.from(decoded, (character) => character.charCodeAt(0)));
    const separator = credentials.indexOf(':');
    if (separator <= 0 || separator === credentials.length - 1) return null;
    if (/[\u0000-\u001f\u007f]/u.test(credentials)) return null;
    return credentials;
  } catch {
    return null;
  }
}

/** Both digests have the same size; comparison visits all bytes for every input. */
async function credentialsMatch(actual, expected) {
  const digests = await Promise.all([actual, expected].map((value) =>
    crypto.subtle.digest('SHA-256', encoder.encode(value))));
  const left = new Uint8Array(digests[0]);
  const right = new Uint8Array(digests[1]);
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left[index] ^ right[index];
  return difference === 0;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let protectedPath;
    try { protectedPath = isPanelPath(url.pathname); }
    catch { return response('Nieprawidłowy adres.', 400); }
    if (!protectedPath) return env.ASSETS.fetch(request);

    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLocal)) {
      return response('Panel wymaga połączenia HTTPS.', 403);
    }
    // No fallback credentials: an unconfigured deployment cannot expose the panel.
    if (typeof env.PANEL_USERNAME !== 'string' || !env.PANEL_USERNAME || env.PANEL_USERNAME.includes(':') ||
        typeof env.PANEL_PASSWORD !== 'string' || !env.PANEL_PASSWORD) {
      return response('Panel nie jest skonfigurowany.', 503);
    }
    const credentials = parseBasicCredentials(request.headers.get('Authorization'));
    if (credentials === null || !await credentialsMatch(credentials, `${env.PANEL_USERNAME}:${env.PANEL_PASSWORD}`)) {
      return response('Zaloguj się, aby otworzyć panel.', 401, {
        'WWW-Authenticate': 'Basic realm="FrigAC panel", charset="UTF-8"'
      });
    }
    if (!['GET', 'HEAD'].includes(request.method)) return response('Niedozwolona metoda.', 405, { 'Allow': 'GET, HEAD' });

    if (isOfferShortcut(url.pathname)) return response(null, 302, { Location: '/panel/oferty/' + url.search });

    const asset = await env.ASSETS.fetch(request);
    const secured = new Response(asset.body, asset);
    for (const [key, value] of Object.entries(privateHeaders)) secured.headers.set(key, value);
    return secured;
  }
};
