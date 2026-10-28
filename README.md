# FRIGAC - strona firmowa

Minimalistyczna, szybka strona dla FRIGAC (montaż klimatyzacji: Bydgoszcz, Toruń, Trójmiasto), z naciskiem na konwersję telefoniczną i SEO lokalne.

## Tech stack

- Astro + TypeScript
- Czyste CSS (bez ciężkiego JS, bez frameworków)
- Publiczna strona statyczna, tylko PL; wewnętrzny panel chroni Cloudflare Worker

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

Testy: `npm test`. Kontrola Astro i TypeScript: `npm run check`.

`npm run build` generuje także `dist/_headers` z hashami skryptów dla CSP.
Przed publikacją używaj całego polecenia, aby nagłówki odpowiadały zbudowanemu HTML.
Opis poprawek i kontroli po audycie: [NAPRAWY_RAPORTU.md](./NAPRAWY_RAPORTU.md).

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

## Katalog techniczny i oferty

Modele, warianty, ceny, kolory, zdjęcia i uzupełnienia techniczne: `src/config/lineups.ts`.
Rejestr źródeł: `src/config/product-sources.json`. Braki są zwracane jako `null`.
Zastane dane pozostają zachowane; różnice ze źródłami wymagają ręcznej decyzji.

- [Raport researchu i braków](docs/product-research/REPORT.md), [pełny audyt CSV](docs/product-research/AUDIT.csv).
- Ponowne wygenerowanie raportu: `npm run audit:products`.
- Kontrola danych publikowanych przez kalkulatory po buildzie: `npm run check:public-payload`.
- Panel `/panel/oferty/`: [obsługa, autoryzacja i sekrety](docs/offers-panel.md).
- Testy przeglądarkowe i PDF: [instrukcja](docs/offers-qa.md).

## Deploy na Cloudflare Workers

`wrangler.toml` kieruje żądania do Workera przed obsługą statycznego HTML.
W docelowym projekcie ustaw sekrety `PANEL_USERNAME` i `PANEL_PASSWORD`, następnie użyj
`npm run deploy`. Szczegóły i kontrolę po publikacji opisuje [instrukcja panelu](docs/offers-panel.md).

Samo opublikowanie `dist/` na Pages lub innym hostingu statycznym omija autoryzację.
Dotychczasowe wdrożenie Pages wymaga migracji domeny do Workera albo osobnej ochrony hostingowej.
