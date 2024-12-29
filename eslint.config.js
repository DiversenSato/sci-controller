import jslint from '@eslint/js'
import tslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default tslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            jslint.configs.recommended,
            ...tslint.configs.recommended,
            ...tslint.configs.stylistic,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'stylistic': stylistic,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'stylistic/eol-last': ['error', 'always'],
            'stylistic/brace-style': ['error', '1tbs'],
            'stylistic/comma-dangle': ['error', 'always-multiline'],
            'stylistic/indent': ['warn', 4],
            'stylistic/no-extra-semi': 'error',
            'stylistic/semi': 'error',
            'stylistic/space-before-blocks': 'error',
            'stylistic/space-before-function-paren': ['error', {
                named: 'never',
                anonymous: 'always',
                asyncArrow: 'always',
            }],
            'stylistic/space-infix-ops': 'error',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
        },
    },
)
