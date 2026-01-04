import { defineConfig } from 'vitest/config'

// Use any for the exported config object to avoid complex type merging issues 
// between different versions of Vite and Vitest types in this shared config package.
// This ensures that consuming packages can use mergeConfig without type errors.
export const config: any = {
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.{ts,tsx}',
        '**/*.types.ts',
        '**/*.css',
        '**/*.d.ts',
      ],
      include: ['src/**'],
      // @ts-ignore - 'all' exists in v8 provider but might be missing from types in this version
      all: true,
    },
  },
}

export default defineConfig(config)
