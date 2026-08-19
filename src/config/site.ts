export type LocalizedBusinessText = Readonly<{
  pl: string;
  en: string;
}>;

type SiteConfig = Readonly<{
  brandName: string;
  siteUrl: `https://${string}`;
  defaultLocale: 'pl' | 'en';
  defaultSocialImage: Readonly<{
    src: `/${string}`;
    mimeType: 'image/png';
    width: number;
    height: number;
    alt: LocalizedBusinessText;
  }>;
}>;

type PhoneNumber = `+${string}`;
type PhoneHref = `tel:${PhoneNumber}`;
type EmailHref = `mailto:${string}`;

type EmailContact = Readonly<{
  address: string;
  href: EmailHref;
}>;

type PhoneContact = Readonly<{
  id: string;
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

type CredentialDocument = Readonly<{
  src: `/${string}`;
  kind: 'gree-manufacturer-authorization';
  label: LocalizedBusinessText;
}>;

type HeldCredential = Readonly<{
  held: true;
  title: LocalizedBusinessText;
  description: LocalizedBusinessText;
}>;

type GreeAuthorizationActivity = 'design' | 'sale' | 'installation' | 'commissioning' | 'servicing';

type BusinessConfig = Readonly<{
  legalName: string;
  contact: Readonly<{
    email: EmailContact;
    phones: readonly [PhoneContact, ...PhoneContact[]];
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
      baseVariantScope: Readonly<{
        maxInstallationLengthMeters: number;
        description: LocalizedBusinessText;
        includedItems: readonly LocalizedBusinessText[];
        electricalCondition: LocalizedBusinessText;
        priceSubject: LocalizedBusinessText;
        devicePricingDescription: LocalizedBusinessText;
      }>;
      condensateDrainage: Readonly<{
        gravity: LocalizedBusinessText;
        pumpOption: Readonly<{
          available: true;
          pricing: 'additional-charge-by-selected-pump';
          description: LocalizedBusinessText;
        }>;
      }>;
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
  credentials: Readonly<{
    fGasPersonnel: HeldCredential & Readonly<{
      issuer: 'UDT';
    }>;
    fGasEntrepreneur: HeldCredential;
    manufacturerAuthorizations: Readonly<{
      gree: Readonly<{
        held: true;
        status: 'authorized-installer';
        title: LocalizedBusinessText;
        description: LocalizedBusinessText;
        productSeries: readonly string[];
        productSeriesDescription: LocalizedBusinessText;
        activities: readonly GreeAuthorizationActivity[];
        scopeDescription: LocalizedBusinessText;
        documents: Readonly<{
          publicationApproved: true;
          items: readonly CredentialDocument[];
        }>;
      }>;
      kaisai: Readonly<{
        held: true;
        status: 'aps';
        title: LocalizedBusinessText;
        description: LocalizedBusinessText;
      }>;
    }>;
    summary: LocalizedBusinessText;
  }>;
  serviceType: LocalizedBusinessText;
}>;

const INSTALLATION_PRICE_FROM_GROSS_PLN = 3499;
const BASE_INSTALLATION_LENGTH_METERS = 5;
const GREE_PRODUCT_SERIES = ['RAC', 'U-Match', 'Free Match'] as const;
const GREE_AUTHORIZATION_ACTIVITIES = [
  'design',
  'sale',
  'installation',
  'commissioning',
  'servicing'
] as const satisfies readonly GreeAuthorizationActivity[];

const createEmailContact = <const Address extends string>(address: Address) =>
  ({
    address,
    href: `mailto:${address}`
  }) as const satisfies EmailContact;

const createPhoneContact = <
  const Id extends string,
  const ContactName extends string,
  const Display extends string,
  const Tel extends PhoneNumber
>(id: Id, contactName: ContactName, display: Display, tel: Tel) =>
  ({
    id,
    contactName,
    display,
    tel,
    href: `tel:${tel}` as PhoneHref
  }) as const satisfies PhoneContact;

export const SITE = {
  brandName: 'FRIGAC',
  siteUrl: 'https://frigac.pl',
  defaultLocale: 'pl',
  defaultSocialImage: {
    src: '/social-card.png',
    mimeType: 'image/png',
    width: 1200,
    height: 630,
    alt: {
      pl: 'FRIGAC — klimatyzacja w Bydgoszczy',
      en: 'FRIGAC — air conditioning in Bydgoszcz'
    }
  }
} as const satisfies SiteConfig;

export const BUSINESS = {
  legalName: 'Frigus Hubert Maciejewski',
  contact: {
    email: createEmailContact('kontakt@frigac.pl'),
    phones: [
      createPhoneContact('hubert', 'Hubert Maciejewski', '735 400 610', '+48735400610'),
      createPhoneContact('nikodem', 'Nikodem Hirsch', '885 788 889', '+48885788889')
    ]
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
      baseVariantScope: {
        maxInstallationLengthMeters: BASE_INSTALLATION_LENGTH_METERS,
        description: {
          pl: `Cena od ${INSTALLATION_PRICE_FROM_GROSS_PLN} zł brutto dotyczy najprostszego wariantu kompleksowego montażu klimatyzacji split z trasą instalacji do ${BASE_INSTALLATION_LENGTH_METERS} m.`,
          en: `The price from PLN ${INSTALLATION_PRICE_FROM_GROSS_PLN} gross applies to the simplest complete split air-conditioning installation, with an installation run of up to ${BASE_INSTALLATION_LENGTH_METERS} m.`
        },
        includedItems: [
          {
            pl: 'montaż jednostki wewnętrznej',
            en: 'indoor unit mounting'
          },
          {
            pl: 'przepust przez ścianę',
            en: 'wall passthrough'
          },
          {
            pl: 'montaż jednostki zewnętrznej',
            en: 'outdoor unit mounting'
          },
          {
            pl: `wykonanie instalacji chłodniczej o długości do ${BASE_INSTALLATION_LENGTH_METERS} m`,
            en: `refrigerant line installation up to ${BASE_INSTALLATION_LENGTH_METERS} m long`
          },
          {
            pl: 'uruchomienie układu',
            en: 'system commissioning'
          }
        ],
        electricalCondition: {
          pl: 'Wariant zakłada łatwy dostęp do zasilania z istniejącej instalacji elektrycznej.',
          en: 'This option assumes easy access to power from the existing electrical installation.'
        },
        priceSubject: {
          pl: 'Podana cena dotyczy usługi montażu.',
          en: 'The stated price covers the installation service.'
        },
        devicePricingDescription: {
          pl: 'Urządzenie dobieramy do pomieszczenia i oczekiwań, a jego cenę uwzględniamy w wycenie całej realizacji przedstawianej przed rozpoczęciem prac.',
          en: 'We select the unit for the room and your requirements, then include its price in the quote for the complete project provided before work begins.'
        }
      },
      condensateDrainage: {
        gravity: {
          pl: 'grawitacyjne odprowadzenie skroplin',
          en: 'gravity condensate drainage'
        },
        pumpOption: {
          available: true,
          pricing: 'additional-charge-by-selected-pump',
          description: {
            pl: 'możliwość odprowadzania skroplin za pomocą pompki; pompka jest dodatkowo płatna, a koszt zależy od wybranej pompki',
            en: 'condensate drainage with a pump is also available; the pump carries an additional charge that depends on the selected pump'
          }
        }
      },
      complexVariantPricing: 'after-consultation-or-site-inspection',
      complexPriceDescription: {
        pl: 'Wszystkie bardziej złożone montaże wyceniamy po konsultacji lub oględzinach.',
        en: 'Any more complex installation is priced after a consultation or site inspection.'
      },
      fullDescription: {
        pl: `Kompleksowa usługa montażu w najprostszym wariancie, z trasą instalacji do ${BASE_INSTALLATION_LENGTH_METERS} m, kosztuje od ${INSTALLATION_PRICE_FROM_GROSS_PLN} zł brutto. Wariant zakłada łatwy dostęp do zasilania z istniejącej instalacji elektrycznej. Wszystkie bardziej złożone montaże wyceniamy po konsultacji lub oględzinach.`,
        en: `A complete installation service in the simplest option, with an installation run of up to ${BASE_INSTALLATION_LENGTH_METERS} m, starts at PLN ${INSTALLATION_PRICE_FROM_GROSS_PLN} gross. This option assumes easy access to power from the existing electrical installation. Any more complex installation is priced after a consultation or site inspection.`
      }
    },
    taxNote: {
      pl: 'Podane ceny są cenami końcowymi. Nie doliczamy podatku VAT.',
      en: 'All prices shown are final. VAT is not added.'
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
        places: [
          'Bydgoszcz',
          'Osielsko',
          'Niemcz',
          'Maksymilianowo',
          'Białe Błota',
          'Łochowo',
          'Brzoza',
          'Solec Kujawski',
          'Murowaniec',
          'Zielonka',
          'Nowa Wieś Wielka',
          'Koronowo',
          'Szubin',
          'Dobrcz',
          'Dąbrowa Chełmińska',
          'Nakło nad Notecią'
        ]
      },
      {
        id: 'trojmiasto',
        label: {
          pl: 'Trójmiasto',
          en: 'Tri-City'
        },
        places: ['Gdańsk', 'Gdynia', 'Sopot']
      }
    ],
    summary: {
      pl: 'Bydgoszcz i okolice oraz Trójmiasto',
      en: 'Bydgoszcz and surrounding areas, and the Tri-City'
    }
  },
  travel: {
    billing: 'included-in-margin',
    note: {
      pl: 'Dojazd jest wliczony w cenę.',
      en: 'Travel is included in the price.'
    }
  },
  credentials: {
    fGasPersonnel: {
      held: true,
      issuer: 'UDT',
      title: {
        pl: 'Certyfikat F-gazowy personelu',
        en: 'Personnel F-gas certificate'
      },
      description: {
        pl: 'Posiadamy certyfikat F-gazowy personelu wydany przez UDT.',
        en: 'We hold a personnel F-gas certificate issued by UDT.'
      }
    },
    fGasEntrepreneur: {
      held: true,
      title: {
        pl: 'Certyfikat F-gazowy przedsiębiorcy',
        en: 'Business F-gas certificate'
      },
      description: {
        pl: 'Posiadamy certyfikat F-gazowy przedsiębiorcy.',
        en: 'The business holds an F-gas certificate.'
      }
    },
    manufacturerAuthorizations: {
      gree: {
        held: true,
        status: 'authorized-installer',
        title: {
          pl: 'Autoryzowany Instalator GREE',
          en: 'GREE Authorized Installer'
        },
        description: {
          pl: 'Posiadamy status Autoryzowanego Instalatora GREE.',
          en: 'We hold GREE Authorized Installer status.'
        },
        productSeries: GREE_PRODUCT_SERIES,
        productSeriesDescription: {
          pl: `Autoryzacja obejmuje urządzenia serii ${GREE_PRODUCT_SERIES.join(', ')}.`,
          en: `The authorization covers the ${GREE_PRODUCT_SERIES.join(', ')} product series.`
        },
        activities: GREE_AUTHORIZATION_ACTIVITIES,
        scopeDescription: {
          pl: 'Autoryzacja obejmuje projektowanie, sprzedaż, montaż, uruchamianie i serwisowanie urządzeń objętych autoryzacją.',
          en: 'The authorization covers the design, sale, installation, commissioning and servicing of the authorized equipment.'
        },
        documents: {
          publicationApproved: true,
          items: [
            {
              src: '/photos/certyfikat-1.jpg',
              kind: 'gree-manufacturer-authorization',
              label: {
                pl: 'Skan autoryzacji producenta GREE — dokument 1',
                en: 'GREE manufacturer authorization scan — document 1'
              }
            },
            {
              src: '/photos/certyfikat-2.jpg',
              kind: 'gree-manufacturer-authorization',
              label: {
                pl: 'Skan autoryzacji producenta GREE — dokument 2',
                en: 'GREE manufacturer authorization scan — document 2'
              }
            }
          ]
        }
      },
      kaisai: {
        held: true,
        status: 'aps',
        title: {
          pl: 'APS KAISAI',
          en: 'KAISAI APS'
        },
        description: {
          pl: 'Posiadamy APS KAISAI.',
          en: 'We hold KAISAI APS status.'
        }
      }
    },
    summary: {
      pl: 'Certyfikat F-gazowy personelu, certyfikat F-gazowy przedsiębiorcy, status Autoryzowanego Instalatora GREE i APS KAISAI.',
      en: 'Personnel F-gas certificate, business F-gas certificate, GREE Authorized Installer status and KAISAI APS.'
    }
  },
  serviceType: {
    pl: 'Montaż klimatyzacji – Bydgoszcz i okolice',
    en: 'Air conditioning installation in Bydgoszcz and surrounding areas'
  }
} as const satisfies BusinessConfig;

export const CONTACT_PHONES = BUSINESS.contact.phones;
export const CONTACT_PHONE = CONTACT_PHONES[0];

export const ANALYTICS = {
  cloudflare: {
    enabled: false,
    token: ''
  }
} as const;
