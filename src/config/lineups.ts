export type EnergyVariant = {
  /** Moc używana w deep linku i do zachowania wariantu między modelami. */
  powerKw: number;
  /** Etykieta wariantu zgodna z materiałami producenta. */
  label: string;
  coolingCapacityKw: number;
  heatingCapacityKw: number;
  seer: number;
  scop: number;
};

export type LineupModel = {
  name: string;
  slug: string;
  tagline: string;
  image: string;
  alt: string;
  variants: EnergyVariant[];
  energyClass?: string;
  noise?: string;
  features: string[];
  badge?: string;
};

const variant = (
  label: string,
  data: Omit<EnergyVariant, 'label' | 'powerKw'>
): EnergyVariant => ({
  label,
  powerKw: Number(label.replace(',', '.')),
  ...data
});

/**
 * Serie klimatyzatorów ściennych, które montujemy.
 * Dane techniczne (moce, klasy energetyczne) pochodzą z kart produktowych
 * producentów - stan na wrzesień 2026. Zdjęcia: materiały producenta.
 *
 * GREE: karty katalogowe i katalog RAC 2026 publikowane przez producenta.
 * KAISAI: aktualne ulotki techniczne z kaisai.com.
 * Etykieta wariantu jest nazwą handlową; coolingCapacityKw przechowuje dokładną
 * moc znamionową z tabeli producenta, jeśli różni się od zaokrąglonej etykiety.
 */

