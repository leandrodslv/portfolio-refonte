import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'

export default tseslint.config(
  {
    ignores: [
      'dist',
      '.astro',
      '.vercel',
      'coverage',
      'ancien-portfolio',
      'studio',
      'playwright-report',
      'test-results',
      'storybook-static',
      '.lighthouseci',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@sanity/*', 'sanity', 'sanity/*'],
              message: 'Sanity ne se lit que depuis src/content/ (AD-2).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/content/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
