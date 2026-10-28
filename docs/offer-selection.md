# Automatyczne propozycje do oferty

Tryb ręczny pozostaje domyślny. Przełączenie na „Dobierz urządzenia” ukrywa ręczny zestaw, ale go nie usuwa. Pola doboru są wymagane tylko w trybie automatycznym. Liczba propozycji (1–8) oznacza alternatywne serie dla jednej strefy, nigdy podział obciążenia między jednostki. Nie jest to projekt multisplit ani automatyczny dobór do ogrzewania głównego.

## Model obliczeń

Wstępny szacunek chłodzenia: `V × 40 W/m³ × (1 + suma korekt) / 1000 + osoby + sprzęt`. Końcowy wynik zaokrąglamy w górę do 0,1 kW. Nie dokładamy drugiej korekty za wysokość, ponieważ jest już zawarta w kubaturze.

Bez skosów `V = powierzchnia po podłodze × wysokość`. Dla prostych, liniowych skosów średnia wysokość części skośnej wynosi `(hmin + hmax) / 2`. Średnią całego pomieszczenia ważymy udziałem podłogi pod skosami; pozostała część ma wysokość maksymalną. Model nie opisuje każdego kształtu dachu.

Korekty słońca (−5 / 0 / +10%), ostatniej kondygnacji (+10%) i dużych przeszkleń (+8%) pochodzą z istniejącej konfiguracji `powerCalculator.ts`. Dodatkowa korekta izolacji to jawne założenie FrigAC: dobra −10%, standardowa 0%, słaba +15%. Baza obejmuje dwie osoby; każda kolejna dodaje 0,18 kW. Dodatkowe ciepło ze sprzętu podaje operator w watach, ponad typowe wyposażenie. To rozszerzenie lokalnej heurystyki, nie normowy bilans cieplny ani gwarancja większej dokładności.

Materiały sprawdzone przy wdrożeniu:

- [Daikin — dobór mocy](https://www.daikin.pl/pl_pl/klienci/inspiration/articles/przewodnik-doboru-mocy-klimatyzacji.html): znaczenie kubatury, wysokości, izolacji i przeszkleń.
- [Zintegrowana Platforma Edukacyjna — budowa instalacji klimatyzacyjnej](https://zpe.gov.pl/a/budowa-instalacji-klimatyzacyjnej/DTFEkAnYJ): orientacyjny wskaźnik kubatury × 40 W oraz pozostałe zyski ciepła.
- [ENERGY STAR — przewodnik doboru](https://www.energystar.gov/ia/partners/manuf_res/downloads/2007RoomAC_prg.pdf): dodatkowe 600 BTU/h na osobę powyżej dwóch (około 0,176 kW, tutaj zaokrąglone do 0,18 kW). Amerykańskiej tabeli powierzchni nie przenosimy do polskiego katalogu split.

Nie przypisujemy źródłom własnych współczynników izolacji ani progów selekcji. Wentylacja, wilgotność, kuchnie i nietypowe zyski wymagają oceny instalatora. Kilka zamkniętych pokoi, ponad 70 m², wysokość ponad 4,5 m lub wynik ponad 7 kW zatrzymują automatyczny dobór z komunikatem.

## Wybór i kolejność modeli

Kandydaci pochodzą wyłącznie z centralnego katalogu. Z każdej serii wybierany jest najmniejszy wyceniony wariant o potwierdzonej nominalnej mocy chłodniczej co najmniej równej wynikowi. Górna granica to `max(wynik × 1,35, wynik + 0,5 kW)` — wewnętrzny filtr przeciw nadmiernemu przewymiarowaniu, nie zalecenie normowe. Brak dopasowania nie powoduje wyboru mniejszej jednostki. Budżet ogranicza cenę bazową z montażem; kolory mają osobne dopłaty.

UVC wymagane jest filtrem bezwzględnym: tylko potwierdzone, niesporne `airQuality.uvc = true`. Sama potrzeba jakości powietrza nadaje UVC największą wagę w tej kategorii, a także uwzględnia jonizator, filtry i samooczyszczanie. Główny priorytet ma wagę 3, dodatkowy 1. Ogólny dobór równo uwzględnia cenę, sprawność i hałas. Wartości porównywane są wśród dopasowanych kandydatów; brakujące i sporne dane nie dają przewagi. Remisy rozstrzyga mniejsza odpowiednia moc, cena, a potem identyfikator serii. Wybór „Obie marki” od dwóch propozycji zapewnia co najmniej jeden pasujący model GREE i KAISAI: jeśli początkowy zestaw zawiera tylko jedną markę, ostatni model zastępujemy najlepiej ocenionym kandydatem drugiej. Wszystkie twarde wymagania pozostają obowiązkowe. Przy braku kandydatów jednej marki pojawia się komunikat. Można też ograniczyć dobór do jednej marki. Ranking jest regułowy i odtwarzalny, bez zewnętrznego modelu AI.

Przy zbyt małej liczbie pasujących serii panel podaje faktyczną liczbę i komunikat. Nie uzupełnia zestawu modelami łamiącymi kryteria. PDF zawiera wyjaśnienie na stronach modeli oraz wspólną stronę „Dlaczego taka moc?” z wymiarami, skosami, kubaturą, korektami i wzorem. Dane klienta i ważność pozostają niezależnymi opcjami. Pola powierzchni i izolacji kalkulatora kosztów przejmują dane doboru w trybie automatycznym; powrót do ręcznego przywraca poprzednie wartości.

## Skala zdjęć

`offer-image-bounds.json` przechowuje granice treści zdjęcia. CSS pokazuje oryginalny plik bez pustych marginesów, w oknie zachowującym proporcje. Jednostki ścienne mają wspólną szerokość 82 mm, także w stosach kolorów; wysokie jednostki ogranicza wysokość 42 mm. Nie zmieniamy plików źródłowych ani wyglądu publicznej strony. Po wymianie zdjęć uruchomić `node scripts/measure-offer-images.mjs`, następnie obejrzeć PDF (wyznaczanie granic jest heurystyczne).
