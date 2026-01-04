import type { Editor } from '@tiptap/core'
import { IconButton } from '@repo/ux'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import React from 'react'
import { useToolbarState } from './hooks'

export interface EditorToolbarProps {
  /** TipTap editor instance */
  editor: Editor | null
  /** Additional CSS styles */
  style?: React.CSSProperties
}

const toolbarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-2)',
  borderBottom: '1px solid var(--color-border)',
  flexWrap: 'wrap',
}

const dividerStyles: React.CSSProperties = {
  width: '1px',
  height: '1.5rem',
  backgroundColor: 'var(--color-border)',
  margin: '0 var(--space-1)',
}

const Divider: React.FC = () => <div style={dividerStyles} />

const activeButtonStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-tertiary)',
  color: 'var(--color-text-primary)',
}

/**
 * Editor toolbar with formatting controls.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  style,
}) => {
  const state = useToolbarState(editor)

  if (!editor)
    return null

  return (
    <div style={{ ...toolbarStyles, ...style }}>
      {/* Text formatting */}
      <IconButton
        icon={Bold}
        label="Bold (Cmd+B)"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        style={state.isBold ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Italic}
        label="Italic (Cmd+I)"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        style={state.isItalic ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Strikethrough}
        label="Strikethrough"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        style={state.isStrike ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Code}
        label="Inline Code"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        style={state.isCode ? activeButtonStyle : undefined}
      />

      <Divider />

      {/* Headings */}
      <IconButton
        icon={Heading1}
        label="Heading 1"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        style={state.isHeading1 ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Heading2}
        label="Heading 2"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        style={state.isHeading2 ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Heading3}
        label="Heading 3"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        style={state.isHeading3 ? activeButtonStyle : undefined}
      />

      <Divider />

      {/* Lists */}
      <IconButton
        icon={List}
        label="Bullet List"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        style={state.isBulletList ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={ListOrdered}
        label="Numbered List"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        style={state.isOrderedList ? activeButtonStyle : undefined}
      />

      <Divider />

      {/* Blocks */}
      <IconButton
        icon={Quote}
        label="Blockquote"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={state.isBlockquote ? activeButtonStyle : undefined}
      />
      <IconButton
        icon={Minus}
        label="Horizontal Rule"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <Divider />

      {/* History */}
      <IconButton
        icon={Undo}
        label="Undo (Cmd+Z)"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
      />
      <IconButton
        icon={Redo}
        label="Redo (Cmd+Shift+Z)"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
      />
    </div>
  )
}
