export type LocalizedBusinessText = Readonly<{
  pl: string;
  en: string;
}>;

type SiteConfig = Readonly<{
  brandName: string;
  siteUrl: `https://${string}`;
  defaultLocale: 'pl' | 'en';
}>;

type PhoneNumber = `+${string}`;
type PhoneHref = `tel:${PhoneNumber}`;
type EmailHref = `mailto:${string}`;

type EmailContact = Readonly<{
  address: string;
  href: EmailHref;
}>;

type PhoneContact = Readonly<{
  contactName: string;
  display: string;
  tel: PhoneNumber;
  href: PhoneHref;
}>;

type ServiceRegion = Readonly<{
  id: string;
  label: LocalizedBusinessText;
  places: readonly string[];
}>;

type CertificateScan = Readonly<{
  src: `/${string}`;
  type: 'gree-authorization';
  alt: LocalizedBusinessText;
}>;

type BusinessConfig = Readonly<{
  legalName: string;
  contact: Readonly<{
    email: EmailContact;
    phone: PhoneContact;
  }>;
  availability: Readonly<{
    mode: 'by-appointment';
    label: LocalizedBusinessText;
  }>;
  pricing: Readonly<{
    currency: 'PLN';
    fromGrossPLN: number;
    label: LocalizedBusinessText;
    installationService: Readonly<{
      kind: 'complete-installation-service';
      name: LocalizedBusinessText;
      baseVariant: 'simplest-installation';
      baseVariantLabel: LocalizedBusinessText;
      complexVariantPricing: 'after-consultation-or-site-inspection';
      complexPriceDescription: LocalizedBusinessText;
      fullDescription: LocalizedBusinessText;
    }>;
    taxNote: LocalizedBusinessText;
  }>;
  warranty: Readonly<{
    type: 'manufacturer';
    period: 'varies-by-manufacturer';
    description: LocalizedBusinessText;
  }>;
  serviceArea: Readonly<{
    regions: readonly ServiceRegion[];
    summary: LocalizedBusinessText;
  }>;
  travel: Readonly<{
    billing: 'included-in-margin';
    note: LocalizedBusinessText;
  }>;
  certifications: Readonly<{
    fGasPersonnel: true;
    fGasCompany: true;
    greeAuthorization: true;
    summary: LocalizedBusinessText;
    scans: Readonly<{
      publicationApproved: true;
      items: readonly CertificateScan[];
    }>;
  }>;
  serviceType: LocalizedBusinessText;
}>;

const INSTALLATION_PRICE_FROM_GROSS_PLN = 3499;

const createEmailContact = <const Address extends string>(address: Address) =>
  ({
    address,
    href: `mailto:${address}`
  }) as const satisfies EmailContact;

const createPhoneContact = <
  const ContactName extends string,
  const Display extends string,
  const Tel extends PhoneNumber
>(contactName: ContactName, display: Display, tel: Tel) =>
  ({
    contactName,
    display,
    tel,
    href: `tel:${tel}` as PhoneHref
  }) as const satisfies PhoneContact;

export const SITE = {
  brandName: 'FRIGAC',
  siteUrl: 'https://frigac.pl',
  defaultLocale: 'pl'
} as const satisfies SiteConfig;

