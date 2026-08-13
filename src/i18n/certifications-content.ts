import type { Localized, PageHeroContent } from './page-content';

type CertificationsPageContent = Readonly<{
  hero: PageHeroContent;
  breadcrumbLabel: string;
  fGasTitle: string;
  apsTitle: string;
  documentsTitle: string;
  documentsDescription: string;
}>;

export const certificationsContent = {
  pl: {
    hero: {
      eyebrow: 'Uprawnienia FRIGAC',
      title: 'Certyfikaty i statusy producentów',
      description:
        'W jednym miejscu prezentujemy posiadane certyfikaty F-gazowe oraz statusy APS marek GREE i KAISAI.'
    },
    breadcrumbLabel: 'Certyfikaty',
    fGasTitle: 'Certyfikaty F-gazowe',
    apsTitle: 'Statusy APS producentów',
    documentsTitle: 'Dostępne dokumenty GREE',
    documentsDescription:
      'Poniższe skany dotyczą dokumentów GREE. Nie są certyfikatami F-gazowymi ani dokumentami KAISAI.'
  },
  en: {
    hero: {
      eyebrow: 'FRIGAC credentials',
      title: 'Certificates and manufacturer statuses',
      description:
        'This page presents our F-gas certificates and the APS statuses held for the GREE and KAISAI brands.'
    },
    breadcrumbLabel: 'Certificates',
    fGasTitle: 'F-gas certificates',
    apsTitle: 'Manufacturer APS statuses',
    documentsTitle: 'Available GREE documents',
    documentsDescription:
      'The scans below relate to GREE documents. They are not F-gas certificates or KAISAI documents.'
  }
} as const satisfies Localized<CertificationsPageContent>;
