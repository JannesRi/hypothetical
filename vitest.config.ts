import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        passWithNoTests: true,
        typecheck: {
            enabled: true,
            include: ['src/**/*.test.ts'],
        },
        coverage: {
            enabled: true,
            provider: 'v8',
        },
    },
})
