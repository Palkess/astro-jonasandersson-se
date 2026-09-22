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
            'Jonas Andersson - Fullstack webbutvecklare | Svelte, Angular, Vue | Tillgänglighet i benmärgen',
        aboutTitle: 'Om mig',
        portfolioTitle: 'Portfolio'
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
        subTitle: 'Fullstack webbutvecklare | Svelte, Angular, Vue | Tillgänglighet i benmärgen'
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
    }
};

export type UiStrings = typeof uiSv;
