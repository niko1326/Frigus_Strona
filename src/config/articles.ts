export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  datePublished: string;
  excerpt: string;
  /** Autor wpisu; brak = artykuł firmowy (FRIGAC). */
  author?: string;
};

export const ARTICLES: Article[] = [
  {
    slug: 'pompka-skroplin-do-klimatyzacji',
    title: 'Pompka skroplin do klimatyzacji – kiedy jest potrzebna i ile kosztuje?',
    metaTitle: 'Pompka skroplin do klimatyzacji – kiedy potrzebna? | FRIGAC',
    description:
      'Kiedy potrzebna jest pompka skroplin do klimatyzacji, jak działa i czy jest głośna? Wyjaśniamy zasady odpływu skroplin oraz koszt montażu pompki.',
    keywords: [
      'pompka skroplin do klimatyzacji',
      'pompka do klimatyzacji',
      'odprowadzanie skroplin z klimatyzacji',
      'montaż pompki skroplin'
    ],
    datePublished: '2026-09-12',
    excerpt:
      'Grawitacyjny odpływ jest najprostszy, ale nie zawsze możliwy. Sprawdź, kiedy potrzebna jest pompka skroplin, jak pracuje i ile kosztuje jej montaż.',
    author: 'Nikodem Hirsch'
  },
  {
    slug: 'pomiar-zuzycia-pradu-klimatyzacji-wifi',
    title: 'Pomiar zużycia prądu klimatyzacji przez Wi-Fi – jak działa i czy warto?',
    metaTitle: 'Pomiar zużycia prądu klimatyzacji przez Wi-Fi | FRIGAC',
    description:
      'Jak mierzyć zużycie prądu klimatyzacji przez Wi-Fi? Wyjaśniamy różnicę między mocą chłodniczą a poborem prądu, działanie modułu i jego koszt.',
    keywords: [
      'pomiar zużycia energii klimatyzacji',
      'pomiar prądu klimatyzacji',
      'ile prądu zużywa klimatyzacja',
      'klimatyzacja Wi-Fi'
    ],
    datePublished: '2026-09-30',
    excerpt:
      'Moc chłodnicza 3,5 kW nie oznacza poboru 3,5 kW prądu. Zobacz, co mierzy moduł energii Wi-Fi i kiedy taki podgląd jest naprawdę przydatny.',
    author: 'Nikodem Hirsch'
  },
  {
    slug: 'jaka-klimatyzacja-do-mieszkania',
    title: 'Jaką klimatyzację wybrać do mieszkania?',
    metaTitle: 'Jaka klimatyzacja do mieszkania? Poradnik | FRIGAC',
    description:
      'Jaką klimatyzację wybrać do mieszkania w bloku? Podpowiadamy, jak dobrać moc do metrażu, na co zwrócić uwagę przy wyborze urządzenia i jak zaplanować miejsce montażu.',
    keywords: [
      'jaka klimatyzacja do mieszkania',
      'klimatyzacja do mieszkania w bloku',
      'dobór mocy klimatyzacji',
      'klimatyzacja split do mieszkania'
    ],
    datePublished: '2026-08-20',
    excerpt:
      'Moc dopasowana do warunków mieszkania, cicha praca i miejsce montażu: trzy rzeczy, od których warto zacząć wybór klimatyzacji do mieszkania.'
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
      'Przy typowym użytkowaniu coroczny przegląd jest rozsądnym punktem wyjścia. Sprawdź, jak dopasować częstotliwość do pracy urządzenia i warunków gwarancji producenta.'
  },
  {
    slug: 'wplyw-klimatyzacji-na-czlowieka',
    title: 'Jaki wpływ może mieć klimatyzacja na człowieka?',
    metaTitle: 'Wpływ klimatyzacji na zdrowie człowieka | FRIGAC',
    description:
      'Jak klimatyzacja wpływa na sen, koncentrację, alergie i serce? Co daje dobrze serwisowana klima, a czym grozi zaniedbana? Przegląd badań o wpływie klimatyzacji na organizm człowieka - z wykresami i źródłami.',
    keywords: [
      'wpływ klimatyzacji na zdrowie',
      'czy klimatyzacja jest zdrowa',
      'klimatyzacja a zdrowie człowieka',
      'klimatyzacja a sen',
      'klimatyzacja a alergia',
      'klimatyzacja Gdańsk',
      'montaż klimatyzacji Gdańsk'
    ],
    datePublished: '2026-09-26',
    excerpt:
      'Dobrze dobrana i serwisowana klimatyzacja chroni przed upałem, poprawia sen i koncentrację. Zaniedbana - wysusza powietrze i dmucha bakteriami. Sprawdzamy, co mówią badania.',
    author: 'Hubert Maciejewski'
  }
];
