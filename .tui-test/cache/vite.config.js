//# hash=498ac6fb73f0801747ffe6a6a8b7c697
//# sourceMappingURL=vite.config.js.map

import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: [
                'es'
            ],
            fileName: function() {
                return 'index.js';
            }
        },
        rollupOptions: {
            external: [
                'chalk',
                'commander',
                'child_process',
                'crypto',
                'util',
                'path',
                'os',
                'fs',
                'fs/promises',
                'url',
                'module',
                'net',
                'http',
                'express',
                'puppeteer',
                '@microsoft/tui-test',
                '@xterm/xterm',
                '@xterm/addon-fit',
                '@xterm/addon-webgl'
            ],
            output: {
                preserveModules: false,
                manualChunks: undefined,
                inlineDynamicImports: true
            }
        },
        target: 'node18',
        outDir: 'dist',
        emptyOutDir: true
    }
});
