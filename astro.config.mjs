// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

import { paraglideVitePlugin } from '@inlang/paraglide-js';
import node from '@astrojs/node';

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
        plugins: [
            tailwindcss(),
            paraglideVitePlugin({
                project: './project.inlang',
                outdir: './src/paraglide',
                strategy: ['url', 'cookie', 'baseLocale']
            })
        ],
        resolve: {
            alias: {
                $lib: new URL('./src', import.meta.url).pathname
            }
        }
    },

    output: 'server',
    adapter: node({ mode: 'standalone' })
});
