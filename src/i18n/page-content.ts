import { BUSINESS } from '../config/site';
import { EQUIPMENT } from '../config/equipment';
import { routeMap, type Locale } from './content';

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
    eyebrow: string;
    visualEyebrow: string;
    visualTitle: string;
    visualDescription: string;
  }>;
  trust: Readonly<{
    items: readonly string[];
  }>;
  certifications: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    linkLabel: string;
    documentsTitle: string;
    documentsDescription: string;
  }>;
  services: Readonly<{
    eyebrow: string;
    title: string;
    cards: readonly TextBlock[];
  }>;
  equipment: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    linkLabel: string;
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
    links?: readonly Readonly<{
      href: string;
      label: string;
    }>[];
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
        eyebrow: 'Dobór urządzenia i kompletny montaż',
        visualEyebrow: 'GREE · KAISAI',
        visualTitle: 'Urządzenie dobrane do pomieszczenia',
        visualDescription: 'Dostawa i kompletny montaż'
      },
      trust: {
        items: [
          `GREE i KAISAI: ${EQUIPMENT.warranty.label.pl.toLowerCase()}. ${EQUIPMENT.warranty.termsNote.pl}`,
          'Dobór modelu i mocy',
          'Dostawa urządzenia i kompletny montaż'
        ]
      },
      certifications: {
        eyebrow: 'Uprawnienia',
        title: 'Certyfikaty i statusy producentów',
        description: 'Posiadamy wymagane certyfikaty F-gazowe oraz statusy APS marek GREE i KAISAI.',
        linkLabel: 'Zobacz certyfikaty i szczegóły uprawnień',
        documentsTitle: 'Skany autoryzacji GREE',
        documentsDescription:
          'Poniższe skany dotyczą wyłącznie autoryzacji producenta GREE. Nie są certyfikatami F-gazowymi.'
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
      equipment: {
        eyebrow: 'Klimatyzatory',
        title: 'GREE i KAISAI dobrane do Twoich potrzeb',
        description:
          'Nie musisz znać modeli ani parametrów technicznych. Pomagamy dobrać odpowiednie urządzenie GREE lub KAISAI, dostarczamy je i wykonujemy kompletny montaż.',
        linkLabel: 'Zobacz klimatyzatory, które montujemy'
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
        description: 'Realizujemy montaże w domach i mieszkaniach w Bydgoszczy oraz miejscowościach w jej otoczeniu.',
        note: 'Przy dalszych lokalizacjach potwierdzamy możliwość realizacji indywidualnie.'
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
        description: 'Praktyczne odpowiedzi o doborze urządzenia, montażu, użytkowaniu i obsłudze Bydgoszczy oraz okolic.'
      },
      items: [
        {
          question: 'Ile kosztuje montaż klimatyzacji w Bydgoszczy?',
          answer: `${BUSINESS.pricing.installationService.fullDescription.pl} Podana kwota dotyczy usługi montażu. Dobór urządzenia, długość instalacji i warunki montażowe uwzględniamy w wycenie całej realizacji, którą przedstawiamy przed rozpoczęciem prac.`
        },
        {
          question: 'Jak dobrać moc klimatyzatora do pomieszczenia?',
          answer:
            'Liczy się nie tylko powierzchnia, ale też nasłonecznienie, liczba okien, piętro i układ pomieszczenia. Nie musisz dobierać mocy samodzielnie — robimy to na podstawie informacji o lokalu i sposobie użytkowania.'
        },
        {
          question: 'Czy montujecie klimatyzację w Osielsku i Niemczu?',
          answer:
            'Tak. Realizujemy montaż klimatyzacji w Osielsku, Niemczu i Maksymilianowie oraz w innych miejscowościach w bezpośrednim sąsiedztwie Bydgoszczy. Pomagamy dobrać urządzenie, dostarczamy je i wykonujemy kompletny montaż.'
        },
        {
          question: 'Ile trwa standardowy montaż klimatyzacji?',
          answer:
            'Standardowy montaż zwykle zajmuje około jednego dnia roboczego. Dokładny czas zależy od warunków technicznych i przebiegu instalacji.'
        },
        {
          question: 'Jakie klimatyzatory montujecie?',
          answer:
            'Specjalizujemy się przede wszystkim w urządzeniach GREE i KAISAI. Zamiast przedstawiać cały katalog, pomagamy dobrać konkretny model do pomieszczenia, oczekiwań i budżetu.',
          links: [
            { href: routeMap.airConditioners.pl, label: 'Zobacz klimatyzatory' },
            { href: routeMap.gree.pl, label: 'Klimatyzatory GREE' },
            { href: routeMap.kaisai.pl, label: 'Klimatyzatory KAISAI' }
          ]
        },
        {
          question: 'Czy montujecie klimatyzację w Białych Błotach i Łochowie?',
          answer:
            'Tak. Obsługujemy Białe Błota i Łochowo, a także pobliski Murowaniec i Zielonkę. Zakres oraz termin ustalamy przed realizacją.'
        },
        {
          question: 'Czy klimatyzacją można ogrzewać mieszkanie?',
          answer:
            'Tak, wiele nowoczesnych urządzeń może pracować również w trybie grzania. Jeśli planujesz regularnie ogrzewać pomieszczenie klimatyzatorem, dobieramy model odpowiedni do takiego sposobu użytkowania.',
          links: [{ href: `${routeMap.gree.pl}#gree-pular-pro`, label: 'Poznaj GREE Pular PRO' }]
        },
        {
          question: 'Jak wygląda montaż klimatyzacji w mieszkaniu?',
          answer:
            'Najpierw dobieramy miejsce i trasę instalacji. Następnie zabezpieczamy miejsce pracy, wykonujemy instalację, montujemy jednostki, uruchamiamy i sprawdzamy urządzenie oraz pokazujemy klientowi podstawy obsługi.'
        },
        {
          question: 'Ile energii zużywa klimatyzator?',
          answer:
            'Zużycie energii zależy między innymi od mocy urządzenia, warunków w pomieszczeniu, ustawionej temperatury i sposobu użytkowania. Dlatego dobieramy moc do konkretnego wnętrza zamiast opierać się wyłącznie na jego powierzchni.'
        },
        {
          question: 'GREE czy KAISAI – którą markę wybrać?',
          answer:
            'Obie marki mają modele, które chętnie montujemy. GREE oferuje szeroki wybór urządzeń i wersji wyposażenia, natomiast KAISAI jest ciekawą propozycją dla osób szukających dobrego stosunku wyposażenia do ceny. Ostateczny wybór zależy od budżetu i sposobu użytkowania.'
        },
        {
          question: 'Ile lat gwarancji ma klimatyzator?',
          answer: `Urządzenia GREE i KAISAI są objęte ${EQUIPMENT.warranty.durationYears}-letnią gwarancją producenta na urządzenie. ${EQUIPMENT.warranty.termsNote.pl}`
        },
        {
          question: 'Czy dojeżdżacie do Solca Kujawskiego i Brzozy?',
          answer:
            'Tak. Realizujemy montaże w Solcu Kujawskim, Brzozie oraz w innych miejscowościach w rozsądnym zasięgu od Bydgoszczy.'
        },
        {
          question: 'Czy klimatyzator ma Wi-Fi?',
          answer:
            'Wiele modeli GREE i KAISAI oferuje sterowanie przez aplikację. Dostępność Wi-Fi zależy jednak od konkretnego urządzenia, dlatego sprawdzamy tę funkcję podczas doboru modelu.'
        },
        {
          question: 'Czy przed montażem trzeba przygotować mieszkanie?',
          answer:
            'Wystarczy zapewnić dostęp do miejsca montażu i odsunąć delikatne przedmioty z najbliższego otoczenia. Przed rozpoczęciem prac zabezpieczamy miejsce, w którym wykonujemy instalację.'
        },
        {
          question: 'Gdzie można zamontować jednostkę zewnętrzną?',
          answer:
            'Miejsce ustalamy po sprawdzeniu warunków technicznych, planowanej trasy instalacji i dostępu potrzebnego do późniejszego serwisu. Rozwiązanie dobieramy indywidualnie do budynku.'
        },
        {
          question: 'Czy montujecie klimatyzację w Koronowie lub Szubinie?',
          answer:
            'Tak. Realizujemy montaże również w Koronowie i Szubinie. Przy dalszych lokalizacjach najlepiej skontaktować się z nami i potwierdzić możliwość realizacji.'
        },
        {
          question: 'Nie wiem, jaki klimatyzator wybrać – czy możecie mi pomóc?',
          answer:
            'Tak. Nie musisz znać modeli, mocy ani parametrów technicznych. Wystarczy, że podasz podstawowe informacje o pomieszczeniu i swoich oczekiwaniach, a pomożemy dobrać odpowiednie urządzenie.',
          links: [{ href: routeMap.contact.pl, label: 'Poproś o dobór klimatyzatora' }]
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
        eyebrow: 'System selection and complete installation',
        visualEyebrow: 'GREE · KAISAI',
        visualTitle: 'A system selected for the room',
        visualDescription: 'Supply and complete installation'
      },
      trust: {
        items: [
          `GREE and KAISAI: ${EQUIPMENT.warranty.label.en.toLowerCase()}. ${EQUIPMENT.warranty.termsNote.en}`,
          'Model and capacity selection',
          'Unit supply and complete installation'
        ]
      },
      certifications: {
        eyebrow: 'Credentials',
        title: 'Certificates and manufacturer statuses',
        description: 'We hold the required F-gas certificates and GREE and KAISAI APS statuses.',
        linkLabel: 'See certificates and credential details',
        documentsTitle: 'GREE authorization scans',
        documentsDescription:
          'The scans below relate only to the GREE manufacturer authorization. They are not F-gas certificates.'
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
      equipment: {
        eyebrow: 'Air conditioners',
        title: 'GREE and KAISAI selected for your needs',
        description:
          'You do not need to know model names or technical specifications. We help select the right GREE or KAISAI unit, supply it and provide complete installation.',
        linkLabel: 'See the air conditioners we install'
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
        description: 'We install systems in houses and apartments in Bydgoszcz and the surrounding area.',
        note: 'For locations farther away, we confirm availability individually.'
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
        description: 'Practical answers about system selection, installation, everyday use, and service around Bydgoszcz.'
      },
      items: [
        {
          question: 'How much does air conditioning installation cost in Bydgoszcz?',
          answer: `${BUSINESS.pricing.installationService.fullDescription.en} The stated amount covers the installation service. We account for the selected unit, installation length and site conditions in the quote for the complete project, which we provide before work begins.`
        },
        {
          question: 'How do you choose the right air conditioner capacity?',
          answer:
            'Room size is only one factor. Sun exposure, the number of windows, the floor and the room layout also matter. You do not need to calculate capacity yourself — we select it using information about the space and how the unit will be used.'
        },
        {
          question: 'Do you install air conditioning in Osielsko and Niemcz?',
          answer:
            'Yes. We install air conditioning in Osielsko, Niemcz and Maksymilianowo, as well as other places immediately around Bydgoszcz. We help select the unit, supply it and provide complete installation.'
        },
        {
          question: 'How long does a standard air conditioning installation take?',
          answer:
            'A standard installation usually takes around one working day. The exact time depends on the technical conditions and the installation route.'
        },
        {
          question: 'Which air conditioners do you install?',
          answer:
            'We focus primarily on GREE and KAISAI equipment. Instead of presenting a full catalogue, we help select a specific model for the room, your expectations and budget.',
          links: [
            { href: routeMap.airConditioners.en, label: 'See air conditioners' },
            { href: routeMap.gree.en, label: 'GREE air conditioners' },
            { href: routeMap.kaisai.en, label: 'KAISAI air conditioners' }
          ]
        },
        {
          question: 'Do you install air conditioning in Białe Błota and Łochowo?',
          answer:
            'Yes. We serve Białe Błota and Łochowo, as well as nearby Murowaniec and Zielonka. We confirm the scope and timing before the work.'
        },
        {
          question: 'Can an air conditioner heat an apartment?',
          answer:
            'Yes. Many modern units can also work in heating mode. If you plan to heat a room regularly with air conditioning, we select a model suited to that use.',
          links: [{ href: `${routeMap.gree.en}#gree-pular-pro`, label: 'See GREE Pular PRO' }]
        },
        {
          question: 'What happens during an apartment air conditioning installation?',
          answer:
            'We first choose the unit locations and installation route. We then protect the work area, install the line and both units, commission and test the system, and explain the basic controls to the customer.'
        },
        {
          question: 'How much electricity does an air conditioner use?',
          answer:
            'Energy use depends on the unit capacity, room conditions, temperature setting and how the system is used. This is why we size the unit for the specific space rather than using floor area alone.'
        },
        {
          question: 'GREE or KAISAI — which brand should I choose?',
          answer:
            'Both brands offer models we are happy to install. GREE has a broad selection of units and feature levels, while KAISAI is an interesting option for customers looking for a good balance between features and price. The final choice depends on the budget and intended use.'
        },
        {
          question: 'How long is the air conditioner warranty?',
          answer: `GREE and KAISAI units come with a ${EQUIPMENT.warranty.durationYears}-year manufacturer's warranty on the unit. ${EQUIPMENT.warranty.termsNote.en}`
        },
        {
          question: 'Do you travel to Solec Kujawski and Brzoza?',
          answer:
            'Yes. We also install systems in Solec Kujawski, Brzoza and other locations within a reasonable distance of Bydgoszcz.'
        },
        {
          question: 'Does an air conditioner have Wi-Fi?',
          answer:
            'Many GREE and KAISAI models offer app control. Wi-Fi availability depends on the specific unit, so we confirm that feature when selecting a model.'
        },
        {
          question: 'Do I need to prepare the apartment before installation?',
          answer:
            'Please provide access to the installation area and move fragile items away from the immediate workspace. We protect the work area before starting the installation.'
        },
        {
          question: 'Where can the outdoor unit be installed?',
          answer:
            'We choose the location after checking the technical conditions, the planned installation route and the access needed for future service. The solution is selected individually for the building.'
        },
        {
          question: 'Do you install air conditioning in Koronowo or Szubin?',
          answer:
            'Yes. We also install systems in Koronowo and Szubin. For locations farther away, please contact us so we can confirm availability.'
        },
        {
          question: 'I do not know which air conditioner to choose — can you help?',
          answer:
            'Yes. You do not need to know model names, capacities or technical specifications. Tell us the basics about the room and what you expect from the unit, and we will help select a suitable system.',
          links: [{ href: routeMap.contact.en, label: 'Ask us to select an air conditioner' }]
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
