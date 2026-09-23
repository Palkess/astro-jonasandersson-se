# jonasandersson.se

Personal portfolio and CV website for Jonas Andersson, a Swedish fullstack web developer. Live at [jonasandersson.se](https://jonasandersson.se).

Built with [Astro 7](https://astro.build) (static output), [Svelte 5](https://svelte.dev) and [Tailwind CSS 4](https://tailwindcss.com). Available in Swedish (default, `/`) and English (`/en/`).

## Getting started

Requires Node 22 or later.

```sh
npm install
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command           | Action                                                      |
| :---------------- | :---------------------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`                    |
| `npm run build`   | Build the static site to `./dist/`                          |
| `npm run preview` | Serve the production build locally                          |
| `npm run check`   | Type-check `.astro`, `.svelte` and `.ts` files (runs in CI) |
| `npm run format`  | Format all files with Prettier                              |

## Project structure

```text
src/
├── components/
│   ├── foundation/   SVG icons
│   ├── base/         Atomic UI components (buttons, links, labels)
│   ├── composites/   Sections built from base components, incl. the cookie consent banner
│   └── pages/        One page body per route, takes `locale`
├── data/             Portfolio projects (locale-invariant data)
├── i18n/             Routing table and Swedish/English dictionaries
├── layouts/          Layout.astro: <head>, hreflang, language switcher, menu, footer
├── pages/            Thin route files; Swedish at the root, other locales under [locale]/
├── styles/           global.css (Tailwind theme and custom utilities)
└── utils/
```

## Internationalization

There is no i18n library. Routing uses Astro's built-in i18n with Swedish unprefixed and English under `/en/`; the URL alone decides the language. UI strings live in `src/i18n/ui.{sv,en}.ts` and portfolio texts in `src/i18n/projects.{sv,en}.ts`. Swedish is the source of truth, so the English files fail type-checking until they match. Long-form content (career history, privacy policy) is written as separate Swedish and English components.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml` (check → build → deploy to GitHub Pages). If the check or build fails, nothing is deployed.

Google Tag Manager is loaded only after a visitor accepts the cookie banner. The container id comes from the `PUBLIC_GTM_ID` repository variable; while it's unset, the build contains no GTM code.

## Documentation

Architecture, conventions, design decisions and workflows are documented in [`docs/agent/`](docs/agent/), with [`AGENTS.md`](AGENTS.md) as the entry point.
