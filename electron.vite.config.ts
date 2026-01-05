import type { Alias } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function aliases(...packages: string[]): Alias[] {
  return packages.map(pkg => ({
    find: `@repo/${pkg}`,
    replacement: resolve(__dirname, `packages/${pkg}/src`),
  }))
}

export default defineConfig({
  main: {
    build: {
      outDir: 'apps/main/dist',
      lib: {
        entry: 'apps/main/src/index.ts',
        formats: ['es'],
      },
      rollupOptions: {
        external: ['electron', 'better-sqlite3'],
        input: {
          index: resolve(__dirname, 'apps/main/src/index.ts'),
        },
      },
    },
    resolve: { alias: aliases('core', 'shared', 'storage') },
  },
  preload: {
    build: {
      outDir: 'apps/preload/dist',
      lib: {
        entry: 'apps/preload/src/index.ts',
        formats: ['cjs'],
      },
      rollupOptions: {
        external: ['electron'],
      },
    },
    resolve: { alias: aliases('core', 'shared') },
  },
  renderer: {
    base: './',
    build: {
      outDir: 'apps/renderer/dist',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'apps/renderer/index.html'),
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        { find: /^@repo\/editor\/styles$/, replacement: resolve(__dirname, 'packages/editor/src/styles/prosemirror.css') },
        { find: '@renderer', replacement: resolve(__dirname, 'apps/renderer/src') },
        ...aliases('core', 'editor', 'shared', 'ux'),
      ],
    },
    root: 'apps/renderer',
    server: {
      port: 5173,
      fs: {
        allow: [resolve(__dirname, '.')],
      },
    },
  },
})
