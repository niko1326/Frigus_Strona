import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { routeMap, type Locale } from '../i18n/content';

export const prerender = true;

const locales = ['pl', 'en'] as const satisfies readonly Locale[];

const absoluteUrl = (path: string): string => new URL(path, SITE.siteUrl).toString();

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const entries = Object.values(routeMap).flatMap((paths) =>
  locales.map((locale) => {
    const localizedUrls: Record<Locale, string> = {
      pl: absoluteUrl(paths.pl),
      en: absoluteUrl(paths.en)
    };

    return [
      '  <url>',
      `    <loc>${escapeXml(localizedUrls[locale])}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="pl" href="${escapeXml(localizedUrls.pl)}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(localizedUrls.en)}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(localizedUrls[SITE.defaultLocale])}" />`,
      '  </url>'
    ].join('\n');
  })
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  ''
].join('\n');

export const GET: APIRoute = () =>
  new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
