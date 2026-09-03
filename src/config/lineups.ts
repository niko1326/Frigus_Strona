import type { LineupModel } from '../components/ModelLineup.astro';

/**
 * Serie klimatyzatorów ściennych, które montujemy.
 * Dane techniczne (moce, klasy energetyczne) pochodzą z kart produktowych
 * producentów - stan na wrzesień 2026. Zdjęcia: materiały producenta.
 */

export const GREE_MODELS: LineupModel[] = [
  {
    name: 'G-TIME',
    badge: 'Nowość',
    tagline:
      'Najnowsza seria Gree ze sprężarką G-STORM. Grzeje jeszcze przy -30°C, więc realnie zastępuje dogrzewanie zimą.',
    image: '/photos/modele/gree-g-time.webp',
    alt: 'Klimatyzator ścienny Gree G-TIME w kolorze białym',
    capacities: ['2,7', '3,5', '5,3', '7,1'],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Grzanie do -30°C', 'Czujnik wilgotności', 'Sterowanie Wi-Fi', 'Czynnik R32']
  },
  {
    name: 'Cosmo Pearl',
    tagline:
      'Cicha seria z jonizacją Colasma i wyjątkowo wyciszoną jednostką zewnętrzną. Dobry wybór, gdy sąsiad jest blisko.',
    image: '/photos/modele/gree-cosmo-pearl.webp',
    alt: 'Klimatyzator ścienny Gree Cosmo Pearl w perłowej bieli',
    capacities: ['2,7', '3,5', '5,1', '7,1'],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Jonizacja Colasma', 'Cicha jednostka zewnętrzna', 'Zawór EEV', 'Czynnik R32']
  },
  {
    name: 'Clivia',
    tagline:
      'Pięć wersji kolorystycznych, od beżowego kamienia po satynową czerń. Dla wnętrz, w których klimatyzator ma być elementem aranżacji.',
    image: '/photos/modele/gree-clivia.webp',
    alt: 'Klimatyzator ścienny Gree Clivia w wersji srebrnej',
    capacities: ['2,7', '3,5', '5,3', '7,1'],
    energyClass: 'A+++ / A++ (2,7 kW), dalej A++ / A+',
    features: ['5 kolorów', 'Lampa UVC', 'Jonizator', 'Kontrola wilgotności']
  },
  {
    name: 'Airy',
    tagline:
      'Seria z algorytmem G-AI Plus 2.0, który sam ogranicza zużycie energii, i hybrydowym rozmrażaniem HDT.',
    image: '/photos/modele/gree-airy.webp',
    alt: 'Klimatyzator ścienny Gree Airy w wersji Dark',
    capacities: ['2,7', '3,5', '5,3', '7,1'],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'G-AI Plus 2.0', 'Lampa UVC', '4 kolory']
  },
  {
    name: 'Amber Prestige',
    badge: 'Najwyższa klasa',
    tagline:
      'Dwustopniowa sprężarka i najwyższa klasa energetyczna także w grzaniu. Wybór, gdy klimatyzacja ma być głównym źródłem ciepła.',
    image: '/photos/modele/gree-amber-prestige.webp',
    alt: 'Klimatyzator ścienny Gree Amber Prestige',
    capacities: ['2,7', '3,5', '5,3', '7,0'],
    energyClass: 'A+++ / A+++ (do 3,5 kW), dalej A++ / A+',
    features: [
      'Grzanie przy -30°C',
      'Chłodzenie do +52°C',
      'Sprężarka dwustopniowa',
      '7 lat gwarancji'
    ]
  },
  {
    name: 'U-Crown Silver',
    tagline:
      'Metalowy front w charakterystycznym profilu w kształcie litery U. Najbardziej wyrazista wizualnie jednostka w ofercie Gree.',
    image: '/photos/modele/gree-u-crown.webp',
    alt: 'Klimatyzator ścienny Gree U-Crown w kolorze srebrnym',
    capacities: ['2,7 - 5,3'],
    energyClass: 'A++ / A++',
    features: ['Metaliczny front', '7 biegów wentylatora', 'Multi Free Match', '7 lat gwarancji']
  },
  {
    name: 'Fairy',
    tagline:
      'Zaokrąglona, dyskretna bryła w trzech kolorach. Klasyczny wybór do sypialni i pokoju dziecka.',
    image: '/photos/modele/gree-fairy.webp',
    alt: 'Klimatyzator ścienny Gree Fairy w kolorze czarnym',
    capacities: ['2,7', '3,5', '5,3', '7,1'],
    energyClass: 'A++ / A+',
    features: ['3 kolory', 'Jonizator', '7 biegów wentylatora', 'Sterowanie Wi-Fi']
  },
  {
    name: 'Pular',
    badge: 'Najczęściej wybierana',
    tagline:
      'Najlepszy stosunek ceny do możliwości w ofercie Gree. To od tej serii zwykle zaczynamy wycenę mieszkania.',
    image: '/photos/modele/gree-pular.webp',
    alt: 'Klimatyzator ścienny Gree Pular w wersji matowej',
    capacities: ['2,5', '3,2', '4,6', '6,2'],
    energyClass: 'A++ / A+',
    features: ['Wi-Fi w standardzie', 'Samoczyszczenie', 'Wersja mat lub połysk', 'Czynnik R32']
  },
  {
    name: 'Pular PRO',
    tagline:
      'Mocniejszy wariant Pulara: grzeje do -25°C i chłodzi nawet przy +50°C, z grzałkami tacy skroplin.',
    image: '/photos/modele/gree-pular-pro.webp',
    alt: 'Klimatyzator ścienny Gree Pular PRO w wersji Dark',
    capacities: ['2,7', '3,5', '5,3', '7,1'],
    energyClass: 'A++ / A+',
    features: ['Grzanie do -25°C', 'Chłodzenie do +50°C', 'Jonizator', 'Samoczyszczenie']
  }
];

