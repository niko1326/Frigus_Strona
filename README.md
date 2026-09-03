# FRIGAC - strona firmowa

Minimalistyczna, szybka strona dla FRIGAC (montaż klimatyzacji: Bydgoszcz, Toruń, Trójmiasto), z naciskiem na konwersję telefoniczną i SEO lokalne.

## Tech stack

- Astro + TypeScript
- Czyste CSS (bez ciężkiego JS, bez frameworków)
- Strona w pełni statyczna, tylko PL

## Local development

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
npm run preview
```

## Edycja danych biznesowych

Wszystkie główne dane są w jednym pliku: `src/config/site.ts`

- `PHONE_DISPLAY`, `PHONE_TEL` - telefon
- `SERVICE_AREAS` - obszar działania
- `COMPANY` - dane do stopki i regulaminu (NIP i adres: uzupełnij, gdy będą znane; puste pola nie są renderowane)
- `PRICING` - cena startowa i notka cenowa
- `HOURS` - godziny pracy
- `STATS` - liczby pokazywane na stronie głównej i "O nas"
- `ANALYTICS.ga4` - Google Analytics 4
- `VERIFICATION.googleSiteVerification` - Google Search Console

Metadane SEO (title/description/keywords) każdej podstrony: `src/i18n/content.ts`.
Artykuły blogowe (lista + metadane): `src/config/articles.ts`, treści w `src/pages/porady/`.

## Google Analytics 4

1. Utwórz usługę GA4 i skopiuj identyfikator pomiaru (`G-XXXXXXXXXX`).
2. W `src/config/site.ts` ustaw:

```ts
export const ANALYTICS = {
  ga4: {
    enabled: true,
    measurementId: 'G-XXXXXXXXXX'
  }
} as const;
```

## Google Search Console

1. Dodaj usługę (domena lub prefiks URL) w Search Console.
2. Przy weryfikacji meta tagiem skopiuj wartość `content` i wklej do `VERIFICATION.googleSiteVerification` w `src/config/site.ts`.
3. Po weryfikacji prześlij sitemapę: `https://frigac.pl/sitemap.xml`.

## SEO wbudowane w projekt

- `sitemap.xml` generowany z listy tras (`src/pages/sitemap.xml.ts`)
- `public/robots.txt`
- schema.org: HVACBusiness (każda strona), FAQPage (`/faq`), Article (artykuły)
- Open Graph + canonical na każdej stronie
- Podstrony lokalne: `/bydgoszcz`, `/trojmiasto`

## Zmiana domeny

Domena jest ustawiona na `https://frigac.pl` w trzech miejscach:

- `astro.config.mjs` (`site`)
- `src/config/site.ts` (`SITE.siteUrl`)
- `public/robots.txt` (link do sitemapy)

## Jak dodać zdjęcia

1. Dodaj zdjęcia do `public/photos/` (skompresowane, najlepiej WebP).
2. Galeria realizacji: podmień placeholdery w `src/components/PhotoGalleryPlaceholder.astro`.
3. Zdjęcie zespołu na "O nas": podmień placeholder w `src/pages/o-nas.astro`.

## Mapa Polski

`src/components/PolandMap.astro` - geometria województw z simplemaps.com (bezpłatna licencja komercyjna). Podświetlone regiony mają klasę `is-active`.

## Deploy na Cloudflare Pages

1. Wypchnij repo do GitHub.
2. Cloudflare Dashboard: Pages -> Create a project -> Connect to Git.
3. Build settings: preset `Astro`, build `npm run build`, output `dist`.
4. Podepnij domenę `frigac.pl`.
