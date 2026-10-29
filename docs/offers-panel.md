# Wewnętrzny panel ofert FrigAC

Panel ma adres `/panel/oferty/`; skrót `/oferty` przekierowuje do niego. W produkcji oba adresy wymagają logowania po stronie Workera. Korzysta z katalogu `src/config/lineups.ts`, uzupełnień technicznych przy modelach i wariantach oraz istniejących funkcji `src/utils/energy-estimate.mjs`. Nie ma osobnej bazy cen ani parametrów. Raport danych znajduje się w [product-research/REPORT.md](product-research/REPORT.md).

Logo w nagłówku panelu prowadzi na lokalną stronę główną; logo w podglądzie i zapisanym PDF prowadzi na stronę FrigAC.

## Przygotowanie oferty i PDF

1. Domyślnie zaznaczona jest opcja „Bez danych klienta — oferta ogólna”. Oferta nie zawiera wtedy nazwy ani adresu klienta (również na podsumowaniu i w tytule dokumentu). Odznaczyć ją, aby uzupełnić dane klienta. Numer i data pozostają dostępne w obu trybach. Termin ważności jest domyślnie wyłączony i nie pojawia się w PDF. Zaznaczenie „Ustaw termin ważności” pokazuje wymagane pole liczby dni (początkowo 14); odznaczenie ponownie pomija termin.
2. Wybrać od 1 do 8 urządzeń, dla każdego moc oraz kolor lub wersję katalogową. W trybie ręcznym panel od razu wyłącza zajętą kombinację modelu, mocy i koloru; ten sam model można nadal dodać w innej mocy lub wersji. Przycisk dodawania proponuje inny model, o ile jest dostępny. Domyślny kolor to „Domyślny — wszystkie kolory”: oferta pokazuje paletę, cenę bazową i dokładną dopłatę dla wybranej mocy. Jednakowe ceny, tańszy kolor oraz brak ceny są opisane osobno; brak ceny koloru nie oznacza braku dopłaty. Wybranie konkretnego koloru podaje jego dokładną cenę. Ceny pobierane są z centralnego cennika. Brak ceny wybranej mocy lub koloru blokuje przygotowanie oferty; uzupełnić ten wariant w centralnej konfiguracji.
3. Wybrać jeden priorytet główny i opcjonalne priorytety dodatkowe. Domyślnie powstaje oferta ogólna. Priorytet główny ustala duże wyróżnienie. Przy „Ofercie ogólnej” wyróżnienie przejmuje pierwszy zaznaczony na liście priorytet dodatkowy; bez dodatkowych priorytetów nie ma dużego bloku hałasu. Hałas pozostaje w specyfikacji (brak wartości jest opisany), a duże wyróżnienie hałasu występuje przy „Cichej pracy”. Porównania hałasu pojawiają się tylko po wybraniu tego priorytetu.
4. Przy koszcie ogrzewania lub chłodzenia podać wspólną powierzchnię, cenę energii, izolację i sposób użytkowania. Urządzenia są alternatywami dla tego samego pomieszczenia. Obliczenia korzystają z istniejącego kalkulatora energii FrigAC. Można wybrać wspólne porównanie kosztów albo osobne strony kosztów każdego urządzenia.
5. Kliknąć „Przygotuj podgląd oferty”, sprawdzić ceny, fotografie i uzgodnienia. Zmiana formularza usuwa poprzedni podgląd, aby do wydruku nie trafiły wcześniejsze dane.
6. Kliknąć „Zapisz PDF / drukuj”. W systemowym oknie drukowania wybrać „Zapisz jako PDF”, papier A4, skalę 100% i wyłączyć nagłówki oraz stopki przeglądarki. Włączyć drukowanie grafiki tła, jeśli przeglądarka tego wymaga dla zachowania kolorowych bloków.

