## When to consult this file

Consult this file when onboarding to this project or working in an unfamiliar part of the stack.

---

# Skills & Tech Stack

## Core Stack

| Technology | Version | Role |
|------------|---------|------|
| [Astro](https://astro.build) | 5.x | Application framework, routing, built-in i18n routing, static build |
| [Svelte](https://svelte.dev) | 5.x | UI component framework (runes API) |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS, CSS-first config via `@theme` |
| TypeScript | ~5.x | Type checking (strict mode) |
| Vite | (bundled with Astro) | Build tooling, HMR |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@astrojs/svelte` | Astro integration for Svelte components |
| `@astrojs/check` | `astro check` — type-checks `.astro`/`.svelte`/`.ts` (`npm run check`, run in CI) |
| `@tailwindcss/vite` | Tailwind v4 Vite plugin |
| `@tailwindcss/forms` | Tailwind plugin: form element resets |
| `@tailwindcss/typography` | Tailwind plugin: prose typography |
| `tailwind-merge` | Merges conflicting Tailwind classes safely |
| `prettier` | Code formatter |
| `prettier-plugin-astro` | Prettier support for `.astro` files |
| `prettier-plugin-svelte` | Prettier support for `.svelte` files |
| `prettier-plugin-tailwindcss` | Sorts Tailwind classes in Prettier output |

## What to Know Before Contributing

- **Astro 5**: Familiarity with Astro's component model (`.astro` files, frontmatter, `<slot>`), file-based routing with `getStaticPaths`, static output, and the built-in `i18n` routing (`astro:i18n`)
- **Svelte 5 runes**: The project exclusively uses the new runes API (`$props`, `$state`, `$bindable`, `{#snippet}`, `{@render}`). Knowledge of Svelte 4 Options API is not sufficient
- **Tailwind CSS v4**: Config is CSS-first (`@theme` in global.css), not JS config. Syntax differs significantly from v3
- **i18n (`src/i18n/`)**: No i18n library. Translations are plain TypeScript objects — `ui.sv.ts` defines the `UiStrings` type and `ui.en.ts` must match it. Routing uses Astro's built-in `i18n` config; all internal links go through `routeHref()`, which wraps `getRelativeLocaleUrl` from `astro:i18n`

---

## How to contribute to this file

Update this file when:
- A major dependency is added or removed
- The required version of a core technology changes significantly
- A meaningful onboarding note would have saved a new contributor time
