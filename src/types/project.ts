/** Every project slug. Adding a project means adding its slug here first. */
export type ProjectSlug = 'olandsstuguthyrning-com' | 'helensfotvard-se';

/**
 * Locale-invariant facts about a portfolio project. Anything a human reads
 * (title, descriptions) lives in `src/i18n/projects.*.ts`, keyed by `slug`.
 */
export interface Project {
    slug: ProjectSlug;
    image: string;
    technologies: string[];
    status: 'public' | 'private' | 'inprogress';
    githubUrl?: string;
    url: string;
    releaseDate: string;
}
