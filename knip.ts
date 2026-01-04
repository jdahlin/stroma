import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'apps/main': {
      entry: ['src/index.ts'],
      project: ['src/**/*.{ts,tsx}'],
    },
    'apps/preload': {
      entry: ['src/index.ts'],
      project: ['src/**/*.{ts,tsx}'],
    },
    'apps/renderer': {
      entry: ['src/main.tsx'],
      project: ['src/**/*.{ts,tsx}'],
    },
    'apps/editor-standalone-web': {
      entry: ['src/main.tsx'],
      project: ['src/**/*.{ts,tsx}'],
    },
    'packages/*': {
      entry: ['src/index.ts'],
      project: ['src/**/*.{ts,tsx}'],
    },
  },
  ignoreDependencies: [
    'eslint-plugin-react',
    '@repo/prettier-config',
    '@repo/tsconfig',
  ],
}

export default config
