import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: './',
    plugins: [react()],
    build: {
        outDir: 'website-dist',
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'website.html'),
        },
    },
});
