import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // Relative assets keep the built Demo usable from a local file:// URL as well as a hosted path.
    base: './',
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            generateScopedName: 'Fresnica-[local]-[hash:base64:5]',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}";`,
            },
        },
    },
    build: {
        outDir: 'demo-dist',
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                examples: resolve(__dirname, 'examples.html'),
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
        assetsInlineLimit: 4096,
    },
});
