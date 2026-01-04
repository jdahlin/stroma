import { resolve } from 'node:path'
import { config } from '@repo/vitest-config'
import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig } from 'vitest/config'

export default defineConfig(
  mergeConfig(config, {
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@renderer', replacement: resolve(__dirname, 'src/renderer') },
        { find: '@repo/core', replacement: resolve(__dirname, '../../packages/core/src') },
        { find: '@repo/shared', replacement: resolve(__dirname, '../../packages/shared/src') },
        { find: '@repo/ux', replacement: resolve(__dirname, '../../packages/ux/src') },
      ],
    },
  }),
)