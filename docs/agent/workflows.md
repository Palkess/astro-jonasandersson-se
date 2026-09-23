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

## Type-check

```bash
npm run check
```

Runs `astro check`, which type-checks `.astro` and `.svelte` files as well as `.ts`. Plain `tsc` skips component files, so prop types are only checked here. CI runs it before every build.

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

The site is fully static and hosted on GitHub Pages at `https://jonasandersson.se`. `site` in `astro.config.mjs` is set to that domain, and no `base` is used.

**Every push to `main` deploys.** `.github/workflows/deploy.yml` runs `npm ci` → `npm run check` → `npm run build`, uploads `dist/` as the Pages artifact, and deploys it with `actions/deploy-pages`. It can also be started by hand (`workflow_dispatch`). If `check` or `build` fails, nothing is deployed and the live site stays as it was.

`public/CNAME` holds the custom domain. With an Actions-based deploy, GitHub takes the domain from the repo's Pages settings rather than from this file, so the settings are what actually matter; the file is kept for parity with the sibling project.

### One-time setup (repo owner)

1. **Repo → Settings → Pages → Build and deployment → Source:** "GitHub Actions".
2. **Settings → Pages → Custom domain:** `jonasandersson.se`. It's also worth verifying the domain under the account's Settings → Pages, so no other repo can claim it.
3. **DNS for the apex domain** (at the registrar):
    - `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
    - `AAAA` records: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
    - Optionally `www` as a `CNAME` to `palkess.github.io`, so `www.jonasandersson.se` redirects to the apex.
    - Remove the old records that point at the Node server.
4. When the DNS check passes in Pages settings, tick **Enforce HTTPS**.
5. Once `https://jonasandersson.se/` and `/en/` serve the static build, shut down the old Node.js server.

---

## How to contribute to this file

Update this file when:

- New scripts are added to `package.json`
- The build process changes (e.g. new compile steps)
- CI/CD is added
- Deployment instructions change