PDF powstaje przez `window.print()` i funkcję zapisu przeglądarki, bez zewnętrznej usługi lub biblioteki PDF. Domyślnie każdy wybrany model ma jedną własną stronę: nazwę, zdjęcia wersji kolorystycznych, cenę z montażem oraz najważniejsze parametry. Modele z kilkoma kolorami prezentują przezroczyste zdjęcia ze strony w układzie warstwowym, z wybranym kolorem na pierwszym planie; w trybie domyślnym biały kolor jest z przodu, jeśli istnieje w katalogu. Pod grafiką widnieją nazwy kolorów serii i wskazanie koloru, którego dotyczy cena. Jasna karta po prawej stronie zdjęć zawiera cenę, zakres standardowego montażu oraz wybraną moc i kolor. Pojedyncza wersja zachowuje jedno zdjęcie. Funkcje takie jak Soft Wind mają osobne, krótkie karty z wyjaśnieniem działania. Trzy modele w ofercie ogólnej dają trzy strony. Strona podsumowania jest opcjonalna i domyślnie wyłączona. Każdy model ma jedną stronę produktu także przy wielu priorytetach. Na kartę trafia ograniczona liczba najważniejszych potwierdzonych parametrów; cena i dopłata za kolor są już obok zdjęć, więc nie zajmują miejsca w specyfikacji. Przy dużej liczbie priorytetów część mniej istotnych parametrów nie jest drukowana. W trybie doboru automatycznego dochodzi wspólna strona uzasadnienia mocy; koszt energii i dłuższe uzgodnienia również mają osobne strony. CSS określa A4 i podziały stron. Przed otwarciem drukowania panel czeka na lokalne fonty z polskimi znakami i wczytanie zdjęć. Ostateczny podział na kartki zależy także od silnika drukowania i ustawień przeglądarki, dlatego należy sprawdzić podgląd przed zapisaniem pliku.

Dane klienta pozostają w pamięci otwartej strony; panel nie zapisuje ich w localStorage ani nie przesyła do serwera. Odświeżenie strony usuwa przygotowaną ofertę. Parametry objęte konfliktem źródeł są oznaczone do ręcznej weryfikacji; nie tworzą przewag porównawczych ani obliczeń kosztów zależnych od spornego pola. Zdania porównawcze dotyczą wyłącznie aktualnie wybranych wariantów.

## Dobór automatyczny

W sekcji urządzeń wybrać „Dobierz urządzenia”. Ręcznie ustawiony zestaw zostaje zachowany i wraca po przełączeniu na „Wybieram ręcznie”. Uzupełnić powierzchnię po podłodze, wysokość, warunki cieplne, liczbę propozycji i opcjonalny limit ceny bazowej. Przy skosach podać wysokość minimalną, maksymalną oraz udział powierzchni pod skosami. Potrzeby wybiera się w tej samej sekcji priorytetów co w trybie ręcznym. Filtr marek pozwala wybrać obie marki, tylko GREE albo tylko KAISAI. Przy obu markach i co najmniej dwóch propozycjach każda marka otrzymuje miejsce, jeśli ma model spełniający wszystkie wymagania.

„Wymagana lampa UVC” jest warunkiem obowiązkowym; sama potrzeba jakości powietrza premiuje UVC w rankingu. Gdy dostępnych modeli jest mniej niż żądano, panel pokazuje rzeczywistą liczbę. Wynik obejmuje alternatywy dla jednej strefy, a nie zestaw kilku jednostek montowanych jednocześnie. PDF otrzymuje uzasadnienie przy modelach i stronę „Dlaczego taka moc?”. W trybie automatycznym założenia powierzchni i izolacji dla kosztów energii pochodzą z doboru.

Metodę, współczynniki, ograniczenia i sposób normalizacji zdjęć opisano w [offer-selection.md](offer-selection.md). Publiczne kalkulatory i katalog pozostają bez zmian.

## Dostęp i sekrety

`worker/panel-auth.mjs` weryfikuje HTTP Basic Auth po stronie Cloudflare Worker przed pobraniem HTML. `wrangler.toml` ustawia `assets.run_worker_first = true`, ponieważ przy domyślnym routingu statyczny plik mógłby zostać zwrócony przed autoryzacją. Ochrona obejmuje całe `/panel`, adresy `index.html`, warianty ze slashem i zakodowane aliasy. Brak sekretów blokuje panel odpowiedzią 503; błędne logowanie daje 401. Hasło nie jest częścią kodu strony, bundla ani repozytorium.

