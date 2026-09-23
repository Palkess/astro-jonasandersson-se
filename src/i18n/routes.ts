/**
 * Locale routing table.
 *
 * Swedish is the default locale and is NOT prefixed (`/about`), English lives
 * under `/en/` (`/en/about`). Slugs are the same in both locales so every URL
 * the SSR site served keeps working — GitHub Pages cannot redirect.
 *
 * This file imports nothing, which is what makes it safe to read from
 * `astro.config.mjs` (the sitemap's `hreflang` alternates, ADR-009).
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

export type RouteKey = 'home' | 'about' | 'portfolio' | 'privacy';

/** Path segment per route per locale. `home` has no segment of its own. */
export const routeSlugs: Record<RouteKey, Record<Locale, string>> = {
    home: { sv: '', en: '' },
    about: { sv: 'about', en: 'about' },
    portfolio: { sv: 'portfolio', en: 'portfolio' },
    privacy: { sv: 'privacy', en: 'privacy' }
};

export function isLocale(value: string | undefined): value is Locale {
    return locales.includes(value as Locale);
}

/**
 * Path for a route, built without `astro:i18n`.
 *
 * `routeHref()` in `./index.ts` is what pages use and stays the canonical
 * helper — it goes through `getRelativeLocaleUrl`. This twin exists because
 * `astro.config.mjs` needs the same paths while building the sitemap, and the
 * config is evaluated before `astro:i18n` exists. Keep the two in agreement:
 * both emit a trailing slash, matching what the build writes to disk.
 */
export function localePath(locale: Locale, key: RouteKey, param?: string): string {
    const prefix = locale === defaultLocale ? '' : `/${locale}`;
    const path = [routeSlugs[key][locale], param].filter(Boolean).join('/');
    return path ? `${prefix}/${path}/` : `${prefix}/`;
}

/**
 * The reverse: which route a built URL path belongs to, so the sitemap can pair
 * `/about/` with `/en/about/`. Returns `null` for anything not produced by this
 * site's routing table.
 */
export function matchRoute(pathname: string): { key: RouteKey; param?: string } | null {
    const segments = pathname.split('/').filter(Boolean);
    const [first, ...rest] = segments;

    const locale = isLocale(first) ? first : defaultLocale;
    const [segment, param, ...extra] = isLocale(first) ? rest : segments;

    if (segment === undefined) return { key: 'home' };
    if (extra.length > 0) return null;

    for (const key of ['about', 'portfolio', 'privacy'] as const) {
        if (routeSlugs[key][locale] !== segment) continue;
        /* Only portfolio has pages below it (one per project). */
        if (param === undefined) return { key };
        return key === 'portfolio' ? { key, param } : null;
    }

    return null;
}

/**
 * Every localized URL for the page at `pathname`, as `hreflang` → path, plus
 * `x-default` → Swedish. Used by the sitemap's `serialize` hook; it mirrors
 * what `alternateLinks()` gives the pages, so both advertise the same cluster.
 */
export function alternatePaths(pathname: string): { lang: string; path: string }[] {
    const route = matchRoute(pathname);
    if (!route) return [];

    return [
        ...locales.map((locale) => ({
            lang: localeTags[locale],
            path: localePath(locale, route.key, route.param)
        })),
        { lang: 'x-default', path: localePath(defaultLocale, route.key, route.param) }
    ];
}
