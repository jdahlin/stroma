import type { PdfPointAnchor } from '@repo/core'
import React from 'react'
import './PdfAnchorMarker.css'

interface PdfAnchorMarkerProps {
  anchor: PdfPointAnchor
}

export const PdfAnchorMarker: React.FC<PdfAnchorMarkerProps> = ({ anchor }) => {
  return (
    <div
      className="pdf-anchor-marker"
      data-anchor-id={anchor.id}
      style={{
        left: `${anchor.point.x * 100}%`,
        top: `${anchor.point.y * 100}%`,
      }}
    />
  )
}
