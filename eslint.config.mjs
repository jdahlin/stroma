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
    files: ['apps/desktop/src/main/**'],
    ...mainBoundaries,
  },
  {
    files: ['apps/desktop/src/renderer/**'],
    ...rendererBoundaries,
  },
)
