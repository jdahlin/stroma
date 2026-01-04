import repoConfig from '@repo/eslint-config'
import {
  coreBoundaries,
  mainBoundaries,
  rendererBoundaries,
  sharedBoundaries,
  uxBoundaries,
} from '@repo/eslint-config/boundaries'

export default repoConfig.append(
  {
    files: ['packages/shared/**'],
    ...sharedBoundaries,
  },
  {
    files: ['packages/core/**'],
    ...coreBoundaries,
  },
  {
    files: ['packages/ux/**'],
    ...uxBoundaries,
  },
  {
    files: ['apps/main/src/**'],
    ...mainBoundaries,
  },
  {
    files: ['apps/renderer/src/**'],
    ...rendererBoundaries,
  },
  {
    // The preload script runs in a special Node.js environment that acts as a bridge
    // between the main process and the renderer. In this specific context:
    // 1. We must use CommonJS `require('electron')` because the preload script is loaded
    //    before the ESM loader is fully patched in some Electron setups, and to ensure
    //    reliable access to the `electron` module.
    // 2. We access the global `process` object directly to expose version information
    //    (node, chrome, electron) to the renderer via `contextBridge`.
    // Therefore, we disable the standard ESM-only and no-global-process rules for this file.
    files: ['apps/preload/src/index.ts'],
    rules: {
      'ts/no-require-imports': 'off',
      'node/prefer-global/process': 'off',
    },
  },
)
