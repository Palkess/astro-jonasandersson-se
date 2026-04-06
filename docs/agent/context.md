## When to consult this file

Consult this file when interpreting domain-specific terms, working with the portfolio data model, or when context from the business domain is needed to produce semantically correct output.

---

# Domain Context

## Site Purpose

Personal portfolio and CV website for **Jonas Andersson**, a Swedish fullstack web developer. The site serves as a professional introduction, career history, and portfolio showcase. Primary audience: potential employers and clients.

## Locale Model

- **Base locale:** `sv` (Swedish) — default language, served at root paths (`/`, `/about`, `/portfolio`)
- **Secondary locale:** `en` (English) — served at prefixed paths (`/en/`, `/en/about`, `/en/portfolio`)
- Swedish is the primary audience language; English is for international visitors
- "Base locale" in Paraglide terms means: this locale is used when no locale signal is found in the URL or cookie

## The `Project` Type

Portfolio entries are modelled as `Project` objects (`src/types/project.ts`):

| Field | Type | Meaning |
|-------|------|---------|
| `slug` | `string` | URL identifier for the portfolio detail page |
| `title` | `string` | Display name of the project |
| `description` | `string` | Short description (locale-specific via translations) |
| `technologies` | `string[]` | Tech stack tags — must match known skill names for color mapping |
| `status` | `'public' \| 'private' \| 'inprogress'` | Visibility/completion state |
| `githubUrl` | `string \| undefined` | Link to source code if public |
| `url` | `string \| undefined` | Link to live project |
| `releaseDate` | `Date \| undefined` | When the project launched |
| `translations` | `Record<string, {title, description}>` | Per-locale overrides |

## Skill / Technology Terms

Technologies listed in a project or on the home skills list must match the known names in `getSkillClassColors()` (`src/utils/getSkillClassColors.ts`) to receive branded color treatment. Known names:

`TypeScript`, `Svelte`, `SvelteKit`, `Tailwind`, `TailwindCSS`, `MySQL`, `IIS`, `Angular`, `Vue`, `Node`, `.NET`

Technologies not in this list render with a neutral gray color. This is not an error — it is a graceful fallback.

## Project Status Values

| Value | Meaning |
|-------|---------|
| `public` | Live, publicly accessible project |
| `private` | Built but not publicly accessible (client work, internal tools) |
| `inprogress` | Work in progress, not yet launched |

## Career Context

Jonas's professional history (encoded in the experience/history components):
- **Tietoevry** — 2021 to present
- **Alpacha AB** — 2018–2021
- **Searchminds Group AB** — 2017–2018
- **BTH (Blekinge Institute of Technology)** — Teaching assistant 2016–2017

This context is relevant when editing the experience or history components to ensure chronological and factual accuracy.

## View Transition Names

Named view transitions create matched animation pairs between pages. The names are semantic:

| Name | What it animates |
|------|-----------------|
| `page-title` | The `<h1>` page title across navigations |
| `profile-image` | Jonas's profile photo |
| `top-menu` | The top navigation bar |
| `page-content` | Main page content area |
| `expertise-list` | The skills list on the home page |
| `project-image-{slug}` | Per-project image, keyed by slug for portfolio transitions |

Mismatching transition names between pages breaks the animation — ensure paired elements use identical names.

---

## How to contribute to this file

Add an entry when:
- A domain term is used in code with a meaning that differs from common usage
- A business rule exists that is not obvious from the code
- A missing piece of context here would cause an agent to produce technically correct but semantically wrong output (e.g. wrong locale, broken skill color, wrong career history)
