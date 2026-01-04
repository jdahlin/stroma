import { lazy } from 'react'

/**
 * Lazy-loaded Editor component.
 * Use this in the desktop app to avoid impacting initial bundle size.
 *
 * @example
 * import { LazyEditor } from '@repo/editor/lazy'
 *
 * function NotesPane() {
 *   return (
 *     <Suspense fallback={<LoadingSpinner />}>
 *       <LazyEditor documentId="doc-1" />
 *     </Suspense>
 *   )
 * }
 */
export const LazyEditor = lazy(() =>
  import('./Editor').then(mod => ({ default: mod.Editor })),
)

// Re-export types for convenience (types don't affect bundle)
export type { DocumentContent, EditorProps } from './types'
