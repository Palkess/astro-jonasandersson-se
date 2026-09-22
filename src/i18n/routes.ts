/**
 * Locale routing table.
 *
 * Swedish is the default locale and is NOT prefixed (`/about`), English lives
 * under `/en/` (`/en/about`). Slugs are the same in both locales so every URL
 * the SSR site served keeps working — GitHub Pages cannot redirect.
 *
 * This file imports nothing, so it stays safe to read from `astro.config.mjs`
 * should the config ever need the table (e.g. for sitemap alternates).
 */

/** Order is the language switcher's display order (English flag first, as before). */
export const locales = ['en', 'sv'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'sv';

/** Language names, each written in its own language, for the switcher. */
export const localeNames: Record<Locale, string> = {
    sv: 'Svenska',
    en: 'English'
};

/** `hreflang` values. */
export const localeTags: Record<Locale, string> = {
    sv: 'sv-SE',
    en: 'en'
};

export type RouteKey = 'home' | 'about' | 'portfolio';

/** Path segment per route per locale. `home` has no segment of its own. */
export const routeSlugs: Record<RouteKey, Record<Locale, string>> = {
    home: { sv: '', en: '' },
    about: { sv: 'about', en: 'about' },
    portfolio: { sv: 'portfolio', en: 'portfolio' }
};

export function isLocale(value: string | undefined): value is Locale {
    return locales.includes(value as Locale);
}