export const KAISAI_MODELS: LineupModel[] = [
  {
    name: 'AIR (KKWK)',
    badge: 'Nowość',
    tagline:
      'Najnowsza seria Kaisai z filtrem jonów srebra i samoczyszczeniem parownika. Prosty, uniwersalny wybór do mieszkania.',
    image: '/photos/modele/kaisai-air.webp',
    alt: 'Klimatyzator ścienny Kaisai AIR w kolorze białym',
    capacities: ['2,6', '3,4', '5,1', '7,0'],
    energyClass: 'A++ / A+',
    features: [
      'Grzanie do -20°C',
      'Filtr jonów srebra',
      'Samoczyszczenie parownika',
      'Złote lamele'
    ]
  },
  {
    name: 'FLY+ (KKWX)',
    badge: 'Nowość',
    tagline:
      'Seria projektowana pod cichą pracę, z trybem sterylizacji 56°C. Do sypialni, w której klimatyzator pracuje nocą.',
    image: '/photos/modele/kaisai-fly-plus.webp',
    alt: 'Klimatyzator ścienny Kaisai FLY+ w kolorze białym',
    capacities: ['2,6', '3,5', '5,2', '7,0'],
    energyClass: 'A++ / A+',
    features: ['Grzanie do -25°C', 'Tryb AI Eco+', 'Sterylizacja 56°C', 'Obsługa Modbus']
  },
  {
    name: 'GEO+ (KKWR / KKWS)',
    badge: 'Nowość',
    tagline:
      'Wysoka klasa energetyczna, lampa UVC i potrójna filtracja. Dostępna w bieli i w szarości.',
    image: '/photos/modele/kaisai-geo-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai GEO+ w wersji białej i szarej',
    capacities: ['2,7', '3,5', '5,4', '7,2'],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Lampa UVC', 'Potrójny filtr', 'Nawiew Soft Wind']
  },
  {
    name: 'ART (KKWI / KKWF)',
    badge: 'Nowość',
    tagline:
      'Designerska jednostka z podwójnymi żaluzjami, w bieli lub czerni. Gdy klimatyzator ma być widoczny i ma dobrze wyglądać.',
    image: '/photos/modele/kaisai-art.webp',
    alt: 'Klimatyzatory ścienne Kaisai ART w wersji białej i czarnej',
    capacities: ['2,7', '3,6', '5,3', '7,0'],
    energyClass: 'A+++ / A++',
    features: [
      'Grzanie do -25°C',
      'Podwójne żaluzje',
      'Sterowanie z aplikacji',
      'Biały lub czarny'
    ]
  },
  {
    name: 'EVO (KEV)',
    tagline:
      'Sprawdzona seria ze zintegrowanym modułem Wi-Fi w standardzie. Rozsądny wybór do pierwszej klimatyzacji.',
    image: '/photos/modele/kaisai-evo.webp',
    alt: 'Klimatyzator ścienny Kaisai EVO w kolorze białym',
    capacities: ['2,6', '3,4', '5,1', '7,0'],
    energyClass: 'A++ / A+',
    features: [
      'Grzanie do -20°C',
      'Wi-Fi w standardzie',
      'Samoczyszczenie parownika',
      'Filtr jonów srebra'
    ]
  },
  {
    name: 'PRO HEAT+ (KRW / KRB)',
    badge: 'Do grzania zimą',
    tagline:
      'Seria zaprojektowana pod pracę grzewczą przy niskich temperaturach. Dobra alternatywa dla dogrzewania elektrycznego.',
    image: '/photos/modele/kaisai-pro-heat-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai PRO HEAT+ w wersji białej i czarnej',
    capacities: ['2,6', '3,5', '5,2', '7,0'],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Wi-Fi w standardzie', 'Jonizator', 'Biały lub czarny']
  },
  {
    name: 'NORDIC (KNP)',
    tagline:
      'Najwyższa klasa energetyczna także w grzaniu i praca przy mrozie do -35°C. Dostępna w jednej wielkości.',
    image: '/photos/modele/kaisai-nordic.webp',
    alt: 'Klimatyzator ścienny Kaisai NORDIC w kolorze białym',
    capacities: ['3,5'],
    energyClass: 'A+++ / A+++',
    features: ['Grzanie do -35°C', 'Jonizator', 'Sterowanie Wi-Fi', 'Czynnik R32']
  },
  {
    name: 'ICE (KLW / KLB)',
    tagline:
      'Wysokie współczynniki sezonowe i filtr Bio HEPA, w czarnym lub białym wykończeniu.',
    image: '/photos/modele/kaisai-ice.webp',
    alt: 'Klimatyzatory ścienne Kaisai ICE w wersji czarnej i białej',
    capacities: ['2,6', '3,5', '5,3', '7,0'],
    energyClass: 'A+++ / A+',
    features: ['SEER 8,8 / SCOP 4,6', 'Grzanie do -25°C', 'Filtr Bio HEPA', 'Czarny lub biały']
  }
];
