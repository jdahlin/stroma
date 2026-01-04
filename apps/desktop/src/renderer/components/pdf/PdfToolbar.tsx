import React from 'react'
import './PdfToolbar.css'

interface PdfToolbarProps {
  title: string
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onOpenPdf: () => void
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  title,
  scale,
  onZoomIn,
  onZoomOut,
  onOpenPdf,
}) => {
  return (
    <div className="pdf-toolbar">
      <div className="pdf-toolbar-title">{title}</div>
      <div className="pdf-toolbar-actions">
        <button type="button" onClick={onOpenPdf}>
          Open
        </button>
        <div className="pdf-toolbar-zoom">
          <button type="button" onClick={onZoomOut}>
            -
          </button>
          <span>
            {Math.round(scale * 100)}
            %
          </span>
          <button type="button" onClick={onZoomIn}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}
