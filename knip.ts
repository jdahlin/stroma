import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  workspaces: {
    'apps/desktop': {
      entry: [
        'src/main/index.ts',
        'src/preload/index.ts',
        'src/renderer/main.tsx',
      ],
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
