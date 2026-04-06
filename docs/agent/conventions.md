## When to consult this file

Consult this file when writing, editing, or reviewing any source code in this project. Not needed for deployment or infrastructure tasks.

---

# Code Conventions

## Formatting

Formatting is fully handled by Prettier — see `.prettierrc`. Run `npm run format` to apply.

## Component Architecture

Components follow a strict three-tier hierarchy:

| Tier | Path | Purpose |
|------|------|---------|
| **Foundation** | `src/components/foundation/` | Raw SVG icons. No logic, no styling variation. |
| **Base** | `src/components/base/` | Atomic UI components (buttons, links, labels). |
| **Composites** | `src/components/composites/` | Assembled from base components. Page-level sections. |

Never skip tiers — composites use base, base uses foundation.

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
import { m } from '$lib/paraglide/messages.js';
```

Never use relative paths (`../../`) to cross component directories.

## Internationalization

- Short UI strings: use `m.key()` message functions imported from `$lib/paraglide/messages.js`
- Long-form content (experience timelines, bio paragraphs): create separate language-specific components (e.g. `swedish-experience.svelte` / `english-experience.svelte`)
- All internal links must go through `localizeHref()` from `$lib/paraglide/runtime`
- Locale detection: use `getLocale()` from `$lib/paraglide/runtime`

```astro
---
import { getLocale } from '$lib/paraglide/runtime';
---
{getLocale() === 'sv' ? <SwedishContent /> : <EnglishContent />}
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
- **Do not hardcode i18n strings in component markup** — English-only hardcoded text breaks the Swedish locale. Either use `m.key()` or create language-specific components.

---

## How to contribute to this file

Add an entry when:
- A new naming convention or file structure pattern is established
- A code pattern is adopted project-wide (not a one-off)
- A pattern is explicitly rejected — add it to Anti-patterns with a reason

Do not document what Prettier or TypeScript already enforce. Reference config files instead.
