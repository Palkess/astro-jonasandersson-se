## When to consult this file

Consult this file when debugging, investigating errors, or working around known issues. Not needed for new feature development unless the feature touches an affected area.

---

# Known Issues

## When to update this file

Add an entry when:
- A bug is confirmed with a reproducible case
- A workaround is found for a known issue
- A suspected issue is promoted to confirmed (update the label)
- A bug is fixed (add a "Resolved" note with date, do not delete the entry — it may inform future decisions)

---

## Confirmed Bugs

### BUG-001: HTML `lang` attribute hardcoded to `"en"`

**Status:** Confirmed

**Location:** `src/layouts/Layout.astro`, `<html lang="en">`

**Description:** The `lang` attribute on the root `<html>` element is statically set to `"en"` and does not change when the active locale is Swedish (`sv`). This means Swedish-language pages are served with incorrect language metadata.

**Impact:**
- Screen readers and assistive technology will use English pronunciation rules for Swedish content
- SEO signals for Swedish content are incorrect
- Fails WCAG 2.2 Success Criterion 3.1.1 (Language of Page) for Swedish pages

**Workaround:** None currently applied. Fix requires importing `getLocale()` from `$lib/paraglide/runtime` in `Layout.astro` and setting `lang={getLocale()}` (or mapping to the correct BCP 47 tag: `sv` → `sv`, `en` → `en`).

**Related decision:** ADR-005 (Paraglide locale detection strategy) — the locale is available at request time since the site is SSR.

---

## Suspected Issues

### SUSPECT-001: Portfolio detail pages are linked but do not exist

**Status:** Suspected / In progress

**Location:** `src/components/composites/project-teaser/project-teaser.svelte`, `src/pages/portfolio/index.astro`

**Description:** The `project-teaser` component links to `/portfolio/{project.slug}` and the `Project` type includes a `slug` field, but there is no corresponding dynamic route (`src/pages/portfolio/[slug].astro`). Clicking a project link will result in a 404.

**Impact:** Portfolio detail pages are effectively non-functional.

**Likely intent:** Detail pages are planned but not yet implemented. The `Project` type has `translations` field with per-locale content, suggesting the full detail page was designed but not built.

**Workaround:** None. Do not expose project links in production until the dynamic route is implemented.

---

## How to contribute to this file

- Label every entry clearly: **Confirmed** or **Suspected**
- Never present a suspicion with the same confidence as a confirmed bug
- When a bug is fixed, add a `**Resolved:** YYYY-MM-DD — <brief description of fix>` line rather than deleting the entry
- Cross-reference `decisions.md` when the root cause is a known architectural choice
