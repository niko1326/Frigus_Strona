import { PRICING } from '../config/site';

export type PageKey =
  | 'home'
  | 'services'
  | 'pricing'
  | 'faq'
  | 'contact'
  | 'about'
  | 'blog'
  | 'bydgoszcz'
  | 'trojmiasto'
  | 'gree'
  | 'kaisai'
  | 'tools'
  | 'calcPower'
  | 'calcCost'
  | 'calcEnergy'
  | 'privacy'
  | 'terms';

type NavLink = {
  href: string;
  label: string;
};

type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
};

export const routes: Record<PageKey, string> = {
  home: '/',
  services: '/uslugi',
  pricing: '/cennik',
  faq: '/faq',
  contact: '/kontakt',
  about: '/o-nas',
  blog: '/porady',
  bydgoszcz: '/bydgoszcz',
  trojmiasto: '/trojmiasto',
  gree: '/klimatyzatory-gree',
  kaisai: '/klimatyzatory-kaisai',
  tools: '/narzedzia',
  calcPower: '/kalkulator-klimatyzacji',
  calcCost: '/kalkulator-kosztow-klimatyzacji',
  calcEnergy: '/ile-pradu-zuzywa-klimatyzacja',
  privacy: '/polityka-prywatnosci',
  terms: '/regulamin'
};

export const navLinks: NavLink[] = [
  { href: routes.services, label: 'Usługi' },
  { href: routes.pricing, label: 'Cennik' },
  { href: routes.about, label: 'O nas' },
  { href: routes.blog, label: 'Porady' },
  { href: routes.faq, label: 'FAQ' },
  { href: routes.contact, label: 'Kontakt' }
];

export const calculatorNavLabels = {
  power: 'Dobór mocy klimatyzatora',
  cost: 'Wycena montażu klimatyzacji',
  energy: 'Koszt zużycia energii'
} as const;

export const labels = {
  callNow: 'Skonsultuj montaż klimatyzacji',
  callShort: 'Zadzwoń teraz',
  freeQuote: 'Skontaktuj się z nami',
  scheduleVisit: 'Umów bezpłatną wizytę',
  consultInstallation: 'Skonsultuj montaż klimatyzacji',
  navAria: 'Główna nawigacja',
  phoneAria: 'Zadzwoń do FRIGAC',
  footerHours: 'Godziny pracy',
  footerInfo:
    'Montaż i serwis klimatyzacji w Gdańsku, Gdyni, Sopocie i całym Trójmieście, a także w Bydgoszczy i Toruniu.',
  stickyCall: 'Bezpłatna wizyta',
  seeServices: 'Zobacz zakres usług',
  readPricing: 'Sprawdź cennik',
  privacy: 'Polityka prywatności',
  terms: 'Regulamin'
} as const;

