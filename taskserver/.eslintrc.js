module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
    },
    extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    rules: {
        'prettier/prettier': 'error',
        'import/extensions': 'off',
        'no-console': 'off',
        'import/order': [
            'error',
            {
                'newlines-between': 'never',
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'parent', 'sibling', 'index'],
                ],
            },
        ],
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint-parser': ['.ts'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryType: true,
                project: './tsconfig.json',
            },
        },
    },
};
