import type { NodeViewProps } from '@tiptap/react'
import type { PdfReferenceAttributes } from '../types'
import { FileText, Icon } from '@repo/ux'
import { NodeViewWrapper } from '@tiptap/react'
import React, { useCallback } from 'react'
import './PdfReferenceNode.css'

export function PdfReferenceNode({ node, extension }: NodeViewProps) {
  const attrs = node.attrs as Partial<PdfReferenceAttributes>
  const anchorId = typeof attrs.anchorId === 'string' ? attrs.anchorId : ''
  const sourceName = typeof attrs.sourceName === 'string' ? attrs.sourceName : 'PDF'
  const pageIndex = Number.isFinite(attrs.pageIndex) ? (attrs.pageIndex as number) : 0
  const previewText = typeof attrs.previewText === 'string' ? attrs.previewText : ''
  const { onReferenceClick } = extension.options as {
    onReferenceClick?: (anchor: string) => void
  }

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

  const ariaLabel = previewText.length > 0
    ? `${sourceName}, page ${pageIndex + 1}: ${previewText}`
    : `${sourceName}, page ${pageIndex + 1}`

  return (
    <NodeViewWrapper
      as="span"
      className="editor-pdf-reference"
      data-pdf-reference
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      contentEditable={false}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      <Icon icon={FileText} size="sm" />
      <span className="editor-pdf-reference__name">{sourceName}</span>
      <span className="editor-pdf-reference__page">{`p.${pageIndex + 1}`}</span>
    </NodeViewWrapper>
  )
}
