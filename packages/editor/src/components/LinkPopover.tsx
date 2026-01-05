import type { Editor } from '@tiptap/core'
import { Check, IconButton, Link2Off, X } from '@repo/ux'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import './LinkPopover.css'

export interface LinkPopoverProps {
  editor: Editor
  onClose: () => void
}

export const LinkPopover: React.FC<LinkPopoverProps> = ({ editor, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(() => {
    const attrs = editor.getAttributes('link') as { href?: unknown }
    return typeof attrs.href === 'string' ? attrs.href : ''
  })

  // Get current link URL if any
  useEffect(() => {
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
    <div className="editor-link-popover">
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="https://example.com"
        className="editor-link-popover__input"
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
