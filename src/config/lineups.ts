import { PRICING } from './site.ts';

export type EnergyVariant = {
  /** Moc używana w deep linku i do zachowania wariantu między modelami. */
  powerKw: number;
  /** Etykieta wariantu zgodna z materiałami producenta. */
  label: string;
  coolingCapacityKw: number;
  heatingCapacityKw: number;
  seer: number;
  scop: number;
  /** Cena urządzenia z montażem; po uzupełnieniu zasila automatycznie ceny „od”. */
  installedPriceFromPLN?: number;
  /** Cena podanego wariantu z podstawowym montażem. */
  priceFromPLN?: number;
  /** Cena wariantu w kolorze innym niż biały, jeśli producent rozróżnia cenę. */
  colorPriceFromPLN?: number;
};

export type ProductPageData = {
  /** Krótki slug używany w adresie strony produktu, np. /klimatyzatory-gree/pular/. */
  slug: string;
  description: string;
  recommendedFor: string[];
  /** Cena kompletnej usługi. Można ją nadpisać osobno dla każdej serii. */
  priceFromPLN: number;
  colors?: ProductColor[];
};

export type ProductColor = {
  name: string;
  image: string;
  alt: string;
  /** Kolor próbki w selektorze; zdjęcie pokazuje właściwe wykończenie urządzenia. */
  swatch: string;
  /** Kolor korzysta z osobnego cennika wariantów kolorystycznych. */
  priceTier?: 'color';
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
  product?: ProductPageData;
};

export type ProductLineupModel = LineupModel & { product: ProductPageData };

const variant = (
  label: string,
  data: Omit<EnergyVariant, 'label' | 'powerKw'>
): EnergyVariant => ({
  label,
  powerKw: Number(label.replace(',', '.')),
  ...data
});

