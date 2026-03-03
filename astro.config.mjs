// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

import { paraglideVitePlugin } from '@inlang/paraglide-js';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    integrations: [svelte()],

    vite: {
        plugins: [
            tailwindcss(),
            paraglideVitePlugin({
                project: './project.inlang',
                outdir: './src/paraglide'
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
