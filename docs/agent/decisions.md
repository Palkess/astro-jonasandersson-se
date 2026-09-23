## When to consult this file

Consult this file when making or evaluating architectural or design choices, or when you wonder "why was this done this way?"

---

# Architectural Decision Records

## ADR-001: SSR over static output

**Status:** Superseded by ADR-006 (2026-09-22)

**Date:** 2024 (initial build)

**Context:** Astro supports both static (`output: 'static'`) and server-rendered (`output: 'server'`) builds. A personal portfolio is mostly static content.

**Decision:** Use SSR with `@astrojs/node` standalone adapter.

**Consequences:**

- Deployment requires a running Node.js process — cannot deploy to pure static hosts (Netlify/Vercel static, GitHub Pages)
- Every page request incurs server overhead vs. serving pre-built HTML
- Enables Paraglide's URL-based locale middleware, which requires server-side request interception
- Enables future dynamic features (contact forms, API routes) without changing the architecture

_Cross-reference: architecture.md — Request Pipeline_

---

## ADR-002: Separate language components for long-form content

**Date:** 2024 (initial build)

**Context:** The site is bilingual (Swedish/English). For short UI strings, Paraglide message keys work well. For long-form content (career timeline, biography paragraphs), two approaches were considered:

1. i18n message keys for every paragraph
2. Separate Swedish and English Svelte components

**Decision:** Use separate language-specific components (`swedish-experience.svelte`, `english-experience.svelte`, etc.) for long-form content.

**Consequences:**

- Long-form content is readable in source — no interpolated strings to scan through
- Adding content requires editing two files instead of two JSON keys
- Component-level locale branching: `{locale === 'sv' ? <SwedishContent /> : <EnglishContent />}`, where `locale` is the page body's prop
- Risk of content drift between locales if one is updated without the other

**Update (2026-09-22):** Still in force after the move away from Paraglide (ADR-007). Short strings now live in the TypeScript dictionaries `src/i18n/ui.{sv,en}.ts` instead of Paraglide message keys, and the branch uses the `locale` prop instead of `getLocale()`.

---

## ADR-003: Tailwind CSS v4 via Vite plugin

**Date:** 2024 (initial build)

**Context:** Tailwind v4 offers two integration paths for Astro: the official `@astrojs/tailwind` integration or loading Tailwind as a Vite plugin via `@tailwindcss/vite`.

**Decision:** Use `@tailwindcss/vite` Vite plugin, configured directly in `astro.config.mjs`.

**Consequences:**

- CSS-first configuration using `@theme`, `@layer`, `@utility`, `@plugin` in `src/styles/global.css`
- No `tailwind.config.js` file — all customisation lives in the CSS file
- More aligned with Tailwind v4's intended usage
- Less familiar to developers used to v3's JS config approach

---

## ADR-004: `$lib` path alias

**Date:** 2024 (initial build)

**Context:** The project uses Astro with Svelte, but imports across component directories using relative paths (`../../utils/foo`) are brittle and hard to read.

**Decision:** Adopt the SvelteKit `$lib` convention — configure a path alias mapping `$lib/*` → `./src/*` in both `tsconfig.json` and `astro.config.mjs` (vite resolve alias).

**Consequences:**

- All internal imports use `$lib/...` regardless of file location
- Consistent with what Svelte developers expect
- Requires dual configuration (TypeScript + Vite) — if one is updated without the other, types break at runtime or type-check time

---

## ADR-005: Paraglide locale detection strategy

**Status:** Superseded by ADR-007 (2026-09-22)

**Date:** 2024 (initial build)

**Context:** Paraglide JS supports multiple locale detection strategies: URL path, cookie, browser `Accept-Language` header, and base locale fallback.

**Decision:** Strategy order: `['url', 'cookie', 'baseLocale']`. Swedish (`sv`) is the base locale.

**Consequences:**

- Language is reflected in the URL — SEO-friendly, shareable locale-specific links
- Cookie allows persistence when navigating locale-ambiguous paths
- No `Accept-Language` detection — users always start in Swedish unless they navigate to `/en/...` or have a cookie set
- Swedish content at `/`, English content at `/en/`

---

## ADR-006: Static output for GitHub Pages

**Date:** 2026-09-22

**Status:** Supersedes ADR-001

**Context:** The site is to be hosted on GitHub Pages, which only serves static files. ADR-001 chose SSR because Paraglide's URL-based locale middleware needed to intercept requests. Once locale routing moved to Astro's built-in i18n and per-locale route files (ADR-007), nothing needed a server any more: the site has no forms, API routes or per-request data, and no Svelte component is hydrated.

