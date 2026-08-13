import { BUSINESS, CONTACT_PHONE, SITE } from '../config/site';

export type Locale = 'pl' | 'en';
export type PageKey =
  | 'home'
  | 'services'
  | 'airConditioners'
  | 'gree'
  | 'kaisai'
  | 'certifications'
  | 'pricing'
  | 'faq'
  | 'contact'
  | 'triCity'
  | 'privacy';

export type LocalizedPathPair = Readonly<Record<Locale, string>>;

type NavLink = {
  href: string;
  label: string;
};

type PageMeta = {
  title: string;
  description: string;
};

export const routeMap = {
  home: { pl: '/', en: '/en/' },
  services: { pl: '/uslugi', en: '/en/services' },
  airConditioners: { pl: '/klimatyzatory/', en: '/en/air-conditioners/' },
  gree: { pl: '/klimatyzatory/gree/', en: '/en/air-conditioners/gree/' },
  kaisai: { pl: '/klimatyzatory/kaisai/', en: '/en/air-conditioners/kaisai/' },
  certifications: { pl: '/certyfikaty', en: '/en/certifications' },
  pricing: { pl: '/cennik', en: '/en/pricing' },
  faq: { pl: '/faq', en: '/en/faq' },
  contact: { pl: '/kontakt', en: '/en/contact' },
  triCity: { pl: '/trojmiasto/', en: '/en/tri-city/' },
  privacy: { pl: '/polityka-prywatnosci', en: '/en/privacy-policy' }
} as const satisfies Record<PageKey, LocalizedPathPair>;

export const navLinks: Record<Locale, NavLink[]> = {
  pl: [
    { href: routeMap.services.pl, label: 'Usługi' },
    { href: routeMap.airConditioners.pl, label: 'Klimatyzatory' },
    { href: routeMap.pricing.pl, label: 'Cennik' },
    { href: routeMap.faq.pl, label: 'FAQ' },
    { href: routeMap.contact.pl, label: 'Kontakt' }
  ],
  en: [
    { href: routeMap.services.en, label: 'Services' },
    { href: routeMap.airConditioners.en, label: 'Air conditioners' },
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
    menu: 'Menu',
    equipmentBrandsAria: 'Marki klimatyzatorów',
    skipLink: 'Przejdź do treści',
    phoneAria: `Zadzwoń do ${SITE.brandName} pod numer ${CONTACT_PHONE.display}`,
    phoneActionPrefix: 'Zadzwoń',
    emailAria: `Napisz do ${SITE.brandName} na adres ${BUSINESS.contact.email.address}`,
    languageSwitch: 'Przełącz na English',
    languageShort: 'EN',
    footerHours: 'Dostępność',
    footerInfoHeading: 'Informacje',
    footerInfo: 'Montaż klimatyzacji typu split i serwis podstawowy',
    stickyCall: 'Zadzwoń po wycenę',
    selectAirConditioner: 'Dobierz klimatyzator',
    breadcrumbsAria: 'Okruszki nawigacyjne',
    homeBreadcrumb: 'Strona główna',
    seeServices: 'Zobacz usługi',
    readPricing: 'Przejdź do cennika',
    ctaBand: 'Zadzwoń i umów wycenę',
    privacy: 'Polityka prywatności',
    certifications: 'Certyfikaty i uprawnienia',
    triCity: 'Klimatyzacja w Trójmieście'
  },
  en: {
    callNow: 'Call for a quote',
    callShort: 'Call now',
    navAria: 'Main navigation',
    menu: 'Menu',
    equipmentBrandsAria: 'Air conditioner brands',
    skipLink: 'Skip to content',
    phoneAria: `Call ${SITE.brandName} at ${CONTACT_PHONE.display}`,
    phoneActionPrefix: 'Call us',
    emailAria: `Email ${SITE.brandName} at ${BUSINESS.contact.email.address}`,
    languageSwitch: 'Switch to Polish',
    languageShort: 'PL',
    footerHours: 'Availability',
    footerInfoHeading: 'Info',
    footerInfo: 'Split air conditioner installation and basic maintenance',
    stickyCall: 'Call for a quote',
    selectAirConditioner: 'Choose an air conditioner',
    breadcrumbsAria: 'Breadcrumbs',
    homeBreadcrumb: 'Home',
    seeServices: 'See services',
    readPricing: 'View pricing',
    ctaBand: 'Call and schedule a quote',
    privacy: 'Privacy policy',
    certifications: 'Certificates and credentials',
    triCity: 'Air conditioning in the Tri-City'
  }
} as const;

