# FRIGAC - opis projektu i wykaz zmian

Dokument porównuje obecny stan projektu z ostatnią wersją wypchniętą na GitHub
(`niko1326/Frigus_Strona`, commit `7c0efa2`). Zmiany uszeregowane od najważniejszych
biznesowo do kosmetycznych.

---

## Czym jest ten projekt (w 10 zdaniach)

1. FRIGAC to dwuosobowa firma montująca klimatyzację typu split w mieszkaniach i domach.
2. Działa w Bydgoszczy, Toruniu i Trójmieście, czyli w Gdańsku, Gdyni i Sopocie, wraz z okolicznymi miejscowościami.
3. Serwis internetowy ma jedno zadanie: doprowadzić odwiedzającego do telefonu, bo firma nie prowadzi formularzy ani sklepu.
4. Cała ścieżka konwersji opiera się na darmowej wycenie telefonicznej udzielanej w kilka minut.
5. Ofertą wyjściową jest klimatyzator z montażem od 3499 zł brutto, z dojazdem i uruchomieniem w cenie.
6. Firma montuje urządzenia marek Gree i Kaisai, a każda z nich ma własną podstronę z pełną listą serii.
7. Wyróżnikami są certyfikaty F-gazowe, pięcioletnia gwarancja na montaż i realizacja zwykle w jeden dzień.
8. Strona jest statyczna, zbudowana w Astro, i generuje 21 podstron bez żadnego backendu.
9. Poza treścią sprzedażową serwis pełni funkcję poradnika: trzy kalkulatory i artykuły odpowiadające na najczęstsze pytania klientów.
10. Całość jest zoptymalizowana pod wyszukiwarki i pod lokalne zapytania w rodzaju "klimatyzacja Bydgoszcz" czy "montaż klimatyzacji Gdańsk".

---

## Zmiany względem wersji z GitHuba

### 1. Zmiana tożsamości firmy i adresu serwisu

Wersja z GitHuba nosiła nazwę **CLIM-PRO / FRIGUS** i wskazywała na adres testowy
`clim-pro.pages.dev`. Obecna wersja to **FRIGAC** pod docelową domeną `frigac.pl`.
Zmiana objęła nazwę marki, adres kanoniczny, wszystkie tytuły stron, dane strukturalne
i nazwę pakietu. To zmiana krytyczna, bo poprzednie adresy kanoniczne kierowałyby
wyszukiwarki pod nieistniejącą domenę.

### 2. Rezygnacja z wersji angielskiej

Wersja z GitHuba była dwujęzyczna i miała sześć podstron angielskich w katalogu `/en/`.
Zostały usunięte wraz z całą maszynerią przełączania języka. Powód jest praktyczny:
firma obsługuje wyłącznie polskich klientów w trzech miastach, a druga wersja językowa
rozdrabniała moc SEO i podwajała koszt utrzymania treści. Cały system tłumaczeń
zastąpiono jednym, płaskim plikiem treści polskich.

### 3. Rozbudowa serwisu z 6 do 20 podstron

Wersja z GitHuba miała sześć podstron polskich. Obecna ma dwadzieścia. Doszły:

- **Podstrony marek**: Gree i Kaisai.
- **Podstrony lokalne**: Bydgoszcz oraz Trójmiasto, pod lokalne zapytania.
- **Narzędzia**: kalkulator mocy klimatyzacji, kalkulator kosztów montażu, kalkulator zużycia prądu.
- **Treści**: O nas, Porady wraz z trzema artykułami poradnikowymi.
- **Formalne**: Regulamin, strona błędu 404.

### 4. Podstrony marek z pełną listą wariantów

To najnowsza zmiana. Wcześniej podstrony marek zawierały wyłącznie ogólny opis
bez konkretów. Obecnie każda prezentuje faktyczną, aktualną ofertę producenta:

| Marka | Liczba serii | Źródło danych |
|---|---|---|
| Gree | 9 serii ściennych | gree.pl |
| Kaisai | 8 serii ściennych | kaisai.com |

Każda seria ma zdjęcie produktowe producenta, warianty mocy w kilowatach, klasę
energetyczną dla chłodzenia i grzania, a gdy producent ją podaje, także głośność.
Doszła również tabela doboru mocy do metrażu, wspólna dla obu podstron.

Zdjęcia są pobrane z serwisów producentów, przycięte, ujednolicone do wspólnego kadru
i zapisane w formacie WebP na naszym serwerze. Nie są podlinkowane do cudzych stron,
więc nie znikną, gdy producent przebuduje swój serwis. **Warto potwierdzić z Gree
i Kaisai prawo do wykorzystania ich materiałów zdjęciowych**, co przy statusie firmy
montującej jest zwykle formalnością.

