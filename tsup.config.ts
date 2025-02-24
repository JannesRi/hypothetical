import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    clean: true,
    sourcemap: true,
    dts: true,
    tsconfig: 'tsconfig.build.json',
})
