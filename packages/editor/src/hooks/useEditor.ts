import type { Editor, Extensions } from '@tiptap/core'
import type { DocumentContent } from '../types'
import { useEditor as useTiptapEditor } from '@tiptap/react'
import { configureExtensions } from '../extensions'

export interface UseEditorOptions {
  /** Initial document content */
  content?: DocumentContent
  /** Called on every content change */
  onChange?: (content: DocumentContent) => void
  /** PDF reference click handler */
  onPdfReferenceClick?: (anchorId: string) => void
  /** Additional extensions to include */
  extensions?: Extensions
  /** Placeholder text when empty */
  placeholder?: string
  /** Disable editing */
  editable?: boolean
  /** Auto-focus on mount */
  autofocus?: boolean | 'start' | 'end' | 'all' | number
}

/**
 * Create and manage a TipTap editor instance.
 * Wraps useTiptapEditor with project-specific configuration.
 */
export function useEditor(options: UseEditorOptions = {}): Editor | null {
  const {
    content,
    onChange,
    onPdfReferenceClick,
    extensions = [],
    placeholder,
    editable = true,
    autofocus = false,
  } = options

  const editor = useTiptapEditor({
    extensions: [
      ...configureExtensions({ placeholder, onPdfReferenceClick }),
      ...extensions,
    ],
    content,
    editable,
    autofocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  return editor
}
