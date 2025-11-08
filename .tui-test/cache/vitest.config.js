//# hash=a95bcb6fb75cd1e90acf6ac949bdd292
//# sourceMappingURL=vitest.config.js.map

import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true
            }
        },
        fileParallelism: false,
        maxConcurrency: 1,
        testTimeout: 30000,
        hookTimeout: 30000,
        include: [
            'src/**/*.test.ts'
        ],
        coverage: {
            provider: 'v8',
            reporter: [
                'text',
                'html'
            ],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.test.ts'
            ]
        }
    }
});