export const GREE_MODELS: LineupModel[] = [
  {
    name: 'G-TIME',
    slug: 'gree-g-time',
    badge: 'Nowość',
    tagline:
      'Najnowsza seria Gree ze sprężarką G-STORM. Grzeje jeszcze przy -30°C, więc realnie zastępuje dogrzewanie zimą.',
    image: '/photos/modele/gree-g-time.webp',
    alt: 'Klimatyzator ścienny Gree G-TIME w kolorze białym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.52, heatingCapacityKw: 3.81, seer: 8.5, scop: 4.8 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6 })
    ],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Grzanie do -30°C', 'Czujnik wilgotności', 'Sterowanie Wi-Fi', 'Czynnik R32']
  },
  {
    name: 'Cosmo Pearl',
    slug: 'gree-cosmo-pearl',
    tagline:
      'Cicha seria z jonizacją Colasma i wyjątkowo wyciszoną jednostką zewnętrzną. Dobry wybór, gdy sąsiad jest blisko.',
    image: '/photos/modele/gree-cosmo-pearl.webp',
    alt: 'Klimatyzator ścienny Gree Cosmo Pearl w perłowej bieli',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 8.5, scop: 4.8 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6 })
    ],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Jonizacja Colasma', 'Cicha jednostka zewnętrzna', 'Zawór EEV', 'Czynnik R32']
  },
  {
    name: 'Clivia',
    slug: 'gree-clivia',
    tagline:
      'Pięć wersji kolorystycznych, od beżowego kamienia po satynową czerń. Dla wnętrz, w których klimatyzator ma być elementem aranżacji.',
    image: '/photos/modele/gree-clivia.webp',
    alt: 'Klimatyzator ścienny Gree Clivia w wersji srebrnej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.2, scop: 4.1 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.35, seer: 7.3, scop: 4.2 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.3, seer: 7, scop: 4.3 })
    ],
    energyClass: 'A+++ / A++ (2,7 kW), dalej A++ / A+',
    features: ['5 kolorów', 'Lampa UVC', 'Jonizator', 'Kontrola wilgotności']
  },
  {
    name: 'Airy',
    slug: 'gree-airy',
    tagline:
      'Seria z algorytmem G-AI Plus 2.0, który sam ogranicza zużycie energii, i hybrydowym rozmrażaniem HDT.',
    image: '/photos/modele/gree-airy.webp',
    alt: 'Klimatyzator ścienny Gree Airy w wersji Dark',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 9, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 8.5, scop: 4.6 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'G-AI Plus 2.0', 'Lampa UVC', '4 kolory']
  },
  {
    name: 'Amber Prestige',
    slug: 'gree-amber-prestige',
    badge: 'Najwyższa klasa',
    tagline:
      'Dwustopniowa sprężarka i najwyższa klasa energetyczna także w grzaniu. Wybór, gdy klimatyzacja ma być głównym źródłem ciepła.',
    image: '/photos/modele/gree-amber-prestige.webp',
    alt: 'Klimatyzator ścienny Gree Amber Prestige',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.5, seer: 8.5, scop: 5.1 }),
      variant('3,53', { coolingCapacityKw: 3.53, heatingCapacityKw: 4.2, seer: 8.5, scop: 5.1 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.57, seer: 6.6, scop: 4.4 }),
      variant('7,03', { coolingCapacityKw: 7.03, heatingCapacityKw: 7.03, seer: 6.5, scop: 4.1 })
    ],
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
    slug: 'gree-u-crown',
    tagline:
      'Metalowy front w charakterystycznym profilu w kształcie litery U. Najbardziej wyrazista wizualnie jednostka w ofercie Gree.',
    image: '/photos/modele/gree-u-crown.webp',
    alt: 'Klimatyzator ścienny Gree U-Crown w kolorze srebrnym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.2, seer: 7.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.53, heatingCapacityKw: 4, seer: 7.2, scop: 4.6 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.3, seer: 6.8, scop: 4 })
    ],
    energyClass: 'A++ / A++',
    features: ['Metaliczny front', '7 biegów wentylatora', 'Multi Free Match', '7 lat gwarancji']
  },
  {
    name: 'Fairy',
    slug: 'gree-fairy',
    tagline:
      'Zaokrąglona, dyskretna bryła w trzech kolorach. Klasyczny wybór do sypialni i pokoju dziecka.',
    image: '/photos/modele/gree-fairy.webp',
    alt: 'Klimatyzator ścienny Gree Fairy w kolorze czarnym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 7.5, scop: 4.2 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 7.1, scop: 4.1 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7.6, scop: 4.3 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 7, scop: 4.2 })
    ],
    energyClass: 'A++ / A+',
    features: ['3 kolory', 'Jonizator', '7 biegów wentylatora', 'Sterowanie Wi-Fi']
  },
  {
    name: 'Pular',
    slug: 'gree-pular',
    badge: 'Najczęściej wybierana',
    tagline:
      'Najlepszy stosunek ceny do możliwości w ofercie Gree. To od tej serii zwykle zaczynamy wycenę mieszkania.',
    image: '/photos/modele/gree-pular.webp',
    alt: 'Klimatyzator ścienny Gree Pular w wersji matowej',
    variants: [
      variant('2,5', { coolingCapacityKw: 2.5, heatingCapacityKw: 2.8, seer: 6.5, scop: 4 }),
      variant('3,2', { coolingCapacityKw: 3.2, heatingCapacityKw: 3.4, seer: 6.1, scop: 4 }),
      variant('4,6', { coolingCapacityKw: 4.6, heatingCapacityKw: 5.2, seer: 6.4, scop: 4 }),
      variant('6,2', { coolingCapacityKw: 6.2, heatingCapacityKw: 6.5, seer: 6.8, scop: 4 })
    ],
    energyClass: 'A++ / A+',
    features: ['Wi-Fi w standardzie', 'Samoczyszczenie', 'Wersja mat lub połysk', 'Czynnik R32']
  },
  {
    name: 'Pular PRO',
    slug: 'gree-pular-pro',
    tagline:
      'Mocniejszy wariant Pulara: grzeje do -25°C i chłodzi nawet przy +50°C, z grzałkami tacy skroplin.',
    image: '/photos/modele/gree-pular-pro.webp',
    alt: 'Klimatyzator ścienny Gree Pular PRO w wersji Dark',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 7.5, scop: 4.2 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.1, scop: 4.1 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7.3, scop: 4.2 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 7, scop: 4.2 })
    ],
    energyClass: 'A++ / A+',
    features: ['Grzanie do -25°C', 'Chłodzenie do +50°C', 'Jonizator', 'Samoczyszczenie']
  }
];

