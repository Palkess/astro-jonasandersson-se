/**
 * Portfolio projects — locale-invariant data only.
 *
 * Titles and descriptions live in `src/i18n/projects.{sv,en}.ts`, keyed by the
 * same `slug`. Nothing here should contain Swedish or English prose.
 */

import type { Project } from '$lib/types/project';

export const projects: Project[] = [
    {
        slug: 'olandsstuguthyrning-com',
        image: '/images/olandsstuguthyrning.jpg',
        technologies: ['TypeScript', 'Astro', 'Svelte', 'Tailwind', 'GitHub Pages'],
        status: 'private',
        url: 'https://olandsstuguthyrning.com',
        releaseDate: '2025-03-18'
    },
    {
        slug: 'helensfotvard-se',
        image: '/images/helensfotvard.jpg',
        technologies: ['TypeScript', 'Astro', 'Svelte', 'Tailwind', 'GitHub Pages'],
        status: 'public',
        githubUrl: 'https://github.com/Palkess/astro-helensfotvard-se',
        url: 'https://helensfotvard.se',
        releaseDate: '2026-03-28'
    }
];
