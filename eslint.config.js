const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

module.exports = [
  // Extend Next.js core web vitals config
  ...compat.extends('next/core-web-vitals'),

  // Global configuration
  {
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'e2e/**', // Playwright E2E tests have their own linting rules
    ],
  },
]
