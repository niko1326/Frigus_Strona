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

Kluczowe pola:

- `SITE.brandName`, `SITE.siteUrl`
- `BUSINESS.legalName`
- `BUSINESS.contact.phones`, `BUSINESS.contact.email`
- `BUSINESS.availability`
- `BUSINESS.pricing`, `BUSINESS.warranty`
- `BUSINESS.serviceArea`, `BUSINESS.travel`
- `BUSINESS.certifications`
- `ANALYTICS.cloudflare`

Dane kontaktowe i zatwierdzone wartości biznesowe nie są duplikowane w komponentach.

## Struktura językowa

- Polski: `/`, `/uslugi`, `/cennik`, `/faq`, `/kontakt`
- English: `/en/`, `/en/services`, `/en/pricing`, `/en/faq`, `/en/contact`

Mapowanie tras i metadata SEO:

- `src/i18n/content.ts`

## Jak dodać zdjęcia później

Aktualnie używany jest placeholder galerii:

- `src/components/PhotoGalleryPlaceholder.astro`

Sugerowany workflow:

1. Dodaj zdjęcia do `public/photos/`.
2. Podmień placeholdery na `<img src="/photos/nazwa.jpg" ... />` w `src/components/PhotoGalleryPlaceholder.astro`.
3. Zachowaj rozmiary i kompresję (WebP/AVIF), żeby utrzymać wydajność.

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

## Alternatywa: GitHub Pages

Możesz też wdrożyć statyczny build `dist/` przez GitHub Pages (np. workflow Actions), ale domyślnie projekt jest przygotowany pod Cloudflare Pages.