### 5. Kaisai zamiast Haiera

Powstała pełna podstrona Kaisai z opisem marki, listą ośmiu serii, tabelą doboru mocy
i sekcją porównującą Kaisai z Gree. Marka jest podpięta do stopki, do rotacji marek
w sekcji powitalnej i do mapy strony.

Podstrona Haier została w całości usunięta, bo firma nie montuje tej marki. Usunięcie
objęło samą podstronę, zdjęcie produktowe, trasę, metadane, wpis w mapie strony
i w pliku dla asystentów AI oraz wszystkie odwołania w treści: w cenniku, w usługach,
w pytaniach na stronie głównej, w obu kalkulatorach i na podstronie Gree. Tam, gdzie
Haier występował jako druga rekomendowana marka, zastąpił go Kaisai. W zbudowanym
serwisie nie ma już ani jednego wystąpienia słowa Haier.

### 6. Kontakt: drugi numer i adres e-mail

Wersja z GitHuba miała jeden numer telefonu i żadnego adresu e-mail. Obecnie działają
dwa numery przypisane do konkretnych osób, Huberta i Nikodema, oraz adres
`kontakt@frigac.pl`. Adres pojawia się w stopce, na stronie kontaktu i w danych
strukturalnych wszystkich podstron.

### 7. Dane strukturalne i widoczność w wyszukiwarce

Doszły elementy, których wcześniej nie było wcale:

- Mapa strony generowana automatycznie z faktycznie istniejących plików stron, z datami modyfikacji, częstotliwością zmian i priorytetami.
- Plik `robots.txt` ze wskazaniem mapy strony.
- Plik `llms.txt` opisujący firmę dla asystentów AI.
- Obrazek Open Graph dla podglądów w mediach społecznościowych.
- Dane strukturalne typu HVACBusiness z obszarem działania, godzinami i widełkami cen.
- Dane strukturalne list produktowych na podstronach marek.
- Okruszki nawigacyjne na podstronach.

### 8. Sekcja powitalna z animacją trójwymiarową

Doszła animowana wizualizacja jednostki klimatyzacyjnej oparta na bibliotece Three.js,
z rotacją marki przy każdym odświeżeniu i przyciskiem wstrzymania animacji. Gdy
przeglądarka nie obsługuje WebGL, wyświetla się statyczna wersja zastępcza. Animacja
respektuje systemowe ustawienie ograniczenia ruchu.

### 9. Przebudowa warstwy wizualnej

Arkusz stylów urósł z 864 do 3009 linii. Doszły między innymi: pasek przewijanych nazw
miejscowości, sekcja z hasłem firmy, licznik statystyk, oś czasu historii firmy, mapa
Polski z obszarem działania, galeria certyfikatów, sekcja pytań i odpowiedzi na stronie
głównej oraz animacje pojawiania się sekcji przy przewijaniu.

### 10. Poprawki z ostatniej sesji

- Wyśrodkowano duże hasło "Klimatyzacja. Komfort. Frigac." nad stopką oraz jego mniejszy odpowiednik w samej stopce.
- Zdanie "Idealna temperatura przez cały rok." w sekcji powitalnej zmieniono na białą czcionkę o normalnej grubości.
- Przy cenie 3499 zł dodano dopisek "brutto" w sekcji powitalnej i w cenniku.
- Kolumnę "Na skróty" w stopce odsunięto w prawo, przy okazji przebudowując proporcje kolumn tak, by żadna pozycja nie łamała się na dwie linie.
- Przywrócono pierwotny favicon z motywem jednostki klimatyzacyjnej.
- Sprawdzono wszystkie odnośniki w stopce i w całym serwisie. Nie ma ani jednego zepsutego.

### 11. Wymiana ikony kojarzonej z AI

Ikona iskierki, czyli czteroramiennej gwiazdki z błyskami, to dziś powszechnie
rozpoznawany symbol sztucznej inteligencji i wyglądała na stronie firmy montażowej
obco. Zastąpiła ją ikona podmuchu powietrza, która pasuje do wszystkich pięciu miejsc,
w których była używana: przeglądów i czyszczenia, higieny powietrza, filtracji
i sterylizacji oraz porządku po pracy. Stary plik ikony został usunięty z projektu.

### 12. Przepełnienia i efekty najechania

