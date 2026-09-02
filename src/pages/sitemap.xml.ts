import type { APIRoute } from 'astro';
import { ARTICLES } from '../config/articles';
import { SITE } from '../config/site';
import { routes } from '../i18n/content';

/**
 * Sitemap budowana automatycznie z realnie istniejących plików stron,
 * dzięki czemu nowa podstrona trafia do mapy bez ręcznej edycji.
 */
const pageModules = import.meta.glob('./**/*.astro', { eager: false });

const EXCLUDED = new Set(['/404']);

const discoveredPaths = Object.keys(pageModules)
  .map((file) =>
    file
      .replace(/^\.\//, '/')
      .replace(/\.astro$/, '')
      .replace(/\/index$/, '')
  )
  .map((path) => (path === '' ? '/' : path))
  .filter((path) => !EXCLUDED.has(path))
  // strony dynamiczne ([slug]) nie mają jednego adresu - pomijamy
  .filter((path) => !path.includes('['));

const articlePaths = ARTICLES.map((article) => `/porady/${article.slug}`);

const allPaths = Array.from(
  new Set([...Object.values(routes), ...discoveredPaths, ...articlePaths])
);

const articleDates = new Map(
  ARTICLES.map((article) => [`/porady/${article.slug}`, article.datePublished])
);

const buildDate = new Date().toISOString().slice(0, 10);

type UrlMeta = { changefreq: string; priority: string };

function metaFor(path: string): UrlMeta {
  if (path === '/') return { changefreq: 'weekly', priority: '1.0' };
  if (path === routes.pricing || path === routes.contact || path === routes.services) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (
    path === routes.bydgoszcz ||
    path === routes.trojmiasto ||
    path === routes.gree ||
    path === routes.kaisai
  ) {
    return { changefreq: 'monthly', priority: '0.8' };
  }
  if (path.startsWith('/porady/')) return { changefreq: 'monthly', priority: '0.7' };
  if (path === routes.privacy || path === routes.terms) {
    return { changefreq: 'yearly', priority: '0.3' };
  }
  return { changefreq: 'monthly', priority: '0.6' };
}

// Strona główna pierwsza, potem alfabetycznie - stabilna, czytelna kolejność.
const sortedPaths = allPaths.sort((a, b) => {
  if (a === '/') return -1;
  if (b === '/') return 1;
  return a.localeCompare(b, 'pl');
});

export const GET: APIRoute = () => {
  const urls = sortedPaths
    .map((path) => {
      const loc = new URL(path, SITE.siteUrl).toString();
      const { changefreq, priority } = metaFor(path);
      const lastmod = articleDates.get(path) ?? buildDate;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
