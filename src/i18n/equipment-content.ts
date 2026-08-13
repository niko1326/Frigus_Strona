import type { EquipmentBrandId } from '../config/equipment';
import type { Localized, PageHeroContent } from './page-content';

type CtaContent = Readonly<{
  label: string;
}>;

type EquipmentOverviewContent = Readonly<{
  hero: PageHeroContent;
  breadcrumbLabel: string;
  brandsEyebrow: string;
  brandsTitle: string;
  selection: Readonly<{
    title: string;
    description: string;
    cta: CtaContent;
  }>;
}>;

type BrandPageContent = Readonly<{
  hero: PageHeroContent;
  breadcrumbLabel: string;
  highlightsLabel: string;
  heroCta: CtaContent;
  recommendedTitle: string;
  colorPicker: Readonly<{
    colorsLabel: string;
    selectedColorLabel: string;
  }>;
  selection?: Readonly<{
    title: string;
    description: string;
    cta: CtaContent;
  }>;
  otherModels: Readonly<{
    title: string;
    description: string;
    cta?: CtaContent;
  }>;
}>;

type EquipmentContent = Readonly<{
  overview: EquipmentOverviewContent;
  brands: Readonly<Record<EquipmentBrandId, BrandPageContent>>;
}>;

export const equipmentContent = {
  pl: {
    overview: {
      hero: {
        eyebrow: 'Dobór urządzenia i kompletny montaż',
        title: 'Klimatyzatory, które montujemy',
        description:
          'W FRIGAC stawiamy na sprawdzone klimatyzatory marek GREE i KAISAI. Pomagamy dobrać urządzenie do wielkości pomieszczenia, sposobu użytkowania i budżetu, a następnie wykonujemy kompletny montaż na terenie Bydgoszczy i okolic.'
      },
      breadcrumbLabel: 'Klimatyzatory',
      brandsEyebrow: 'Sprawdzone marki',
      brandsTitle: 'Urządzenie dobieramy do potrzeb, nie z katalogu',
      selection: {
        title: 'Nie wiesz, którą markę wybrać?',
        description:
          'Nie musisz znać modeli ani parametrów technicznych. Opowiedz nam o pomieszczeniu i oczekiwaniach, a pomożemy dobrać markę, model i odpowiednią moc urządzenia.',
        cta: { label: 'Dobierz klimatyzator' }
      }
    },
    brands: {
      gree: {
        hero: {
          eyebrow: 'Klimatyzacja GREE z profesjonalnym montażem',
          title: 'Klimatyzatory GREE z montażem – Bydgoszcz i okolice',
          description:
            'FRIGAC pomaga dobrać odpowiedni klimatyzator GREE do pomieszczenia, oczekiwań użytkownika oraz zakładanego budżetu. Zapewniamy urządzenie i kompletny montaż na terenie Bydgoszczy i okolic.'
        },
        breadcrumbLabel: 'GREE',
        highlightsLabel: 'Najważniejsze informacje',
        heroCta: { label: 'Dobierz klimatyzator GREE' },
        recommendedTitle: 'Poznaj wybrane modele GREE',
        colorPicker: {
          colorsLabel: 'Dostępne kolory',
          selectedColorLabel: 'Wybrany kolor'
        },
        selection: {
          title: 'Nie wiesz, który model wybrać?',
          description:
            'Nie musisz znać parametrów technicznych ani samodzielnie przeglądać całego katalogu. Powiedz nam, jakie pomieszczenie chcesz klimatyzować i czego oczekujesz od urządzenia, a pomożemy dobrać odpowiednią moc i model.',
          cta: { label: 'Poproś o dobór klimatyzatora' }
        },
        otherModels: {
          title: 'Pozostałe klimatyzatory GREE',
          description:
            'Montujemy również inne urządzenia z aktualnej oferty GREE. Jeśli pokazane modele nie odpowiadają potrzebom klienta, dobieramy indywidualnie odpowiednie urządzenie z szerszej oferty producenta.'
        }
      },
      kaisai: {
        hero: {
          eyebrow: 'Klimatyzacja KAISAI – funkcjonalność w rozsądnej cenie',
          title: 'Klimatyzatory KAISAI z montażem – Bydgoszcz i okolice',
          description:
            'FRIGAC pomaga dobrać klimatyzator KAISAI do wielkości pomieszczenia, oczekiwań i budżetu klienta. Zapewniamy urządzenie oraz kompletny montaż na terenie Bydgoszczy i okolic.'
        },
        breadcrumbLabel: 'KAISAI',
        highlightsLabel: 'Najważniejsze informacje',
        heroCta: { label: 'Dobierz klimatyzator KAISAI' },
        recommendedTitle: 'Klimatyzatory KAISAI, które najczęściej polecamy',
        colorPicker: {
          colorsLabel: 'Dostępne kolory',
          selectedColorLabel: 'Wybrany kolor'
        },
        otherModels: {
          title: 'Szukasz innego modelu KAISAI?',
          description:
            'Montujemy również inne urządzenia z aktualnej oferty KAISAI. Dobieramy klimatyzator na podstawie wielkości pomieszczenia, sposobu użytkowania oraz zakładanego budżetu.',
          cta: { label: 'Dobierz klimatyzator KAISAI' }
        }
      }
    }
  },
  en: {
    overview: {
      hero: {
        eyebrow: 'System selection and complete installation',
        title: 'Air conditioners we install',
        description:
          'At FRIGAC, we focus on proven GREE and KAISAI air conditioners. We help select a unit for the room size, intended use and budget, then provide complete installation in Bydgoszcz and surrounding areas.'
      },
      breadcrumbLabel: 'Air conditioners',
      brandsEyebrow: 'Proven brands',
      brandsTitle: 'A unit selected for your needs, not from a catalogue',
      selection: {
        title: 'Not sure which brand to choose?',
        description:
          'You do not need to know the models or technical specifications. Tell us about the room and what you expect from the system, and we will help select the right brand, model and capacity.',
        cta: { label: 'Choose an air conditioner' }
      }
    },
    brands: {
      gree: {
        hero: {
          eyebrow: 'GREE air conditioning with professional installation',
          title: 'GREE air conditioners with installation in Bydgoszcz',
          description:
            'FRIGAC helps select the right GREE air conditioner for the room, the way it will be used and the available budget. We supply the unit and provide complete installation in Bydgoszcz and surrounding areas.'
        },
        breadcrumbLabel: 'GREE',
        highlightsLabel: 'Key information',
        heroCta: { label: 'Choose a GREE air conditioner' },
        recommendedTitle: 'Explore selected GREE models',
        colorPicker: {
          colorsLabel: 'Available colours',
          selectedColorLabel: 'Selected colour'
        },
        selection: {
          title: 'Not sure which model to choose?',
          description:
            'You do not need to know the technical specifications or work through the entire catalogue yourself. Tell us about the room and what you expect from the unit, and we will help select the right capacity and model.',
          cta: { label: 'Ask us to select an air conditioner' }
        },
        otherModels: {
          title: 'Other GREE air conditioners',
          description:
            'We also install other units from the current GREE range. If the models shown do not fit your needs, we select a suitable unit individually from the wider manufacturer range.'
        }
      },
      kaisai: {
        hero: {
          eyebrow: 'KAISAI air conditioning – practical features at a sensible price',
          title: 'KAISAI air conditioners with installation in Bydgoszcz',
          description:
            'FRIGAC helps select a KAISAI air conditioner for the room size, your expectations and budget. We supply the unit and provide complete installation in Bydgoszcz and surrounding areas.'
        },
        breadcrumbLabel: 'KAISAI',
        highlightsLabel: 'Key information',
        heroCta: { label: 'Choose a KAISAI air conditioner' },
        recommendedTitle: 'KAISAI air conditioners we recommend most often',
        colorPicker: {
          colorsLabel: 'Available colours',
          selectedColorLabel: 'Selected colour'
        },
        otherModels: {
          title: 'Looking for a different KAISAI model?',
          description:
            'We also install other units from the current KAISAI range. We select an air conditioner based on room size, intended use and budget.',
          cta: { label: 'Choose a KAISAI air conditioner' }
        }
      }
    }
  }
} as const satisfies Localized<EquipmentContent>;
