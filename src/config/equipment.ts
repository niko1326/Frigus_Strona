import type { LocalizedBusinessText } from './site';

export type EquipmentBrandId = 'gree' | 'kaisai';

export type EquipmentImage = Readonly<{
  src: `/${string}`;
  mimeType: 'image/avif' | 'image/webp' | 'image/png' | 'image/jpeg';
  width: number;
  height: number;
  alt: LocalizedBusinessText;
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
          }
        },
        {
          id: 'fairy',
          name: 'GREE Fairy',
          group: 'recommended',
          label: {
            pl: 'Design i komfort',
            en: 'Design and comfort'
          },
          description: {
            pl: 'Model dla osób, dla których oprócz komfortu ważny jest również wygląd jednostki wewnętrznej. Dobrze sprawdzi się w nowoczesnych i estetycznie urządzonych wnętrzach.',
            en: 'A model for people who value the appearance of the indoor unit as well as comfort. It works well in modern, aesthetically designed interiors.'
          },
          ctaLabel: {
            pl: 'Zapytaj o GREE Fairy',
            en: 'Ask about GREE Fairy'
          }
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
          }
        },
        {
          id: 'clivia',
          name: 'GREE Clivia',
          group: 'other'
        },
        {
          id: 'airy',
          name: 'GREE Airy',
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
      models: []
    }
  }
} as const satisfies EquipmentConfig;
