import type { PdfAnchor } from '@repo/core'
import React from 'react'
import { PdfAnchorMarker } from './PdfAnchorMarker'
import { PdfFigureOverlay } from './PdfFigureOverlay'
import { PdfHighlightOverlay } from './PdfHighlightOverlay'
import './PdfOverlayLayer.css'

interface PdfOverlayLayerProps {
  anchors: PdfAnchor[]
}

export const PdfOverlayLayer: React.FC<PdfOverlayLayerProps> = ({ anchors }) => {
  const textAnchors = anchors.filter(anchor => anchor.type === 'text')
  const pointAnchors = anchors.filter(anchor => anchor.type === 'point')
  const figureAnchors = anchors.filter(anchor => anchor.type === 'figure')

  return (
    <div className="pdf-overlay-layer">
      {textAnchors.map(anchor => (
        <PdfHighlightOverlay key={anchor.id} anchor={anchor} />
      ))}
      {pointAnchors.map(anchor => (
        <PdfAnchorMarker key={anchor.id} anchor={anchor} />
      ))}
      {figureAnchors.map(anchor => (
        <PdfFigureOverlay key={anchor.id} anchor={anchor} />
      ))}
    </div>
  )
}
