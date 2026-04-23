import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte({
        compileroptions: {
            css: 'external',
            customElement: true,
        }
    })],
    build: {
        outDir: '../wwwroot/ui',
        // emptyOutDir: false,
        /* rollupOptions: {
            input: 'main.js',
        } */
        lib: {
            entry: './entry.js',
            formats: ['es'],
            fileName: 'course-prioritizer'
        },
        rollupOptions: {
            external: ['./main.js'], // Add this line
        }
    }
});