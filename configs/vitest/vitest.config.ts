import { defineConfig } from 'vitest/config'

// Use any to avoid complex type merging issues between vite and vitest in this version
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
        '**/*.css',
        '**/*.d.ts',
      ],
      include: ['src/**'],
      // @ts-ignore - 'all' exists in v8 provider but might missing from types in this version
      all: true,
    },
  },
}

export default defineConfig(config)
