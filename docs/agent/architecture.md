## When to consult this file

Consult this file when navigating the codebase, proposing structural changes, or debugging routing and rendering behaviour. Not needed for simple component edits.

---

# Architecture

## Overview

Personal portfolio/CV website for Jonas Andersson. Built with Astro 5 (SSR) + Svelte 5 + Tailwind CSS 4 + Paraglide JS. Deployed as a Node.js server (not static).

## Runtime Mode

**Server-side rendered (SSR).** `astro.config.mjs` sets `output: 'server'` with `@astrojs/node` adapter in `standalone` mode. This means every request is handled by a live Node.js process — there is no prerendered static output.

Reason: Paraglide's URL-based locale strategy requires server-side request interception via middleware. See `decisions.md`.

## Request Pipeline

```
Request
  └─ Astro middleware (src/middleware.ts)
       └─ paraglideMiddleware()       ← locale detection from URL / cookie / baseLocale
            └─ Page render
                 └─ Layout.astro      ← top menu, footer, slot
                      └─ Page content (Astro + Svelte components)
```

## Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/pages/index.astro` | Landing page: name, subtitle, skills, profile image, nav |
| `/about` | `src/pages/about/index.astro` | About page: career timeline, biography |
| `/portfolio` | `src/pages/portfolio/index.astro` | Portfolio listing: project teasers |

There are no dynamic routes (`[slug].astro`) — portfolio item detail pages do not yet exist. See `bugs.md`.

## Component Hierarchy

```
Foundation (src/components/foundation/)
  └─ Icons: Github, LinkedIn, FlagBritain, FlagSweden, AppWindow, ExternalLink, MoveLeft

Base (src/components/base/)
  └─ button, language-links, page-title, paper, skills-list, social-links

Composites (src/components/composites/)
  └─ project-teaser, sub-page
  └─ swedish-experience, english-experience   ← locale-split content
  └─ swedish-history, english-history         ← locale-split content
```

Composites are assembled from Base components. Pages use composites directly. Foundation icons are leaf nodes — no dependencies.

## Internationalization

- **Base locale:** Swedish (`sv`)
- **Secondary locale:** English (`en`)
- **Detection order:** URL path → cookie → base locale
- **Message source:** `messages/en.json` and `messages/sv.json`
- **Compiled output:** `src/paraglide/` (auto-generated, never edit)
- **Usage:** `m.key()` for short strings; separate language components for long-form content

URL structure: Swedish content at `/`, English content at `/en/` (Paraglide URL strategy).

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

- **Portfolio projects**: hardcoded `Project[]` array in `src/pages/portfolio/index.astro`
- **Career history**: encoded in the locale-specific experience/history Svelte components
- **i18n strings**: `messages/*.json`

## Key Utilities

| Utility | Location | Purpose |
|---------|----------|---------|
| `$lib` alias | `tsconfig.json` + `astro.config.mjs` | Maps `$lib/*` → `./src/*` |
| `twMerge` | `tailwind-merge` (npm) | Merge Tailwind class props safely |
| `getSkillClassColors()` | `src/utils/getSkillClassColors.ts` | Maps tech name → Tailwind color classes |
| `m.*()` | `$lib/paraglide/messages.js` | i18n message functions |
| `localizeHref()` | `$lib/paraglide/runtime` | Prefix hrefs with locale path |
| `getLocale()` | `$lib/paraglide/runtime` | Get current locale at runtime |

---

## How to contribute to this file

Update this file when:
- New pages, routes, or major components are added
- The rendering mode changes (e.g. static prerendering is added)
- The i18n strategy or locale list changes
- A new significant utility or integration is introduced

Do not document individual component internals here — that belongs in conventions.md.
