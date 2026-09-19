export interface Certificate {
  id: string;
  title: string;
  holder: string;
  image: string;
  document: string;
  width: number;
  height: number;
  alt: string;
}

export const GREE_CERTIFICATES: Certificate[] = [
  {
    id: 'gree-hubert',
    title: 'Certyfikat autoryzacyjny GREE',
    holder: 'Hubert Maciejewski',
    image: '/certificates/gree-hubert.webp',
    document: '/certificates/gree-hubert.pdf',
    width: 2105,
    height: 1489,
    alt: 'Certyfikat autoryzacyjny GREE Huberta Maciejewskiego – serie RAC, U-Match i Free Match'
  },
  {
    id: 'gree-nikodem',
    title: 'Certyfikat autoryzacyjny GREE',
    holder: 'Nikodem Hirsch',
    image: '/certificates/gree-nikodem.webp',
    document: '/certificates/gree-nikodem.pdf',
    width: 2105,
    height: 1489,
    alt: 'Certyfikat autoryzacyjny GREE Nikodema Hirscha – serie RAC, U-Match i Free Match'
  }
];

export const KAISAI_CERTIFICATE: Certificate = {
  id: 'kaisai',
  title: 'Autoryzowany Partner Serwisowy KAISAI',
  holder: 'Certyfikat Partnera Serwisowego KAISAI',
  image: '/certificates/kaisai.webp',
  document: '/certificates/kaisai.pdf',
  width: 1489,
  height: 2105,
  alt: 'Certyfikat Autoryzowanego Partnera Serwisowego KAISAI SPLIT/MULTI przyznany firmie Frigus Hubert Maciejewski'
};

// Wyłącznie spłaszczone obrazy z zamaskowaną datą urodzenia; bez oryginalnych PDF.
export const FGAS_CERTIFICATES: Certificate[] = [
  {
    id: 'fgaz-hubert',
    title: 'Certyfikat dla personelu UDT',
    holder: 'Hubert Maciejewski',
    image: '/certificates/fgaz-hubert.webp',
    document: '/certificates/fgaz-hubert.webp',
    width: 1050,
    height: 694,
    alt: 'Certyfikat F-gazowy dla personelu UDT – Hubert Maciejewski, data urodzenia zamaskowana'
  },
  {
    id: 'fgaz-nikodem',
    title: 'Certyfikat dla personelu UDT',
    holder: 'Nikodem Hirsch',
    image: '/certificates/fgaz-nikodem.webp',
    document: '/certificates/fgaz-nikodem.webp',
    width: 1010,
    height: 660,
    alt: 'Certyfikat F-gazowy dla personelu UDT – Nikodem Hirsch, data urodzenia zamaskowana'
  }
];
