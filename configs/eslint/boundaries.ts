/**
 * Import boundary rules for different packages.
 * Each package should extend the appropriate boundary config.
 */

import type { Linter } from 'eslint';

interface BoundaryConfig {
  rules: Linter.RulesRecord;
}

// @shared - Cannot import anything from other packages
export const sharedBoundaries: BoundaryConfig = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@core', '@core/*'], message: '@shared cannot import from @core' },
          { group: ['@ux', '@ux/*'], message: '@shared cannot import from @ux' },
          { group: ['@main', '@main/*'], message: '@shared cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@shared cannot import from @renderer',
          },
        ],
      },
    ],
  },
};

// @core - Can only import from @shared
export const coreBoundaries: BoundaryConfig = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@ux', '@ux/*'], message: '@core cannot import from @ux' },
          { group: ['@main', '@main/*'], message: '@core cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@core cannot import from @renderer',
          },
        ],
      },
    ],
  },
};

// @ux - Can import from @core and @shared
export const uxBoundaries: BoundaryConfig = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@main', '@main/*'], message: '@ux cannot import from @main' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@ux cannot import from @renderer',
          },
        ],
      },
    ],
  },
};

// @main - Can import from @core and @shared, NOT @ux or @renderer
export const mainBoundaries: BoundaryConfig = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@ux', '@ux/*'], message: '@main cannot import from @ux' },
          {
            group: ['@renderer', '@renderer/*'],
            message: '@main cannot import from @renderer',
          },
        ],
      },
    ],
  },
};

// @renderer - Can import from @core, @shared, @ux, NOT @main
export const rendererBoundaries: BoundaryConfig = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [{ group: ['@main', '@main/*'], message: '@renderer cannot import from @main' }],
      },
    ],
  },
};
