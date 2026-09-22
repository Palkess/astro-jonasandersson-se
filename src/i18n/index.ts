/**
 * i18n helpers.
 *
 * Always build internal links with `routeHref` rather than writing paths by
 * hand: it routes through Astro's `getRelativeLocaleUrl`, which applies both the
 * locale prefix and any `base` path.
 */

import { getRelativeLocaleUrl } from 'astro:i18n';

import {
    defaultLocale,
    localeTags,
    locales,
    routeSlugs,
    type Locale,
    type RouteKey
} from '$lib/i18n/routes';

import { uiSv, type UiStrings } from '$lib/i18n/ui.sv';
import { uiEn } from '$lib/i18n/ui.en';

const uiByLocale: Record<Locale, UiStrings> = { sv: uiSv, en: uiEn };

export function useTranslations(locale: Locale): UiStrings {
    return uiByLocale[locale];
}

/**
 * URL for a route in a given locale.
 * `routeHref('sv', 'about')` → `/about/`
 * `routeHref('en', 'portfolio', 'some-project')` → `/en/portfolio/some-project/`
 */
export function routeHref(locale: Locale, key: RouteKey, param?: string): string {
    const segment = routeSlugs[key][locale];
    const path = [segment, param].filter((part): part is string => Boolean(part)).join('/');
    return getRelativeLocaleUrl(locale, path);
}

export interface AlternateLink {
    locale: Locale;
    /** `hreflang` value. */
    hreflang: string;
    href: string;
}

/**
 * `hreflang` alternates for a page, for every locale plus `x-default` (Swedish).
 * `href` values are relative; resolve them against `Astro.site` when rendering.
 */
export function alternateLinks(key: RouteKey, param?: string): AlternateLink[] {
    const alternates = locales.map((locale) => ({
        locale,
        hreflang: localeTags[locale],
        href: routeHref(locale, key, param)
    }));

    return [
        ...alternates,
        {
            locale: defaultLocale,
            hreflang: 'x-default',
            href: routeHref(defaultLocale, key, param)
        }
    ];
}

export { defaultLocale, localeNames, localeTags, locales, isLocale } from '$lib/i18n/routes';
export type { Locale, RouteKey } from '$lib/i18n/routes';
export type { UiStrings } from '$lib/i18n/ui.sv';