Wartości parametrów w kartach modeli były przycinane na wąskich kartach, bo wiersz
specyfikacji używał układu elastycznego z rozsunięciem do krawędzi. Wiersz przebudowano
na siatkę, w której etykieta zajmuje tyle, ile potrzebuje, a wartość dostaje resztę
i może zawinąć się do drugiej linii. Długie napisy w kartach mogą się teraz łamać
zamiast rozpychać ramkę.

Efekty najechania działają na wszystkich kaflach. Karta modelu unosi się, dostaje cień,
niebieskawą ramkę, a jej zdjęcie delikatnie się przybliża w obrębie kadru. Ten sam efekt
dodano kartom usług, których wcześniej nie miały, oraz zdjęciu na stronie o nas. Reakcja
uruchamia się także przy nawigacji klawiaturą, nie tylko myszą.

Poprawność sprawdzono pomiarowo: 126 kombinacji, czyli 21 podstron na sześciu
szerokościach ekranu od 1440 do 390 pikseli. Nie znaleziono ani jednego elementu
wystającego poza ramkę czy poza ekran, ani żadnego przyciętego napisu.

### 13. Rozwijane menu w nawigacji

Pozycja "Narzędzia" w górnym pasku otwiera teraz panel z trzema wejściami: Gree, Kaisai
i sama strona narzędzi z ikoną klucza. Panel działa myszą i klawiaturą: strzałki
przechodzą po pozycjach, Escape zamyka i wraca na przycisk, kliknięcie obok też zamyka.

Pasek nawigacji przewija się poziomo na wąskich ekranach, więc panel osadzony wewnątrz
niego byłby przycinany. Dlatego leży poza paskiem i jest pozycjonowany względem okna,
przyklejony do przycisku, z dosunięciem do krawędzi ekranu, gdy zabrakłoby miejsca.

Nazwy marek są sygnaturami tekstowymi, nie skopiowanymi znakami towarowymi. Jeśli macie
oficjalne pliki logotypów od producentów, podmiana to jedna linia w komponencie.

### 14. Klikalne modele

Kliknięcie w jednostkę na scenie trójwymiarowej na stronie głównej prowadzi na podstronę
marki, która akurat jest wyświetlana. Trafienie liczy raycaster po geometrii jednostki,
więc kliknięcie w puste tło hero nic nie robi, a kursor zmienia się w rękę dopiero nad
samym urządzeniem. Przy okazji wyszedł błąd: kontener treści hero rozciągał się na całą
szerokość i przechwytywał kliknięcia kierowane w model. Teraz sam nie łapie wskaźnika,
łapią go dopiero nagłówek i przyciski.

Karty modeli na podstronach Gree i Kaisai są odnośnikami do strony kontaktu i mają
widoczne wezwanie "Zapytaj o wycenę" ze strzałką reagującą na najechanie. Każda karta
ma opis dla czytników ekranu z nazwą serii.

### 15. Drobne zmiany porządkowe

- Usunięto nieużywany komponent zastępczy galerii zdjęć oraz pasek zaufania zastąpiony bogatszymi sekcjami.
- Uporządkowano dane firmowe w jednym pliku konfiguracyjnym: kontakty, obszar działania, ceny, godziny, dane do stopki.
- Dodano miejsca na identyfikator Google Analytics i kod weryfikacyjny Google Search Console, wyłączone do czasu uzupełnienia.
- Dodano ikonę dla urządzeń Apple.

---

## Stan techniczny

| Parametr | Wartość |
|---|---|
| Liczba podstron | 21 zbudowanych, 20 w mapie strony (bez strony błędu) |
| Adresów w mapie strony | 20, zgodność z budowaniem potwierdzona automatycznie |
| Zepsutych odnośników wewnętrznych | 0 |
| Brakujących obrazów | 0 |
| Błędów kontroli typów | 0 |
| Rozmiar zbudowanego serwisu | 2,4 MB |

Sprawdzone szerokości ekranu: 1440, 1180, 1024, 900, 700 i 390 pikseli, na każdej
podstronie. Nigdzie nie występuje przewijanie w poziomie ani przycinanie tekstu.

## Co warto zrobić dalej

1. Uzupełnić numer NIP i adres firmy w danych do stopki i regulaminu, bo pola są przygotowane, ale puste.
2. Wkleić identyfikator Google Analytics i kod weryfikacyjny Google Search Console.
3. Potwierdzić z producentami prawo do wykorzystania zdjęć produktowych.
4. Uzupełnić poziomy głośności serii Kaisai z kart katalogowych, bo producent nie publikuje ich na stronie.