W docelowym projekcie Cloudflare ustawić osobno dwa szyfrowane sekrety. Poniższe polecenia poproszą o wartości interaktywnie; login i hasło przekazane przez właściciela należy wpisać w tych monitach, nigdy jako argument polecenia:

```sh
npx wrangler secret put PANEL_USERNAME
npx wrangler secret put PANEL_PASSWORD
```

Panel wymaga HTTPS. Wyjątkiem jest lokalny Wrangler na `localhost`, `127.0.0.1` lub `::1`. Nagłówki odpowiedzi panelu zawierają `private, no-store`, `X-Robots-Tag: noindex, nofollow, noarchive` oraz zakaz osadzania w ramce. Po zakończeniu pracy należy zamknąć sesję przeglądarki korzystającą z Basic Auth; przeglądarka zarządza zapamiętaniem tych credentials. Basic Auth służy jednemu wewnętrznemu kontu. Cloudflare Access jest rozwiązaniem dla przyszłych indywidualnych kont, SSO i polityk dostępu.

## Uruchomienie lokalne

Szybki podgląd na własnym komputerze: `npm run dev -- --host 127.0.0.1 --port 4321`, następnie otworzyć `http://127.0.0.1:4321/oferty`. To lokalny podgląd bez logowania; nie jest publikacją na domenie. Do testowania ochrony logowaniem użyć Workera zgodnie z poniższą instrukcją.

Po `npm run build` uruchomić `npm run worker:dev -- --ip 127.0.0.1`. Lokalne wartości można przekazać Wranglerowi przez nieśledzony plik `.dev.vars` albo lokalne zmienne środowiskowe zgodnie z dokumentacją Wrangler. `.dev.vars`, `.env` i ich odmiany są ignorowane przez Git. Nie kopiować ich do `public/` ani `dist/`.

`npm run dev` i `npm run preview` uruchamiają Astro bez Workera, więc **nie testują autoryzacji** i udostępniają statyczny panel lokalnie. Używać ich wyłącznie na interfejsie loopback; nie włączać publicznego tunelu ani `--host` dla takiego podglądu.

## Wdrożenie i kontrola

Właściwa ścieżka wdrożenia to Cloudflare Workers przez `npm run deploy`, po ustawieniu sekretów. Samo przesłanie `dist/` na Pages lub inny hosting statyczny omija Workera. Jeśli domena jest obecnie obsługiwana przez Pages, trzeba skierować ją do tego Workera albo najpierw skonfigurować ochronę Cloudflare Access dla panelu i wszystkich alternatywnych domen deploymentu. Lokalne pliki nie potwierdzają aktywnej konfiguracji konta Cloudflare.

Nie dodawać `/panel` do publicznej nawigacji. Sitemap odrzuca ten prefiks także po złączeniu wszystkich źródeł tras; `robots.txt` zawiera `Disallow: /panel`. Te ustawienia indeksowania uzupełniają autoryzację.

Przed publikacją wykonać `npm test`, `npm run check` i `npm run build`. Po wdrożeniu sprawdzić bez logowania `/panel/oferty/` oraz `/panel/oferty/index.html`: oba muszą zwrócić 401 albo 503, a nie HTML panelu. Po poprawnym logowaniu powinna być dostępna oferta z nagłówkiem `Cache-Control: private, no-store`. Publiczne podstrony produktowe powinny pozostać dostępne bez logowania.

Nie wdrożono automatycznie produkcji ani nie zapisano sekretów w trakcie przygotowania kodu.

## Dokumentacja platformy

- [Worker przed zasobami statycznymi](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Sekrety Cloudflare Workers](https://developers.cloudflare.com/workers/configuration/secrets/)
- [HTTP Basic Authentication w Workers](https://developers.cloudflare.com/workers/examples/basic-auth/)
- [Cloudflare Access dla własnej aplikacji](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
