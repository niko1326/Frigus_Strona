export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  datePublished: string;
  excerpt: string;
};

export const ARTICLES: Article[] = [
  {
    slug: 'jaka-klimatyzacja-do-mieszkania',
    title: 'Jaką klimatyzację wybrać do mieszkania?',
    metaTitle: 'Jaka klimatyzacja do mieszkania? Poradnik | FRIGAC',
    description:
      'Jaką klimatyzację wybrać do mieszkania w bloku? Podpowiadamy, jak dobrać moc do metrażu, na co zwrócić uwagę przy wyborze urządzenia i o jakich formalnościach pamiętać.',
    keywords: [
      'jaka klimatyzacja do mieszkania',
      'klimatyzacja do mieszkania w bloku',
      'dobór mocy klimatyzacji',
      'klimatyzacja split do mieszkania'
    ],
    datePublished: '2026-08-20',
    excerpt:
      'Moc dopasowana do metrażu, cicha praca i zgoda wspólnoty: trzy rzeczy, od których warto zacząć wybór klimatyzacji do mieszkania.'
  },
  {
    slug: 'ile-kosztuje-montaz-klimatyzacji',
    title: 'Ile kosztuje montaż klimatyzacji w 2026 roku?',
    metaTitle: 'Ile kosztuje montaż klimatyzacji w 2026? | FRIGAC',
    description:
      'Ile kosztuje montaż klimatyzacji z urządzeniem w 2026 roku? Realne widełki cenowe, składniki ceny i podpowiedzi, jak nie przepłacić za montaż klimatyzacji w mieszkaniu lub domu.',
    keywords: [
      'ile kosztuje montaż klimatyzacji',
      'cena montażu klimatyzacji 2026',
      'klimatyzacja z montażem cena',
      'koszt klimatyzacji do mieszkania'
    ],
    datePublished: '2026-08-27',
    excerpt:
      'Klimatyzator z montażem zaczyna się od około 3500 zł. Sprawdź, co dokładnie składa się na tę cenę i kiedy montaż może kosztować więcej.'
  },
  {
    slug: 'jak-czesto-serwisowac-klimatyzacje',
    title: 'Jak często serwisować klimatyzację?',
    metaTitle: 'Jak często serwisować klimatyzację? | FRIGAC',
    description:
      'Jak często robić przegląd klimatyzacji i co grozi za jego brak? Wyjaśniamy, co obejmuje serwis klimatyzacji, ile kosztuje i dlaczego warto go robić przed sezonem letnim.',
    keywords: [
      'serwis klimatyzacji jak często',
      'przegląd klimatyzacji',
      'czyszczenie klimatyzacji',
      'serwis klimatyzacji cena'
    ],
    datePublished: '2026-09-01',
    excerpt:
      'Raz w roku to rozsądne minimum. Zobacz, co dokładnie dzieje się podczas przeglądu i po czym poznać, że klimatyzacja wymaga czyszczenia.'
  }
];
