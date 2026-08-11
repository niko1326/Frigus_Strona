import { BUSINESS, CONTACT_PHONE, SITE } from '../config/site';

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

type ServiceRegionId = (typeof BUSINESS.serviceArea.regions)[number]['id'];

const getServiceRegion = (id: ServiceRegionId) => {
  const region = BUSINESS.serviceArea.regions.find((candidate) => candidate.id === id);

  if (!region) {
    throw new Error(`Missing service region in business config: ${id}`);
  }

  return region;
};

const bydgoszczRegion = getServiceRegion('bydgoszcz');
const triCityRegion = getServiceRegion('trojmiasto');
const [bydgoszcz] = bydgoszczRegion.places;
const [gdansk, gdynia] = triCityRegion.places;

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
    callNow: 'Zadzwoń po wycenę',
    callShort: 'Zadzwoń teraz',
    navAria: 'Główna nawigacja',
    phoneAria: `Zadzwoń do ${SITE.brandName} pod numer ${CONTACT_PHONE.display}`,
    emailAria: `Napisz do ${SITE.brandName} na adres ${BUSINESS.contact.email.address}`,
    languageSwitch: 'Przełącz na English',
    languageShort: 'EN',
    footerHours: 'Dostępność',
    footerInfo: 'Montaż klimatyzacji typu split i serwis podstawowy',
    stickyCall: 'Zadzwoń po wycenę',
    seeServices: 'Zobacz usługi',
    readPricing: 'Przejdź do cennika',
    ctaBand: 'Zadzwoń i umów wycenę',
    privacy: 'Polityka prywatności'
  },
  en: {
    callNow: 'Call for a quote',
    callShort: 'Call now',
    navAria: 'Main navigation',
    phoneAria: `Call ${SITE.brandName} at ${CONTACT_PHONE.display}`,
    emailAria: `Email ${SITE.brandName} at ${BUSINESS.contact.email.address}`,
    languageSwitch: 'Switch to Polish',
    languageShort: 'PL',
    footerHours: 'Availability',
    footerInfo: 'Split air conditioner installation and basic maintenance',
    stickyCall: 'Call for a quote',
    seeServices: 'See services',
    readPricing: 'View pricing',
    ctaBand: 'Call and schedule a quote',
    privacy: 'Privacy policy'
  }
} as const;

export const pageMeta: Record<Locale, Record<PageKey, PageMeta>> = {
  pl: {
    home: {
      title: `${SITE.brandName} | Montaż klimatyzacji split - ${BUSINESS.serviceArea.summary.pl}`,
      description: `Montaż klimatyzacji typu split: ${BUSINESS.serviceArea.summary.pl}. Szybka wycena telefoniczna, czysty montaż. ${BUSINESS.warranty.description.pl}`,
      keywords: [
        `montaż klimatyzacji ${bydgoszcz}`,
        `montaż klimatyzacji ${gdansk}`,
        `montaż klimatyzacji ${gdynia}`,
        'montaż klimatyzacji split',
        'klimatyzacja mieszkanie dom'
      ]
    },
    services: {
      title: `Usługi | ${SITE.brandName}`,
      description: `Zakres usługi ${SITE.brandName}: montaż jednostki wewnętrznej i zewnętrznej, przepust przez ścianę, prowadzenie instalacji i uruchomienie.`,
      keywords: ['usługi klimatyzacja split', 'montaż jednostki zewnętrznej', 'przegląd klimatyzacji']
    },
    pricing: {
      title: `Cennik | ${SITE.brandName}`,
      description: BUSINESS.pricing.installationService.fullDescription.pl,
      keywords: ['cennik montaż klimatyzacji', 'ile kosztuje montaż klimatyzacji', 'klimatyzacja split cena montażu']
    },
    faq: {
      title: `FAQ | ${SITE.brandName}`,
      description: 'Najczęstsze pytania o montaż klimatyzacji split, wycenę, terminy, gwarancję i przygotowanie mieszkania.',
      keywords: ['faq klimatyzacja split', 'czas montażu klimatyzacji', 'gwarancja producenta klimatyzacji']
    },
    contact: {
      title: `Kontakt | ${SITE.brandName}`,
      description: `Skontaktuj się z ${SITE.brandName} i umów wycenę telefonicznie. Obszar: ${BUSINESS.serviceArea.summary.pl}.`,
      keywords: [`kontakt klimatyzacja ${bydgoszcz}`, 'telefon montaż klimatyzacji', 'wycena klimatyzacji']
    },
    privacy: {
      title: `Polityka prywatności | ${SITE.brandName}`,
      description: `Podstawowe informacje o przetwarzaniu danych kontaktowych przez ${BUSINESS.legalName}.`,
      keywords: [`polityka prywatności ${SITE.brandName.toLowerCase()}`]
    }
  },
  en: {
    home: {
      title: `${SITE.brandName} | Split AC Installation - ${BUSINESS.serviceArea.summary.en}`,
      description: `Split AC installation: ${BUSINESS.serviceArea.summary.en}. Fast phone quotes and clean work. ${BUSINESS.warranty.description.en}`,
      keywords: [
        `split ac installation ${bydgoszcz}`,
        `ac installation ${gdansk}`,
        `air conditioner installation ${triCityRegion.label.en}`
      ]
    },
    services: {
      title: `Services | ${SITE.brandName}`,
      description: `Service scope from ${SITE.brandName}: indoor and outdoor unit installation, wall penetration, line routing and commissioning.`,
      keywords: ['split ac services', 'outdoor unit mounting', 'ac maintenance cleaning']
    },
    pricing: {
      title: `Pricing | ${SITE.brandName}`,
      description: BUSINESS.pricing.installationService.fullDescription.en,
      keywords: ['split ac installation price', 'air conditioner installation cost', `ac quote ${bydgoszcz}`]
    },
    faq: {
      title: `FAQ | ${SITE.brandName}`,
      description: 'Common questions about split AC installation, timelines, pricing, warranty, and preparation.',
      keywords: ['split ac faq', 'installation timeline', 'ac warranty']
    },
    contact: {
      title: `Contact | ${SITE.brandName}`,
      description: `Call ${SITE.brandName} for a quote and installation scheduling. Service area: ${BUSINESS.serviceArea.summary.en}.`,
      keywords: ['call ac installer', 'contact split ac installation', 'ac quote']
    },
    privacy: {
      title: `Privacy Policy | ${SITE.brandName}`,
      description: `Basic information about personal data handling by ${BUSINESS.legalName}.`,
      keywords: [`${SITE.brandName.toLowerCase()} privacy policy`]
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
