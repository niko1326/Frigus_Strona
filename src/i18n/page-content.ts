import { BUSINESS } from '../config/site';
import type { Locale } from './content';

export type Localized<T> = Readonly<Record<Locale, T>>;

export type PageHeroContent = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

type TextBlock = Readonly<{
  title: string;
  description: string;
}>;

type HomeContent = Readonly<{
  hero: Readonly<{
    imageAlt: string;
  }>;
  trust: Readonly<{
    items: readonly string[];
  }>;
  certifications: Readonly<{
    eyebrow: string;
  }>;
  services: Readonly<{
    eyebrow: string;
    title: string;
    cards: readonly TextBlock[];
  }>;
  howItWorks: Readonly<{
    eyebrow: string;
    title: string;
    steps: readonly TextBlock[];
  }>;
  pricing: Readonly<{
    eyebrow: string;
    linkLabel: string;
  }>;
  serviceArea: Readonly<{
    eyebrow: string;
    description: string;
    note: string;
  }>;
  cta: Readonly<{
    headline: string;
  }>;
}>;

type ServicesContent = Readonly<{
  hero: PageHeroContent;
  installation: Readonly<{
    title: string;
    items: readonly string[];
  }>;
  maintenance: Readonly<{
    title: string;
    description: string;
    items: readonly string[];
  }>;
  features: Readonly<{
    preparation: TextBlock;
    outdoor: TextBlock;
    cleanup: TextBlock;
  }>;
}>;

type PricingContent = Readonly<{
  hero: PageHeroContent;
  phoneNote: string;
}>;

type FaqContent = Readonly<{
  hero: PageHeroContent;
  items: readonly Readonly<{
    question: string;
    answer: string;
  }>[];
}>;

type ContactContent = Readonly<{
  hero: PageHeroContent;
  availabilityLabel: string;
  areaLabel: string;
  note: string;
}>;

type PrivacyContent = Readonly<{
  hero: PageHeroContent;
  items: readonly string[];
}>;

type SitePageContent = Readonly<{
  home: HomeContent;
  services: ServicesContent;
  pricing: PricingContent;
  faq: FaqContent;
  contact: ContactContent;
  privacy: PrivacyContent;
}>;

