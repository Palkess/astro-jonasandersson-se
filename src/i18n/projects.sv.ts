import type { ProjectTexts } from '$lib/i18n/types';

/** Swedish project texts — the source of truth for `projects.en.ts`. */
export const projectsSv: ProjectTexts = {
    'olandsstuguthyrning-com': {
        title: 'Olandsstuguthyrning.com',
        descriptionTitle: 'Landningssida för uthyrning av stugor på Öland',
        description:
            'Helen och Lars hyr ut sina stugor året runt på Öland och behövde en egen sida för att visa upp sina stugor och kunna dirigera hyrgästerna till sin bokningspartner för att skicka en bokningsförfrågan. Samt kunna erbjuda sina hyrgäster lite nyttig information kring området, som fågelskådning. I september 2026 byggdes sidan om från grunden till en statisk Astro-webbplats på svenska, engelska och tyska, med ett bildgalleri för varje stuga, och flyttades från en egen IIS-server till GitHub Pages. Sidan gör inte en enda förfrågan till tredje part innan besökaren har gett sitt samtycke.'
    },
    'helensfotvard-se': {
        title: 'Helensfotvard.se',
        descriptionTitle: 'Webbplats för en klinik för medicinsk fotvård i Borgholm',
        description:
            'Helen driver Helens Fotvård, en klinik för medicinsk fotvård i Borgholm på Öland, och behövde en webbplats som presenterar hennes behandlingar och gör det enkelt för kunderna att boka tid. Sidan är byggd som en statisk Astro-webbplats på GitHub Pages, med en egen sida för varje behandling, strukturerad data för sökmotorer och mjuka övergångar mellan sidorna. Google Tag Manager laddas först när besökaren har godkänt kakor.'
    }
};
