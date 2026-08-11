export const SITE = {
  brandName: 'FRIGAC',
  siteUrl: 'https://frigac.pl',
  defaultLocale: 'pl'
} as const;

export const PHONE_DISPLAY = '735 400 610';
export const PHONE_TEL = '+48735400610';

export const SERVICE_AREAS = ['Bydgoszcz', 'Gdańsk', 'Gdynia', 'Sopot', 'okolice'] as const;
export const SERVICE_AREAS_EN = ['Bydgoszcz', 'Gdańsk', 'Gdynia', 'Sopot', 'nearby towns'] as const;

export const PRICING = {
  installFromPLN: 3499,
  installToPLN: 25,
  pricingNotePL:
    'Cena montażu zależy od długości instalacji i warunków technicznych. Na ten moment realizujemy usługę bez VAT dla klientów indywidualnych (brutto = netto).',
  pricingNoteEN:
    'Installation cost depends on line length and technical conditions. At the moment we operate without VAT for individual clients (gross = net).',
  travelIncludedPL: 'Dojazd w obszarze działania: w cenie.',
  travelIncludedEN: 'Travel within service area: included.'
} as const;

export const HOURS = {
  weekdays: '08:00-18:00',
  saturday: '09:00-14:00',
  sundayPL: 'Po wcześniejszym kontakcie',
  sundayEN: 'By prior arrangement'
} as const;

export const BUSINESS = {
  teamSize: 2,
  warrantyYears: 2,
  serviceTypePL: 'Montaż klimatyzacji typu split',
  serviceTypeEN: 'Split air conditioner installation',
  certificationsPL: 'F-gazy: personel + przedsiębiorca',
  certificationsEN: 'F-gas: personnel + company certificates'
} as const;

export const ANALYTICS = {
  cloudflare: {
    enabled: false,
    token: ''
  }
} as const;
