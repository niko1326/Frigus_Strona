import type { LocalizedBusinessText } from './site';

export type EquipmentBrandId = 'gree' | 'kaisai';

export type EquipmentImage = Readonly<{
  src: `/${string}`;
  mimeType: 'image/avif' | 'image/webp' | 'image/png' | 'image/jpeg';
  width: number;
  height: number;
  alt: LocalizedBusinessText;
}>;

export type EquipmentColorVariant = Readonly<{
  id: string;
  label: LocalizedBusinessText;
  swatch: `#${string}`;
  image: EquipmentImage;
}>;

type EquipmentModelBase = Readonly<{
  id: string;
  name: string;
  image?: EquipmentImage;
}>;

export type RecommendedEquipmentModel = EquipmentModelBase &
  Readonly<{
    group: 'recommended';
    label: LocalizedBusinessText;
    description: LocalizedBusinessText;
    ctaLabel: LocalizedBusinessText;
    colorVariants?: readonly [EquipmentColorVariant, ...EquipmentColorVariant[]];
  }>;

export type ShowcaseEquipmentModel = RecommendedEquipmentModel &
  Readonly<{
    colorVariants: readonly [EquipmentColorVariant, ...EquipmentColorVariant[]];
  }>;

export type OtherEquipmentModel = EquipmentModelBase &
  Readonly<{
    group: 'other';
  }>;

export type EquipmentModel = RecommendedEquipmentModel | OtherEquipmentModel;

export type EquipmentBrand<Id extends EquipmentBrandId = EquipmentBrandId> = Readonly<{
  id: Id;
  name: string;
  navigationImage?: EquipmentImage;
  overviewImage?: EquipmentImage;
  description: LocalizedBusinessText;
  ctaLabel: LocalizedBusinessText;
  overviewFeatures: readonly LocalizedBusinessText[];
  pageHighlights: readonly LocalizedBusinessText[];
  models: readonly EquipmentModel[];
}>;

type EquipmentConfig = Readonly<{
  warranty: Readonly<{
    type: 'manufacturer';
    scope: 'device';
    durationYears: 5;
    subjectToManufacturerTerms: true;
    label: LocalizedBusinessText;
    termsNote: LocalizedBusinessText;
  }>;
  wifi: Readonly<{
    availability: 'selected-devices';
    label: LocalizedBusinessText;
  }>;
  brands: Readonly<{
    [Id in EquipmentBrandId]: EquipmentBrand<Id>;
  }>;
}>;

const FIVE_YEAR_WARRANTY_LABEL = {
  pl: '5 lat gwarancji na urządzenie',
  en: '5-year warranty on the unit'
} as const satisfies LocalizedBusinessText;

const WARRANTY_TERMS_NOTE = {
  pl: 'Zgodnie z warunkami gwarancji producenta.',
  en: "Subject to the manufacturer's warranty terms."
} as const satisfies LocalizedBusinessText;

const SELECTED_DEVICE_WIFI_LABEL = {
  pl: 'Sterowanie Wi-Fi w wybranych urządzeniach',
  en: 'Wi-Fi control in selected units'
} as const satisfies LocalizedBusinessText;

const GREE_LOGO = {
  src: '/photos/Logo_GREE_kolorowe.png',
  mimeType: 'image/png',
  width: 842,
  height: 190,
  alt: { pl: 'Logo GREE', en: 'GREE logo' }
} as const satisfies EquipmentImage;

const KAISAI_LOGO = {
  src: '/photos/Logo_KAISAI_szare.png',
  mimeType: 'image/png',
  width: 390,
  height: 75,
  alt: { pl: 'Logo KAISAI', en: 'KAISAI logo' }
} as const satisfies EquipmentImage;