export const BUSINESS = {
  legalName: 'Frigus Hubert Maciejewski',
  contact: {
    email: createEmailContact('kontakt@frigac.pl'),
    phone: createPhoneContact('Hubert Maciejewski', '735 400 610', '+48735400610')
  },
  availability: {
    mode: 'by-appointment',
    label: {
      pl: 'Po wcześniejszym umówieniu',
      en: 'By appointment'
    }
  },
  pricing: {
    currency: 'PLN',
    fromGrossPLN: INSTALLATION_PRICE_FROM_GROSS_PLN,
    label: {
      pl: `od ${INSTALLATION_PRICE_FROM_GROSS_PLN} zł brutto`,
      en: `from PLN ${INSTALLATION_PRICE_FROM_GROSS_PLN} gross`
    },
    installationService: {
      kind: 'complete-installation-service',
      name: {
        pl: 'Kompleksowa usługa montażu',
        en: 'Complete installation service'
      },
      baseVariant: 'simplest-installation',
      baseVariantLabel: {
        pl: 'najprostszy wariant montażu',
        en: 'the simplest installation option'
      },
      complexVariantPricing: 'after-consultation-or-site-inspection',
      complexPriceDescription: {
        pl: 'Wszystkie bardziej złożone montaże wyceniamy po konsultacji lub oględzinach.',
        en: 'Any more complex installation is priced after a consultation or site inspection.'
      },
      fullDescription: {
        pl: `Kompleksowa usługa montażu kosztuje od ${INSTALLATION_PRICE_FROM_GROSS_PLN} zł brutto w najprostszym wariancie. Wszystkie bardziej złożone montaże wyceniamy po konsultacji lub oględzinach.`,
        en: `A complete installation service starts at PLN ${INSTALLATION_PRICE_FROM_GROSS_PLN} gross for the simplest installation option. Any more complex installation is priced after a consultation or site inspection.`
      }
    },
    taxNote: {
      pl: 'Jesteśmy na ryczałcie, dlatego dla klienta cena netto = brutto.',
      en: 'We use lump-sum taxation, so for the customer the net price equals the gross price.'
    }
  },
  warranty: {
    type: 'manufacturer',
    period: 'varies-by-manufacturer',
    description: {
      pl: 'Gwarancja producenta; okres zależy od producenta.',
      en: 'Manufacturer warranty; the warranty period depends on the manufacturer.'
    }
  },
  serviceArea: {
    regions: [
      {
        id: 'bydgoszcz',
        label: {
          pl: 'Bydgoszcz i okolice',
          en: 'Bydgoszcz and nearby areas'
        },
        places: ['Bydgoszcz']
      },
      {
        id: 'trojmiasto',
        label: {
          pl: 'Gdańsk i Trójmiasto',
          en: 'Gdańsk and the Tri-City area'
        },
        places: ['Gdańsk', 'Gdynia', 'Sopot']
      }
    ],
    summary: {
      pl: 'Bydgoszcz i okolice oraz Gdańsk i Trójmiasto',
      en: 'Bydgoszcz and nearby areas, plus Gdańsk and the Tri-City area'
    }
  },
  travel: {
    billing: 'included-in-margin',
    note: {
      pl: 'Dojazd jest wliczony w marżę.',
      en: 'Travel is included in the margin.'
    }
  },
  certifications: {
    fGasPersonnel: true,
    fGasCompany: true,
    greeAuthorization: true,
    summary: {
      pl: 'Certyfikat F-gaz posiada personel i przedsiębiorca. Posiadamy również autoryzację GREE.',
      en: 'Both personnel and the company hold F-gas certification. We also hold GREE authorization.'
    },
    scans: {
      publicationApproved: true,
      items: [
        {
          src: '/photos/certyfikat-1.jpg',
          type: 'gree-authorization',
          alt: {
            pl: 'Skan autoryzacji GREE nr 1',
            en: 'GREE authorization scan 1'
          }
        },
        {
          src: '/photos/certyfikat-2.jpg',
          type: 'gree-authorization',
          alt: {
            pl: 'Skan autoryzacji GREE nr 2',
            en: 'GREE authorization scan 2'
          }
        }
      ]
    }
  },
  serviceType: {
    pl: 'Montaż klimatyzacji typu split',
    en: 'Split air conditioner installation'
  }
} as const satisfies BusinessConfig;

export const CONTACT_PHONE = BUSINESS.contact.phone;

export const ANALYTICS = {
  cloudflare: {
    enabled: false,
    token: ''
  }
} as const;
