import type { Editor } from '@tiptap/core'
import type { DocumentContent } from '../types'
import { useCallback, useRef, useSyncExternalStore } from 'react'

/**
 * Subscribe to editor state changes using React's useSyncExternalStore.
 * Provides a reactive way to read editor state in React components.
 */
export function useEditorState<T>(
  editor: Editor | null,
  selector: (editor: Editor) => T,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T | null {
  const lastSnapshotRef = useRef<T | null>(null)

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!editor)
        return () => {}

      editor.on('update', callback)
      editor.on('selectionUpdate', callback)
      editor.on('transaction', callback)

      return () => {
        editor.off('update', callback)
        editor.off('selectionUpdate', callback)
        editor.off('transaction', callback)
      }
    },
    [editor],
  )

  const getSnapshot = useCallback(() => {
    if (!editor)
      return null
    const nextValue = selector(editor)
    const lastValue = lastSnapshotRef.current

    if (lastValue !== null && isEqual(lastValue, nextValue))
      return lastValue

    lastSnapshotRef.current = nextValue
    return nextValue
  }, [editor, isEqual, selector])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * Get the current document content as JSON.
 */
export function useDocumentContent(editor: Editor | null): DocumentContent | null {
  return useEditorState(editor, e => e.getJSON())
}

/**
 * Check if the editor is empty.
 */
export function useIsEmpty(editor: Editor | null): boolean {
  return useEditorState(editor, e => e.isEmpty) ?? true
}

/**
 * Check if the editor can undo.
 */
export function useCanUndo(editor: Editor | null): boolean {
  return useEditorState(editor, e => e.can().undo()) ?? false
}

/**
 * Check if the editor can redo.
 */
export function useCanRedo(editor: Editor | null): boolean {
  return useEditorState(editor, e => e.can().redo()) ?? false
}
