import type { PdfRect } from '@repo/core'
import React, { useCallback, useEffect } from 'react'
import './PdfSelectionLayer.css'

interface PdfSelectionLayerProps {
  pageRef: React.RefObject<HTMLDivElement | null>
  onCreateTextAnchor: (pageIndex: number, text: string, rects: PdfRect[]) => void
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export const PdfSelectionLayer: React.FC<PdfSelectionLayerProps> = ({
  pageRef,
  onCreateTextAnchor,
}) => {
  const captureSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed)
      return

    const text = selection.toString().trim()
    if (!text)
      return

    const range = selection.getRangeAt(0)
    const pageEl = pageRef.current
    if (!pageEl || !pageEl.contains(range.commonAncestorContainer)) {
      return
    }

    const pageIndex = Number(pageEl.dataset.pageIndex ?? -1)
    if (Number.isNaN(pageIndex) || pageIndex < 0)
      return

    const pageRect = pageEl.getBoundingClientRect()
    const selectionRect = range.getBoundingClientRect()

    const x = clamp((selectionRect.left - pageRect.left) / pageRect.width, 0, 1)
    const y = clamp((selectionRect.top - pageRect.top) / pageRect.height, 0, 1)
    const width = clamp(selectionRect.width / pageRect.width, 0, 1)
    const height = clamp(selectionRect.height / pageRect.height, 0, 1)

    onCreateTextAnchor(pageIndex, text, [{ x, y, width, height }])
    selection.removeAllRanges()
  }, [onCreateTextAnchor, pageRef])

  useEffect(() => {
    const pageEl = pageRef.current
    if (!pageEl)
      return undefined

    const handleMouseUp = () => captureSelection()
    pageEl.addEventListener('mouseup', handleMouseUp)

    return () => pageEl.removeEventListener('mouseup', handleMouseUp)
  }, [captureSelection, pageRef])

  return <div className="pdf-selection-layer" />
}
