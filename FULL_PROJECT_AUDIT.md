# FRIGAC - Full Project CRO & Positioning Audit

## Section A: Project Inventory & Architecture Map

Based on a deep scan of `src/pages/`, `src/components/`, and `public/`, here is the complete routing and component architecture of the project:

### Primary Pages
- **Homepage:** `src/pages/index.astro` (`/`)
- **Services:** `src/pages/uslugi.astro` (`/uslugi`)
- **Pricing:** `src/pages/cennik.astro` (`/cennik`)
- **Contact:** `src/pages/kontakt.astro` (`/kontakt`)
- **About Us:** `src/pages/o-nas.astro` (`/o-nas`)
- **Certificates:** `src/pages/certyfikaty.astro` (`/certyfikaty`)
- **FAQ:** `src/pages/faq.astro` (`/faq`)

### Local Landing Pages
- **Tricity LP:** `src/pages/trojmiasto.astro` (`/trojmiasto`)
- **Bydgoszcz/Toruń LP:** `src/pages/bydgoszcz.astro` (`/bydgoszcz`)

### Products & Tools
- **Gree Lineup:** `src/pages/klimatyzatory-gree.astro` (`/klimatyzatory-gree`)
- **Kaisai Lineup:** `src/pages/klimatyzatory-kaisai.astro` (`/klimatyzatory-kaisai`)
- **Power Calculator:** `src/pages/kalkulator-klimatyzacji.astro` (`/kalkulator-klimatyzacji`)
- **Cost Calculator:** `src/pages/kalkulator-kosztow-klimatyzacji.astro` (`/kalkulator-kosztow-klimatyzacji`)

### Content / Legal
- `src/pages/porady/*` (Blog/Guides)
- `404.astro`, `regulamin.astro`, `polityka-prywatnosci.astro`

---

## Section B: Individual Page Audits

### 1. Homepage (`src/pages/index.astro` -> components/sections/home/)
* **What it currently does:** Acts as the main entry point, featuring a 3D model, price teasers, how-it-works timeline, and basic CTAs ("Zadzwoń teraz").
* **Aesthetic & Commercial CRO flaws:** The copy relies heavily on "montaż w mieszkaniach i domach" and "standardowy montaż", which sounds like basic handyman work. It fails to explicitly reassure homeowners or boutique owners about *how* the installation is done (dust-free, protecting their expensive flooring/furniture). The CTAs are low-intent ("Zadzwoń teraz"). 
* **Exact Replacement Copy:**
  - **Hero Headline:** Estetyczny montaż klimatyzacji z gwarancją czystości. Trójmiasto i Bydgoszcz.
  - **Hero Subheadline:** Dyskretne chłodzenie dla Twojego domu, mieszkania lub salonu. Instalacja z odsysaniem pyłu, idealne maskowanie przewodów i 0 bałaganu po pracy.
  - **Primary CTA:** Wyślij zdjęcie ściany – wycena w 15 min
  - **Trust Badges (Hero):** Wiercenie bezpyłowe | Pisemna gwarancja i faktura | Zabezpieczenie podłóg i mebli
  - **How It Works (Krok 1):** Oszczędzasz czas. Wyślij zdjęcie ściany lub zadzwoń, a my w 15 minut podamy kosztorys bez ukrytych opłat.
  - **How It Works (Krok 2):** Czysty montaż. Używamy mat ochronnych i odkurzaczy przemysłowych. Maskujemy instalację tak, aby idealnie wtapiała się w tło.
  - **How It Works (Krok 3):** Szkolenie i odbiór. Uruchamiamy system, pokazujemy obsługę z telefonu i wystawiamy fakturę (na firmę lub osobę prywatną).

### 2. Pricing (`src/pages/cennik.astro`)
* **What it currently does:** Lists starting prices (`{PRICING.installFromPLN}`), standard installation inclusions, brand lineups, and additional service costs (extra meter of pipe, condensate pump).
* **Aesthetic & Commercial CRO flaws:** The term "Klimatyzator z montażem od X zł brutto" is good, but it doesn't mention invoice capabilities clearly enough for the 20% small business demographic. Needs to reinforce that a legal invoice is always issued.
* **Exact Replacement Copy:**
  - **Below "Klimatyzator z montażem od...":** Dodaj: *Wycena jest ostateczna i transparentna. Do każdej realizacji wystawiamy fakturę na firmę lub osobę prywatną.*
  - **Additional Services Note:** Zmień z: *Ostateczna wycena zależy od przebiegu instalacji...* na: *Wszystkie ceny to kwoty brutto z wystawioną fakturą. Przed wierceniem pierwszego otworu znasz dokładny, ostateczny koszt.*

### 3. Contact (`src/pages/kontakt.astro`)
* **What it currently does:** Forces a phone call. "Bez formularzy i czekania na odpowiedź. Zadzwoń..."
* **Aesthetic & Commercial CRO flaws:** High friction. Many homeowners and salon owners are busy during the day or prefer asynchronous communication. Asking them to "describe the place" over the phone is harder than just letting them upload a photo.
* **Exact Replacement Copy:**
  - **Headline:** Darmowa wycena ze zdjęcia lub przez telefon
  - **Body:** Nie masz czasu na długie rozmowy? Wyślij nam zdjęcie ściany (MMS lub WhatsApp), na której chcesz powiesić klimatyzator. Ocenimy warunki i w 15 minut odeślemy orientacyjną wycenę wraz z proponowanymi modelami.
  - **Action Button:** Wyślij zdjęcie przez WhatsApp (Link do wa.me/numer)
  - **Invoice Note:** *Obsługujemy osoby prywatne i małe firmy. Do każdego montażu otrzymujesz pełną dokumentację gwarancyjną oraz fakturę.*

