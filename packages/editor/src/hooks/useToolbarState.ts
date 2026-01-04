import type { Editor } from '@tiptap/core'
import { useCallback } from 'react'
import { useEditorState } from './useEditorState'

export interface ToolbarState {
  // Text formatting
  isBold: boolean
  isItalic: boolean
  isStrike: boolean
  isCode: boolean

  // Block types
  isHeading1: boolean
  isHeading2: boolean
  isHeading3: boolean
  isBulletList: boolean
  isOrderedList: boolean
  isBlockquote: boolean
  isCodeBlock: boolean

  // Links
  isLink: boolean

  // History
  canUndo: boolean
  canRedo: boolean
}

const defaultState: ToolbarState = {
  isBold: false,
  isItalic: false,
  isStrike: false,
  isCode: false,
  isHeading1: false,
  isHeading2: false,
  isHeading3: false,
  isBulletList: false,
  isOrderedList: false,
  isBlockquote: false,
  isCodeBlock: false,
  isLink: false,
  canUndo: false,
  canRedo: false,
}

/**
 * Track active formatting state for the toolbar.
 * Updates reactively when selection changes.
 */
export function useToolbarState(editor: Editor | null): ToolbarState {
  const selector = useCallback((e: Editor): ToolbarState => {
    return {
      isBold: e.isActive('bold'),
      isItalic: e.isActive('italic'),
      isStrike: e.isActive('strike'),
      isCode: e.isActive('code'),
      isHeading1: e.isActive('heading', { level: 1 }),
      isHeading2: e.isActive('heading', { level: 2 }),
      isHeading3: e.isActive('heading', { level: 3 }),
      isBulletList: e.isActive('bulletList'),
      isOrderedList: e.isActive('orderedList'),
      isBlockquote: e.isActive('blockquote'),
      isCodeBlock: e.isActive('codeBlock'),
      isLink: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }
  }, [])

  return useEditorState(editor, selector) ?? defaultState
}
