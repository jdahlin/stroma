import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: [
      { find: '@renderer', replacement: resolve(__dirname, 'src/renderer') },
      { find: '@repo/core', replacement: resolve(__dirname, '../../packages/core/src') },
      { find: '@repo/editor', replacement: resolve(__dirname, '../../packages/editor/src') },
      { find: '@repo/shared', replacement: resolve(__dirname, '../../packages/shared/src') },
      { find: '@repo/ux', replacement: resolve(__dirname, '../../packages/ux/src') },
    ],
  },
  server: {
    port: 5173,
    fs: {
      allow: [resolve(__dirname, '../..')],
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
})
