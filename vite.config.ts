import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {

    const isBrowserLib = mode === 'library';
    const isReactLib = mode === 'react';

    return {
        plugins: [
            react(),
            ...(isBrowserLib
                ? [cssInjectedByJsPlugin()]
                : []),
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
            ...(isBrowserLib
                ? {
                    'process.env.NODE_ENV': JSON.stringify('production'),
                }
                : {}),
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
                    sourcemap: true,
                    license: {
                        fileName: 'archival-IIIF-viewer.min.js.LICENSE.txt',
                    },
                }
                : {
                    outDir: 'dist',
                    emptyOutDir: true,
                },
    };
});