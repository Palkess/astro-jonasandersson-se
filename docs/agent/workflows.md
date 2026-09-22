## When to consult this file

Consult this file when running, building, testing, or deploying the project.

---

# Workflows

## Development

```bash
npm run dev
```

Starts the Astro dev server at `http://localhost:4321`. Hot module replacement is active.

## Build

```bash
npm run build
```

`astro build` prerenders every page to static HTML in `dist/` (`dist/index.html`, `dist/about/index.html`, `dist/en/about/index.html`, …).

## Preview

```bash
npm run preview
```

Serves `dist/` locally, like a static host would, for testing before deployment.

## Format

```bash
npm run format
```

Runs Prettier on all files. Always run this before committing.

## Editing i18n Messages

1. Add the key to `src/i18n/ui.sv.ts` (Swedish is the source of truth; its shape defines the `UiStrings` type).
2. Add the English text at the same path in `src/i18n/ui.en.ts`. Until you do, `ui.en.ts` fails type-checking.
3. Use it as `useTranslations(locale).<group>.<key>` in a page body, and pass it down as a prop.

Portfolio project texts work the same way in `src/i18n/projects.{sv,en}.ts`, keyed by slug. No compile step is needed; they're plain TypeScript.

## Deployment

The site is fully static: `npm run build` produces `dist/`, and any static file host can serve it as-is. No Node.js is needed at runtime. The intended host is GitHub Pages on the `jonasandersson.se` custom domain; `site` in `astro.config.mjs` is set to that and no `base` is used.

No CI/CD is configured yet.

---

## How to contribute to this file

Update this file when:
- New scripts are added to `package.json`
- The build process changes (e.g. new compile steps)
- CI/CD is added
- Deployment instructions change
