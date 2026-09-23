/**
 * Swedish UI strings — the source of truth for `ui.en.ts`.
 * The shape of this object defines the `UiStrings` type the other locales must match.
 *
 * Long-form content (career timeline, history) stays in the locale-specific
 * Svelte components, see ADR-002.
 */
export const uiSv = {
    meta: {
        siteTitle:
            'Jonas Andersson - Fullstack webbutvecklare | Svelte, Angular, Vue, React | Tillgänglighet i benmärgen',
        aboutTitle: 'Om mig',
        portfolioTitle: 'Portfolio',
        notFoundTitle: 'Sidan hittades inte',
        homeDescription:
            'Jonas Andersson – fullstack webbutvecklare från Öland/Kalmar som bygger tillgängliga, användarvänliga webbplatser med Svelte, Angular, Vue och React.',
        aboutDescription:
            'Lär känna Jonas: fullstack webbutvecklare på Tieto med erfarenhet från design till produktion, tidigare på Alpacha och Searchminds. Uppvuxen på Öland.',
        portfolioDescription:
            'Webbplatser som Jonas Andersson har byggt, från stuguthyrning till fotvårdsklinik på Öland – statiska Astro-sidor med fokus på tillgänglighet och prestanda.',
        ogImageAlt:
            'Skärmbild av startsidan: Jonas Andersson, fullstack webbutvecklare, med teknik-taggar (Svelte, Typescript, Angular, Vue, Node, .NET) och en rund bild på Jonas.'
    },

    nav: {
        home: 'Hem',
        about: 'Vem är jag?',
        portfolio: 'Portfolio',
        back: 'Gå tillbaka'
    },

    common: {
        profileImgAlt:
            'Bild på Jonas som har kortklipt hår, medellångt fullskägg och har en grön skjorta på sig.'
    },

    home: {
        subTitle:
            'Fullstack webbutvecklare | Svelte, Angular, Vue, React | Tillgänglighet i benmärgen'
    },

    about: {
        summary:
            'Hej, mitt namn är Jonas 👋 Jag är en fullstack webbutvecklare från Öland/Kalmar som har en passion för att ta fram smarta, smidiga och snygga webblösningar. Efter många år inom IT-branschen och med en bred kompetens inom hela utvecklingsprocessen från design till produktion, har jag en gedigen erfarenhet av att skapa webbplatser och applikationer som är användarvänliga, tilltalande och effektiva.',
        skills: 'Huvudkunskaper'
    },

    portfolio: {
        readAbout: 'Här kan ni läsa om några av dom projekt som jag har varit med och utvecklat.',
        usedTech: 'Använda tekniker',
        gotoWebpage: 'Gå till webbplatsen',
        release: 'Release'
    },

    notFound: {
        text: 'Sidan du letar efter finns inte. Den kan ha flyttats eller tagits bort.',
        homeLink: 'Gå till startsidan'
    }
};

export type UiStrings = typeof uiSv;
