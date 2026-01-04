import type { PdfTextAnchor } from '@repo/core'
import React from 'react'
import './PdfHighlightOverlay.css'

interface PdfHighlightOverlayProps {
  anchor: PdfTextAnchor
}

export const PdfHighlightOverlay: React.FC<PdfHighlightOverlayProps> = ({ anchor }) => {
  return (
    <>
      {anchor.rects.map(rect => (
        <div
          key={`${anchor.id}-${rect.x}-${rect.y}-${rect.width}-${rect.height}`}
          className="pdf-highlight"
          data-anchor-id={anchor.id}
          style={{
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.width * 100}%`,
            height: `${rect.height * 100}%`,
          }}
        />
      ))}
    </>
  )
}
