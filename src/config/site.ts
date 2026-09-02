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
  'Bydgoszcz',
  'Toruń',
  'Gdańsk',
  'Gdynia',
  'Sopot',
  'okolice'
] as const;

// Dane firmowe do stopki i regulaminu. Pola puste nie są renderowane.
// Uzupełnij NIP/adres, gdy będą znane.
export const COMPANY = {
  legalName: 'FRIGAC',
  nip: '',
  address: ''
} as const;

export const PRICING = {
  installFromPLN: 3499,
  pricingNote:
    'Podana cena obejmuje klimatyzator z montażem w standardowym zakresie. Finalna wycena zależy od długości instalacji i warunków technicznych. Na ten moment realizujemy usługę bez VAT dla klientów indywidualnych (brutto = netto).',
  travelIncluded: 'Dojazd w obszarze działania: w cenie.'
} as const;

export const HOURS = {
  daily: '08:00-18:00',
  dailyLabel: 'Codziennie'
} as const;

export const BUSINESS = {
  teamSize: 2,
  warrantyYears: 5,
  serviceType: 'Montaż klimatyzacji typu split',
  certifications: 'Certyfikaty F-gazowe: personel i przedsiębiorca'
} as const;

export const STATS = [
  { value: '50+', label: 'zamontowanych klimatyzacji' },
  { value: '100%', label: 'zadowolonych klientów' },
  { value: '5 lat', label: 'gwarancji na montaż' },
  { value: '30+', label: 'miejscowości w zasięgu realizacji' }
] as const;

export const ANALYTICS = {
  // Google Analytics 4: wklej identyfikator pomiaru (G-XXXXXXXXXX)
  // i ustaw enabled: true.
  ga4: {
    enabled: false,
    measurementId: ''
  }
} as const;

export const VERIFICATION = {
  // Google Search Console: wklej wartość meta tagu weryfikacyjnego
  // (content z <meta name="google-site-verification" ...>).
  googleSiteVerification: ''
} as const;
