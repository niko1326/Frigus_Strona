# Poprawki po audycie z 27 października 2026

Zmiany przygotowano w lokalnym projekcie na podstawie `raport.pdf`. Publiczna domena nie została wdrożona w ramach tej pracy.

Aktualizacja z 28 października 2026: przywrócono automatyczne ładowanie pełnych modeli 3D w hero od razu po otwarciu strony, także na telefonach. Usunięto podglądy i przyciski uruchamiania 3D. Pozostałe poprawki po audycie zostały zachowane.

## Wprowadzone zmiany

| Obszar raportu | Poprawka |
| --- | --- |
| Hero i modele 3D — stan od 28.10.2026 | Three.js i pełne modele GLB ładują się automatycznie od razu na telefonach i komputerach. Oszczędzanie danych, wolne połączenie i preferencja ograniczenia ruchu nie uzależniają pobierania modeli od kliknięcia. Wpływ tej wersji na LCP, blokowanie wątku i transfer wymaga ponownego pomiaru. |
| Zasoby blokujące renderowanie | Inter jest serwowany lokalnie jako WOFF2 z `font-display: swap` i preloadem podstawowego podzbioru. Polski podzbiór ma około 7,4 KB. Usunięto zewnętrzny arkusz Google Fonts, a pobieranie Google Analytics odłożono do załadowania strony. |
| Rozmiary obrazów | Dodano miniatury, `srcset`, `sizes`, rzeczywiste proporcje obrazów oraz aktualizację wariantów po zmianie koloru produktu. |
| Kompresja certyfikatów | Podglądy F-gaz przy 720 px: 1 211 522 → 76 978 B, mniej o 93,6%. Oryginały i linki do pełnych dokumentów pozostają dostępne. |
| CLS kalkulatora | Zarezerwowano miejsce na przyciski mocy i zmienne komunikaty, zanim JavaScript odtworzy wybór z adresu. |
| Tytuły i opisy SEO | Skrócono tytuły i opisy stron, artykułów i produktów. Pełne oznaczenia urządzeń nadal występują w treści i opisach. |
| Kontrast | Przyciemniono pomarańczowe przyciski, aktywne niebieskie linki i szare podpisy; rozjaśniono tekst na niebieskich tłach. Biały tekst głównego CTA ma kontrast 4,64:1 zamiast około 3,35:1. |
| Dostępne nazwy linków | Usunięto zbędne `aria-label` kart katalogowych. Nazwy linków certyfikatów obejmują widoczny tekst „Zobacz dokument”. |
| Przewijanie klawiaturą | Przewijane tabele i schemat mają fokus, nazwane regiony i widoczne oznaczenie fokusu. Ujednolicono respektowanie atrybutu `hidden`. |
| HSTS i pozostałe nagłówki | Dodano HSTS na tydzień, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy i Permissions-Policy. |
| CSP | Po każdym buildzie powstają hashe faktycznych skryptów inline. `script-src` nie dopuszcza dowolnych skryptów inline ani `eval`. Dozwolone są własne moduły i używany Google Analytics. `blob:` jest potrzebne do tekstur modeli 3D. |
| Cache | Haszowane zasoby Astro mają roczny cache `immutable`; publiczne obrazy i fonty mają krótszy cache, aby umożliwić wymianę plików. |

## Kontrole wykonane 28.10.2026

- `npm run check`: brak błędów, ostrzeżeń i wskazówek.
- `npm run build`: 42 statyczne strony oraz nagłówki CSP.
- Chrome: oba modele, GREE i KAISAI, automatycznie pobierają się i renderują bez kliknięcia na ekranach 390 i 1280 px, również przy symulowanym oszczędzaniu danych i połączeniu 2G. Brak błędów JavaScript i naruszeń CSP.
- Dodatkowo sprawdzono automatyczne pobranie i statyczną klatkę pełnego modelu 3D przy preferencji ograniczenia ruchu. Usunięte podglądy i przyciski uruchamiania nie występują w DOM.
- Pomiaru Lighthouse nie powtarzano; wcześniejsze liczby poniżej nie opisują aktualnej wersji.

## Kontrole wykonane 27.10.2026

