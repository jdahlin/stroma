import type { NodeViewProps } from '@tiptap/react'
import { Icon } from '@repo/ux'
import { NodeViewWrapper } from '@tiptap/react'
import { FileText } from 'lucide-react'
import React, { useCallback } from 'react'

const wrapperStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-1) var(--space-2)',
  borderRadius: '999px',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-secondary)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
  userSelect: 'none',
}

const nameStyles: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  maxWidth: '12rem',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const pageBadgeStyles: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-secondary)',
  backgroundColor: 'var(--color-bg-tertiary)',
  borderRadius: 'var(--radius-sm)',
  padding: '0 var(--space-1)',
}

export function PdfReferenceNode({ node, extension }: NodeViewProps) {
  const { anchorId, sourceName, pageIndex, previewText } = node.attrs
  const { onReferenceClick } = extension.options

  const handleActivate = useCallback(() => {
    onReferenceClick?.(anchorId)
  }, [anchorId, onReferenceClick])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleActivate()
      }
    },
    [handleActivate],
  )

  const ariaLabel = previewText
    ? `${sourceName}, page ${pageIndex + 1}: ${previewText}`
    : `${sourceName}, page ${pageIndex + 1}`

  return (
    <NodeViewWrapper
      as="span"
      style={wrapperStyles}
      data-pdf-reference
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      contentEditable={false}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <Icon icon={FileText} size="sm" />
      <span style={nameStyles}>{sourceName}</span>
      <span style={pageBadgeStyles}>p.{pageIndex + 1}</span>
    </NodeViewWrapper>
  )
}