**Decision:** Use Astro's default static output. Remove `output: 'server'`, the `@astrojs/node` adapter and `src/middleware.ts`. `site` is set to `https://jonasandersson.se` and no `base` is used, since the site is served from that custom domain.

**Consequences:**

- `npm run build` writes plain HTML to `dist/` (`/about/index.html`, `/en/about/index.html`, …). Any static host works; no Node.js process at runtime.
- Deployed by GitHub Actions (`.github/workflows/deploy.yml`) on every push to `main`, after `astro check` and the build pass. Setup steps are in `workflows.md`.
- Every URL has to exist as a generated file. There are no server-side redirects or rewrites — GitHub Pages can't do them — which is why existing URLs are kept as-is (ADR-007).
- Anything computed at render time is frozen at build time (e.g. the footer's copyright year updates on redeploy).
- Future dynamic features (contact form, API routes) would need a third-party service or a return to an adapter.
- **Update (2026-09-23):** the context's "no Svelte component is hydrated" no longer holds: the cookie consent banner is a `client:load` island (ADR-008). Nothing else about this decision changes.
- Reverses the "Static prerendering individual routes" anti-pattern below, which only made sense while the middleware existed.

_Cross-reference: architecture.md — Runtime Mode_

---

## ADR-007: Locale routing through Astro i18n and per-locale route files

**Date:** 2026-09-22

**Status:** Supersedes ADR-005. Copies the approach of the sibling project `astro-olandsstuguthyrning-com` (its ADR-004/005).

**Context:** ADR-005's strategy (`url` → `cookie` → `baseLocale`) relied on middleware running for every request. A static site has no request to intercept, and on GitHub Pages nothing server-side can read a locale cookie.

**Decision:**

- Astro's built-in i18n: `defaultLocale: 'sv'`, `locales: ['sv', 'en']`, `prefixDefaultLocale: false`.
- Swedish pages are real files at the root (`src/pages/index.astro`, `about.astro`, `portfolio.astro`), each with `const locale = 'sv'`. Other locales are generated by `src/pages/[locale]/index.astro` and `src/pages/[locale]/[slug].astro` via `getStaticPaths`, with slugs taken from `routeSlugs` in `src/i18n/routes.ts`.
- The locale is decided by the route file and passed down as a prop (route → `Layout` → page body → components). Nothing reads a global locale.
- The URL alone decides the language. No `Accept-Language` detection, no cookie, no client-side redirect.
- Slugs are identical in both locales (`/about/`, `/en/about/`), so every URL the SSR site served still works.

**Consequences:**

- Language stays in the URL — SEO-friendly and shareable — with `hreflang` alternates and a canonical URL on every page (`Layout.astro`).
- Visitors always land in Swedish at `/` unless they follow an `/en/` link. The language switcher links to the same page in the other language.
- Adding a locale means adding it to `locales` (in `astro.config.mjs` _and_ `src/i18n/routes.ts`), a `ui.<locale>.ts` / `projects.<locale>.ts` dictionary, and its `routeSlugs` entries. The `[locale]` routes then generate its pages automatically.
- Adding a page means a Swedish route file, a `RouteKey` + `routeSlugs` entry, and a case in `[locale]/[slug].astro`.
- Pages below a route (e.g. `/portfolio/<slug>/`) use `routeHref(locale, key, param)` and pass `param` to `Layout`. The non-default locales get a nested `[locale]/[slug]/[param].astro` whose middle segment comes from `routeSlugs`, as `[locale]/[slug]/[project].astro` does.
- Adding a portfolio project needs no route changes: `getStaticPaths` in both project routes iterates `src/data/projects.ts`.

_Cross-reference: architecture.md — Internationalization; conventions.md — Internationalization_

---

## ADR-008: Cookie consent island gates Google Tag Manager

**Date:** 2026-09-23

**Status:** Copies the approach of the sibling project `astro-olandsstuguthyrning-com` (its `CookieConsent.svelte`).

**Context:** The site is to get analytics through Google Tag Manager. Its visitors are mostly Swedish/EU, so analytics cookies need prior, explicit consent (GDPR/ePrivacy). A static site has no server that could decide whether to include the GTM snippet, so the decision has to happen in the browser.

**Decision:**

- `src/components/composites/cookie-consent/cookie-consent.svelte`, rendered by `Layout.astro` with `client:load`. It is the site's only hydrated component.
- GTM is injected **only** after an explicit accept, and on later visits only if the stored choice is `granted`. Declining or ignoring the banner means no GTM script, no analytics cookie and no request to Google.
- The choice is stored in `localStorage` under `analytics-consent` (`granted` / `denied`), not in a cookie. If storage is unavailable, the choice just isn't remembered.
- The container id is `PUBLIC_GTM_ID`, a GitHub Actions repository **variable** (not a secret: it ends up in the client bundle by design), passed to the build in `deploy.yml`. While it is unset, the GTM loader is dropped from the bundle entirely.
- The banner links to a privacy policy at `/privacy/` and `/en/privacy/` (new `privacy` route key; slugs are identical in both locales, like the other routes). The policy is long-form text, so it lives in `swedish-privacy-policy` / `english-privacy-policy` (ADR-002) rather than in the dictionaries as in the sibling project. `Layout.astro` also links it from the footer.
- There is no "change your choice" control; visitors reset it by clearing site data, which the policy says.

**Consequences:**

- Pages now ship a small amount of JS (Svelte runtime + the island) — the "no framework JS" property of ADR-006 no longer holds.
- The privacy policy states the consent behaviour as fact. If analytics, a form or anything else that handles personal data is added or changed, the policy changes in the same commit.
- Setting or changing `PUBLIC_GTM_ID` needs a rebuild (re-running the last deploy is enough).

_Cross-reference: context.md — GDPR; workflows.md — Deployment → Environment_

---

## ADR-009: Sitemap alternates built from `routeSlugs`, not by `@astrojs/sitemap`

**Date:** 2026-09-23

**Status:** Copies the approach of the sibling project `astro-olandsstuguthyrning-com` (its ADR-018).

**Context:** Search engines should get a sitemap with the `hreflang` cluster for every page. `@astrojs/sitemap` has an `i18n` option that pairs locales by matching the path after the locale prefix. That would work here today, because slugs are identical in both locales (ADR-007), but it breaks as soon as a slug is translated, and it doesn't emit `x-default`, which every page's `<head>` does. The sibling project found out the hard way that mismatched or asymmetric `hreflang` annotations can get the whole cluster ignored.

**Decision:**

- `@astrojs/sitemap` in `astro.config.mjs`, without its `i18n` option. A `serialize` hook adds each URL's alternates from `alternatePaths()` in `src/i18n/routes.ts`: every locale plus `x-default` → Swedish, the same set `alternateLinks()` gives `Layout.astro`.
- `src/i18n/routes.ts` gained `localePath()`, `matchRoute()` and `alternatePaths()`, pure functions with no imports, so the config can read them before `astro:i18n` exists. Pages keep using `routeHref()`; the two must keep emitting the same paths, trailing slash included.
- `public/robots.txt` allows everything and points at `/sitemap-index.xml`. The 404 page (which the plugin leaves out of the sitemap) stays out of search through its `noindex` meta tag, not through `Disallow`.

**Consequences:**

- A new route key or a page below a route needs a matching case in `matchRoute()`, or its sitemap entry silently loses its alternates. Translating a slug needs no sitemap change.
- To check a build: every `<url>` in `dist/sitemap-0.xml` should list the same `hreflang`/`href` pairs as that page's `<link rel="alternate">` tags, and its `<loc>` should equal the page's canonical URL.

_Cross-reference: architecture.md — Internationalization_

---

## Anti-patterns

- **Astro content collections for this site's content** — The content is small, typed inline, and tightly coupled to components. Content collections would add schema overhead and a content directory layer without meaningful benefit at this scale. Do not migrate to content collections unless the project grows significantly.
- **React or other UI frameworks** — Svelte 5 is the chosen component framework. Adding React would double the client-side runtime. Do not add `@astrojs/react` or similar.
- ~~**Static prerendering individual routes**~~ — _Obsolete since ADR-006: the whole site is static now._ This used to warn against mixing SSR and per-route `prerender = true` because of the locale middleware.
- **Locale detection or redirects in the browser** — A static host can only detect language with client-side JS, which means a redirect after load: a flash of the wrong language for users and a real risk of confusing crawlers. `hreflang` already tells search engines which page is which. See ADR-007.

---

## How to contribute to this file

Add an ADR when:

- A meaningful architectural choice is made that isn't obvious from the code
- A previously considered alternative is explicitly rejected
- An existing decision is reversed — update the original ADR with a "Superseded by ADR-XXX" note and add the new one

Date-stamp every entry. Cross-reference `bugs.md` if the decision is the known cause of a documented issue.