const product = (
  slug: string,
  description: string,
  recommendedFor: string[],
  options: { priceFromPLN?: number; colors?: ProductColor[] } = {}
): ProductPageData => ({
  slug,
  description,
  recommendedFor,
  priceFromPLN: options.priceFromPLN ?? PRICING.installFromPLN,
  colors: options.colors
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

export const GREE_MODELS: ProductLineupModel[] = [
  {
    name: 'G-TIME',
    slug: 'gree-g-time',
    product: product(
      'g-time',
      'Gree G-TIME łączy wysoką sprawność sezonową z rozwiązaniami wspierającymi ogrzewanie w niskich temperaturach. Cztery warianty mocy pozwalają dopasować serię do sypialni, salonu lub większej otwartej strefy.',
      [
        'w domu, w którym klimatyzator ma także regularnie ogrzewać zimą',
        'w salonie lub większej otwartej przestrzeni',
        'gdy ważna jest kontrola wilgotności i sterowanie przez Wi-Fi'
      ],
      { priceFromPLN: 4599 }
    ),
    badge: 'NOWA SERIA',
    tagline:
      'Najnowsza seria Gree ze sprężarką G-STORM, przygotowana do pracy w trybie grzania także przy bardzo niskich temperaturach.',
    image: '/photos/modele/gree-g-time.webp',
    alt: 'Klimatyzator ścienny Gree G-TIME w kolorze białym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6, priceFromPLN: 4599 }),
      variant('3,5', { coolingCapacityKw: 3.52, heatingCapacityKw: 3.81, seer: 8.5, scop: 4.8, priceFromPLN: 4799 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6, priceFromPLN: 6199 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6, priceFromPLN: 6599 })
    ],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Grzanie do -30°C', 'Cicha praca', 'Sterowanie Wi-Fi', 'Kontrola wilgotności']
  },
  {
    name: 'Cosmo Pearl',
    slug: 'gree-cosmo-pearl',
    product: product(
      'cosmo-pearl',
      'Gree Cosmo Pearl to seria nastawiona na cichą pracę oraz komfort użytkowania. Perłowe wykończenie, jonizacja Colasma i wyciszona jednostka zewnętrzna sprawdzają się tam, gdzie urządzenie pracuje blisko strefy wypoczynku.',
      [
        'w sypialni lub pokoju dziecka',
        'w mieszkaniu z balkonem położonym blisko sąsiadów',
        'gdy priorytetem są cicha praca i funkcje wspierające jakość powietrza'
      ],
      { priceFromPLN: 4399 }
    ),
    tagline:
      'Cicha seria z jonizacją Colasma i wyciszoną jednostką zewnętrzną, przeznaczona dla osób, którym szczególnie zależy na komforcie akustycznym.',
    image: '/photos/modele/gree-cosmo-pearl.webp',
    alt: 'Klimatyzator ścienny Gree Cosmo Pearl w perłowej bieli',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6, priceFromPLN: 4399 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 8.5, scop: 4.8, priceFromPLN: 4599 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6, priceFromPLN: 5899 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6, priceFromPLN: 6399 })
    ],
    energyClass: 'A+++ / A++',
    noise: 'od 18 dB(A)',
    features: ['Cicha praca', 'Jonizacja powietrza', 'Cicha jednostka zewnętrzna', 'Sterowanie Wi-Fi']
  },
  {
    name: 'Clivia',
    slug: 'gree-clivia',
    product: product(
      'clivia',
      'Gree Clivia wyróżnia się szerokim wyborem kolorów oraz funkcjami wspierającymi komfort i jakość powietrza. To seria do wnętrz, w których wygląd jednostki jest równie ważny jak jej parametry pracy.',
      [
        'w reprezentacyjnym salonie lub nowocześnie urządzonym mieszkaniu',
        'gdy kolor jednostki ma pasować do aranżacji',
        'dla osób zainteresowanych lampą UVC, jonizacją i kontrolą wilgotności'
      ],
      {
        priceFromPLN: 4399,
        colors: [
          {
            name: 'Beżowy kamień',
            image: '/photos/modele/kolory/gree-clivia-bezowy-kamien.webp',
            alt: 'Klimatyzator ścienny Gree Clivia w kolorze Beige Stone',
            swatch: '#d8cdbc',
            priceTier: 'color'
          },
          {
            name: 'Granatowy',
            image: '/photos/modele/kolory/gree-clivia-granatowy.webp',
            alt: 'Klimatyzator ścienny Gree Clivia w kolorze Navy Blue',
            swatch: '#25384e',
            priceTier: 'color'
          },
          {
            name: 'Satynowa czerń',
            image: '/photos/modele/kolory/gree-clivia-satynowa-czern.webp',
            alt: 'Klimatyzator ścienny Gree Clivia w kolorze Satin Black',
            swatch: '#25272a',
            priceTier: 'color'
          },
          {
            name: 'Srebrny',
            image: '/photos/modele/kolory/gree-clivia-srebrny.webp',
            alt: 'Klimatyzator ścienny Gree Clivia w kolorze Silver',
            swatch: '#b8bdc1',
            priceTier: 'color'
          },
          {
            name: 'Biały',
            image: '/photos/modele/kolory/gree-clivia-bialy.webp',
            alt: 'Klimatyzator ścienny Gree Clivia w kolorze White',
            swatch: '#f4f4f1'
          }
        ]
      }
    ),
    tagline:
      'Pięć wersji kolorystycznych, od beżowego kamienia po satynową czerń. Dla wnętrz, w których klimatyzator ma być elementem aranżacji.',
    image: '/photos/modele/gree-clivia.webp',
    alt: 'Klimatyzator ścienny Gree Clivia w wersji srebrnej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 8.5, scop: 4.6, priceFromPLN: 4399, colorPriceFromPLN: 4499 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.2, scop: 4.1, priceFromPLN: 4599, colorPriceFromPLN: 4599 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.35, seer: 7.3, scop: 4.2, priceFromPLN: 5899, colorPriceFromPLN: 5999 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.3, seer: 7, scop: 4.3, priceFromPLN: 6499, colorPriceFromPLN: 6499 })
    ],
    energyClass: 'A+++ / A++ (2,7 kW), dalej A++ / A+',
    features: ['5 wersji kolorystycznych', 'Lampa UVC', 'Jonizacja', 'Kontrola wilgotności']
  },
  {
    name: 'Airy',
    slug: 'gree-airy',
    product: product(
      'airy',
      'Gree Airy jest serią o wysokiej sprawności sezonowej, wyposażoną w algorytm G-AI Plus 2.0 i hybrydowe rozmrażanie. Jest dostępna w czterech mocach i kilku wersjach kolorystycznych.',
      [
        'przy częstym chłodzeniu i regularnym ogrzewaniu',
        'w mieszkaniu albo domu, gdzie liczy się wysoka efektywność sezonowa',
        'gdy potrzebne są nowoczesne funkcje i wybór koloru urządzenia'
      ],
      {
        priceFromPLN: 4899,
        colors: [
          {
            name: 'Ciemny',
            image: '/photos/modele/kolory/gree-airy-ciemny.webp',
            alt: 'Klimatyzator ścienny Gree Airy w kolorze Dark',
            swatch: '#282a2e',
            priceTier: 'color'
          },
          {
            name: 'Szampański',
            image: '/photos/modele/kolory/gree-airy-szampanski.webp',
            alt: 'Klimatyzator ścienny Gree Airy w kolorze Champagne',
            swatch: '#c5b59d',
            priceTier: 'color'
          },
          {
            name: 'Srebrny',
            image: '/photos/modele/kolory/gree-airy-srebrny.webp',
            alt: 'Klimatyzator ścienny Gree Airy w kolorze Silver',
            swatch: '#b7bcc0',
            priceTier: 'color'
          },
          {
            name: 'Biały',
            image: '/photos/modele/kolory/gree-airy-bialy.webp',
            alt: 'Klimatyzator ścienny Gree Airy w kolorze White',
            swatch: '#f3f3f0'
          }
        ]
      }
    ),
    tagline:
      'Seria z algorytmem G-AI Plus 2.0, który sam ogranicza zużycie energii, i hybrydowym rozmrażaniem HDT.',
    image: '/photos/modele/gree-airy.webp',
    alt: 'Klimatyzator ścienny Gree Airy w wersji Dark',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 9, scop: 4.6, priceFromPLN: 4899, colorPriceFromPLN: 5099 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 8.5, scop: 4.6, priceFromPLN: 5099, colorPriceFromPLN: 5199 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6, priceFromPLN: 6299, colorPriceFromPLN: 6399 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 8.5, scop: 4.6, priceFromPLN: 6799, colorPriceFromPLN: 6899 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Oszczędzanie energii G-AI', 'Lampa UVC', '4 wersje kolorystyczne']
  },
  {
    name: 'Amber Prestige',
    slug: 'gree-amber-prestige',
    product: product(
      'amber-prestige',
      'Gree Amber Prestige to seria przygotowana do wymagającej pracy grzewczej. Dwustopniowa sprężarka, wysoki SCOP mniejszych wariantów i szeroki zakres temperatur pracy czynią ją rozwiązaniem do całorocznego użytkowania.',
      [
        'gdy klimatyzator ma być ważnym źródłem ogrzewania',
        'w domu użytkowanym przez cały rok',
        'dla osób oczekujących wysokiej sprawności grzewczej mniejszych wariantów'
      ],
      { priceFromPLN: 5599 }
    ),
    badge: 'TOP DO OGRZEWANIA',
    tagline:
      'Model nastawiony na wydajne grzanie, z dwustopniową sprężarką i pracą grzewczą przy bardzo niskich temperaturach.',
    image: '/photos/modele/gree-amber-prestige.webp',
    alt: 'Klimatyzator ścienny Gree Amber Prestige',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.5, seer: 8.5, scop: 5.1, priceFromPLN: 5599 }),
      variant('3,53', { coolingCapacityKw: 3.53, heatingCapacityKw: 4.2, seer: 8.5, scop: 5.1, priceFromPLN: 5799 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.57, seer: 6.6, scop: 4.4, priceFromPLN: 6399 }),
      variant('7,03', { coolingCapacityKw: 7.03, heatingCapacityKw: 7.03, seer: 6.5, scop: 4.1, priceFromPLN: 6999 })
    ],
    energyClass: 'A+++ / A+++ (do 3,5 kW), dalej A++ / A+',
    features: ['Grzanie do -30°C', 'Wysoka efektywność grzania', 'Sprężarka dwustopniowa', 'Chłodzenie do +52°C']
  },
  {
    name: 'U-Crown Silver',
    slug: 'gree-u-crown',
    product: product(
      'u-crown-silver',
      'Gree U-Crown Silver ma charakterystyczną obudowę w kształcie litery U i metaliczne wykończenie. Łączy wyrazisty wygląd z trzema wariantami mocy oraz możliwością zastosowania w instalacji Multi Free Match.',
      [
        'we wnętrzu, w którym klimatyzator ma być widocznym elementem aranżacji',
        'w salonie, gabinecie lub reprezentacyjnej przestrzeni',
        'gdy rozważana jest instalacja pojedyncza albo układ Multi Free Match'
      ],
      { priceFromPLN: 5499 }
    ),
    tagline:
      'Charakterystyczna jednostka z metalowym frontem i profilem w kształcie litery U, skierowana do bardziej designerskich wnętrz.',
    image: '/photos/modele/gree-u-crown.webp',
    alt: 'Klimatyzator ścienny Gree U-Crown w kolorze srebrnym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.2, seer: 7.5, scop: 4.6, priceFromPLN: 5499 }),
      variant('3,5', { coolingCapacityKw: 3.53, heatingCapacityKw: 4, seer: 7.2, scop: 4.6 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.3, seer: 6.8, scop: 4 })
    ],
    energyClass: 'A++ / A++',
    features: ['Metalowy front', 'Cicha praca', 'Sterowanie Wi-Fi']
  },
  {
    name: 'Fairy',
    slug: 'gree-fairy',
    product: product(
      'fairy',
      'Gree Fairy ma zaokrągloną, dyskretną obudowę i jest dostępny w trzech kolorach. Cztery warianty mocy oraz siedem biegów wentylatora ułatwiają dopasowanie pracy urządzenia do codziennego komfortu.',
      [
        'w sypialni lub pokoju dziecka',
        'w mieszkaniu, w którym liczy się dyskretna forma urządzenia',
        'gdy potrzebne są różne warianty mocy i sterowanie Wi-Fi'
      ],
      {
        priceFromPLN: 3799,
        colors: [
          {
            name: 'Ciemny',
            image: '/photos/modele/kolory/gree-fairy-ciemny.webp',
            alt: 'Klimatyzator ścienny Gree Fairy w kolorze Dark',
            swatch: '#303236'
          },
          {
            name: 'Srebrny',
            image: '/photos/modele/kolory/gree-fairy-srebrny.webp',
            alt: 'Klimatyzator ścienny Gree Fairy w kolorze Silver',
            swatch: '#aeb4b8'
          },
          {
            name: 'Biały',
            image: '/photos/modele/kolory/gree-fairy-bialy.webp',
            alt: 'Klimatyzator ścienny Gree Fairy w kolorze White',
            swatch: '#f3f3f0'
          }
        ]
      }
    ),
    tagline:
      'Zaokrąglona, dyskretna jednostka dostępna w trzech kolorach, z jonizacją i sterowaniem Wi-Fi.',
    image: '/photos/modele/gree-fairy.webp',
    alt: 'Klimatyzator ścienny Gree Fairy w kolorze czarnym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 7.5, scop: 4.2, priceFromPLN: 3799 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 7.1, scop: 4.1, priceFromPLN: 3999 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7.6, scop: 4.3, priceFromPLN: 5499 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 7, scop: 4.2, priceFromPLN: 6099 })
    ],
    energyClass: 'A++ / A+',
    features: ['3 wersje kolorystyczne', 'Jonizacja', 'Cicha praca', 'Sterowanie Wi-Fi']
  },
  {
    name: 'Pular',
    slug: 'gree-pular',
    product: product(
      'pular',
      'Gree Pular to uniwersalna seria o dobrym stosunku ceny do możliwości. Obejmuje cztery warianty mocy, ma Wi-Fi w standardzie i funkcję samoczyszczenia, dlatego często stanowi punkt wyjścia przy doborze klimatyzacji do mieszkania.',
      [
        'w mieszkaniu, sypialni lub salonie',
        'przy pierwszym montażu klimatyzacji',
        'gdy ważny jest dobry stosunek ceny do funkcji i prosty dobór mocy'
      ],
      { priceFromPLN: 3399 }
    ),
    badge: 'MOCNY STOSUNEK CENY DO JAKOŚCI',
    tagline:
      'Przystępna cenowo seria z Wi-Fi, samoczyszczeniem i kilkoma wariantami mocy. Dobry wybór, gdy zależy Ci na prostym, funkcjonalnym klimatyzatorze.',
    image: '/photos/modele/gree-pular.webp',
    alt: 'Klimatyzator ścienny Gree Pular w wersji matowej',
    variants: [
      variant('2,5', { coolingCapacityKw: 2.5, heatingCapacityKw: 2.8, seer: 6.5, scop: 4, priceFromPLN: 3399 }),
      variant('3,2', { coolingCapacityKw: 3.2, heatingCapacityKw: 3.4, seer: 6.1, scop: 4, priceFromPLN: 3499 }),
      variant('4,6', { coolingCapacityKw: 4.6, heatingCapacityKw: 5.2, seer: 6.4, scop: 4, priceFromPLN: 4399 }),
      variant('6,2', { coolingCapacityKw: 6.2, heatingCapacityKw: 6.5, seer: 6.8, scop: 4, priceFromPLN: 5199 })
    ],
    energyClass: 'A++ / A+',
    features: ['Wi-Fi w standardzie', 'Samoczyszczenie', 'Mat lub połysk']
  },
  {
    name: 'Pular PRO',
    slug: 'gree-pular-pro',
    product: product(
      'pular-pro',
      'Gree Pular PRO rozwija podstawową serię Pular o rozwiązania wspierające pracę w szerszym zakresie temperatur. Grzałki i praca grzewcza do -25°C sprawiają, że warto rozważyć go przy częstszym dogrzewaniu.',
      [
        'w domu lub mieszkaniu, gdzie klimatyzator ma często dogrzewać',
        'w pomieszczeniach użytkowanych przez cały rok',
        'gdy potrzebny jest szeroki wybór mocy i praca przy niskiej temperaturze zewnętrznej'
      ],
      {
        priceFromPLN: 3999,
        colors: [
          {
            name: 'Ciemny',
            image: '/photos/modele/kolory/gree-pular-pro-ciemny.webp',
            alt: 'Klimatyzator ścienny Gree Pular PRO w kolorze Dark',
            swatch: '#34363a'
          },
          {
            name: 'Biały',
            image: '/photos/modele/kolory/gree-pular-pro-bialy.webp',
            alt: 'Klimatyzator ścienny Gree Pular PRO w kolorze White',
            swatch: '#f3f3f0'
          }
        ]
      }
    ),
    tagline:
      'Mocniejszy wariant Pulara: grzeje do -25°C i chłodzi nawet przy +50°C, z grzałkami tacy skroplin.',
    image: '/photos/modele/gree-pular-pro.webp',
    alt: 'Klimatyzator ścienny Gree Pular PRO w wersji Dark',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 7.5, scop: 4.2, priceFromPLN: 3999 }),
      variant('3,5', { coolingCapacityKw: 3.51, heatingCapacityKw: 3.81, seer: 7.1, scop: 4.1, priceFromPLN: 4199 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7.3, scop: 4.2, priceFromPLN: 5599 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 7, scop: 4.2, priceFromPLN: 6199 })
    ],
    energyClass: 'A++ / A+',
    features: ['Grzanie do -25°C', 'Chłodzenie do +50°C', 'Jonizacja', 'Samoczyszczenie']
  }
];

