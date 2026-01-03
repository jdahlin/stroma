import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

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
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer'),
      '@core': resolve(__dirname, '../../packages/core/src'),
      '@shared': resolve(__dirname, '../../packages/shared/src'),
      '@ux': resolve(__dirname, '../../packages/ux/src'),
    },
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
});
