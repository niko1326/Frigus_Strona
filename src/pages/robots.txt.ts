import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const prerender = true;

const robots = ['User-agent: *', 'Allow: /', `Sitemap: ${new URL('/sitemap.xml', SITE.siteUrl).toString()}`, ''].join(
  '\n'
);

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
