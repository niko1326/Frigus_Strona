import { routes } from '../i18n/content';

export type Brand = {
  /** Nazwa marki wielkimi literami - używana na kaflu w hero. */
  name: string;
  /** Adres podstrony marki. */
  href: string;
  /** Etykieta odnośnika w stopce i sekcjach "zobacz też". */
  linkLabel: string;
};

/**
 * Marki, które montujemy. Kolejność steruje rotacją kafla w hero
 * oraz kolejnością odnośników w stopce.
 */
export const BRANDS: Brand[] = [
  { name: 'GREE', href: routes.gree, linkLabel: 'Klimatyzatory Gree' },
  { name: 'KAISAI', href: routes.kaisai, linkLabel: 'Klimatyzatory Kaisai' }
];
