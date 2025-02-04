const { resolve } = require('node:path')
const project = resolve(process.cwd(), 'tsconfig.json')

/** @type { import("eslint").Linter.LegacyConfig } */
module.exports = {
    root: true,
    ignorePatterns: ['vitest.config.ts'],
    extends: [
        require.resolve('@vercel/style-guide/eslint/node'),
        require.resolve('@vercel/style-guide/eslint/typescript'),
        require.resolve('@vercel/style-guide/eslint/vitest'),
        'prettier',
    ],
    parserOptions: {
        project,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project,
            },
        },
    },
    rules: {
        '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/restrict-template-expressions': [
            'warn',
            { allowArray: true, allowBoolean: true, allowNumber: true },
        ],
        'import/no-default-export': 'off',
        'no-promise-executor-return': 'off',
        'unicorn/filename-case': [
            'error',
            { cases: { camelCase: true, pascalCase: true } },
        ],
        'vitest/prefer-lowercase-title': [
            'error',
            { ignoreTopLevelDescribe: true },
        ],
    },
}
