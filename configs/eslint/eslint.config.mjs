import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: process.cwd(),
    },
  },
  formatters: true,
}, {
  files: ['**/*.ts', '**/*.tsx'],
  rules: {
    // Forbid inline overrides (force config-level overrides)
    'ts/ban-ts-comment': ['error', { 'ts-ignore': true, 'ts-nocheck': true, 'ts-expect-error': 'allow-with-description' }],
    'eslint-comments/no-use': ['error', { allow: [] }],

    // async correctness (LLM bug magnets)
    'ts/no-floating-promises': 'error',
    'ts/no-misused-promises': ['error', { checksVoidReturn: true }],
    'ts/await-thenable': 'error',

    // correctness + maintainability
    'ts/only-throw-error': 'error',
    'ts/switch-exhaustiveness-check': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'ts/no-explicit-any': 'error',
    'ts/no-non-null-assertion': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/strict-boolean-expressions': 'error',
    'react/no-leaked-conditional-rendering': 'error',
  },
}, {
  files: ['apps/desktop/src/renderer/chrome/CommandPalette.tsx'],
  rules: {
    'ts/strict-boolean-expressions': 'off',
  },
})
