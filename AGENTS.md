# FRIGAC website — Codex working rules

## Git

- Production branch: main
- Development branch: develop
- Never modify, merge into, or push directly to main.
- Work only on develop unless explicitly instructed otherwise.
- Do not create commits or push unless explicitly requested.

## Workflow

Before modifying files:
1. Inspect the relevant implementation.
2. Explain briefly what you intend to change.
3. Do not make unrelated refactors.

After every task:
1. Run `npm run check`.
2. Run `npm run build`.
3. Report changed files.
4. Report any warnings, TODOs or assumptions.
5. Do not silently invent missing business information.

## Project architecture

- Astro + TypeScript.
- Static-first.
- Avoid unnecessary client-side JavaScript.
- Avoid introducing frameworks or dependencies unless clearly justified.
- Prefer semantic HTML and progressive enhancement.
- Keep PL and EN versions synchronized.

## Business data

Never invent:
- legal company name,
- tax/VAT status,
- prices,
- warranty terms,
- certifications,
- company address,
- opening hours,
- service area,
- manufacturer authorizations,
- legal/privacy statements.

If a value is unknown, ask for it or leave an internal TODO.

## Branding

Canonical public domain:
https://frigac.pl

Old project names/domains such as:
- CLIM-PRO
- clim-pro.pages.dev
- frigus.pages.dev

are legacy values and must not be used as public branding or canonical URLs.

Do not assume that the legal business name is the same as the FRIGAC brand.

## Quality

Prefer:
- centralized configuration,
- reusable Astro components,
- typed content structures,
- accessible links and controls,
- minimal JavaScript,
- good Core Web Vitals,
- correct SEO metadata.

Do not:
- hide important content when JavaScript is unavailable,
- duplicate business facts across files,
- publish placeholder copy,
- expose personal data from certificates without explicit approval.