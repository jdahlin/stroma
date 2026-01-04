import type { NodeViewProps } from '@tiptap/react'
import { Icon } from '@repo/ux'
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react'
import React, { useCallback, useState } from 'react'

const sectionStyles: React.CSSProperties = {
  position: 'relative',
  marginBottom: 'var(--space-3)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg-primary)',
}

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-2) var(--space-3)',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
  cursor: 'pointer',
  userSelect: 'none',
}

const dragHandleStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color-text-muted)',
  cursor: 'grab',
}

const chevronStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color-text-secondary)',
}

const titleInputStyles: React.CSSProperties = {
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  outline: 'none',
  fontFamily: 'inherit',
}

const contentStyles: React.CSSProperties = {
  padding: 'var(--space-3)',
}

const collapsedContentStyles: React.CSSProperties = {
  display: 'none',
}

export function SectionBlock({ node, updateAttributes }: NodeViewProps) {
  const { title, collapsed } = node.attrs
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const toggleCollapsed = useCallback(() => {
    updateAttributes({ collapsed: !collapsed })
  }, [collapsed, updateAttributes])

  const handleTitleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditTitle(title)
  }, [title])

  const handleTitleBlur = useCallback(() => {
    setIsEditing(false)
    if (editTitle.trim() !== title) {
      updateAttributes({ title: editTitle.trim() || 'Untitled Section' })
    }
  }, [editTitle, title, updateAttributes])

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleBlur()
    }
    else if (e.key === 'Escape') {
      e.preventDefault()
      setEditTitle(title)
      setIsEditing(false)
    }
  }, [handleTitleBlur, title])

  return (
    <NodeViewWrapper style={sectionStyles} data-drag-handle>
      <div style={headerStyles} onClick={toggleCollapsed}>
        <div style={dragHandleStyles} data-drag-handle>
          <Icon icon={GripVertical} size="sm" />
        </div>
        <div style={chevronStyles}>
          <Icon icon={collapsed ? ChevronRight : ChevronDown} size="sm" />
        </div>
        {isEditing
          ? (
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                onClick={e => e.stopPropagation()}
                style={titleInputStyles}
                autoFocus
              />
            )
          : (
              <span
                style={{ ...titleInputStyles, cursor: 'text' }}
                onClick={handleTitleClick}
              >
                {title}
              </span>
            )}
      </div>
      <NodeViewContent
        style={collapsed ? collapsedContentStyles : contentStyles}
      />
    </NodeViewWrapper>
  )
}
