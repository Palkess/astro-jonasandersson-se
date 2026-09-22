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
    }
];
