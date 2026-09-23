## When to consult this file

Consult this file when navigating the codebase, proposing structural changes, or debugging routing and rendering behaviour. Not needed for simple component edits.

---

# Architecture

## Overview

Personal portfolio/CV website for Jonas Andersson. Built with Astro 5 (static output) + Svelte 5 + Tailwind CSS 4, bilingual (Swedish/English) through Astro's built-in i18n routing and TypeScript dictionaries in `src/i18n/`. Deployed as static files.

## Runtime Mode

**Static.** `astro.config.mjs` uses Astro's default static output — no adapter, no middleware. `npm run build` prerenders every page to `dist/` as `<route>/index.html`, and any static host can serve it; the intended host is GitHub Pages on the `jonasandersson.se` custom domain (`site` is set, no `base`). There is no server at runtime, so there are no redirects or rewrites, and render-time values such as the footer's year are fixed at build time.

One Svelte component is hydrated: the cookie consent banner (`cookie-consent`, `client:load` in `Layout.astro`), which is also the only thing allowed to load Google Tag Manager, and only after an explicit accept (ADR-008). Everything else renders to plain HTML with no framework JS.

Until 2026-09 the site was SSR with `@astrojs/node`, and Paraglide JS handled i18n through middleware. See ADR-006 / ADR-007 in `decisions.md`.

## Build Pipeline

```
astro build
  └─ Route file (src/pages/…)              ← fixes the locale: 'sv' in root files, getStaticPaths in [locale]/…
       └─ Layout.astro                      ← lang, title, canonical, hreflang, language switcher, top menu, footer, slot
            └─ Page body (src/components/pages/…)   ← text + links from useTranslations(locale) / routeHref(locale, …)
                 └─ Composites / base / foundation   ← receive localized text and hrefs as props
  → dist/<route>/index.html
```

The locale flows down as a prop. Nothing reads it from a request, cookie or global.

## Pages

| Route                                          | File                                                                                 | Description                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `/`                                            | `src/pages/index.astro` → `home-page`                                                | Landing page: name, subtitle, skills, profile image, nav                                        |
| `/about/`                                      | `src/pages/about.astro` → `about-page`                                               | About page: career timeline, biography                                                          |
| `/portfolio/`                                  | `src/pages/portfolio.astro` → `portfolio-page`                                       | Portfolio listing: project teasers                                                              |
| `/en/`                                         | `src/pages/[locale]/index.astro` → `home-page`                                       | Home page in every non-default locale                                                           |
| `/privacy/`                                    | `src/pages/privacy.astro` → `privacy-page`                                           | Privacy policy (cookies, analytics, GDPR rights); linked from the footer and the consent banner |
| `/en/about/`, `/en/portfolio/`, `/en/privacy/` | `src/pages/[locale]/[slug].astro` → `about-page` / `portfolio-page` / `privacy-page` | Content pages in every non-default locale; slugs from `routeSlugs`                              |
| `/portfolio/<slug>/`                           | `src/pages/portfolio/[slug].astro` → `project-page`                                  | One page per project in `src/data/projects.ts`                                                  |
| `/en/portfolio/<slug>/`                        | `src/pages/[locale]/[slug]/[project].astro` → `project-page`                         | Project pages in every non-default locale; the `portfolio` segment comes from `routeSlugs`      |
| `/404.html`                                    | `src/pages/404.astro` → `not-found-page`                                             | Served by GitHub Pages for every missing path, in either language. Bilingual (see below)        |

Swedish route files set `const locale = 'sv'`. The `[locale]` files generate the other locales with `getStaticPaths` over `locales` minus the default (constants the function needs are declared _inside_ it, because Astro extracts `getStaticPaths` into its own chunk).

Route files are thin wrappers: they fix the locale and render the matching page body from `src/components/pages/` inside `<Layout {locale} routeKey="…" title={…}>`. From `locale` + `routeKey`, `Layout.astro` derives `<html lang>`, the translated `<title>`, the canonical URL, the `hreflang` alternates (resolved against `site`), the OG tags and the language switcher's links, which point at the same page in the other language.

Project pages pass `routeKey="portfolio"` and `param={slug}` to `Layout`, which appends the slug to the canonical URL, the `hreflang` alternates and the language switcher links.

The 404 page is the one route without a `routeKey`. GitHub Pages serves the same `404.html` for a missing `/…` and a missing `/en/…`, and the page can't tell which language the visitor was in without client-side JS (see the "Locale detection or redirects in the browser" anti-pattern). So `not-found-page` shows the message in every locale, default locale first, each block with its own `lang`, and `<html lang>` is the default locale. Without a `routeKey`, `Layout.astro` leaves out the canonical URL, the `hreflang` alternates and `og:url`, adds `<meta name="robots" content="noindex">`, and points the language switcher at each locale's home page.

