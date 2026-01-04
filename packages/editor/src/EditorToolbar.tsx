import type { Editor } from '@tiptap/core'
import { IconButton } from '@repo/ux'
import {
  Bold,
  Code,
  Code2,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { LinkPopover } from './components'
import { useToolbarState } from './hooks'

export interface EditorToolbarProps {
  /** TipTap editor instance */
  editor: Editor | null
  /** Additional CSS styles */
  style?: React.CSSProperties
}

const toolbarStyles: React.CSSProperties = {
  position: 'relative',
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

const linkPopoverStyles: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 'var(--space-2)',
  marginTop: 'var(--space-1)',
}

/**
 * Editor toolbar with formatting controls.
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  style,
}) => {
  const state = useToolbarState(editor)
  const [showLinkPopover, setShowLinkPopover] = useState(false)

  const handleLinkClick = useCallback(() => {
    setShowLinkPopover(true)
  }, [])

  const handleLinkPopoverClose = useCallback(() => {
    setShowLinkPopover(false)
  }, [])

  const handleImageInsert = useCallback(() => {
    const url = window.prompt('Image URL')
    if (!url)
      return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handlePdfReferenceInsert = useCallback(() => {
    const sourceName = window.prompt('PDF name')
    if (!sourceName)
      return
    const pageInput = window.prompt('Page number (1-based)', '1')
    if (!pageInput)
      return
    const pageNumber = Number(pageInput)
    if (!Number.isFinite(pageNumber) || pageNumber < 1)
      return

    editor
      .chain()
      .focus()
      .insertPdfReference({
        anchorId: crypto.randomUUID(),
        sourceId: crypto.randomUUID(),
        sourceName: sourceName.trim() || 'PDF',
        pageIndex: pageNumber - 1,
      })
      .run()
  }, [editor])

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
        data-active={state.isBold}
      />
      <IconButton
        icon={Italic}
        label="Italic (Cmd+I)"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        data-active={state.isItalic}
      />
      <IconButton
        icon={Strikethrough}
        label="Strikethrough"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        data-active={state.isStrike}
      />
      <IconButton
        icon={Code}
        label="Inline Code"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        data-active={state.isCode}
      />

      <Divider />

      {/* Headings */}
      <IconButton
        icon={Heading1}
        label="Heading 1"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        data-active={state.isHeading1}
      />
      <IconButton
        icon={Heading2}
        label="Heading 2"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        data-active={state.isHeading2}
      />
      <IconButton
        icon={Heading3}
        label="Heading 3"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        data-active={state.isHeading3}
      />

      <Divider />

      {/* Lists */}
      <IconButton
        icon={List}
        label="Bullet List"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={state.isBulletList}
      />
      <IconButton
        icon={ListOrdered}
        label="Numbered List"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        data-active={state.isOrderedList}
      />

      <Divider />

      {/* Blocks */}
      <IconButton
        icon={Quote}
        label="Blockquote"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        data-active={state.isBlockquote}
      />
      <IconButton
        icon={Code2}
        label="Code Block"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        data-active={state.isCodeBlock}
      />
      <IconButton
        icon={Minus}
        label="Horizontal Rule"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <Divider />

      {/* Insert */}
      <IconButton
        icon={Link}
        label="Insert Link (Cmd+K)"
        size="sm"
        onClick={handleLinkClick}
        data-active={state.isLink}
      />
      <IconButton
        icon={Image}
        label="Insert Image"
        size="sm"
        onClick={handleImageInsert}
      />
      <IconButton
        icon={FileText}
        label="Insert PDF Reference"
        size="sm"
        onClick={handlePdfReferenceInsert}
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

      {/* Link Popover */}
      {showLinkPopover && (
        <div style={linkPopoverStyles}>
          <LinkPopover editor={editor} onClose={handleLinkPopoverClose} />
        </div>
      )}
    </div>
  )
}
