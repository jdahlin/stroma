import type { Editor } from '@tiptap/core'
import { EditorContent as TiptapEditorContent } from '@tiptap/react'
import React from 'react'

export interface EditorContentProps {
  /** TipTap editor instance */
  editor: Editor | null
  /** Additional CSS styles */
  style?: React.CSSProperties
}

const contentStyles: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: 'var(--space-4)',
}

/**
 * TipTap editor content area wrapper.
 * Provides the editable content region.
 */
export const EditorContent: React.FC<EditorContentProps> = ({
  editor,
  style,
}) => {
  return (
    <div style={{ ...contentStyles, ...style }}>
      <TiptapEditorContent editor={editor} />
    </div>
  )
}