Poniższe wyniki zapisano przed przywróceniem automatycznego ładowania modeli 3D z 28.10.2026. Stanowią zapis kontroli pozostałych poprawek. Zachowanie hero sprawdzono ponownie 28.10.2026 zgodnie z opisem wyżej; wydajność aktualnej wersji wymaga osobnego pomiaru.

- `npm test`: 43 testy przechodzą, w tym testy hashowania CSP i limitu długości nagłówka Cloudflare.
- `npm run check`: brak błędów, ostrzeżeń i wskazówek.
- `npm run build`: 42 statyczne strony oraz nagłówki CSP.
- Audyt wszystkich 42 dokumentów HTML: tytuły 30–60 znaków, opisy do 160 znaków, brak powtórzeń, canonical bez parametrów.
- Chrome, 7 adresów na ekranach 390 i 1280 px: brak wykrytych naruszeń WCAG A/AA, błędów JavaScript, brakujących zasobów, naruszeń CSP i poziomego przepełnienia strony.
- Rozszerzona kontrola mobilna wszystkich 42 dokumentów, po poprawieniu i ponownym sprawdzeniu strony błędu 404: brak wykrytych naruszeń WCAG A/AA, błędów JavaScript, brakujących zasobów, naruszeń CSP i poziomego przepełnienia strony.
- Chrome: sprawdzono menu i zmianę koloru produktu. Historyczna kontrola hero obejmowała ręczne włączenie obu modeli 3D na telefonie, pauzę animacji i ograniczenie ruchu; dotyczyła wersji sprzed przywrócenia automatycznego ładowania.
- Kalkulator: 6 pomiarów dla adresów G-TIME, Airy i Fairy z raportu, z opóźnionym JavaScript, dało CLS 0.
- **Historyczny pomiar Lighthouse wersji z nieruchomym podglądem na telefonie, z 27.10.2026:** wydajność 99/100, LCP 2,0 s, TBT 0 ms, CLS 0, początkowo 126 KiB pobranych zasobów. Te liczby nie opisują aktualnej wersji z automatycznym ładowaniem pełnego 3D. Test wykonano na lokalnym Wranglerze ze standardową symulacją mobilną i zablokowanym Google Analytics, aby nie wysyłać sztucznych odsłon. Nie stanowi on bezpośredniego porównania z audytem publicznej domeny.

Automatyczny test dostępności nie zastępuje pełnej kontroli ręcznej. Pomiar lokalny nie potwierdza czasu odpowiedzi publicznego serwera.

## Uwagi do zgłoszeń i wdrożenia

Dziesięć powtórzeń metadanych kalkulatora w raporcie dotyczy adresów różniących się `model` i `power`. Wszystkie wskazują canonical tej samej strony kalkulatora. Zachowano tę konsolidację zamiast tworzyć osobne indeksowalne strony dla każdej konfiguracji.

Po wdrożeniu trzeba powtórzyć pomiar na `https://frigac.pl`, szczególnie TTFB wskazany dla `/o-nas`. Projekt jest statyczny i korzysta z hostingu zasobów Cloudflare; w repozytorium nie ma zapytań do bazy ani backendu, które tłumaczyłyby 14-sekundową odpowiedź.

Nagłówki konfiguruje `public/_headers`; podczas `npm run build` skrypt `scripts/build-security-headers.mjs` dodaje hashe i zapisuje końcowe `dist/_headers`. Należy używać kompletnego polecenia `npm run build`, aby CSP odpowiadało zawartości HTML. Obsługa `_headers` przez aktualny hosting została sprawdzona w [dokumentacji Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/headers/) oraz lokalnym Wranglerze.

HSTS celowo zaczyna od `max-age=604800`, bez objęcia niezweryfikowanych subdomen. Po sprawdzeniu produkcyjnego HTTPS można wydłużyć go do roku.

Po wymianie zdjęć produktów lub certyfikatów należy wykonać `node scripts/generate-responsive-images.mjs`, a następnie ponownie zbudować stronę. Miniatury i manifest znajdują się w repozytorium, więc zwykły build nie wymaga ponownego generowania obrazów.