export const pageMeta: Record<PageKey, PageMeta> = {
  home: {
    title: `Klimatyzacja Gdańsk i Trójmiasto od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Klimatyzacja z montażem od ${PRICING.installFromPLN} zł w Gdańsku, Gdyni i Sopocie. Dobór urządzenia, montaż i serwis. Sprawdź ofertę FRIGAC i umów bezpłatną wizytę.`,
    keywords: [
      'klimatyzacja Gdańsk',
      'klima Gdańsk',
      'montaż klimatyzacji Gdańsk',
      'klimatyzacja z montażem Gdańsk',
      'klimatyzator z montażem Gdańsk',
      'klimatyzacja Trójmiasto',
      'klima Gdynia',
      'klimatyzacja Gdynia',
      'klimatyzacja Sopot',
      'klimatyzacja Wrzeszcz',
      'klimatyzacja Przymorze',
      'montaż klimatyzacji w bloku',
      'klimatyzacja Bydgoszcz',
      'klimatyzacja do mieszkania 50m2'
    ]
  },
  services: {
    title: 'Usługi: montaż i serwis klimatyzacji | FRIGAC',
    description:
      'Dobór i montaż klimatyzacji, uruchomienie, przeglądy i czyszczenie. Poznaj usługi FRIGAC i sprawdź, co obejmuje standardowy montaż klimatyzatora.',
    keywords: [
      'montaż klimatyzacji split',
      'serwis klimatyzacji',
      'czyszczenie klimatyzacji',
      'montaż jednostki zewnętrznej',
      'przegląd klimatyzacji'
    ]
  },
  pricing: {
    title: `Cennik montażu klimatyzacji od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Klimatyzator ze standardowym montażem do ${PRICING.standardInstallationMeters} mb od ${PRICING.installFromPLN} zł. Sprawdź cennik FRIGAC, zakres usługi i koszty dodatkowych prac.`,
    keywords: [
      'cennik montażu klimatyzacji',
      'ile kosztuje montaż klimatyzacji',
      'klimatyzacja z montażem cena',
      'montaż klimatyzacji cena Gdańsk',
      'klimatyzacja z montażem Gdańsk cena',
      'klima Gdańsk cena',
      'montaż klimatyzacji cena Gdynia',
      'montaż klimatyzacji cena Bydgoszcz'
    ]
  },
  faq: {
    title: 'Montaż klimatyzacji: najczęstsze pytania | FRIGAC',
    description:
      'Ile trwa montaż klimatyzacji, gdzie umieścić jednostkę i jaka jest gwarancja? Odpowiedzi FRIGAC na pytania o montaż i serwis w mieszkaniu i domu.',
    keywords: [
      'montaż klimatyzacji pytania',
      'ile trwa montaż klimatyzacji',
      'miejsce montażu klimatyzacji',
      'gwarancja producenta klimatyzacji'
    ]
  },
  contact: {
    title: 'Kontakt i wycena klimatyzacji | FRIGAC',
    description:
      'Zapytaj FRIGAC o wycenę montażu klimatyzacji: 735 400 610. Obsługujemy Gdańsk, Gdynię, Sopot, Bydgoszcz i Toruń. Umów bezpłatną wizytę.',
    keywords: [
      'klimatyzacja Gdańsk kontakt',
      'klima Gdańsk telefon',
      'wycena montażu klimatyzacji Gdańsk',
      'wycena montażu klimatyzacji',
      'telefon montaż klimatyzacji',
      'darmowa wycena klimatyzacji'
    ]
  },
  about: {
    title: 'O nas: certyfikowani instalatorzy klimatyzacji | FRIGAC',
    description:
      'Poznaj FRIGAC i certyfikowanych instalatorów klimatyzacji. Montujemy w Trójmieście, Bydgoszczy i Toruniu. Sprawdź nasze kwalifikacje i sposób pracy.',
    keywords: [
      'instalator klimatyzacji Gdańsk',
      'firma klimatyzacyjna Trójmiasto',
      'montaż klimatyzacji Gdańsk firma',
      'instalator klimatyzacji Bydgoszcz',
      'certyfikat f-gazy montaż klimatyzacji'
    ]
  },
  blog: {
    title: 'Porady: dobór, montaż i serwis klimatyzacji | FRIGAC',
    description:
      'Jak dobrać klimatyzację do mieszkania, ile kosztuje montaż i kiedy zlecić serwis? Praktyczne poradniki FRIGAC przygotowane przez instalatorów.',
    keywords: [
      'jaka klimatyzacja do mieszkania',
      'porady klimatyzacja',
      'serwis klimatyzacji jak często',
      'dobór mocy klimatyzacji'
    ]
  },
  bydgoszcz: {
    title: `Klimatyzacja Bydgoszcz - montaż od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Klimatyzacja z montażem od ${PRICING.installFromPLN} zł w Bydgoszczy i okolicach. Dobór urządzenia do mieszkania i domu, montaż oraz serwis. Zapytaj FRIGAC o wycenę.`,
    keywords: [
      'klimatyzacja Bydgoszcz',
      'montaż klimatyzacji Bydgoszcz',
      'montaż klimatyzacji w bloku',
      'klimatyzacja Gree Bydgoszcz',
      'klimatyzacja Fordon',
      'montaż klimatyzacji Toruń'
    ]
  },
  trojmiasto: {
    title: `Klimatyzacja Gdańsk, Gdynia, Sopot od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Montaż i serwis klimatyzacji w Gdańsku, Gdyni i Sopocie. Urządzenie z montażem od ${PRICING.installFromPLN} zł. Poznaj ofertę FRIGAC dla mieszkań i domów w Trójmieście.`,
    keywords: [
      'klimatyzacja Gdańsk',
      'klima Gdańsk',
      'montaż klimatyzacji Gdańsk',
      'klimatyzacja z montażem Gdańsk',
      'klimatyzator z montażem Gdańsk',
      'klimatyzacja Wrzeszcz',
      'klimatyzacja Przymorze',
      'klimatyzacja Zaspa',
      'klimatyzacja Oliwa',
      'klima Gdynia',
      'klimatyzacja Gdynia',
      'klimatyzacja Sopot',
      'montaż klimatyzacji w bloku Gdańsk',
      'klimatyzacja Trójmiasto'
    ]
  },
  gree: {
    title: `Klimatyzatory Gree z montażem od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Klimatyzatory Gree z montażem od ${PRICING.installFromPLN} zł. Porównaj modele, moce, ceny i funkcje. Montaż FRIGAC w Trójmieście, Bydgoszczy i Toruniu.`,
    keywords: [
      'klimatyzacja Gree Gdańsk',
      'klimatyzator Gree montaż Gdańsk',
      'klimatyzacja Gree Trójmiasto',
      'klimatyzacja Gree Bydgoszcz',
      'klimatyzacja 3.5 kw',
      'Gree split z montażem'
    ]
  },
  kaisai: {
    title: `Klimatyzatory Kaisai z montażem od ${PRICING.installFromPLN} zł | FRIGAC`,
    description:
      `Klimatyzatory Kaisai z montażem od ${PRICING.installFromPLN} zł. Poznaj modele, ceny i parametry. Dobór i montaż FRIGAC w Trójmieście, Bydgoszczy i Toruniu.`,
    keywords: [
      'klimatyzator Kaisai montaż Gdańsk',
      'klimatyzacja Kaisai Gdańsk',
      'klimatyzacja Kaisai Trójmiasto',
      'klimatyzacja Kaisai Bydgoszcz',
      'Kaisai split z montażem',
      'Kaisai ONE cena'
    ]
  },
  tools: {
    title: 'Darmowe kalkulatory klimatyzacji online | FRIGAC',
    description:
      'Darmowe kalkulatory FRIGAC: dobór mocy klimatyzacji, wycena montażu i koszt zużycia prądu. Oblicz orientacyjny wynik online, bez rejestracji.',
    keywords: [
      'kalkulator klimatyzacji',
      'kalkulator mocy klimatyzacji',
      'ile kosztuje klimatyzacja',
      'ile prądu zużywa klimatyzacja'
    ]
  },
  calcPower: {
    title: 'Kalkulator mocy klimatyzacji - jaka moc na m2? | FRIGAC',
    description:
      'Kalkulator mocy klimatyzacji online: orientacyjny dobór kW i BTU dla jednej strefy z korektą wysokości, nasłonecznienia, położenia i dużych przeszkleń.',
    keywords: [
      'kalkulator klimatyzacji',
      'kalkulator mocy klimatyzacji',
      'jaka moc klimatyzacji',
      'klimatyzacja ile kw na m2',
      'ile BTU na m2',
      'jaki klimatyzator do 50m2',
      'jaki klimatyzator do mieszkania',
      'jaki klimatyzator do domu'
    ]
  },
  calcCost: {
    title: 'Ile kosztuje klimatyzacja? Kalkulator kosztów | FRIGAC',
    description:
      'Oblicz orientacyjny koszt klimatyzacji z montażem. Podaj liczbę i metraż pomieszczeń, priorytet oraz długość instalacji w kalkulatorze FRIGAC.',
    keywords: [
      'ile kosztuje klimatyzacja',
      'kalkulator kosztów klimatyzacji',
      'klimatyzacja z montażem cena',
      'koszt klimatyzacji do mieszkania',
      'multisplit cena'
    ]
  },
  calcEnergy: {
    title: 'Ile prądu zużywa klimatyzacja? Kalkulator | FRIGAC',
    description:
      'Oszacuj zużycie prądu i koszt chłodzenia lub grzania klimatyzacją. Kalkulator FRIGAC uwzględnia model, SEER lub SCOP, metraż i cenę energii.',
    keywords: [
      'ile prądu zużywa klimatyzacja',
      'klimatyzacja koszt prądu',
      'zużycie energii klimatyzacja',
      'klimatyzacja ile kosztuje prąd',
      'SEER co to znaczy'
    ]
  },
  privacy: {
    title: 'Polityka prywatności serwisu FRIGAC',
    description:
      'Polityka prywatności serwisu FRIGAC: jakie dane przetwarzamy, w jakim celu i jakie prawa przysługują Ci zgodnie z RODO.',
    keywords: []
  },
  terms: {
    title: 'Regulamin świadczenia usług | FRIGAC',
    description:
      'Regulamin świadczenia usług montażu i serwisu klimatyzacji przez FRIGAC: zakres usług, wycena, gwarancja i reklamacje.',
    keywords: []
  }
};
