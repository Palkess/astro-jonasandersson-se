import type { ProjectSlug } from '$lib/types/project';

export interface ProjectText {
    title: string;
    descriptionTitle: string;
    description: string;
}

/** Keyed by every `ProjectSlug`, so a project missing a translation fails type-checking. */
export type ProjectTexts = Record<ProjectSlug, ProjectText>;
