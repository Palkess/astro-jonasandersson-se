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

This is a two-step process:
1. **Compile Paraglide messages** — `paraglide-js compile --project ./project.inlang --outdir ./src/paraglide`
   Reads `messages/*.json` and generates TypeScript runtime in `src/paraglide/`.
2. **Astro build** — `astro build`
   Outputs a Node.js SSR server to `dist/`.

The build will fail if the Paraglide compile step is skipped and `src/paraglide/` is missing or stale.

## Preview

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

## Format

```bash
npm run format
```

Runs Prettier on all files. Always run this before committing.

## Editing i18n Messages

1. Edit `messages/en.json` or `messages/sv.json`
2. Run `npm run build` (or trigger the compile step directly: `npx paraglide-js compile --project ./project.inlang --outdir ./src/paraglide`)
3. The new message keys will be available as `m.key()` in source

Adding a new key: add it to both locale files. Missing keys in either locale will cause Paraglide type errors.

## Deployment

No CI/CD is configured. Deployment is manual:

1. Run `npm run build`
2. Transfer `dist/` to the server
3. Start with `node dist/server/entry.mjs` (Node.js standalone server)

The server must have Node.js available. It is not a static site and cannot be deployed to static hosting.

---

## How to contribute to this file

Update this file when:
- New scripts are added to `package.json`
- The build process changes (e.g. new compile steps)
- CI/CD is added
- Deployment instructions change
