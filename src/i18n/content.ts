export type Locale = 'pl' | 'en';
export type PageKey = 'home' | 'services' | 'pricing' | 'faq' | 'contact' | 'privacy';

type NavLink = {
  href: string;
  label: string;
};

type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
};

export const routeMap: Record<PageKey, { pl: string; en: string }> = {
  home: { pl: '/', en: '/en/' },
  services: { pl: '/uslugi', en: '/en/services' },
  pricing: { pl: '/cennik', en: '/en/pricing' },
  faq: { pl: '/faq', en: '/en/faq' },
  contact: { pl: '/kontakt', en: '/en/contact' },
  privacy: { pl: '/polityka-prywatnosci', en: '/en/privacy-policy' }
};

export const navLinks: Record<Locale, NavLink[]> = {
  pl: [
    { href: routeMap.services.pl, label: 'Usługi' },
    { href: routeMap.pricing.pl, label: 'Cennik' },
    { href: routeMap.faq.pl, label: 'FAQ' },
    { href: routeMap.contact.pl, label: 'Kontakt' }
  ],
  en: [
    { href: routeMap.services.en, label: 'Services' },
    { href: routeMap.pricing.en, label: 'Pricing' },
    { href: routeMap.faq.en, label: 'FAQ' },
    { href: routeMap.contact.en, label: 'Contact' }
  ]
};

export const commonLabels = {
  pl: {
    callNow: 'Zadzwoń po darmową wycenę',
    callShort: 'Zadzwoń teraz',
    navAria: 'Główna nawigacja',
    phoneAria: 'Zadzwoń do FRIGAC',
    languageSwitch: 'Przełącz na English',
    languageShort: 'EN',
    footerHours: 'Godziny',
    footerInfo: 'Montaż klimatyzacji typu split i serwis podstawowy',
    stickyCall: 'Zadzwoń: darmowa wycena',
    seeServices: 'Zobacz usługi',
    readPricing: 'Przejdź do cennika',
    ctaBand: 'Zadzwoń i umów wycenę',
    privacy: 'Polityka prywatności'
  },
  en: {
    callNow: 'Call for a free quote',
    callShort: 'Call now',
    navAria: 'Main navigation',
    phoneAria: 'Call FRIGAC',
    languageSwitch: 'Switch to Polish',
    languageShort: 'PL',
    footerHours: 'Hours',
    footerInfo: 'Split air conditioner installation and basic maintenance',
    stickyCall: 'Call: free quote',
    seeServices: 'See services',
    readPricing: 'View pricing',
    ctaBand: 'Call and schedule a quote',
    privacy: 'Privacy policy'
  }
} as const;

export const pageMeta: Record<Locale, Record<PageKey, PageMeta>> = {
  pl: {
    home: {
      title: 'FRIGAC | Montaż klimatyzacji split - Bydgoszcz i Trójmiasto',
      description:
        'Montaż klimatyzacji typu split w Bydgoszczy i Trójmieście. Szybka wycena telefoniczna, czysty montaż, 2 lata gwarancji.',
      keywords: [
        'montaż klimatyzacji Bydgoszcz',
        'montaż klimatyzacji Gdańsk',
        'montaż klimatyzacji Gdynia',
        'montaż klimatyzacji split',
        'klimatyzacja mieszkanie dom'
      ]
    },
    services: {
      title: 'Usługi | FRIGAC',
      description:
        'Zakres usługi FRIGAC: montaż jednostki wewnętrznej i zewnętrznej, przepust przez ścianę, prowadzenie instalacji i uruchomienie.',
      keywords: ['usługi klimatyzacja split', 'montaż jednostki zewnętrznej', 'przegląd klimatyzacji']
    },
    pricing: {
      title: 'Cennik | FRIGAC',
      description: 'Cennik startowy montażu klimatyzacji typu split. Cena montażu od podanego zakresu + cena urządzenia.',
      keywords: ['cennik montaż klimatyzacji', 'ile kosztuje montaż klimatyzacji', 'klimatyzacja split cena montażu']
    },
    faq: {
      title: 'FAQ | FRIGAC',
      description: 'Najczęstsze pytania o montaż klimatyzacji split, wycenę, terminy, gwarancję i przygotowanie mieszkania.',
      keywords: ['faq klimatyzacja split', 'czas montażu klimatyzacji', 'gwarancja montażowa klimatyzacji']
    },
    contact: {
      title: 'Kontakt | FRIGAC',
      description: 'Skontaktuj się z FRIGAC i umów bezpłatną wycenę telefonicznie. Obsługa Bydgoszcz i Trójmiasto.',
      keywords: ['kontakt klimatyzacja Bydgoszcz', 'telefon montaż klimatyzacji', 'darmowa wycena klimatyzacji']
    },
    privacy: {
      title: 'Polityka prywatności | FRIGAC',
      description: 'Podstawowe informacje o przetwarzaniu danych kontaktowych przez FRIGAC.',
      keywords: ['polityka prywatności frigac']
    }
  },
  en: {
    home: {
      title: 'FRIGAC | Split AC Installation in Bydgoszcz and Tri-City',
      description:
        'Minimal, reliable split AC installation in Bydgoszcz and Tri-City. Fast phone quotes, clean work, 2-year installation warranty.',
      keywords: ['split ac installation bydgoszcz', 'ac installation gdansk', 'air conditioner installation tri-city']
    },
    services: {
      title: 'Services | FRIGAC',
      description:
        'What is included: indoor unit mounting, wall passthrough, outdoor unit mounting, full line run, startup, and maintenance cleaning.',
      keywords: ['split ac services', 'outdoor unit mounting', 'ac maintenance cleaning']
    },
    pricing: {
      title: 'Pricing | FRIGAC',
      description: 'Starting price for split AC installation: installation from the listed range plus unit cost.',
      keywords: ['split ac installation price', 'air conditioner installation cost', 'ac quote bydgoszcz']
    },
    faq: {
      title: 'FAQ | FRIGAC',
      description: 'Common questions about split AC installation, timelines, pricing, warranty, and preparation.',
      keywords: ['split ac faq', 'installation timeline', 'ac warranty']
    },
    contact: {
      title: 'Contact | FRIGAC',
      description: 'Call FRIGAC for a free quote and installation scheduling in Bydgoszcz and Tri-City.',
      keywords: ['call ac installer', 'contact split ac installation', 'free ac quote']
    },
    privacy: {
      title: 'Privacy Policy | FRIGAC',
      description: 'Basic information about personal data handling at FRIGAC.',
      keywords: ['frigac privacy policy']
    }
  }
};

const normalizePath = (value: string): string => {
  const noHash = value.split('#')[0] ?? value;
  const noQuery = noHash.split('?')[0] ?? noHash;
  if (noQuery === '') {
    return '/';
  }

  if (noQuery !== '/' && noQuery.endsWith('/')) {
    return noQuery.slice(0, -1);
  }

  return noQuery;
};

export const getAlternatePath = (pathname: string, locale: Locale): string => {
  const current = normalizePath(pathname);

  const foundPair = (Object.values(routeMap) as Array<{ pl: string; en: string }>).find(
    (pair) => normalizePath(pair.pl) === current || normalizePath(pair.en) === current
  );

  if (!foundPair) {
    return locale === 'pl' ? routeMap.home.en : routeMap.home.pl;
  }

  return locale === 'pl' ? foundPair.en : foundPair.pl;
};

export const getPathByPage = (page: PageKey, locale: Locale): string => routeMap[page][locale];
