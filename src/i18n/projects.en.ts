import type { ProjectTexts } from '$lib/i18n/types';

/** English project texts. Keep in sync with `projects.sv.ts`. */
export const projectsEn: ProjectTexts = {
    'olandsstuguthyrning-com': {
        title: 'Olandsstuguthyrning.com',
        descriptionTitle: 'Landing page for cottage rental on Öland',
        description:
            'Helen and Lars rent out their cottages all year round on Öland and needed their own page to showcase their cottages and be able to direct the tenants to their booking partner to send a booking request. And be able to offer their tenants some useful information about the area, such as bird watching. In September 2026 the site was rebuilt from scratch as a static Astro site in Swedish, English and German, with a photo gallery for every cottage, and moved from a self-hosted IIS server to GitHub Pages. It makes no third-party requests at all until the visitor has given consent.'
    },
    'helensfotvard-se': {
        title: 'Helensfotvard.se',
        descriptionTitle: 'Website for a medical foot care clinic in Borgholm',
        description:
            "Helen runs Helens Fotvård, a medical foot care clinic in Borgholm on Öland, and needed a website that presents her treatments and makes it easy for customers to book an appointment. It's built as a static Astro site on GitHub Pages, with a page for every treatment, structured data for search engines and smooth transitions between pages. Google Tag Manager is only loaded once the visitor has accepted cookies."
    }
};
