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
  { href: routes.tools, label: 'Narzędzia' },
  { href: routes.about, label: 'O nas' },
  { href: routes.blog, label: 'Porady' },
  { href: routes.faq, label: 'FAQ' },
  { href: routes.contact, label: 'Kontakt' }
];

export const labels = {
  callNow: 'Zadzwoń po darmową wycenę',
  callShort: 'Zadzwoń teraz',
  freeQuote: 'Darmowa wycena',
  navAria: 'Główna nawigacja',
  phoneAria: 'Zadzwoń do FRIGAC',
  footerHours: 'Godziny pracy',
  footerInfo: 'Montaż i serwis klimatyzacji w Bydgoszczy, Toruniu i Trójmieście.',
  stickyCall: 'Zadzwoń: darmowa wycena',
  seeServices: 'Zobacz zakres usług',
  readPricing: 'Sprawdź cennik',
  privacy: 'Polityka prywatności',
  terms: 'Regulamin'
} as const;

export const pageMeta: Record<PageKey, PageMeta> = {
  home: {
    title: 'Klimatyzacja Bydgoszcz i Gdańsk - montaż od 3499 zł | FRIGAC',
    description:
      'Klimatyzacja Bydgoszcz, Gdańsk, Gdynia, Sopot i Toruń. Montaż klimatyzacji z urządzeniem od 3499 zł, także w bloku. Czysty montaż w 1 dzień, 5 lat gwarancji. Zadzwoń po darmową wycenę.',
    keywords: [
      'klimatyzacja Bydgoszcz',
      'montaż klimatyzacji Bydgoszcz',
      'klimatyzacja Gdańsk',
      'montaż klimatyzacji Gdańsk',
      'klimatyzacja Gdynia',
      'klimatyzacja Sopot',
      'montaż klimatyzacji w bloku',
      'klimatyzacja do mieszkania 50m2'
    ]
  },
  services: {
    title: 'Usługi: montaż i serwis klimatyzacji | FRIGAC',
    description:
      'Pełny zakres usług FRIGAC: dobór klimatyzatora, montaż jednostki wewnętrznej i zewnętrznej, uruchomienie układu oraz przeglądy i czyszczenie. Sprawdź, co dokładnie obejmuje montaż.',
    keywords: [
      'montaż klimatyzacji split',
      'serwis klimatyzacji',
      'czyszczenie klimatyzacji',
      'montaż jednostki zewnętrznej',
      'przegląd klimatyzacji'
    ]
  },
  pricing: {
    title: 'Cennik montażu klimatyzacji od 3499 zł | FRIGAC',
    description:
      'Ile kosztuje montaż klimatyzacji? Klimatyzator z montażem od 3499 zł, dojazd w cenie, wycena telefoniczna w kilka minut. Zobacz, co wpływa na finalną cenę montażu klimatyzacji.',
    keywords: [
      'cennik montażu klimatyzacji',
      'ile kosztuje montaż klimatyzacji',
      'klimatyzacja z montażem cena',
      'montaż klimatyzacji cena Bydgoszcz',
      'montaż klimatyzacji cena Gdańsk'
    ]
  },
  faq: {
    title: 'Montaż klimatyzacji: najczęstsze pytania | FRIGAC',
    description:
      'Ile trwa montaż klimatyzacji? Czy potrzebna jest zgoda wspólnoty? Jaka jest gwarancja? Odpowiadamy na najczęstsze pytania o montaż i serwis klimatyzacji w mieszkaniu i domu.',
    keywords: [
      'montaż klimatyzacji pytania',
      'ile trwa montaż klimatyzacji',
      'zgoda wspólnoty klimatyzacja',
      'gwarancja na montaż klimatyzacji'
    ]
  },
  contact: {
    title: 'Kontakt i darmowa wycena klimatyzacji | FRIGAC',
    description:
      'Zadzwoń po darmową wycenę montażu klimatyzacji: 735 400 610. Działamy w Bydgoszczy, Toruniu i Trójmieście. Wycena telefoniczna w kilka minut, montaż w dogodnym terminie.',
    keywords: [
      'klimatyzacja Bydgoszcz kontakt',
      'wycena montażu klimatyzacji',
      'telefon montaż klimatyzacji',
      'darmowa wycena klimatyzacji'
    ]
  },
  about: {
    title: 'O nas: certyfikowani instalatorzy klimatyzacji | FRIGAC',
    description:
      'Poznaj zespół FRIGAC: certyfikowani instalatorzy klimatyzacji (F-gazy) z Bydgoszczy i Trójmiasta. Ponad 50 zamontowanych klimatyzacji, czysty montaż i 5 lat gwarancji.',
    keywords: [
      'instalator klimatyzacji Bydgoszcz',
      'firma klimatyzacyjna Trójmiasto',
      'certyfikat f-gazy montaż klimatyzacji'
    ]
  },
  blog: {
    title: 'Porady: dobór, montaż i serwis klimatyzacji | FRIGAC',
    description:
      'Praktyczne porady o klimatyzacji: jak dobrać moc urządzenia do mieszkania, ile kosztuje montaż, jak często serwisować klimatyzację. Wiedza od certyfikowanych instalatorów.',
    keywords: [
      'jaka klimatyzacja do mieszkania',
      'porady klimatyzacja',
      'serwis klimatyzacji jak często',
      'dobór mocy klimatyzacji'
    ]
  },
  bydgoszcz: {
    title: 'Klimatyzacja Bydgoszcz - montaż klimatyzacji od 3499 zł | FRIGAC',
    description:
      'Klimatyzacja Bydgoszcz: montaż klimatyzacji w mieszkaniu, bloku i domu - Fordon, Osowa Góra, Szwederowo, Osielsko, Białe Błota, Toruń. Klimatyzator z montażem od 3499 zł, 5 lat gwarancji.',
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
    title: 'Klimatyzacja Gdańsk, Gdynia, Sopot - montaż | FRIGAC',
    description:
      'Klimatyzacja Gdańsk, Gdynia i Sopot: montaż klimatyzacji w apartamentach, mieszkaniach w bloku i domach. Klimatyzator z montażem od 3499 zł, czysty montaż w 1 dzień, 5 lat gwarancji.',
    keywords: [
      'klimatyzacja Gdańsk',
      'montaż klimatyzacji Gdańsk',
      'klimatyzacja Gdynia',
      'klimatyzacja Sopot',
      'montaż klimatyzacji w bloku',
      'klimatyzacja Trójmiasto'
    ]
  },
  gree: {
    title: 'Klimatyzatory Gree z montażem od 3499 zł | FRIGAC',
    description:
      'Klimatyzacja Gree Bydgoszcz, Toruń i Trójmiasto: montujemy ciche jednostki split Gree z Wi-Fi, grzaniem zimą i wysoką klasą energetyczną. Gree z montażem od 3499 zł, 5 lat gwarancji na montaż.',
    keywords: [
      'klimatyzacja Gree Bydgoszcz',
      'klimatyzator Gree montaż',
      'klimatyzacja Gree Trójmiasto',
      'klimatyzacja 3.5 kw',
      'Gree split z montażem'
    ]
  },
  kaisai: {
    title: 'Klimatyzatory Kaisai z montażem od 3499 zł | FRIGAC',
    description:
      'Klimatyzacja Kaisai Bydgoszcz, Toruń i Trójmiasto: montujemy ścienne jednostki split Kaisai ze sterowaniem Wi-Fi i grzaniem zimą. Kaisai z montażem od 3499 zł, 5 lat gwarancji na montaż.',
    keywords: [
      'klimatyzator Kaisai montaż',
      'klimatyzacja Kaisai Bydgoszcz',
      'klimatyzacja Kaisai Trójmiasto',
      'Kaisai split z montażem',
      'Kaisai ONE cena'
    ]
  },
  tools: {
    title: 'Darmowe kalkulatory klimatyzacji online | FRIGAC',
    description:
      'Bezpłatne narzędzia FRIGAC: kalkulator mocy klimatyzacji (kW i BTU na m2), kalkulator kosztów montażu oraz kalkulator zużycia prądu przez klimatyzację. Bez rejestracji, z raportem do pobrania.',
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
      'Kalkulator klimatyzacji online: policz, jaka moc klimatyzacji do mieszkania, domu lub biura. Ile kW i BTU na m2, poprawka na nasłonecznienie i piętro, rekomendowane urządzenie i koszt montażu.',
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
      'Kalkulator kosztów klimatyzacji: policz orientacyjny koszt klimatyzacji z montażem dla mieszkania lub domu - split i multisplit, standard i premium - oraz szacunkowy koszt energii na sezon.',
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
      'Kalkulator zużycia prądu przez klimatyzację: podaj moc, SEER, godziny pracy i cenę prądu, a policzymy koszt chłodzenia na dzień, miesiąc i cały sezon. Sprawdź, ile naprawdę kosztuje klimatyzacja.',
    keywords: [
      'ile prądu zużywa klimatyzacja',
      'klimatyzacja koszt prądu',
      'zużycie energii klimatyzacja',
      'klimatyzacja ile kosztuje prąd',
      'SEER co to znaczy'
    ]
  },
  privacy: {
    title: 'Polityka prywatności | FRIGAC',
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
