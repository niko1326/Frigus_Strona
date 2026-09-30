export const SITE = {
  brandName: 'FRIGAC',
  siteUrl: 'https://frigac.pl',
  defaultLocale: 'pl'
} as const;

export const PHONE_DISPLAY = '735 400 610';
export const EMAIL = 'kontakt@frigac.pl';
export const PHONE_TEL = '+48735400610';

// Dwa numery kontaktowe - każdy instalator ma własny.
export const CONTACTS = [
  { name: 'Hubert', display: '735 400 610', tel: '+48735400610' },
  { name: 'Nikodem', display: '885 788 889', tel: '+48885788889' }
] as const;

export const SERVICE_AREAS = [
  'Gdańsk',
  'Gdynia',
  'Sopot',
  'Trójmiasto',
  'Bydgoszcz',
  'Toruń',
  'okolice'
] as const;

// Dane firmowe do stopki i dokumentów prawnych. Pola puste nie są renderowane.
export const COMPANY = {
  legalName: 'Frigus Hubert Maciejewski',
  nip: '5543045506',
  address: ''
} as const;

export const PRICING = {
  installFromPLN: 3499,
  standardInstallationMeters: 3,
  extraInstallationMeterFromPLN: 130,
  condensatePumpFromPLN: 350,
  energyMeterFromPLN: 250,
  pricingNote:
    'Podana cena obejmuje klimatyzator z montażem w standardowym zakresie. Finalna wycena zależy od długości instalacji i warunków technicznych. Na ten moment realizujemy usługę bez VAT dla klientów indywidualnych (brutto = netto).',
  travelIncluded:
    'Dojazd w Gdańsku, Gdyni, Sopocie, Bydgoszczy i Toruniu oraz w okolicach po wcześniejszym uzgodnieniu.'
} as const;

export const HOURS = {
  daily: '08:00-18:00',
  dailyLabel: 'Codziennie'
} as const;

export const BUSINESS = {
  teamSize: 2,
  serviceType: 'Montaż klimatyzacji typu split',
  certifications: 'Certyfikaty F-gazowe: personel i przedsiębiorca'
} as const;

export const STATS = [
  { value: '20+', label: 'modeli do wyboru' },
  { value: '100%', label: 'zadowolonych klientów' },
  { value: '5 lat', label: 'gwarancji producenta na urządzenie' },
  { value: '30+', label: 'miejscowości w zasięgu realizacji' }
] as const;

export const ANALYTICS = {
  // Google Analytics 4: wklej identyfikator pomiaru (G-XXXXXXXXXX)
  // i ustaw enabled: true.
  ga4: {
    enabled: true,
    measurementId: 'G-LHYC8S5TBY'
  }
} as const;

export const VERIFICATION = {
  // Google Search Console: wklej wartość meta tagu weryfikacyjnego
  // (content z <meta name="google-site-verification" ...>).
  googleSiteVerification: ''
} as const;
