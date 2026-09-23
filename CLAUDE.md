# jonasandersson.se — Claude Code Instructions

Personal portfolio and CV website for Jonas Andersson, a Swedish fullstack web developer. Built with Astro 5 (static output) + Svelte 5 + Tailwind CSS 4, bilingual (Swedish/English) via Astro's built-in i18n routing and TypeScript dictionaries in `src/i18n/`. Builds to static files, intended for GitHub Pages.

---

## Quick Start

```bash
npm run dev        # dev server at http://localhost:4321
npm run build      # static build to dist/
npm run preview    # preview production build
npm run check      # type-check .astro/.svelte/.ts (runs in CI)
npm run format     # format all files with Prettier
```

The build prerenders every page to static HTML in `dist/` — no compile step, no server. Every push to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml` (check → build → deploy).

---

## Boundaries

> Do not modify these without explicit human review.

| Path                                         | Reason                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/i18n/ui.*.ts`, `src/i18n/projects.*.ts` | Translation source of truth. Every change must be made in both `sv` and `en`.                                |
| `src/i18n/routes.ts`                         | Routing table. Changing a slug or locale changes public URLs, and GitHub Pages cannot redirect the old ones. |
| `.prettierrc`                                | Formatting config used by all contributors.                                                                  |

---

## Reference Files

Consult these files only when the condition applies — do not load all of them by default:

- @docs/agent/conventions.md — when writing, editing, or reviewing code
- @docs/agent/architecture.md — when navigating the codebase or proposing structural changes
- @docs/agent/decisions.md — when making or evaluating architectural or design choices
- @docs/agent/bugs.md — when debugging, investigating errors, or working around known issues
- @docs/agent/workflows.md — when running, building, testing, or deploying
- @docs/agent/skills.md — when onboarding or assessing unfamiliar parts of the stack
- @docs/agent/context.md — when interpreting domain-specific terms or portfolio data model
