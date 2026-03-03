export interface ProjectTranslation {
    title: string;
    descriptionTitle: string;
    description: string;
}

export interface Project {
    slug: string;
    title: string;
    descriptionTitle: string;
    description: string;
    image: string;
    technologies: string[];
    status: 'public' | 'private' | 'inprogress';
    githubUrl?: string;
    url: string;
    releaseDate: string;
    translations: {
        [key: string]: ProjectTranslation;
    };
}