export const pageContent = {
  pl: {
    home: {
      hero: {
        imageAlt: 'Klimatyzacja po montażu'
      },
      trust: {
        items: [
          BUSINESS.warranty.description.pl,
          BUSINESS.certifications.summary.pl,
          'Szybkie terminy i szybka odpowiedź',
          'Porządek po montażu'
        ]
      },
      certifications: {
        eyebrow: 'Uprawnienia / Certyfikaty'
      },
      services: {
        eyebrow: 'Usługi',
        title: 'Zakres, którego naprawdę potrzebujesz',
        cards: [
          {
            title: 'Montaż split (mieszkanie/dom)',
            description: 'Montaż jednostki wewnętrznej i estetyczne poprowadzenie instalacji.'
          },
          {
            title: 'Montaż jednostki zewnętrznej + uruchomienie',
            description: 'Bezpieczny montaż, próżnia, napełnienie i pełne uruchomienie układu.'
          },
          {
            title: 'Przegląd i czyszczenie',
            description: 'Regularny serwis podstawowy dla wydajnej i higienicznej pracy urządzenia.'
          }
        ]
      },
      howItWorks: {
        eyebrow: 'Jak to działa',
        title: 'Prosto: 3 kroki do gotowej klimatyzacji',
        steps: [
          { title: 'Telefon', description: 'Krótka rozmowa, orientacyjny zakres i termin wizji lub montażu.' },
          { title: 'Wycena', description: BUSINESS.pricing.installationService.fullDescription.pl },
          { title: 'Montaż', description: 'Montaż zwykle trwa około 1 dnia, z zachowaniem porządku.' }
        ]
      },
      pricing: {
        eyebrow: 'Cennik',
        linkLabel: 'Sprawdź szczegóły cennika'
      },
      serviceArea: {
        eyebrow: 'Obszar działania',
        description: 'Realizujemy montaże w domach i mieszkaniach na całym wskazanym obszarze.',
        note: 'Uwaga: ewentualne zgody administracyjne i formalności po stronie inwestora/właściciela lokalu.'
      },
      cta: {
        headline: 'Zadzwoń i umów wycenę'
      }
    },
    services: {
      hero: {
        eyebrow: 'Usługi',
        title: 'Montaż split i serwis podstawowy',
        description:
          'Realizujemy pojedyncze instalacje split w mieszkaniach i domach. Skupiamy się na poprawnym montażu, estetyce prowadzenia instalacji i czystym zakończeniu prac.'
      },
      installation: {
        title: 'Co obejmuje montaż split',
        items: [
          'montaż jednostki wewnętrznej',
          'przepust przez ścianę',
          'montaż jednostki zewnętrznej',
          'prowadzenie pełnej instalacji chłodniczej i uruchomienie'
        ]
      },
      maintenance: {
        title: 'Przegląd i czyszczenie',
        description:
          'Oferujemy serwis okresowy: czyszczenie jednostki wewnętrznej, kontrolę podstawowych parametrów i sprawdzenie działania układu.',
        items: [
          'czyszczenie filtrów i elementów dostępnych serwisowo',
          'kontrola odprowadzenia skroplin',
          'sprawdzenie pracy urządzenia po czyszczeniu'
        ]
      },
      features: {
        preparation: {
          title: 'Przygotowanie miejsca',
          description: 'Dobieramy trasę instalacji tak, aby była możliwie krótka i estetyczna.'
        },
        outdoor: {
          title: 'Montaż zewnętrzny',
          description: 'Stabilny montaż jednostki zewnętrznej z myślą o trwałości i dostępie serwisowym.'
        },
        cleanup: {
          title: 'Porządek po montażu',
          description: 'Po zakończeniu prac zostawiamy miejsce montażu uporządkowane.'
        }
      }
    },
    pricing: {
      hero: {
        eyebrow: 'Cennik',
        title: BUSINESS.pricing.installationService.name.pl,
        description: BUSINESS.pricing.installationService.fullDescription.pl
      },
      phoneNote: 'Brak formularzy: najkrótsza droga do wyceny to telefon.'
    },
    faq: {
      hero: {
        eyebrow: 'FAQ',
        title: 'Najczęściej zadawane pytania',
        description: 'Krótko i konkretnie: jak wygląda wycena, montaż i serwis.'
      },
      items: [
        {
          question: 'Ile trwa montaż split?',
          answer: 'Zwykle około 1 dnia roboczego. Czas zależy od warunków technicznych i długości instalacji.'
        },
        { question: 'Czy dojazd jest dodatkowo płatny?', answer: BUSINESS.travel.note.pl },
        {
          question: 'Jak wyceniacie bardziej złożone montaże?',
          answer: BUSINESS.pricing.installationService.complexPriceDescription.pl
        },
        { question: 'Jaka jest gwarancja?', answer: BUSINESS.warranty.description.pl },
        {
          question: 'Czy oferujecie przeglądy i czyszczenie?',
          answer: 'Tak, wykonujemy serwis podstawowy i czyszczenie urządzeń split.'
        },
        {
          question: 'Jak uzyskać wycenę?',
          answer: 'Zadzwoń, aby omówić montaż i ustalić, czy potrzebne są oględziny.'
        }
      ]
    },
    contact: {
      hero: {
        eyebrow: 'Kontakt',
        title: 'Telefon to najszybsza wycena',
        description:
          'Bez formularzy i bez kolejek. Zadzwoń, opisz lokal i urządzenie, a szybko wrócimy z propozycją zakresu i terminu.'
      },
      availabilityLabel: 'Dostępność',
      areaLabel: 'Obszar',
      note: 'Skontaktuj się telefonicznie lub mailowo.'
    },
    privacy: {
      hero: {
        eyebrow: 'Polityka prywatności',
        title: 'Podstawowe informacje o danych',
        description: `Administratorem danych kontaktowych jest ${BUSINESS.legalName}. Dane przekazane podczas kontaktu są używane wyłącznie do kontaktu w sprawie wyceny i realizacji usługi.`
      },
      items: [
        'Zakres danych: imię, numer telefonu, adres e-mail, adres montażu (jeśli podany).',
        'Cel: kontakt, ustalenie wyceny i realizacja usługi.',
        'Okres przechowywania: nie dłużej niż wymagają tego rozliczenia i kontakt serwisowy.',
        'Kontakt w sprawie danych: z użyciem danych kontaktowych podanych na stronie.'
      ]
    }
  },
  en: {
    home: {
      hero: {
        imageAlt: 'Installed air conditioner'
      },
      trust: {
        items: [
          BUSINESS.warranty.description.en,
          BUSINESS.certifications.summary.en,
          'Fast response and short lead times',
          'Clean finish after installation'
        ]
      },
      certifications: {
        eyebrow: 'Credentials / Certificates'
      },
      services: {
        eyebrow: 'Services',
        title: 'Exactly the scope you need',
        cards: [
          {
            title: 'Split installation (apartment/house)',
            description: 'Indoor unit mounting and neat refrigerant line routing.'
          },
          {
            title: 'Outdoor unit mounting + startup',
            description: 'Safe mounting, vacuum process, charging, and full commissioning.'
          },
          {
            title: 'Maintenance and cleaning',
            description: 'Basic recurring service to keep the system efficient and clean.'
          }
        ]
      },
      howItWorks: {
        eyebrow: 'How it works',
        title: 'Simple: 3 steps to working AC',
        steps: [
          { title: 'Call', description: 'Short call to understand scope and propose a timeline.' },
          { title: 'Quote', description: BUSINESS.pricing.installationService.fullDescription.en },
          { title: 'Install', description: 'Installation usually takes about one day with a clean finish.' }
        ]
      },
      pricing: {
        eyebrow: 'Pricing',
        linkLabel: 'See pricing details'
      },
      serviceArea: {
        eyebrow: 'Service area',
        description: 'We install split units in apartments and houses across the listed locations.',
        note: 'Note: any building permissions or housing administration approvals are handled by the property owner.'
      },
      cta: {
        headline: 'Call and schedule your quote'
      }
    },
    services: {
      hero: {
        eyebrow: 'Services',
        title: 'Split installation and basic maintenance',
        description:
          'We focus on single split installations in apartments and houses, with tidy line routing and clean, reliable commissioning.'
      },
      installation: {
        title: 'What split installation includes',
        items: [
          'indoor unit mounting',
          'wall passthrough',
          'outdoor unit mounting',
          'full refrigerant line run and commissioning'
        ]
      },
      maintenance: {
        title: 'Maintenance and cleaning',
        description:
          'We provide recurring basic service: cleaning accessible parts and checking essential operating parameters.',
        items: [
          'indoor unit cleaning and filter service',
          'condensate drainage check',
          'post-cleaning operation check'
        ]
      },
      features: {
        preparation: {
          title: 'Site preparation',
          description: 'We plan line routing to keep the installation neat and technically sound.'
        },
        outdoor: {
          title: 'Outdoor unit setup',
          description: 'Stable mounting with serviceability and durability in mind.'
        },
        cleanup: {
          title: 'Clean finish',
          description: 'After installation, we leave the workspace in order.'
        }
      }
    },
    pricing: {
      hero: {
        eyebrow: 'Pricing',
        title: BUSINESS.pricing.installationService.name.en,
        description: BUSINESS.pricing.installationService.fullDescription.en
      },
      phoneNote: 'No forms or widgets. Phone call is the fastest quote path.'
    },
    faq: {
      hero: {
        eyebrow: 'FAQ',
        title: 'Frequently asked questions',
        description: 'Quick answers about quotes, installation timeline, and maintenance.'
      },
      items: [
        {
          question: 'How long does a split installation take?',
          answer: 'Usually around one working day, depending on technical conditions and line length.'
        },
        { question: 'Is travel charged separately?', answer: BUSINESS.travel.note.en },
        {
          question: 'How are more complex installations priced?',
          answer: BUSINESS.pricing.installationService.complexPriceDescription.en
        },
        { question: 'What warranty do you provide?', answer: BUSINESS.warranty.description.en },
        {
          question: 'Do you offer maintenance cleaning?',
          answer: 'Yes, we offer basic maintenance and cleaning for split systems.'
        },
        {
          question: 'What is the fastest way to get a quote?',
          answer: 'Call us to discuss the installation and determine whether a site inspection is needed.'
        }
      ]
    },
    contact: {
      hero: {
        eyebrow: 'Contact',
        title: 'Phone call is the fastest quote',
        description:
          'No forms, no booking widgets. Call us, share your location and unit plan, and we will return with a practical next step.'
      },
      availabilityLabel: 'Availability',
      areaLabel: 'Area',
      note: 'Contact us by phone or email.'
    },
    privacy: {
      hero: {
        eyebrow: 'Privacy Policy',
        title: 'Basic data information',
        description: `${BUSINESS.legalName} handles contact data shared when contacting us to provide quote communication and service delivery.`
      },
      items: [
        'Data scope: name, phone number, email address, installation address (if provided).',
        'Purpose: quote communication and service delivery.',
        'Storage period: no longer than needed for accounting and service communication.',
        'Data questions: use the contact details listed on this website.'
      ]
    }
  }
} as const satisfies Localized<SitePageContent>;
