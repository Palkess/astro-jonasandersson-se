// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// Static output (Astro's default): every page is prerendered to `dist/` and
// served by GitHub Pages from the jonasandersson.se custom domain, so no `base`.
// https://astro.build/config
export default defineConfig({
    site: 'https://jonasandersson.se',

    i18n: {
        defaultLocale: 'sv',
        locales: ['sv', 'en'],
        routing: {
            // Swedish stays unprefixed so existing inbound links survive.
            prefixDefaultLocale: false
        }
    },

    integrations: [svelte()],

    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                $lib: new URL('./src', import.meta.url).pathname
            }
        }
    }
});
