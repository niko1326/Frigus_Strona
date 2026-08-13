import type { Locale } from './content';

type LocalizedLocationContent = Readonly<{
  hero: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  area: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    placesLabel: string;
    availabilityNote: string;
  }>;
  offer: Readonly<{
    eyebrow: string;
    title: string;
    items: readonly Readonly<{
      title: string;
      description: string;
    }>[];
    servicesLink: string;
  }>;
  pricing: Readonly<{
    eyebrow: string;
    title: string;
    scopeTitle: string;
    pricingLink: string;
  }>;
  equipment: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    link: string;
  }>;
  contact: Readonly<{
    title: string;
    description: string;
  }>;
}>;

export const triCityContent = {
  pl: {
    hero: {
      eyebrow: 'Gdańsk · Gdynia · Sopot',
      title: 'Montaż klimatyzacji w Trójmieście',
      description:
        'Pomagamy dobrać urządzenie GREE lub KAISAI, dostarczamy je i wykonujemy kompletny montaż klimatyzacji na terenie Trójmiasta.'
    },
    area: {
      eyebrow: 'Obszar działania',
      title: 'Obsługujemy całe Trójmiasto',
      description:
        'Realizujemy montaże w Gdańsku, Gdyni i Sopocie. Dokładny termin oraz możliwość realizacji pod wskazanym adresem potwierdzamy podczas kontaktu.',
      placesLabel: 'Główne miasta obsługi',
      availabilityNote: 'Pracujemy po wcześniejszym umówieniu.'
    },
    offer: {
      eyebrow: 'Kompleksowa realizacja',
      title: 'Od doboru urządzenia do uruchomienia',
      items: [
        {
          title: 'Dobór klimatyzatora',
          description: 'Dobieramy model i moc urządzenia do pomieszczenia oraz sposobu użytkowania.'
        },
        {
          title: 'Ustalenie zakresu',
          description: 'Omawiamy miejsce jednostek i trasę instalacji, a następnie przedstawiamy wycenę realizacji.'
        },
        {
          title: 'Montaż i uruchomienie',
          description: 'Dostarczamy urządzenie, wykonujemy instalację i uruchamiamy gotowy układ.'
        }
      ],
      servicesLink: 'Sprawdź pełny zakres usług'
    },
    pricing: {
      eyebrow: 'Cena montażu',
      title: 'Najprostszy wariant od 3499 zł brutto',
      scopeTitle: 'Zakres wariantu podstawowego',
      pricingLink: 'Zobacz dokładny zakres ceny'
    },
    equipment: {
      eyebrow: 'Klimatyzatory',
      title: 'Urządzenia GREE i KAISAI',
      description:
        'Nie musisz samodzielnie porównywać wszystkich parametrów. Pomagamy wybrać urządzenie dopasowane do pomieszczenia i oczekiwań.',
      link: 'Zobacz klimatyzatory, które montujemy'
    },
    contact: {
      title: 'Planujesz klimatyzację w Trójmieście?',
      description: 'Zadzwoń lub napisz. Omówimy lokalizację, pomieszczenie i oczekiwany zakres montażu.'
    }
  },
  en: {
    hero: {
      eyebrow: 'Gdańsk · Gdynia · Sopot',
      title: 'Air conditioning installation in the Tri-City',
      description:
        'We help select a GREE or KAISAI unit, supply it and provide complete air conditioning installation across the Tri-City.'
    },
    area: {
      eyebrow: 'Service area',
      title: 'Serving the entire Tri-City',
      description:
        'We carry out installations in Gdańsk, Gdynia and Sopot. We confirm the exact schedule and availability at your address when you contact us.',
      placesLabel: 'Main service locations',
      availabilityNote: 'We work by appointment.'
    },
    offer: {
      eyebrow: 'Complete project',
      title: 'From unit selection to commissioning',
      items: [
        {
          title: 'Air conditioner selection',
          description: 'We select the model and capacity for the room and the way the system will be used.'
        },
        {
          title: 'Defining the scope',
          description: 'We discuss unit locations and the installation route, then provide a quote for the project.'
        },
        {
          title: 'Installation and commissioning',
          description: 'We supply the unit, complete the installation and commission the finished system.'
        }
      ],
      servicesLink: 'See the complete service scope'
    },
    pricing: {
      eyebrow: 'Installation price',
      title: 'The simplest option from PLN 3499 gross',
      scopeTitle: 'Scope of the basic option',
      pricingLink: 'See exactly what the price covers'
    },
    equipment: {
      eyebrow: 'Air conditioners',
      title: 'GREE and KAISAI equipment',
      description:
        'You do not need to compare every specification yourself. We help select a unit suited to the room and your requirements.',
      link: 'Explore the air conditioners we install'
    },
    contact: {
      title: 'Planning air conditioning in the Tri-City?',
      description: 'Call or email us. We will discuss the location, the room and the expected installation scope.'
    }
  }
} as const satisfies Record<Locale, LocalizedLocationContent>;
