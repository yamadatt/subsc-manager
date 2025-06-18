import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.jsx', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {},
  },
];
