import type { EditorProps } from './types'
import React from 'react'
import { EditorContent } from './EditorContent'
import { EditorToolbar } from './EditorToolbar'
import { useEditor } from './hooks'

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: 'var(--color-bg-primary)',
}

/**
 * Main Editor component.
 * Composes toolbar, content area, and manages editor state.
 */
export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onPdfReferenceClick,
  placeholder,
  readOnly = false,
  autoFocus = false,
}) => {
  const editor = useEditor({
    content,
    onChange,
    onPdfReferenceClick,
    placeholder,
    editable: !readOnly,
    autofocus: autoFocus,
  })

  return (
    <div style={containerStyles}>
      {!readOnly && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
