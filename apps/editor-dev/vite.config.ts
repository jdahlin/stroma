import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@repo/core', replacement: resolve(__dirname, '../../packages/core/src') },
      { find: '@repo/editor', replacement: resolve(__dirname, '../../packages/editor/src') },
      { find: '@repo/editor/styles', replacement: resolve(__dirname, '../../packages/editor/src/styles/prosemirror.css') },
      { find: '@repo/shared', replacement: resolve(__dirname, '../../packages/shared/src') },
      { find: '@repo/ux', replacement: resolve(__dirname, '../../packages/ux/src') },
      { find: '@repo/ux/styles', replacement: resolve(__dirname, '../../packages/ux/src/styles/index.css') },
    ],
  },
  server: {
    port: 5174,
  },
})
