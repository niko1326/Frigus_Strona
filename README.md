# FRIGAC Astro Website

Minimalistyczna, szybka strona marketingowa z naciskiem na kontakt bezpośredni.

## Tech stack

- Astro + TypeScript
- Czyste CSS (bez ciężkiego JS)
- Statyczne strony PL/EN

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

## Edycja danych strony i firmy

Wszystkie główne dane biznesowe są w jednym pliku:

- `src/config/site.ts`

Typowane dane marek i modeli klimatyzatorów są w:

- `src/config/equipment.ts`

Kluczowe pola:

- `SITE.brandName`, `SITE.siteUrl`
- `BUSINESS.legalName`
- `BUSINESS.contact.phone`, `BUSINESS.contact.email`
- `BUSINESS.availability`
- `BUSINESS.pricing`, `BUSINESS.warranty`
- `BUSINESS.serviceArea`, `BUSINESS.travel`
- `BUSINESS.credentials`
- `ANALYTICS.cloudflare`

Dane kontaktowe i zatwierdzone wartości biznesowe nie są duplikowane w komponentach.

## Struktura językowa

- Polski: `/`, `/uslugi`, `/klimatyzatory/`, `/klimatyzatory/gree/`, `/klimatyzatory/kaisai/`, `/cennik`, `/faq`, `/kontakt`
- English: `/en/`, `/en/services`, `/en/air-conditioners/`, `/en/air-conditioners/gree/`, `/en/air-conditioners/kaisai/`, `/en/pricing`, `/en/faq`, `/en/contact`

Mapowanie tras i metadata SEO:

- `src/i18n/content.ts`

Treści podstron urządzeń:

- `src/i18n/equipment-content.ts`

Listę polecanych modeli KAISAI pozostawiono pustą do czasu zatwierdzenia konkretnych urządzeń. Karty obsługują opcjonalne obrazy z wymiarami i tekstami alternatywnymi PL/EN; nie należy dodawać zastępczych zdjęć innej marki.

## Zdjęcia realizacji

Sekcja realizacji pozostaje wyłączona do czasu zatwierdzenia zdjęć przeznaczonych do publikacji.
Po ich dodaniu do `public/photos/` należy użyć zoptymalizowanych formatów WebP/AVIF i podać opisowe teksty alternatywne PL/EN.

## Cloudflare Web Analytics (privacy-friendly)

Konfiguracja w `src/config/site.ts`:

```ts
export const ANALYTICS = {
  cloudflare: {
    enabled: true,
    token: 'YOUR_CLOUDFLARE_WEB_ANALYTICS_TOKEN'
  }
} as const;
```

Po ustawieniu `enabled: true` i tokena, snippet Cloudflare jest automatycznie dodawany w `src/components/Layout.astro`.

## Deploy na Cloudflare Pages (rekomendowane)

1. Wypchnij repo do GitHub.
2. W Cloudflare Dashboard: Pages -> Create a project -> Connect to Git.
3. Build settings:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy.

Domena produkcyjna `https://frigac.pl` jest ustawiona w `astro.config.mjs` oraz w `SITE.siteUrl` w `src/config/site.ts`.

### Preview i indeksacja

Cloudflare Pages domyślnie dodaje nagłówek `X-Robots-Tag: noindex` do deploymentów preview:
https://developers.cloudflare.com/pages/configuration/preview-deployments/#preview-indexing-by-search-engines

Projekt nie próbuje rozpoznawać preview przez `import.meta.env.PROD`, ponieważ każdy statyczny build wdrożeniowy Astro działa w trybie produkcyjnym. Po wdrożeniu preview nagłówek należy potwierdzić przez `curl -I <preview-url>`. Przy zmianie platformy hostingowej analogiczne `noindex` trzeba skonfigurować na poziomie tej platformy lub CDN.

## Alternatywa: GitHub Pages

Możesz też wdrożyć statyczny build `dist/` przez GitHub Pages (np. workflow Actions), ale domyślnie projekt jest przygotowany pod Cloudflare Pages.