export const EQUIPMENT = {
  warranty: {
    type: 'manufacturer',
    scope: 'device',
    durationYears: 5,
    subjectToManufacturerTerms: true,
    label: FIVE_YEAR_WARRANTY_LABEL,
    termsNote: WARRANTY_TERMS_NOTE
  },
  wifi: {
    availability: 'selected-devices',
    label: SELECTED_DEVICE_WIFI_LABEL
  },
  brands: {
    gree: {
      id: 'gree',
      name: 'GREE',
      navigationImage: GREE_LOGO,
      overviewImage: GREE_LOGO,
      description: {
        pl: 'Sprawdzone klimatyzatory z szerokim wyborem modeli, funkcji i wersji stylistycznych. Dobieramy urządzenia GREE zarówno do standardowego chłodzenia, jak i dla klientów planujących wykorzystywać klimatyzację również do ogrzewania.',
        en: 'Proven air conditioners with a wide choice of models, features and styles. We select GREE units both for standard cooling and for customers planning to use air conditioning for heating as well.'
      },
      ctaLabel: {
        pl: 'Poznaj klimatyzatory GREE',
        en: 'Explore GREE air conditioners'
      },
      overviewFeatures: [
        FIVE_YEAR_WARRANTY_LABEL,
        { pl: 'Szeroki wybór modeli', en: 'Wide choice of models' },
        SELECTED_DEVICE_WIFI_LABEL,
        { pl: 'Modele do chłodzenia i ogrzewania', en: 'Models for cooling and heating' }
      ],
      pageHighlights: [
        FIVE_YEAR_WARRANTY_LABEL,
        { pl: 'Autoryzowany montaż', en: 'Authorized installation' },
        { pl: 'Dobór modelu i mocy', en: 'Model and capacity selection' },
        { pl: 'Bydgoszcz i okolice', en: 'Bydgoszcz and surrounding areas' }
      ],
      models: [
        {
          id: 'pular',
          name: 'GREE Pular',
          group: 'recommended',
          label: {
            pl: 'Uniwersalny wybór',
            en: 'Versatile choice'
          },
          description: {
            pl: 'Sprawdzony i uniwersalny klimatyzator do salonu, sypialni i innych pomieszczeń mieszkalnych. Dobry wybór dla osób szukających funkcjonalnego urządzenia bez niepotrzebnego przepłacania.',
            en: 'A proven and versatile air conditioner for a living room, bedroom and other residential spaces. A good choice for people looking for a functional unit without paying more than necessary.'
          },
          ctaLabel: {
            pl: 'Zapytaj o GREE Pular',
            en: 'Ask about GREE Pular'
          },
          colorVariants: [
            {
              id: 'matt',
              label: { pl: 'Biały mat', en: 'Matt white' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/gree/models/pular-matt.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 498,
                alt: {
                  pl: 'Klimatyzator GREE Pular w kolorze białym matowym',
                  en: 'GREE Pular air conditioner in matt white'
                }
              }
            },
            {
              id: 'shiny',
              label: { pl: 'Biały połysk', en: 'Gloss white' },
              swatch: '#ffffff',
              image: {
                src: '/photos/gree/models/pular-shiny.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 475,
                alt: {
                  pl: 'Klimatyzator GREE Pular w kolorze białym z połyskiem',
                  en: 'GREE Pular air conditioner in gloss white'
                }
              }
            }
          ]
        },
        {
          id: 'pular-pro',
          name: 'GREE Pular PRO',
          group: 'recommended',
          label: {
            pl: 'Chłodzenie i ogrzewanie',
            en: 'Cooling and heating'
          },
          description: {
            pl: 'Rozbudowana wersja popularnego Pulara dla osób, które planują korzystać z klimatyzacji nie tylko latem, ale również regularnie wykorzystywać ją do ogrzewania pomieszczenia.',
            en: 'An enhanced version of the popular Pular for people who plan to use air conditioning not only in summer, but also regularly to heat the room.'
          },
          ctaLabel: {
            pl: 'Zapytaj o Pular PRO',
            en: 'Ask about Pular PRO'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/gree/models/pular-pro-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 498,
                alt: {
                  pl: 'Klimatyzator GREE Pular PRO w kolorze białym',
                  en: 'GREE Pular PRO air conditioner in white'
                }
              }
            },
            {
              id: 'dark',
              label: { pl: 'Ciemny', en: 'Dark' },
              swatch: '#3f4243',
              image: {
                src: '/photos/gree/models/pular-pro-dark.webp',
                mimeType: 'image/webp',
                width: 1358,
                height: 462,
                alt: {
                  pl: 'Klimatyzator GREE Pular PRO w ciemnym kolorze',
                  en: 'GREE Pular PRO air conditioner in dark finish'
                }
              }
            }
          ]
        },
        {
          id: 'clivia',
          name: 'GREE Clivia',
          group: 'recommended',
          label: {
            pl: 'Technologia i wyrazisty design',
            en: 'Technology and distinctive design'
          },
          description: {
            pl: 'Flagowy model GREE łączący rozbudowane funkcje komfortu, inteligentne sterowanie G-AI i kontrolę wilgotności z szerokim wyborem wykończeń.',
            en: 'A flagship GREE model combining advanced comfort features, intelligent G-AI control and humidity management with a wide choice of finishes.'
          },
          ctaLabel: {
            pl: 'Zapytaj o GREE Clivia',
            en: 'Ask about GREE Clivia'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/gree/models/clivia-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 481,
                alt: {
                  pl: 'Klimatyzator GREE Clivia w kolorze białym',
                  en: 'GREE Clivia air conditioner in white'
                }
              }
            },
            {
              id: 'beige-stone',
              label: { pl: 'Beige Stone', en: 'Beige Stone' },
              swatch: '#c7b49f',
              image: {
                src: '/photos/gree/models/clivia-beige-stone.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 462,
                alt: {
                  pl: 'Klimatyzator GREE Clivia w wykończeniu Beige Stone',
                  en: 'GREE Clivia air conditioner in Beige Stone finish'
                }
              }
            },
            {
              id: 'silver',
              label: { pl: 'Srebrny', en: 'Silver' },
              swatch: '#aeb2b5',
              image: {
                src: '/photos/gree/models/clivia-silver.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 481,
                alt: {
                  pl: 'Klimatyzator GREE Clivia w kolorze srebrnym',
                  en: 'GREE Clivia air conditioner in silver'
                }
              }
            },
            {
              id: 'navy-blue',
              label: { pl: 'Navy Blue', en: 'Navy Blue' },
              swatch: '#173047',
              image: {
                src: '/photos/gree/models/clivia-navy-blue.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 481,
                alt: {
                  pl: 'Klimatyzator GREE Clivia w wykończeniu Navy Blue',
                  en: 'GREE Clivia air conditioner in Navy Blue finish'
                }
              }
            },
            {
              id: 'satin-black',
              label: { pl: 'Satin Black', en: 'Satin Black' },
              swatch: '#262728',
              image: {
                src: '/photos/gree/models/clivia-satin-black.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 451,
                alt: {
                  pl: 'Klimatyzator GREE Clivia w wykończeniu Satin Black',
                  en: 'GREE Clivia air conditioner in Satin Black finish'
                }
              }
            }
          ]
        },
        {
          id: 'airy',
          name: 'GREE Airy',
          group: 'recommended',
          label: {
            pl: 'Nowoczesny komfort',
            en: 'Modern comfort'
          },
          description: {
            pl: 'Nowoczesny klimatyzator o dopracowanej formie, dostępny w kilku wykończeniach i wyposażony w inteligentną technologię G-AI Plus 2.0.',
            en: 'A modern air conditioner with a refined form, available in several finishes and equipped with intelligent G-AI Plus 2.0 technology.'
          },
          ctaLabel: {
            pl: 'Zapytaj o GREE Airy',
            en: 'Ask about GREE Airy'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/gree/models/airy-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 441,
                alt: {
                  pl: 'Klimatyzator GREE Airy w kolorze białym',
                  en: 'GREE Airy air conditioner in white'
                }
              }
            },
            {
              id: 'champagne',
              label: { pl: 'Champagne', en: 'Champagne' },
              swatch: '#c5ad8c',
              image: {
                src: '/photos/gree/models/airy-champagne.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 429,
                alt: {
                  pl: 'Klimatyzator GREE Airy w wykończeniu Champagne',
                  en: 'GREE Airy air conditioner in Champagne finish'
                }
              }
            },
            {
              id: 'silver',
              label: { pl: 'Srebrny', en: 'Silver' },
              swatch: '#adb1b3',
              image: {
                src: '/photos/gree/models/airy-silver.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 429,
                alt: {
                  pl: 'Klimatyzator GREE Airy w kolorze srebrnym',
                  en: 'GREE Airy air conditioner in silver'
                }
              }
            },
            {
              id: 'dark',
              label: { pl: 'Ciemny', en: 'Dark' },
              swatch: '#303234',
              image: {
                src: '/photos/gree/models/airy-dark.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 429,
                alt: {
                  pl: 'Klimatyzator GREE Airy w ciemnym kolorze',
                  en: 'GREE Airy air conditioner in dark finish'
                }
              }
            }
          ]
        },
        {
          id: 'fairy',
          name: 'GREE Fairy',
          group: 'other'
        },
        {
          id: 'amber-prestige',
          name: 'GREE Amber Prestige',
          group: 'other'
        }
      ]
    },
    kaisai: {
      id: 'kaisai',
      name: 'KAISAI',
      navigationImage: KAISAI_LOGO,
      overviewImage: KAISAI_LOGO,
      description: {
        pl: 'Nowoczesne i funkcjonalne klimatyzatory oferujące bardzo dobry stosunek wyposażenia do ceny. Dobry wybór dla osób szukających sprawdzonego urządzenia do mieszkania lub domu.',
        en: 'Modern and functional air conditioners offering very good value for their features. A good choice for people looking for a proven unit for an apartment or house.'
      },
      ctaLabel: {
        pl: 'Poznaj klimatyzatory KAISAI',
        en: 'Explore KAISAI air conditioners'
      },
      overviewFeatures: [
        FIVE_YEAR_WARRANTY_LABEL,
        { pl: 'Nowoczesne funkcje', en: 'Modern features' },
        { pl: 'Szeroki wybór urządzeń', en: 'Wide choice of units' },
        { pl: 'Dobry stosunek ceny do wyposażenia', en: 'Good value for the feature set' }
      ],
      pageHighlights: [
        FIVE_YEAR_WARRANTY_LABEL,
        { pl: 'Dobór odpowiedniej mocy', en: 'Capacity selected for the room' },
        { pl: 'Kompletny montaż', en: 'Complete installation' },
        { pl: 'Bydgoszcz i okolice', en: 'Bydgoszcz and surrounding areas' }
      ],
      models: [
        {
          id: 'air',
          name: 'KAISAI AIR',
          group: 'recommended',
          label: {
            pl: 'Codzienny komfort',
            en: 'Everyday comfort'
          },
          description: {
            pl: 'Nowoczesny, minimalistyczny model do domu, mieszkania lub niewielkiego lokalu. Łączy energooszczędną pracę z funkcjami wspierającymi wygodne użytkowanie przez cały rok.',
            en: 'A modern, minimalist model for a home, apartment or small commercial space. It combines energy-efficient operation with features designed for convenient year-round use.'
          },
          ctaLabel: {
            pl: 'Zapytaj o KAISAI AIR',
            en: 'Ask about KAISAI AIR'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/kaisai/models/kaisai-air-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 457,
                alt: {
                  pl: 'Klimatyzator KAISAI AIR w kolorze białym',
                  en: 'KAISAI AIR air conditioner in white'
                }
              }
            }
          ]
        },
        {
          id: 'art',
          name: 'KAISAI ART',
          group: 'recommended',
          label: {
            pl: 'Design i wygodne sterowanie',
            en: 'Design and convenient control'
          },
          description: {
            pl: 'Model łączący współczesny wygląd z praktycznymi rozwiązaniami zwiększającymi komfort. Dostępny w białym i czarnym wykończeniu, pasuje do mieszkań, apartamentów i nowoczesnych lokali.',
            en: 'A model combining contemporary styling with practical comfort features. Available in white and black, it suits apartments, homes and modern commercial interiors.'
          },
          ctaLabel: {
            pl: 'Zapytaj o KAISAI ART',
            en: 'Ask about KAISAI ART'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/kaisai/models/kaisai-art-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 530,
                alt: {
                  pl: 'Klimatyzator KAISAI ART w kolorze białym',
                  en: 'KAISAI ART air conditioner in white'
                }
              }
            },
            {
              id: 'black',
              label: { pl: 'Czarny', en: 'Black' },
              swatch: '#171819',
              image: {
                src: '/photos/kaisai/models/kaisai-art-black.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 530,
                alt: {
                  pl: 'Klimatyzator KAISAI ART w kolorze czarnym',
                  en: 'KAISAI ART air conditioner in black'
                }
              }
            }
          ]
        },
        {
          id: 'geo-plus',
          name: 'KAISAI GEO+',
          group: 'recommended',
          label: {
            pl: 'Komfort i rozbudowana filtracja',
            en: 'Comfort and advanced filtration'
          },
          description: {
            pl: 'Klimatyzator łączący komfort termiczny z rozbudowanym systemem filtracji powietrza. Nowoczesna forma i dwa warianty kolorystyczne pozwalają dopasować go do domu lub biura.',
            en: 'An air conditioner combining thermal comfort with an advanced air-filtration system. Its modern form and two colour options make it suitable for a home or office.'
          },
          ctaLabel: {
            pl: 'Zapytaj o KAISAI GEO+',
            en: 'Ask about KAISAI GEO+'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/kaisai/models/kaisai-geo-plus-white.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 542,
                alt: {
                  pl: 'Klimatyzator KAISAI GEO+ w kolorze białym',
                  en: 'KAISAI GEO+ air conditioner in white'
                }
              }
            },
            {
              id: 'grey',
              label: { pl: 'Szary', en: 'Grey' },
              swatch: '#9da1a4',
              image: {
                src: '/photos/kaisai/models/kaisai-geo-plus-grey.webp',
                mimeType: 'image/webp',
                width: 1400,
                height: 532,
                alt: {
                  pl: 'Klimatyzator KAISAI GEO+ w kolorze szarym',
                  en: 'KAISAI GEO+ air conditioner in grey'
                }
              }
            }
          ]
        },
        {
          id: 'pro-heat-plus',
          name: 'KAISAI PRO HEAT+',
          group: 'recommended',
          label: {
            pl: 'Chłodzenie i ogrzewanie',
            en: 'Cooling and heating'
          },
          description: {
            pl: 'Model przeznaczony do komfortowego chłodzenia i efektywnego ogrzewania przez cały rok. Jest dostępny w wersji białej i czarnej oraz oferuje zdalne sterowanie przez Wi-Fi.',
            en: 'A model designed for comfortable cooling and efficient year-round heating. It is available in white and black and offers remote control over Wi-Fi.'
          },
          ctaLabel: {
            pl: 'Zapytaj o KAISAI PRO HEAT+',
            en: 'Ask about KAISAI PRO HEAT+'
          },
          colorVariants: [
            {
              id: 'white',
              label: { pl: 'Biały', en: 'White' },
              swatch: '#f2f1ed',
              image: {
                src: '/photos/kaisai/models/whitenewkaisaiplusheat.png',
                mimeType: 'image/png',
                width: 1536,
                height: 1024,
                alt: {
                  pl: 'Klimatyzator KAISAI PRO HEAT+ w kolorze białym',
                  en: 'KAISAI PRO HEAT+ air conditioner in white'
                }
              }
            },
            {
              id: 'black',
              label: { pl: 'Czarny', en: 'Black' },
              swatch: '#171819',
              image: {
                src: '/photos/kaisai/models/blacknewkaisaiproheatplus.png',
                mimeType: 'image/png',
                width: 1536,
                height: 1024,
                alt: {
                  pl: 'Klimatyzator KAISAI PRO HEAT+ w kolorze czarnym',
                  en: 'KAISAI PRO HEAT+ air conditioner in black'
                }
              }
            }
          ]
        }
      ]
    }
  }
} as const satisfies EquipmentConfig;
