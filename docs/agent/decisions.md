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

*Cross-reference: architecture.md — Request Pipeline*

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
- Component-level locale branching: `{getLocale() === 'sv' ? <SwedishContent /> : <EnglishContent />}`
- Risk of content drift between locales if one is updated without the other

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
- Every URL has to exist as a generated file. There are no server-side redirects or rewrites — GitHub Pages can't do them — which is why existing URLs are kept as-is (ADR-007).
- Anything computed at render time is frozen at build time (e.g. the footer's copyright year updates on redeploy).
- Future dynamic features (contact form, API routes) would need a third-party service or a return to an adapter.
- Reverses the "Static prerendering individual routes" anti-pattern below, which only made sense while the middleware existed.

*Cross-reference: architecture.md — Runtime Mode*

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
- Adding a locale means adding it to `locales` (in `astro.config.mjs` *and* `src/i18n/routes.ts`), a `ui.<locale>.ts` / `projects.<locale>.ts` dictionary, and its `routeSlugs` entries. The `[locale]` routes then generate its pages automatically.
- Adding a page means a Swedish route file, a `RouteKey` + `routeSlugs` entry, and a case in `[locale]/[slug].astro`.

*Cross-reference: architecture.md — Internationalization; conventions.md — Internationalization*

---

## Anti-patterns

- **Astro content collections for this site's content** — The content is small, typed inline, and tightly coupled to components. Content collections would add schema overhead and a content directory layer without meaningful benefit at this scale. Do not migrate to content collections unless the project grows significantly.
- **React or other UI frameworks** — Svelte 5 is the chosen component framework. Adding React would double the client-side runtime. Do not add `@astrojs/react` or similar.
- ~~**Static prerendering individual routes**~~ — *Obsolete since ADR-006: the whole site is static now.* This used to warn against mixing SSR and per-route `prerender = true` because of the locale middleware.
- **Locale detection or redirects in the browser** — A static host can only detect language with client-side JS, which means a redirect after load: a flash of the wrong language for users and a real risk of confusing crawlers. `hreflang` already tells search engines which page is which. See ADR-007.

---

## How to contribute to this file

Add an ADR when:
- A meaningful architectural choice is made that isn't obvious from the code
- A previously considered alternative is explicitly rejected
- An existing decision is reversed — update the original ADR with a "Superseded by ADR-XXX" note and add the new one

Date-stamp every entry. Cross-reference `bugs.md` if the decision is the known cause of a documented issue.