export const KAISAI_MODELS: LineupModel[] = [
  {
    name: 'AIR (KKWK)',
    slug: 'kaisai-air',
    tagline:
      'Seria z filtrem jonów srebra, trybem ECO, samoczyszczeniem parownika oraz grzałką tacy ociekowej.',
    image: '/photos/modele/kaisai-air.webp',
    alt: 'Klimatyzator ścienny Kaisai AIR w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.7, seer: 6.4, scop: 4 }),
      variant('3,4', { coolingCapacityKw: 3.4, heatingCapacityKw: 3.4, seer: 6.1, scop: 4 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.2, seer: 6.8, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 6.4, scop: 4 })
    ],
    energyClass: 'A++ / A+',
    features: ['Filtr jonów srebra', 'Tryb ECO', 'Samoczyszczenie', 'Grzałka tacy skroplin']
  },
  {
    name: 'FLY+ (KKWX)',
    slug: 'kaisai-fly-plus',
    badge: 'CICHA PRACA',
    tagline:
      'Seria nastawiona na cichą i energooszczędną pracę, z funkcją AI Eco+, sterylizacją 56°C i grzaniem do -25°C.',
    image: '/photos/modele/kaisai-fly-plus.webp',
    alt: 'Klimatyzator ścienny Kaisai FLY+ w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.9, seer: 7, scop: 4.1 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 6.5, scop: 4.1 }),
      variant('5,2', { coolingCapacityKw: 5.2, heatingCapacityKw: 5.4, seer: 7.4, scop: 4.1 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.3, seer: 6.5, scop: 4.1 })
    ],
    energyClass: 'A++ / A+',
    features: ['Cicha praca', 'Sterylizacja 56°C', 'AI Eco+', 'Grzanie do -25°C']
  },
  {
    name: 'GEO+ (KKWR / KKWS)',
    slug: 'kaisai-geo-plus',
    badge: 'OCZYSZCZANIE POWIETRZA',
    tagline:
      'Model 2w1 łączący klimatyzację z rozbudowanym oczyszczaniem powietrza, lampą UVC i nawiewem Soft Wind.',
    image: '/photos/modele/kaisai-geo-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai GEO+ w wersji białej i szarej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.3, seer: 8.7, scop: 4.7 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 4.2, seer: 8.7, scop: 4.7 }),
      variant('5,4', { coolingCapacityKw: 5.4, heatingCapacityKw: 5.8, seer: 8.7, scop: 4.6 }),
      variant('7,2', { coolingCapacityKw: 7.2, heatingCapacityKw: 7.3, seer: 8.7, scop: 4.6 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Lampa UVC', 'Rozbudowana filtracja', 'Nawiew Soft Wind', 'Oczyszczanie powietrza']
  },
  {
    name: 'ART (KKWI / KKWF)',
    slug: 'kaisai-art',
    badge: 'DESIGN',
    tagline:
      'Jednostka dostępna w bieli i czerni, z podwójnymi żaluzjami, filtrem zapachowym i grzaniem do -25°C.',
    image: '/photos/modele/kaisai-art.webp',
    alt: 'Klimatyzatory ścienne Kaisai ART w wersji białej i czarnej',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3.4, seer: 8.5, scop: 4.6 }),
      variant('3,6', { coolingCapacityKw: 3.6, heatingCapacityKw: 3.9, seer: 8.5, scop: 4.7 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 8.5, scop: 4.6 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 8.5, scop: 4.7 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Biały lub czarny', 'Podwójne żaluzje', 'Grzanie do -25°C', 'Filtr zapachowy']
  },
  {
    name: 'EVO (KEV)',
    slug: 'kaisai-evo',
    tagline:
      'Model z funkcją ECO, filtrem jonów srebra oraz rozwiązaniami wspierającymi higienę urządzenia i pracę zimą.',
    image: '/photos/modele/kaisai-evo.webp',
    alt: 'Klimatyzator ścienny Kaisai EVO w kolorze białym',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.7, seer: 6.4, scop: 4 }),
      variant('3,4', { coolingCapacityKw: 3.4, heatingCapacityKw: 3.4, seer: 6.1, scop: 4 }),
      variant('5,1', { coolingCapacityKw: 5.1, heatingCapacityKw: 5.2, seer: 6.8, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 6.4, scop: 4 })
    ],
    energyClass: 'A++ / A+',
    features: ['Filtr jonów srebra', 'Tryb ECO', 'Samoczyszczenie', 'Grzałka tacy skroplin']
  },
  {
    name: 'PRO HEAT+ (KRW / KRB)',
    slug: 'kaisai-pro-heat-plus',
    tagline:
      'Seria do grzania przy temperaturze zewnętrznej do -25°C, z lampą UVC, jonizatorem i łagodnym nawiewem Gentle Cooling.',
    image: '/photos/modele/kaisai-pro-heat-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai PRO HEAT+ w wersji białej i czarnej',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 3.3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.9, seer: 8.5, scop: 4.7 }),
      variant('5,2', { coolingCapacityKw: 5.2, heatingCapacityKw: 5.5, seer: 8.5, scop: 4.6 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 8.5, scop: 4.7 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Lampa UVC', 'Jonizator', 'Gentle Cooling']
  },
  {
    name: 'NORDIC (KNP)',
    slug: 'kaisai-nordic',
    badge: 'TOP DO OGRZEWANIA',
    tagline:
      'Model do pracy grzewczej przy temperaturze do -35°C, zachowujący pełną moc przy -15°C, ze sterylizacją 56°C i Wi-Fi.',
    image: '/photos/modele/kaisai-nordic.webp',
    alt: 'Klimatyzator ścienny Kaisai NORDIC w kolorze białym',
    variants: [variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 9.2, scop: 5.1 })],
    energyClass: 'A+++ / A+++',
    features: ['Grzanie do -35°C', 'Pełna moc grzewcza przy -15°C', 'Sterylizacja 56°C', 'Wi-Fi w standardzie']
  },
  {
    name: 'ICE (KLW / KLB)',
    slug: 'kaisai-ice',
    tagline:
      'Seria z filtrem Bio HEPA, jonizacją i nawiewem 3D, wyposażona w tryby oszczędzania energii Eco i Gear.',
    image: '/photos/modele/kaisai-ice.webp',
    alt: 'Klimatyzatory ścienne Kaisai ICE w wersji czarnej i białej',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 2.9, seer: 8.8, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 8.5, scop: 4.6 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7, scop: 4 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.3, seer: 6.4, scop: 4 })
    ],
    energyClass: 'A+++ / A+',
    features: ['Filtr Bio HEPA', 'Jonizacja', 'Nawiew 3D', 'Tryby Eco i Gear']
  }
];

export const ENERGY_MODELS = [
  ...GREE_MODELS.map((model) => ({ ...model, brand: 'gree' as const, brandLabel: 'GREE' })),
  ...KAISAI_MODELS.map((model) => ({ ...model, brand: 'kaisai' as const, brandLabel: 'KAISAI' }))
];

export const getLowestInstalledPrice = (models: LineupModel[]): number | null => {
  const prices = models.flatMap((model) =>
    model.variants.flatMap((item) =>
      typeof (item.priceFromPLN ?? item.installedPriceFromPLN) === 'number'
        ? [item.priceFromPLN ?? item.installedPriceFromPLN!]
        : []
    )
  );

  return prices.length > 0 ? Math.min(...prices) : null;
};
