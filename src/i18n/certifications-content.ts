import type { Localized, PageHeroContent } from './page-content';

type CertificationsPageContent = Readonly<{
  hero: PageHeroContent;
  breadcrumbLabel: string;
  fGasTitle: string;
  manufacturerStatusesTitle: string;
  documentsTitle: string;
  documentsDescription: string;
}>;

export const certificationsContent = {
  pl: {
    hero: {
      eyebrow: 'Uprawnienia FRIGAC',
      title: 'Certyfikaty i statusy producentów',
      description:
        'W jednym miejscu prezentujemy posiadane certyfikaty F-gazowe, status Autoryzowanego Instalatora GREE oraz APS KAISAI.'
    },
    breadcrumbLabel: 'Certyfikaty',
    fGasTitle: 'Certyfikaty F-gazowe',
    manufacturerStatusesTitle: 'Statusy producentów',
    documentsTitle: 'Dostępne dokumenty GREE',
    documentsDescription:
      'Poniższe skany dotyczą dokumentów GREE. Nie są certyfikatami F-gazowymi ani dokumentami KAISAI.'
  },
  en: {
    hero: {
      eyebrow: 'FRIGAC credentials',
      title: 'Certificates and manufacturer statuses',
      description:
        'This page presents our F-gas certificates, GREE Authorized Installer status and KAISAI APS.'
    },
    breadcrumbLabel: 'Certificates',
    fGasTitle: 'F-gas certificates',
    manufacturerStatusesTitle: 'Manufacturer statuses',
    documentsTitle: 'Available GREE documents',
    documentsDescription:
      'The scans below relate to GREE documents. They are not F-gas certificates or KAISAI documents.'
  }
} as const satisfies Localized<CertificationsPageContent>;