## Component Hierarchy

```
Foundation (src/components/foundation/)
  └─ Icons: Github, LinkedIn, FlagBritain, FlagSweden, AppWindow, ExternalLink, MoveLeft

Base (src/components/base/)
  └─ button, language-links, page-title, paper, skills-list, social-links

Composites (src/components/composites/)
  └─ project-teaser, sub-page
  └─ cookie-consent                            ← the only `client:` island (ADR-008)
  └─ swedish-experience, english-experience   ← locale-split content
  └─ swedish-history, english-history         ← locale-split content
  └─ swedish-privacy-policy, english-privacy-policy ← locale-split content

Pages (src/components/pages/)
  └─ home-page, about-page, portfolio-page     ← one body per route, takes `locale`
  └─ project-page                              ← one portfolio project, takes `locale` + `project`
  └─ privacy-page                              ← the privacy policy, takes `locale`
  └─ not-found-page                            ← the 404 page, bilingual, takes no props
```

Composites are assembled from Base components. Page bodies use composites, base and foundation directly, and are rendered by thin route files in `src/pages/` inside `<Layout>`. Foundation icons are leaf nodes — no dependencies.

## Internationalization

- **Default locale:** Swedish (`sv`), unprefixed: `/`, `/about/`, `/portfolio/`
- **Other locale:** English (`en`), prefixed: `/en/`, `/en/about/`, `/en/portfolio/`
- **Detection:** none. The URL alone decides the language (Astro i18n, `prefixDefaultLocale: false`); no cookie, no `Accept-Language`, no client-side redirect. See ADR-007.
- **Routing table:** `src/i18n/routes.ts` (`locales`, `routeSlugs`, `localeTags`). The order of `locales` is the language switcher's display order.
- **Strings:** `src/i18n/ui.{sv,en}.ts` (UI) and `src/i18n/projects.{sv,en}.ts` (portfolio), read with `useTranslations(locale)` / `getProjectText(locale, slug)`.
- **Links:** `routeHref(locale, key, param?)`, via Astro's `getRelativeLocaleUrl`. Always emits a trailing slash.
- **Long-form content:** separate Swedish/English components (ADR-002).

## Styling

Tailwind CSS v4 loaded as a Vite plugin (not the Astro integration). Custom theme and utilities defined in `src/styles/global.css`:

- Custom color: `--color-navy-100: #001f3f` (primary background)
- Custom CSS component `.link` — animated underline
- Custom CSS component `.timeline` — vertical timeline with dots
- Custom CSS component `.bg-angular` — Angular brand gradient

## View Transitions

MPA view transitions are enabled via `@view-transition { navigation: auto; }` in `global.css`. Named transitions applied to:

- `page-title` — via `.view-transition-pageTitle` class
- `profile-image` — via `.view-transition-profileImg` class
- `top-menu`, `page-content`, `expertise-list` — similar pattern
- Project images — dynamic names via inline `style="view-transition-name: project-image-{slug}"`

## Data

No Astro content collections. Data is inline:

- **Portfolio projects**: locale-invariant `Project[]` in `src/data/projects.ts`; titles and descriptions per locale in `src/i18n/projects.{sv,en}.ts`, keyed by slug (see `context.md`)
- **Career history**: encoded in the locale-specific experience/history Svelte components
- **i18n strings**: `src/i18n/ui.{sv,en}.ts` (UI) and `src/i18n/projects.{sv,en}.ts` (portfolio texts)

## Key Utilities

| Utility                          | Location                             | Purpose                                                    |
| -------------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `$lib` alias                     | `tsconfig.json` + `astro.config.mjs` | Maps `$lib/*` → `./src/*`                                  |
| `twMerge`                        | `tailwind-merge` (npm)               | Merge Tailwind class props safely                          |
| `getSkillClassColors()`          | `src/utils/getSkillClassColors.ts`   | Maps tech name → Tailwind color classes                    |
| `useTranslations(locale)`        | `$lib/i18n`                          | UI strings for a locale                                    |
| `getProjectText(locale, slug)`   | `$lib/i18n`                          | Portfolio project texts for a locale                       |
| `routeHref(locale, key, param?)` | `$lib/i18n`                          | Localized internal link (trailing slash)                   |
| `alternateLinks(key, param?)`    | `$lib/i18n`                          | `hreflang` alternates for a route (used by `Layout.astro`) |

---

## How to contribute to this file

Update this file when:

- New pages, routes, or major components are added
- The rendering mode changes (e.g. static prerendering is added)
- The i18n strategy or locale list changes
- A new significant utility or integration is introduced

Do not document individual component internals here — that belongs in conventions.md.
