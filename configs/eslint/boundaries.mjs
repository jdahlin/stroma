/**
 * Import boundary rules for different packages.
 * Each package should extend the appropriate boundary config.
 */

// @repo/shared - Cannot import anything from other packages
export const sharedBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@repo/core', '@repo/core/*'],
            message: '@repo/shared cannot import from @repo/core',
          },
          {
            group: ['@repo/storage', '@repo/storage/*'],
            message: '@repo/shared cannot import from @repo/storage',
          },
          {
            group: ['@repo/ux', '@repo/ux/*'],
            message: '@repo/shared cannot import from @repo/ux',
          },
          { group: ['@main', '@main/*'], message: '@repo/shared cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@repo/shared cannot import from @renderer',
          },
        ],
      },
    ],
  },
}

// @repo/core - Can only import from @repo/shared
export const coreBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@repo/storage', '@repo/storage/*'], message: '@repo/core cannot import from @repo/storage' },
          { group: ['@repo/ux', '@repo/ux/*'], message: '@repo/core cannot import from @repo/ux' },
          { group: ['@main', '@main/*'], message: '@repo/core cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@repo/core cannot import from @renderer',
          },
        ],
      },
    ],
  },
}

// @repo/ux - Can import from @repo/core and @repo/shared
export const uxBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@repo/storage', '@repo/storage/*'], message: '@repo/ux cannot import from @repo/storage' },
          { group: ['@main', '@main/*'], message: '@repo/ux cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@repo/ux cannot import from @renderer',
          },
        ],
      },
    ],
  },
}

// @main - Can import from @repo/core and @repo/shared, NOT @repo/ux or @renderer
export const mainBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@repo/ux', '@repo/ux/*'], message: '@main cannot import from @repo/ux' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@main cannot import from @renderer',
          },
        ],
      },
    ],
  },
}

// @repo/storage - Can import from @repo/core and @repo/shared (Node-only)
export const storageBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@repo/ux', '@repo/ux/*'], message: '@repo/storage cannot import from @repo/ux' },
          { group: ['@main', '@main/*'], message: '@repo/storage cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@repo/storage cannot import from @renderer',
          },
        ],
      },
    ],
  },
}

// @renderer - Can import from @repo/core, @repo/shared, @repo/ux, NOT @main
export const rendererBoundaries = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@main', '@main/*'], message: '@renderer cannot import from @main' },
          { group: ['@repo/storage', '@repo/storage/*'], message: '@renderer cannot import from @repo/storage' },
        ],
      },
    ],
  },
}