### 4. About Us (`src/pages/o-nas.astro`)
* **What it currently does:** Highlights a small 2-person team ("Dwóch instalatorów"), certs, and 3 rules (Mówimy wprost, terminy, po nas nie trzeba sprzątać). 
* **Aesthetic & Commercial CRO flaws:** This page is actually very close to perfect for the target audience. The "Po nas nie trzeba sprzątać" rule is excellent. We just need to elevate the "cleanliness" aspect to sound more premium.
* **Exact Replacement Copy:**
  - **Rule 3 Headline (Current: Po nas nie trzeba sprzątać):** Gwarancja absolutnej czystości
  - **Rule 3 Body:** Szanujemy Twoje wnętrze. Wiercimy wyłącznie z użyciem przemysłowych odsysaczy pyłu, meble i podłogi zabezpieczamy grubą folią i matami, a wszystkie kartony zabieramy ze sobą. Zostawiamy idealny chłód i zero bałaganu.

### 5. Services (`src/pages/uslugi.astro`)
* **What it currently does:** Lists what mounting includes and emphasizes "Standard montażu FRIGAC".
* **Aesthetic & Commercial CRO flaws:** The checklist is good but reads a bit technically ("próżnia przed uruchomieniem", "wibroizolacja"). Needs to translate technical features into aesthetic/comfort benefits for the homeowner/salon owner.
* **Exact Replacement Copy:**
  - **Checklist enhancements:**
    - *wibroizolacja pod jednostką zewnętrzną* -> *Wibroizolacja agregatu: gwarantuje cichą pracę bez przenoszenia drgań na ściany budynku.*
    - *maskownice dopasowane kolorem* -> *Estetyczne prowadzenie instalacji: rury ukrywamy w dyskretnych korytkach dopasowanych do koloru elewacji lub ściany, dbając o każdy detal wizualny.*

### 6. Local Landing Pages (`trojmiasto.astro`, `bydgoszcz.astro`)
* **What they currently do:** SEO-focused pages listing districts.
* **Aesthetic & Commercial CRO flaws:** Very generic text ("Klimatyzacja do mieszkania w bloku").
* **Exact Replacement Copy:** 
  - Emphasize local presence and speed.
  - *Jesteśmy stąd. Nie doliczamy za dojazd na terenie {Miasto}. Specjalizujemy się w estetycznych, bezpyłowych montażach w mieszkaniach deweloperskich, domach jednorodzinnych oraz lokalnych biurach i salonach usługowych. Gwarantujemy terminowość, pełną dokumentację powykonawczą i fakturę do każdej realizacji.*

---

## Section C: Global Asset & Trust Signals Review

### Imagery Audit (`public/photos/`)
Currently, there is only one installation photo identified (`montaz-klimatyzacji-frigac.jpg`). 
- **Action Required:** Ensure this photo depicts a highly professional scene. The installer should ideally be using a dust-extraction vacuum, working over a protective floor mat. If the photo shows a messy room, cables hanging loose, or lack of protective gear, it will instantly kill the "Premium & Clean" positioning. Consider adding a carousel of "Before/After" or "During Installation" showing the floor mats and clean drill sites.

### Frictionless Lead Capture (Global)
- **Action Required:** The site currently lacks an asynchronous, image-based lead capture. Adding a WhatsApp floating button or a simple form allowing file uploads (`<input type="file" accept="image/*">`) will significantly boost conversions for users who just want to point their phone at a wall and get a price.

---

## Section D: High-Priority Copy & Code Diffs ready to apply

### Strictly Regulated Trust & Tax Terms
Whenever mentioning pricing, warranties, or checkout flows, apply this exact vocabulary.

❌ **STRICTLY FORBIDDEN:**
- "Faktura VAT 8%"
- "Faktura VAT 23%"
- "Zwolnienie z VAT" (don't overcomplicate it for the user)
- "Tani montaż"

✅ **APPROVED COPY:**
- "Faktura do każdej realizacji"
- "Pisemna gwarancja i faktura na firmę lub osobę prywatną"
- "Estetyczny, bezpyłowy montaż"

### `src/components/sections/home/HeroSection.astro` (Conceptual Diff)
```diff
- <h1>Montaż klimatyzacji <strong>Gdańsk, Trójmiasto, Bydgoszcz i Toruń</strong></h1>
+ <h1>Estetyczny montaż klimatyzacji z <strong>gwarancją czystości</strong>. Gdańsk i Bydgoszcz.</h1>

- <p class="hero-lead">Dobieramy i montujemy klimatyzację z montażem w Gdańsku, Gdyni i Sopocie - w mieszkaniach i domach, czysto i sprawnie. Standardowy montaż w 1 dzień.</p>
+ <p class="hero-lead">Dyskretne chłodzenie dla Twojego domu lub salonu. Wiercenie bezpyłowe, idealne maskowanie instalacji i 0 bałaganu po pracy. Faktura i pisemna gwarancja do każdej realizacji.</p>

- <CTAButton href={`tel:${PHONE_TEL}`} label={labels.callNow} ariaLabel={labels.callNow} />
+ <CTAButton href={`tel:${PHONE_TEL}`} label="Wyślij zdjęcie ściany – wycena w 15 min" ariaLabel="Wyślij SMS z prośbą o wycenę" />
```
