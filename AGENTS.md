# jonasandersson.se — Agent Instructions

Personal portfolio and CV website for Jonas Andersson, a Swedish fullstack web developer. Built with Astro 5 (static output) + Svelte 5 + Tailwind CSS 4, bilingual (Swedish/English) via Astro's built-in i18n routing and TypeScript dictionaries in `src/i18n/`. Builds to static files, intended for GitHub Pages.

---

## Quick Start

```bash
npm run dev        # dev server at http://localhost:4321
npm run build      # static build to dist/
npm run preview    # preview production build
npm run format     # format all files with Prettier
```

The build prerenders every page to static HTML in `dist/` — no compile step, no server.

---

## Boundaries

> Do not modify these without explicit human review.

| Path | Reason |
|------|--------|
| `src/i18n/ui.*.ts`, `src/i18n/projects.*.ts` | Translation source of truth. Every change must be made in both `sv` and `en`. |
| `src/i18n/routes.ts` | Routing table. Changing a slug or locale changes public URLs, and GitHub Pages cannot redirect the old ones. |
| `.prettierrc` | Formatting config used by all contributors. |

---

## Conventions

**Component architecture** follows a strict four-tier hierarchy:
- `src/components/foundation/` — SVG icons only, no logic
- `src/components/base/` — atomic UI (button, links, labels)
- `src/components/composites/` — assembled page sections
- `src/components/pages/` — one `.astro` page body per route, taking `locale` as a prop; the files in `src/pages/` are thin wrappers that render it inside `<Layout>`

Each component lives in its own folder: `component-name/component-name.svelte`, with an optional `types.ts` sibling.

**Svelte 5 runes only.** Never use the legacy Options API. Always use `$props()`, `$state()`, `$bindable()`, `{#snippet}`, `{@render}`.

**`class` props + `twMerge`.** Every component that accepts external styling must accept an optional `class` prop and merge it via `twMerge` from `tailwind-merge`.

**`$lib` alias.** All internal imports use `$lib/...` (maps to `./src/`). Never use relative paths across directories.

**i18n.** The locale is a prop, fixed by the route file and passed down — never read from a global. Short strings: `useTranslations(locale)` from `$lib/i18n` (dictionaries in `src/i18n/ui.{sv,en}.ts`). Long-form content: separate Swedish/English Svelte components. All internal links: `routeHref(locale, key, param?)` from `$lib/i18n` — never a hand-written path. Page bodies (`src/components/pages/`) get text and links from `useTranslations(locale)` / `routeHref(locale, key)` in `$lib/i18n`; lower-tier components have no runtime imports from `$lib/i18n` (types only) and receive localized hrefs and labels as props.

**Images.** Processed images: import from `$lib/assets/`, use `.src`. Static images: `public/images/`, reference by string path.

**Formatting** is handled by Prettier — see `.prettierrc`. Run `npm run format`.

---

## Architecture

**Runtime:** Static. `astro build` prerenders every page to `dist/<route>/index.html`. No adapter, no middleware, no server at runtime (ADR-006).

**Pages:**
- `/`, `/about/`, `/portfolio/` — `src/pages/index.astro`, `about.astro`, `portfolio.astro` (Swedish, `const locale = 'sv'`)
- `/en/` — `src/pages/[locale]/index.astro`
- `/en/about/`, `/en/portfolio/` — `src/pages/[locale]/[slug].astro` (slugs from `routeSlugs` in `src/i18n/routes.ts`)

Each route file renders a page body from `src/components/pages/` inside `<Layout {locale} routeKey="…">`. Portfolio detail pages are still missing — see Known Issues.

**Locales:** Swedish (`sv`) is the default locale (unprefixed root paths). English (`en`) uses the `/en/` prefix. No detection: the URL alone decides the language — no cookie, no `Accept-Language`, no client-side redirect (ADR-007).

**Data:** No content collections. Portfolio projects are a `Project[]` in `src/data/projects.ts` (locale-invariant data), with per-locale texts in `src/i18n/projects.{sv,en}.ts` keyed by slug. Career history is in the locale-split experience/history Svelte components.

**View transitions:** Named MPA transitions (`.view-transition-pageTitle`, etc.) provide smooth cross-page animation. Transition names must match between paired elements.

**Key utilities:**
- `twMerge` — merge Tailwind classes safely
- `getSkillClassColors()` — `src/utils/getSkillClassColors.ts` — maps tech name to color classes
- `useTranslations(locale)` / `getProjectText(locale, slug)` — translated strings from `$lib/i18n`
- `routeHref(locale, key, param?)` — localized internal links from `$lib/i18n` (trailing slash)
- `alternateLinks(key)` — `hreflang` alternates, used by `Layout.astro`

---

## Architectural Decisions

- **Static output (ADR-006):** Built for GitHub Pages; no server, so no redirects or per-request logic. Replaced the original SSR + Paraglide middleware setup.
- **Locale routing via Astro i18n (ADR-007):** Swedish unprefixed, English under `/en/`; locale fixed per route file and passed as a prop; no locale cookie or detection.
- **Separate language components for long-form content:** Career timelines and biographies are separate `.svelte` files per locale rather than i18n keys, to keep content readable in source.
- **Tailwind v4 via Vite plugin:** CSS-first config in `src/styles/global.css` using `@theme`/`@layer`/`@utility`. No `tailwind.config.js`.
- **`$lib` alias:** SvelteKit convention imported into Astro for consistent, portable imports.

---

## Known Issues

**BUG-001 (Resolved 2026-09-22):** `<html lang>` used to be hardcoded to `"en"`. `Layout.astro` now renders `lang={locale}` from its required `locale` prop.

**SUSPECT-001 (Suspected):** Portfolio links to `/portfolio/{slug}` but no `[slug].astro` dynamic route exists. These links currently 404.

---

## Domain Context

- **Base locale:** Swedish (`sv`). English (`en`) is secondary.
- **`Project` type** (`src/types/project.ts`): `slug`, `image`, `technologies`, `status` (`public`/`private`/`inprogress`), `githubUrl`, `url`, `releaseDate`. Prose (`title`, `descriptionTitle`, `description`) is a `ProjectText` in `src/i18n/projects.{sv,en}.ts`, read via `getProjectText(locale, slug)`.
- **Technology names** must match those in `getSkillClassColors()` for branded colors: `TypeScript`, `Svelte`, `SvelteKit`, `Tailwind`, `TailwindCSS`, `MySQL`, `IIS`, `Angular`, `Vue`, `Node`, `.NET`.

---

For detailed reference files, see `docs/agent/` — these are loaded automatically by Claude Code via CLAUDE.md.
