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
  priceFromPLN?: number;
  /** Krótsza nazwa używana w dynamicznym CTA, bez kodu serii w nawiasie. */
  ctaName?: string;
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
  /** Potwierdzona forma zdalnego sterowania, wyświetlana poza tagami różnicującymi modele. */
  connectivityLabel?: string;
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
  options: { priceFromPLN?: number | null; colors?: ProductColor[]; ctaName?: string } = {}
): ProductPageData => ({
  slug,
  description,
  recommendedFor,
  ...(options.priceFromPLN === null
    ? {}
    : { priceFromPLN: options.priceFromPLN ?? PRICING.installFromPLN }),
  ctaName: options.ctaName,
  colors: options.colors
});

const inquiryProduct = (
  slug: string,
  ctaName: string,
  description: string,
  recommendedFor: string[]
): ProductPageData => product(slug, description, recommendedFor, { priceFromPLN: null, ctaName });

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
        'gdy potrzebne są kontrola wilgotności i monitoring zużycia energii w aplikacji'
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
    features: ['Grzanie do -30°C', 'Cicha praca', 'Monitoring zużycia energii w aplikacji', 'Kontrola wilgotności'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
  },
  {
    name: 'Cosmo Pearl',
    slug: 'gree-cosmo-pearl',
    product: product(
      'cosmo-pearl',
      'Gree Cosmo Pearl łączy niski poziom hałasu jednostki wewnętrznej z wyciszoną konstrukcją agregatu. Perłowe wykończenie obudowy uzupełnia serię nastawioną na komfort akustyczny.',
      [
        'gdy ważny jest niski poziom hałasu jednostki wewnętrznej',
        'gdy znaczenie ma wyciszona praca jednostki zewnętrznej',
        'gdy perłowe wykończenie ma pasować do jasnej aranżacji wnętrza'
      ],
      { priceFromPLN: 4399 }
    ),
    tagline:
      'Cicha seria z perłowym wykończeniem i wyciszoną jednostką zewnętrzną, przygotowana z myślą o komforcie akustycznym.',
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
    features: ['Cicha praca', 'Cicha jednostka zewnętrzna', 'Perłowe wykończenie'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
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
        'gdy przydatne są lampa UVC i kontrola wilgotności'
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
    features: ['5 wersji kolorystycznych', 'Lampa UVC', 'Kontrola wilgotności'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
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
        'gdy przydatne są algorytm G-AI Plus 2.0, hybrydowe rozmrażanie i wybór koloru'
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
    features: ['Grzanie do -25°C', 'Oszczędzanie energii G-AI', 'Lampa UVC', '4 wersje kolorystyczne'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
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
    features: ['Grzanie do -30°C', 'Wysoka efektywność grzania', 'Sprężarka dwustopniowa', 'Chłodzenie do +52°C'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
  },
  {
    name: 'U-Crown Silver',
    slug: 'gree-u-crown',
    product: product(
      'u-crown-silver',
      'Gree U-Crown Silver ma metalowy front i profil obudowy w kształcie litery U. Seria występuje w trzech wariantach mocy, pracuje cicho i może być stosowana także w instalacji Multi Free Match.',
      [
        'gdy istotne są metalowe wykończenie i charakterystyczny profil obudowy',
        'gdy ważna jest cicha praca jednostki wewnętrznej',
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
    features: ['Metalowy front', 'Cicha praca'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
  },
  {
    name: 'Fairy',
    slug: 'gree-fairy',
    product: product(
      'fairy',
      'Gree Fairy ma zaokrągloną obudowę i występuje w trzech wersjach kolorystycznych. Cztery warianty mocy, od 2,7 do 7,1 kW, pozwalają dopasować wydajność do różnej wielkości pomieszczeń.',
      [
        'gdy zaokrąglona forma jednostki pasuje do aranżacji wnętrza',
        'gdy potrzebny jest wybór pomiędzy białą, srebrną i ciemną obudową',
        'gdy potrzebna jest seria dostępna w mocach od 2,7 do 7,1 kW'
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
      'Zaokrąglona jednostka dostępna w trzech kolorach i czterech wariantach mocy - od 2,7 do 7,1 kW.',
    image: '/photos/modele/gree-fairy.webp',
    alt: 'Klimatyzator ścienny Gree Fairy w kolorze czarnym',
    variants: [
      variant('2,7', { coolingCapacityKw: 2.7, heatingCapacityKw: 3, seer: 7.5, scop: 4.2, priceFromPLN: 3799 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 7.1, scop: 4.1, priceFromPLN: 3999 }),
      variant('5,3', { coolingCapacityKw: 5.3, heatingCapacityKw: 5.6, seer: 7.6, scop: 4.3, priceFromPLN: 5499 }),
      variant('7,1', { coolingCapacityKw: 7.1, heatingCapacityKw: 7.8, seer: 7, scop: 4.2, priceFromPLN: 6099 })
    ],
    energyClass: 'A++ / A+',
    features: ['3 wersje kolorystyczne', 'Zaokrąglona obudowa', 'Cicha praca'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
  },
  {
    name: 'Pular',
    slug: 'gree-pular',
    product: product(
      'pular',
      'Gree Pular to przystępna cenowo seria dostępna w czterech wariantach mocy. Oferuje samoczyszczenie oraz wybór matowego lub błyszczącego wykończenia.',
      [
        'gdy potrzebna jest przystępna cenowo seria w jednym z czterech wariantów mocy',
        'gdy ważne są samoczyszczenie i prosty zestaw funkcji',
        'gdy jednostka ma mieć matowe albo błyszczące wykończenie'
      ],
      { priceFromPLN: 3399 }
    ),
    badge: 'MOCNY STOSUNEK CENY DO JAKOŚCI',
    tagline:
      'Przystępna cenowo seria z samoczyszczeniem, czterema wariantami mocy oraz matowym lub błyszczącym frontem.',
    image: '/photos/modele/gree-pular.webp',
    alt: 'Klimatyzator ścienny Gree Pular w wersji matowej',
    variants: [
      variant('2,5', { coolingCapacityKw: 2.5, heatingCapacityKw: 2.8, seer: 6.5, scop: 4, priceFromPLN: 3399 }),
      variant('3,2', { coolingCapacityKw: 3.2, heatingCapacityKw: 3.4, seer: 6.1, scop: 4, priceFromPLN: 3499 }),
      variant('4,6', { coolingCapacityKw: 4.6, heatingCapacityKw: 5.2, seer: 6.4, scop: 4, priceFromPLN: 4399 }),
      variant('6,2', { coolingCapacityKw: 6.2, heatingCapacityKw: 6.5, seer: 6.8, scop: 4, priceFromPLN: 5199 })
    ],
    energyClass: 'A++ / A+',
    features: ['Samoczyszczenie', 'Mat lub połysk'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
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
    features: ['Grzanie do -25°C', 'Chłodzenie do +50°C', 'Samoczyszczenie'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja Gree+'
  }
];

export const KAISAI_MODELS: ProductLineupModel[] = [
  {
    name: 'AIR (KKWK)',
    slug: 'kaisai-air',
    product: inquiryProduct(
      'air',
      'AIR',
      'Kaisai AIR łączy funkcję ECO z filtrem jonów srebra i samoczyszczeniem parownika. Grzałka tacy ociekowej oraz podgrzewanie uzwojeń sprężarki wspierają pracę urządzenia w sezonie zimowym.',
      [
        'gdy potrzebne są podstawowe funkcje chłodzenia i ogrzewania w czterech wariantach mocy',
        'gdy ważne są filtr jonów srebra i samoczyszczenie parownika',
        'gdy urządzenie ma być sterowane przez Wi-Fi z aplikacji mobilnej'
      ]
    ),
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
    features: ['Filtr jonów srebra', 'Tryb ECO', 'Samoczyszczenie', 'Grzałka tacy skroplin'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'FLY+ (KKWX)',
    slug: 'kaisai-fly-plus',
    product: inquiryProduct(
      'fly-plus',
      'FLY+',
      'Kaisai FLY+ skupia się na cichej i oszczędnej pracy. Funkcja Eco+ oparta na AI, sterylizacja wymiennika w 56°C oraz grzałki sprężarki i tacy skroplin wspierają codzienne użytkowanie przez cały rok.',
      [
        'gdy priorytetem jest cicha praca jednostki wewnętrznej',
        'gdy przydatne są funkcje Eco+ oraz Gear do kontroli intensywności pracy',
        'gdy urządzenie ma ogrzewać przy temperaturze zewnętrznej do -25°C'
      ]
    ),
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
    features: ['Cicha praca', 'Sterylizacja 56°C', 'AI Eco+', 'Grzanie do -25°C'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'GEO+ (KKWR / KKWS)',
    slug: 'kaisai-geo-plus',
    product: inquiryProduct(
      'geo-plus',
      'GEO+',
      'Kaisai GEO+ łączy klimatyzację z rozbudowanym systemem oczyszczania powietrza. Trzystopniowa filtracja, lampa UVC, samoczyszczenie i nawiew Soft Wind są jego głównymi cechami użytkowymi.',
      [
        'gdy istotna jest rozbudowana filtracja powietrza',
        'gdy przydatne są lampa UVC i samoczyszczenie parownika',
        'gdy nawiew ma być rozpraszany przez funkcję Soft Wind'
      ]
    ),
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
    features: ['Lampa UVC', 'Rozbudowana filtracja', 'Nawiew Soft Wind', 'Oczyszczanie powietrza'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'ART (KKWI / KKWF)',
    slug: 'kaisai-art',
    product: inquiryProduct(
      'art',
      'ART',
      'Kaisai ART jest dostępny w bieli i czerni. Podwójne żaluzje poziome, filtr zapachowy, tryb hotelowy i port ON/OFF odróżniają tę serię od pozostałych modeli ściennych marki.',
      [
        'gdy potrzebna jest biała albo czarna wersja jednostki',
        'gdy ważne są podwójne żaluzje poziome i filtr zapachowy',
        'w instalacjach wykorzystujących tryb hotelowy lub port ON/OFF'
      ]
    ),
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
    features: ['Biały lub czarny', 'Podwójne żaluzje', 'Grzanie do -25°C', 'Filtr zapachowy'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'EVO (KEV)',
    slug: 'kaisai-evo',
    product: inquiryProduct(
      'evo',
      'EVO',
      'Kaisai EVO oferuje filtr jonów srebra, funkcję ECO oraz samoczyszczenie parownika. Grzałka tacy ociekowej i podgrzewanie uzwojeń sprężarki wspierają stabilną pracę podczas ogrzewania.',
      [
        'gdy ważne są funkcja ECO i cztery warianty mocy',
        'gdy potrzebne są filtr jonów srebra i samoczyszczenie parownika',
        'gdy urządzenie ma być sterowane przez Wi-Fi z aplikacji mobilnej'
      ]
    ),
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
    features: ['Filtr jonów srebra', 'Tryb ECO', 'Samoczyszczenie', 'Grzałka tacy skroplin'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'PRO HEAT+ (KRW / KRB)',
    slug: 'kaisai-pro-heat-plus',
    product: inquiryProduct(
      'pro-heat-plus',
      'PRO HEAT+',
      'Kaisai PRO HEAT+ jest przygotowany do ogrzewania przy temperaturze zewnętrznej do -25°C. Łączy lampę UVC i jonizację z nawiewem 3D, funkcją Gentle Cooling oraz grzałką tacy ociekowej.',
      [
        'gdy klimatyzator ma regularnie wspierać ogrzewanie',
        'gdy potrzebne są lampa UVC, jonizacja i filtr jonów srebra',
        'gdy ważne są nawiew 3D oraz łagodny nawiew Gentle Cooling'
      ]
    ),
    tagline:
      'Seria do grzania przy temperaturze zewnętrznej do -25°C, z lampą UVC, jonizatorem i łagodnym nawiewem Gentle Cooling.',
    image: '/photos/modele/kaisai-pro-heat-plus.webp',
    alt: 'Klimatyzatory ścienne Kaisai PRO HEAT+ w wersji białej i czarnej',
    variants: [
      variant('2,6', { coolingCapacityKw: 2.6, heatingCapacityKw: 3, seer: 8.5, scop: 4.6 }),
      variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.9, seer: 8.5, scop: 4.7 }),
      variant('5,2', { coolingCapacityKw: 5.2, heatingCapacityKw: 5.5, seer: 8.5, scop: 4.6 }),
      variant('7,0', { coolingCapacityKw: 7, heatingCapacityKw: 7.1, seer: 8.5, scop: 4.7 })
    ],
    energyClass: 'A+++ / A++',
    features: ['Grzanie do -25°C', 'Lampa UVC', 'Jonizator', 'Gentle Cooling'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'NORDIC (KNP)',
    slug: 'kaisai-nordic',
    product: inquiryProduct(
      'nordic',
      'Nordic',
      'Kaisai NORDIC jest jednowariantową serią przeznaczoną do intensywnej pracy grzewczej. Pracuje w trybie grzania przy temperaturze zewnętrznej do -35°C i zachowuje pełną moc grzewczą przy -15°C.',
      [
        'gdy głównym wyróżnikiem ma być praca grzewcza przy bardzo niskiej temperaturze',
        'gdy potrzebna jest pełna moc grzewcza przy -15°C',
        'gdy przydatne są sterylizacja wymiennika w 56°C i sterowanie przez aplikację'
      ]
    ),
    badge: 'TOP DO OGRZEWANIA',
    tagline:
      'Model do pracy grzewczej przy temperaturze do -35°C, zachowujący pełną moc przy -15°C, ze sterylizacją 56°C i Wi-Fi.',
    image: '/photos/modele/kaisai-nordic.webp',
    alt: 'Klimatyzator ścienny Kaisai NORDIC w kolorze białym',
    variants: [variant('3,5', { coolingCapacityKw: 3.5, heatingCapacityKw: 3.8, seer: 9.2, scop: 5.1 })],
    energyClass: 'A+++ / A+++',
    features: ['Grzanie do -35°C', 'Pełna moc grzewcza przy -15°C', 'Sterylizacja 56°C'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
  },
  {
    name: 'ICE (KLW / KLB)',
    slug: 'kaisai-ice',
    product: inquiryProduct(
      'ice',
      'ICE',
      'Kaisai ICE jest dostępny w bieli i czerni. Filtr Bio HEPA, filtr zimnokatalityczny, jonizacja oraz nawiew 3D wspierają filtrację i równomierne rozprowadzanie powietrza.',
      [
        'gdy ważne są filtr Bio HEPA i jonizacja powietrza',
        'gdy potrzebny jest automatyczny nawiew 3D',
        'gdy jednostka ma być biała albo czarna i sterowana z aplikacji'
      ]
    ),
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
    features: ['Filtr Bio HEPA', 'Jonizacja', 'Nawiew 3D', 'Tryby Eco i Gear'],
    connectivityLabel: 'Sterowanie Wi-Fi / aplikacja mobilna'
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