export const KAISAI_MODELS: LineupModel[] = [
  {
    name: 'AIR (KKWK)',
    slug: 'kaisai-air',
    badge: 'Nowość',
    tagline:
      'Najnowsza seria Kaisai z filtrem jonów srebra i samoczyszczeniem parownika. Prosty, uniwersalny wybór do mieszkania.',
    image: '/photos/modele/kaisai-air.webp',
    alt: 'Klimatyzator ścienny Kaisai AIR w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.7, seer: 6.4, scop: 4 }),
      variant('3,4', { coolingCapacityKw: 3.4, heatingCapacityKw: 3.4, seer: 6.1, scop: 4 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.2, seer: 6.8, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 6.4, scop: 4 })
    ],
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
    slug: 'kaisai-fly-plus',
    badge: 'Nowość',
    tagline:
      'Seria projektowana pod cichą pracę, z trybem sterylizacji 56°C. Do sypialni, w której klimatyzator pracuje nocą.',
    image: '/photos/modele/kaisai-fly-plus.webp',
    alt: 'Klimatyzator ścienny Kaisai FLY+ w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.9, seer: 7, scop: 4.1 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 6.5, scop: 4.1 }),
      variant('5,2', { coolingCapacityKw: 5.2, heatingCapacityKw: 5.4, seer: 7.4, scop: 4.1 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.3, seer: 6.5, scop: 4.1 })
    ],
    energyClass: 'A++ / A+',
    features: ['Grzanie do -25°C', 'Tryb AI Eco+', 'Sterylizacja 56°C', 'Obsługa Modbus']
  },
  {
    name: 'GEO+ (KKWR / KKWS)',
    slug: 'kaisai-geo-plus',
    badge: 'Nowość',
    tagline:
      'Wysoka klasa energetyczna, lampa UVC i potrójna filtracja. Dostępna w bieli i w szarości.',
    image: '/photos/modele/kaisai-geo-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai GEO+ w wersji białej i szarej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.3, seer: 8.7, scop: 4.7 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 4.2, seer: 8.7, scop: 4.7 }),
      variant('5,4', { coolingCapacityKw: 5.4, heatingCapacityKw: 5.8, seer: 8.7, scop: 4.6 }),
      variant('7,2', { coolingCapacityKw: 7.2, heatingCapacityKw: 7.3, seer: 8.7, scop: 4.6 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Lampa UVC', 'Potrójny filtr', 'Nawiew Soft Wind']
  },
  {
    name: 'ART (KKWI / KKWF)',
    slug: 'kaisai-art',
    badge: 'Nowość',
    tagline:
      'Designerska jednostka z podwójnymi żaluzjami, w bieli lub czerni. Gdy klimatyzator ma być widoczny i ma dobrze wyglądać.',
    image: '/photos/modele/kaisai-art.webp',
    alt: 'Klimatyzatory ścienne Kaisai ART w wersji białej i czarnej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.4, seer: 8.5, scop: 4.6 }),
      variant('3,6', { coolingCapacityKw: 3.6, heatingCapacityKw: 3.9, seer: 8.5, scop: 4.7 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 8.5, scop: 4.7 })
    ],
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
    slug: 'kaisai-evo',
    tagline:
      'Sprawdzona seria ze zintegrowanym modułem Wi-Fi w standardzie. Rozsądny wybór do pierwszej klimatyzacji.',
    image: '/photos/modele/kaisai-evo.webp',
    alt: 'Klimatyzator ścienny Kaisai EVO w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.7, seer: 6.4, scop: 4 }),
      variant('3,4', { coolingCapacityKw: 3.4, heatingCapacityKw: 3.4, seer: 6.1, scop: 4 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.2, seer: 6.8, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 6.4, scop: 4 })
    ],
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
    slug: 'kaisai-pro-heat-plus',
    badge: 'Do grzania zimą',
    tagline:
      'Seria zaprojektowana pod pracę grzewczą przy niskich temperaturach. Dobra alternatywa dla dogrzewania elektrycznego.',
    image: '/photos/modele/kaisai-pro-heat-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai PRO HEAT+ w wersji białej i czarnej',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 3.3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.9, seer: 8.5, scop: 4.7 }),
      variant('5,2', { coolingCapacityKw: 5.2, heatingCapacityKw: 5.5, seer: 8.5, scop: 4.6 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 8.5, scop: 4.7 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Wi-Fi w standardzie', 'Jonizator', 'Biały lub czarny']
  },
  {
    name: 'NORDIC (KNP)',
    slug: 'kaisai-nordic',
    tagline:
      'Najwyższa klasa energetyczna także w grzaniu i praca przy mrozie do -35°C. Dostępna w jednej wielkości.',
    image: '/photos/modele/kaisai-nordic.webp',
    alt: 'Klimatyzator ścienny Kaisai NORDIC w kolorze białym',
    variants: [variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 9.2, scop: 5.1 })],
    energyClass: 'A+++ / A+++',
    features: ['Grzanie do -35°C', 'Jonizator', 'Sterowanie Wi-Fi', 'Czynnik R32']
  },
  {
    name: 'ICE (KLW / KLB)',
    slug: 'kaisai-ice',
    tagline:
      'Wysokie współczynniki sezonowe i filtr Bio HEPA, w czarnym lub białym wykończeniu.',
    image: '/photos/modele/kaisai-ice.webp',
    alt: 'Klimatyzatory ścienne Kaisai ICE w wersji czarnej i białej',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.9, seer: 8.8, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 8.5, scop: 4.6 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.3, seer: 6.4, scop: 4 })
    ],
    energyClass: 'A+++ / A+',
    features: ['SEER 8,8 / SCOP 4,6', 'Grzanie do -25°C', 'Filtr Bio HEPA', 'Czarny lub biały']
  }
];

export const ENERGY_MODELS = [
  ...GREE_MODELS.map((model) => ({ ...model, brand: 'gree' as const, brandLabel: 'GREE' })),
  ...KAISAI_MODELS.map((model) => ({ ...model, brand: 'kaisai' as const, brandLabel: 'KAISAI' }))
];
