import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {

    const isBrowserLib = mode === 'library';
    const isReactLib = mode === 'react';

    return {
        plugins: [
            react(),
            ...(isReactLib
                ? [dts({
                    tsconfigPath: './tsconfig.prod.json',
                    outDirs: 'dist',
                    insertTypesEntry: true,
                })]
                : []),
        ],
        server: {
            port: 3000
        },
        define: {
            global: 'globalThis',
        },
        build: isReactLib
            ? {
                outDir: 'dist/react',
                emptyOutDir: true,

                lib: {
                    entry: resolve(import.meta.dirname, 'src/index.ts'),
                    formats: ['es'],
                    fileName: () => 'index.js',
                    cssFileName: 'style',
                },

                rolldownOptions: {
                    external: [
                        'react',
                        'react-dom',
                        'react/jsx-runtime',
                        'react/jsx-dev-runtime',
                    ],
                },
            }
            : isBrowserLib
                ? {
                    outDir: 'dist-pkg/dist',
                    emptyOutDir: true,

                    lib: {
                        entry: resolve(import.meta.dirname, 'src/library.ts'),
                        name: 'ArchivalIIIFViewer',
                        formats: ['iife'],
                        fileName: () => 'archival-IIIF-viewer.min.js',
                        cssFileName: 'archival-IIIF-viewer',
                    },

                    minify: true,
                }
                : {
                    outDir: 'dist',
                    emptyOutDir: true,
                },
    };
});