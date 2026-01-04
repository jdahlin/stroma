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
    // async correctness (LLM bug magnets)
    'ts/no-floating-promises': 'error',
    'ts/no-misused-promises': ['error', { checksVoidReturn: true }],
    'ts/await-thenable': 'error',

    // correctness + maintainability
    'ts/only-throw-error': 'error',
    'ts/switch-exhaustiveness-check': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
})
