// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { alternatePaths } from './src/i18n/routes';

// Static output (Astro's default): every page is prerendered to `dist/` and
// served by GitHub Pages from the jonasandersson.se custom domain, so no `base`.
const site = 'https://jonasandersson.se';

// https://astro.build/config
export default defineConfig({
    site,

    i18n: {
        defaultLocale: 'sv',
        locales: ['sv', 'en'],
        routing: {
            // Swedish stays unprefixed so existing inbound links survive.
            prefixDefaultLocale: false
        }
    },

    integrations: [
        svelte(),
        /*
         * The alternates come from `routeSlugs` (via `alternatePaths`) rather
         * than the plugin's own `i18n` option, so the sitemap and the pages'
         * `hreflang` links share one routing table and can't disagree — also
         * about `x-default`, which the plugin option doesn't emit (ADR-009).
         *
         * `src/i18n/routes.ts` imports nothing, which is what makes it safe to
         * read from here — the config runs before `astro:i18n` exists.
         */
        sitemap({
            serialize(item) {
                const links = alternatePaths(new URL(item.url).pathname).map((alternate) => ({
                    lang: alternate.lang,
                    url: new URL(alternate.path, site).href
                }));

                return links.length > 0 ? { ...item, links } : item;
            }
        })
    ],

    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                $lib: new URL('./src', import.meta.url).pathname
            }
        }
    }
});
