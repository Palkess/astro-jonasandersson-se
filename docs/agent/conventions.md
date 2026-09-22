## When to consult this file

Consult this file when writing, editing, or reviewing any source code in this project. Not needed for deployment or infrastructure tasks.

---

# Code Conventions

## Formatting

Formatting is fully handled by Prettier — see `.prettierrc`. Run `npm run format` to apply.

## Component Architecture

Components follow a strict four-tier hierarchy:

| Tier | Path | Purpose |
|------|------|---------|
| **Foundation** | `src/components/foundation/` | Raw SVG icons. No logic, no styling variation. |
| **Base** | `src/components/base/` | Atomic UI components (buttons, links, labels). |
| **Composites** | `src/components/composites/` | Assembled from base components. Page-level sections. |
| **Pages** | `src/components/pages/` | One page body per route (`home-page`, `about-page`, `portfolio-page`, `project-page`), as `.astro`. Takes `locale`, plus the entry it displays for detail pages (`project-page` takes a `Project`). |

Never skip tiers — composites use base, base uses foundation. The one exception is the pages tier: a page body may use composites, base and foundation directly.

Page bodies hold everything inside `<Layout>`. The route files in `src/pages/` stay thin: they pick the locale, pass `locale`, `routeKey`, a translated `title` (from `useTranslations(locale).meta`) and optionally a `description` to `<Layout>`, and render one page body. Never hardcode a title string in a route file. Because the body only takes `locale`, the same component serves both `/about` and `/en/about`.

## File Structure

Each component lives in its own directory:

```
src/components/base/button/
  button.svelte
  types.ts        ← optional, when props are complex
```

Do not put multiple components in a single file or directory.

## Svelte 5 Syntax

Always use Svelte 5 runes. Never use the legacy Options API.

```svelte
<script lang="ts">
    let { class: className = '', ...props }: MyProps = $props();
</script>
```

- `$props()` for all component props
- `$state()` for reactive local state
- `$bindable()` for two-way bound props
- `{#snippet}` / `{@render}` for content slots

## Class Props and `twMerge`

Every Svelte component that accepts external styling must:

1. Accept an optional `class` prop (rename to `className` internally to avoid collision with the HTML keyword)
2. Merge it via `twMerge` from `tailwind-merge`

```svelte
import { twMerge } from 'tailwind-merge';
let { class: className = '' } = $props();
// Usage:
<div class={twMerge('default-classes', className)}>
```

Reason: Tailwind utility conflicts are silently wrong without `twMerge`.

## Path Alias

Use `$lib` for all internal imports. `$lib` maps to `./src/`.

```ts
import { twMerge } from 'tailwind-merge';
import type { Project } from '$lib/types/project';
import { useTranslations } from '$lib/i18n';
```

Never use relative paths (`../../`) to cross component directories.

## Internationalization

- **The locale is a prop.** Route files fix it (`const locale = 'sv'` in root files, `getStaticPaths` in `src/pages/[locale]/…`) and pass it to `<Layout>` and the page body. Never read it from a global, a cookie or the request.
- Short UI strings: `useTranslations(locale)` from `$lib/i18n`. Add new keys to `src/i18n/ui.sv.ts` first — its shape is the `UiStrings` type, so `ui.en.ts` fails type-checking until it matches.
- Long-form content (experience timelines, bio paragraphs): create separate language-specific components (e.g. `swedish-experience.svelte` / `english-experience.svelte`)
- All internal links must go through `routeHref(locale, key, param?)` from `$lib/i18n`. Never hand-write an internal path.
- Page bodies (`src/components/pages/`) resolve text and links from their `locale` prop with `useTranslations(locale)` and `routeHref(locale, key, param?)`.
- Components in the foundation, base and composites tiers never resolve the locale or build links themselves — no runtime imports from `$lib/i18n` there (type-only imports such as `ProjectText` are fine). The page body or layout passes already-localized `href`s and translated labels in as props (e.g. `backHref`/`backLabel` on `sub-page`, `languages` on `language-links`). The one exception is the locale-split long-form components (ADR-002), which *are* a language.

```astro
---
const { locale } = Astro.props;
---
{locale === 'sv' ? <SwedishContent /> : <EnglishContent />}
```

## Image Handling

- **Optimized images** (processed by Astro): import as asset from `$lib/assets/`, use `.src` property
- **Static images** (in `public/images/`): reference by string path (`/images/filename.jpg`)

Do not mix patterns for the same type of image.

## TypeScript

TypeScript strict mode is enabled — see `tsconfig.json`. All component props must be typed. Use interfaces in a sibling `types.ts` when props are non-trivial.

## Anti-patterns

- **Do not use relative paths across component directories** — We tried this; it breaks path portability when files move and is inconsistent with the rest of the codebase. Use `$lib/...` always.
- **Do not use Svelte 4 Options API** — The project is Svelte 5 throughout. Mixing syntax causes subtle reactivity bugs and inconsistency. Use runes.
- **Do not add Tailwind classes without `twMerge` when a `class` prop is accepted** — Without merging, callers cannot override base styles and conflicting utilities silently apply both, producing undefined behavior.
- **Do not hardcode i18n strings in component markup** — English-only hardcoded text breaks the Swedish locale. Either use `useTranslations(locale)` or create language-specific components.

---

## How to contribute to this file

Add an entry when:
- A new naming convention or file structure pattern is established
- A code pattern is adopted project-wide (not a one-off)
- A pattern is explicitly rejected — add it to Anti-patterns with a reason

Do not document what Prettier or TypeScript already enforce. Reference config files instead.
