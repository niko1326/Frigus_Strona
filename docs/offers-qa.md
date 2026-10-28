# Przeglądarkowe testy generatora ofert

Skrypt `scripts/verify-offers-browser.mjs` uruchamia Chromium przez Playwright i sprawdza lokalny panel wraz z rzeczywistym wydrukiem PDF. Nie uruchamia serwera, nie wdraża strony i nie korzysta z produkcyjnego konta. Przyjmuje wyłącznie adres loopback.

## Uruchomienie

1. Wykonać `npm run build` i uruchomić lokalny Cloudflare Worker na `127.0.0.1:8787` zgodnie z [instrukcją panelu](offers-panel.md#uruchomienie-lokalne). Skonfigurować tymczasowe dane logowania przeznaczone tylko do QA.
2. Udostępnić Playwright z Chromium. Może pochodzić z osobnego katalogu tymczasowego; nie trzeba dodawać go do zależności produkcyjnych projektu. Przykładowe przygotowanie narzędzia:

   ```sh
   npm install --prefix /private/tmp/frigac-offer-qa --no-save playwright
   /private/tmp/frigac-offer-qa/node_modules/.bin/playwright install chromium
   ```

3. Ustawić w środowisku bieżącej sesji `FRIGAC_QA_USERNAME` i `FRIGAC_QA_PASSWORD` zgodnie z lokalnym Workerem. Obie wartości są wymagane. Nie używać danych konta produkcyjnego ani nie zapisywać ich w repozytorium.
4. Uruchomić:

   ```sh
   FRIGAC_PLAYWRIGHT_MODULE=/private/tmp/frigac-offer-qa/node_modules/playwright/index.mjs \
     npm run test:browser
   ```

`FRIGAC_QA_URL` zmienia adres lokalnego Workera; domyślnie jest to `http://127.0.0.1:8787`. Gdy Playwright jest dostępny jako moduł projektu, można pominąć `FRIGAC_PLAYWRIGHT_MODULE`.

Skrypt wymaga nagłówka `Cache-Control: private, no-store` na odpowiedzi panelu, dlatego samo `astro dev` lub `astro preview` nie wystarcza do jego uruchomienia. Logowania używa wyłącznie kontekst przeglądarki; raport nie zawiera credentials.

## Zakres

- Automatyczny dobór: obie marki lub tylko GREE, filtry UVC, mniej dostępnych propozycji, skosy i kubatura, wszystkie priorytety, wspólne dane energii, błędne wymiary, oddzielne pokoje, budżet bez wyników i przywrócenie ręcznego zestawu.
- Jednakowa szerokość widocznego urządzenia dla G-TIME, GEO+ i Clivii (bez pustych marginesów obrazu).

- Domyślna oferta bez danych klienta: ukrycie nazwy i adresu na wszystkich stronach oraz w tytule dokumentu, usunięcie starego podglądu i przywrócenie pól po odznaczeniu opcji.
- Domyślna pełna paleta kolorów: cena bazowa, dopłaty zależne od mocy, jednakowe ceny, tańszy kolor i nieznana cena alternatywnej wersji.

- Skrót `/oferty` przekierowuje po logowaniu do `/panel/oferty/`; oba adresy są wykluczone z mapy strony.

- Dokumenty z 1, 3, 5 i 8 urządzeniami oraz wszystkie 11 priorytetów. Domyślna oferta ogólna ma dokładnie jedną stronę z opisem i prezentacją kolorów dla każdego wybranego modelu, bez dodatkowej okładki.
- Koszty wspólne i na osobnych stronach; brak komunikatów o niewybranym trybie ogrzewania w ofercie dotyczącej tylko chłodzenia.
- Dokładna cena i fotografia wybranego wariantu mocy oraz koloru z centralnej konfiguracji; komplet zdjęć i nazw kolorów Clivii oraz Airy, przezroczyste tło i wybrany wariant na pierwszym planie.
- Opcjonalne podsumowanie włączane polem `#include-summary`; jednoznaczne wskazanie mocy i koloru zwycięzców porównania, także przy kilku wariantach tej samej serii.
- Unieważnianie podglądu po zmianie formularza oraz anulowanie drukowania, gdy edycja nastąpi podczas oczekiwania na zdjęcia. Osobno sprawdzane jest wyczyszczenie i ponowne wygenerowanie podglądu.
- Odrzucanie wariantów bez ceny oraz nieprawidłowego koloru, escapowanie danych klienta i pomijanie `null` / `undefined` / `NaN` w treści dokumentu.
- Osiem urządzeń, wszystkie priorytety, maksymalne długości danych klienta, adresu i numeru oferty oraz 1200 znaków uwag.
- Brak przewijania poziomego całej strony na ekranie telefonu.

Każdy zapisany PDF musi mieć tyle fizycznych kartek, ile logicznych stron `.offer-page`. Sprawdzana jest szerokość, wysokość do 1048 px odpowiadająca obszarowi drukowania A4 oraz brak treści wychodzącej poza stronę. Ostatni blok treści musi kończyć się co najmniej 2 px nad stopką; kontrola obejmuje także stopkę pozycjonowaną absolutnie, która nie zwiększa wysokości strony. Zliczanie kartek odczytuje obiekty `/Type /Page` z pliku generowanego przez Chromium.

## Wyniki

Pliki trafiają do `output/offers/`: przykładowe PDF-y, `panel-desktop.png`, `panel-mobile.png` i `browser-qa.json`. Raport zawiera liczbę kartek, wymiary stron, wykonane kontrole i błędy JavaScript. Przy niepowodzeniu zapisuje również nazwę scenariusza, komunikat i `failure.png`, a proces kończy się błędem.

Automatyczne sprawdzenie geometrii nie zastępuje oceny czytelności zdjęć, typografii i polskich znaków w przykładowych PDF-ach. Silniki wydruku innych przeglądarek mogą inaczej dzielić strony.
