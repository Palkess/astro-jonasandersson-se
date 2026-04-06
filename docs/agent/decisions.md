## When to consult this file

Consult this file when making or evaluating architectural or design choices, or when you wonder "why was this done this way?"

---

# Architectural Decision Records

## ADR-001: SSR over static output

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

**Date:** 2024 (initial build)

**Context:** Paraglide JS supports multiple locale detection strategies: URL path, cookie, browser `Accept-Language` header, and base locale fallback.

**Decision:** Strategy order: `['url', 'cookie', 'baseLocale']`. Swedish (`sv`) is the base locale.

**Consequences:**
- Language is reflected in the URL — SEO-friendly, shareable locale-specific links
- Cookie allows persistence when navigating locale-ambiguous paths
- No `Accept-Language` detection — users always start in Swedish unless they navigate to `/en/...` or have a cookie set
- Swedish content at `/`, English content at `/en/`

---

## Anti-patterns

- **Astro content collections for this site's content** — The content is small, typed inline, and tightly coupled to components. Content collections would add schema overhead and a content directory layer without meaningful benefit at this scale. Do not migrate to content collections unless the project grows significantly.
- **React or other UI frameworks** — Svelte 5 is the chosen component framework. Adding React would double the client-side runtime. Do not add `@astrojs/react` or similar.
- **Static prerendering individual routes** — While Astro supports per-route `prerender = true`, mixing SSR and static adds complexity to the middleware/locale pipeline. Avoid until there is a specific need.

---

## How to contribute to this file

Add an ADR when:
- A meaningful architectural choice is made that isn't obvious from the code
- A previously considered alternative is explicitly rejected
- An existing decision is reversed — update the original ADR with a "Superseded by ADR-XXX" note and add the new one

Date-stamp every entry. Cross-reference `bugs.md` if the decision is the known cause of a documented issue.