export const pageMeta: Record<Locale, Record<PageKey, PageMeta>> = {
  pl: {
    home: {
      title: `Klimatyzacja Bydgoszcz i okolice | ${SITE.brandName}`,
      description: `Dobór urządzeń GREE i KAISAI oraz kompletny montaż klimatyzacji w Bydgoszczy i okolicach. Skontaktuj się z ${SITE.brandName} i poproś o wycenę.`
    },
    services: {
      title: `Usługi montażu klimatyzacji w Bydgoszczy | ${SITE.brandName}`,
      description: `Kompletny montaż klimatyzacji w Bydgoszczy i okolicach: przygotowanie instalacji, montaż jednostek i uruchomienie urządzenia.`
    },
    airConditioners: {
      title: `Klimatyzatory z montażem Bydgoszcz | ${SITE.brandName}`,
      description: `Klimatyzatory GREE i KAISAI z doborem urządzenia i kompletnym montażem w Bydgoszczy i okolicach. Sprawdź marki polecane przez ${SITE.brandName}.`
    },
    gree: {
      title: `Klimatyzatory GREE z montażem Bydgoszcz | ${SITE.brandName}`,
      description: `${SITE.brandName} dobiera klimatyzatory GREE i zapewnia kompletny montaż klimatyzacji w Bydgoszczy i okolicach. Poznaj wybrane modele i warianty kolorystyczne.`
    },
    kaisai: {
      title: `Klimatyzatory KAISAI z montażem Bydgoszcz | ${SITE.brandName}`,
      description: `${SITE.brandName} pomaga dobrać klimatyzator KAISAI i wykonuje kompletny montaż w Bydgoszczy i okolicach. Poznaj wybrane modele i warianty kolorystyczne.`
    },
    certifications: {
      title: `Certyfikaty i uprawnienia | ${SITE.brandName}`,
      description: `Sprawdź certyfikaty F-gazowe, status Autoryzowanego Instalatora GREE oraz APS KAISAI posiadane przez ${SITE.brandName}.`
    },
    pricing: {
      title: `Cennik montażu klimatyzacji w Bydgoszczy | ${SITE.brandName}`,
      description: `Kompleksowa usługa montażu od ${BUSINESS.pricing.fromGrossPLN} zł brutto w najprostszym wariancie. Złożone montaże wyceniamy po konsultacji lub oględzinach.`
    },
    faq: {
      title: `FAQ: klimatyzacja i montaż Bydgoszcz | ${SITE.brandName}`,
      description: 'Odpowiedzi o cenie, doborze mocy, montażu, gwarancji, urządzeniach GREE i KAISAI oraz obsłudze Bydgoszczy i okolic.'
    },
    contact: {
      title: `Kontakt | ${SITE.brandName}`,
      description: `Skontaktuj się z ${SITE.brandName} i umów wycenę telefonicznie. Obszar: ${BUSINESS.serviceArea.summary.pl}.`
    },
    triCity: {
      title: `Montaż klimatyzacji Trójmiasto | ${SITE.brandName}`,
      description: `Dobór urządzeń GREE i KAISAI oraz kompletny montaż klimatyzacji w Gdańsku, Gdyni i Sopocie. Skontaktuj się z ${SITE.brandName} i ustal zakres realizacji.`
    },
    privacy: {
      title: `Polityka prywatności | ${SITE.brandName}`,
      description: `Podstawowe informacje o przetwarzaniu danych kontaktowych przez ${BUSINESS.legalName}.`
    }
  },
  en: {
    home: {
      title: `Air Conditioning Installation in Bydgoszcz | ${SITE.brandName}`,
      description: `GREE and KAISAI system selection with complete air conditioning installation in Bydgoszcz and surrounding areas. Contact ${SITE.brandName} for a quote.`
    },
    services: {
      title: `Air Conditioning Installation Services in Bydgoszcz | ${SITE.brandName}`,
      description: `Complete air conditioning installation in Bydgoszcz and surrounding areas, from line preparation and unit mounting to commissioning.`
    },
    airConditioners: {
      title: `Air Conditioners with Installation in Bydgoszcz | ${SITE.brandName}`,
      description: `GREE and KAISAI air conditioners with system selection and complete installation in Bydgoszcz and surrounding areas.`
    },
    gree: {
      title: `GREE Air Conditioners with Installation in Bydgoszcz | ${SITE.brandName}`,
      description: `${SITE.brandName} helps select a GREE air conditioner and provides complete installation in Bydgoszcz and surrounding areas.`
    },
    kaisai: {
      title: `KAISAI Air Conditioners with Installation in Bydgoszcz | ${SITE.brandName}`,
      description: `${SITE.brandName} helps select a KAISAI air conditioner and provides complete installation in Bydgoszcz and surrounding areas.`
    },
    certifications: {
      title: `Certificates and Credentials | ${SITE.brandName}`,
      description: `See the F-gas certificates, GREE Authorized Installer status and KAISAI APS held by ${SITE.brandName}.`
    },
    pricing: {
      title: `Air Conditioning Installation Pricing in Bydgoszcz | ${SITE.brandName}`,
      description: `Complete installation from PLN ${BUSINESS.pricing.fromGrossPLN} gross for the simplest option. Complex installations are quoted after consultation or a site inspection.`
    },
    faq: {
      title: `Air Conditioning Installation FAQ | ${SITE.brandName}`,
      description: 'Answers about pricing, system sizing, installation, warranties, GREE and KAISAI equipment, and service around Bydgoszcz.'
    },
    contact: {
      title: `Contact | ${SITE.brandName}`,
      description: `Call ${SITE.brandName} for a quote and installation scheduling. Service area: ${BUSINESS.serviceArea.summary.en}.`
    },
    triCity: {
      title: `Air Conditioning Installation in the Tri-City | ${SITE.brandName}`,
      description: `GREE and KAISAI system selection with complete air conditioning installation in Gdańsk, Gdynia and Sopot. Contact ${SITE.brandName} to discuss your project.`
    },
    privacy: {
      title: `Privacy Policy | ${SITE.brandName}`,
      description: `Basic information about personal data handling by ${BUSINESS.legalName}.`
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

export const getLocalizedPaths = (pathname: string): LocalizedPathPair => {
  const current = normalizePath(pathname);

  const foundPair = (Object.values(routeMap) as readonly LocalizedPathPair[]).find(
    (pair) => normalizePath(pair.pl) === current || normalizePath(pair.en) === current
  );

  if (!foundPair) {
    throw new Error(`Missing localized route mapping for path: ${pathname}`);
  }

  return foundPair;
};

export const getAlternatePath = (pathname: string, locale: Locale): string =>
  getLocalizedPaths(pathname)[locale === 'pl' ? 'en' : 'pl'];

export const getPathByPage = (page: PageKey, locale: Locale): string => routeMap[page][locale];
