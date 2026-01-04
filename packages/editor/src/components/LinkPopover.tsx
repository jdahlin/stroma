import type { Editor } from '@tiptap/core'
import { IconButton } from '@repo/ux'
import { Check, Link2Off, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface LinkPopoverProps {
  editor: Editor
  onClose: () => void
}

const popoverStyles: React.CSSProperties = {
  position: 'absolute',
  zIndex: 'var(--z-popover)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-2)',
  backgroundColor: 'var(--color-bg-primary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
}

const inputStyles: React.CSSProperties = {
  width: '240px',
  padding: 'var(--space-2)',
  fontSize: 'var(--text-sm)',
  fontFamily: 'inherit',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--color-text-primary)',
  outline: 'none',
}

export const LinkPopover: React.FC<LinkPopoverProps> = ({ editor, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')

  // Get current link URL if any
  useEffect(() => {
    const attrs = editor.getAttributes('link')
    if (attrs.href) {
      setUrl(attrs.href)
    }
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editor])

  const handleSubmit = useCallback(() => {
    if (url.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.trim() })
        .run()
    }
    onClose()
  }, [editor, url, onClose])

  const handleRemove = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    onClose()
  }, [editor, onClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
      else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    },
    [handleSubmit, onClose],
  )

  const isLink = editor.isActive('link')

  return (
    <div style={popoverStyles}>
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://example.com"
        style={inputStyles}
      />
      <IconButton
        icon={Check}
        label="Apply link"
        size="sm"
        onClick={handleSubmit}
      />
      {isLink && (
        <IconButton
          icon={Link2Off}
          label="Remove link"
          size="sm"
          onClick={handleRemove}
        />
      )}
      <IconButton
        icon={X}
        label="Cancel"
        size="sm"
        onClick={onClose}
      />
    </div>
  )
}
