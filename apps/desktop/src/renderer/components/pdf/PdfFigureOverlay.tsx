import React from 'react';
import type { PdfFigureAnchor } from '@repo/core';
import './PdfFigureOverlay.css';

interface PdfFigureOverlayProps {
  anchor: PdfFigureAnchor;
}

export const PdfFigureOverlay: React.FC<PdfFigureOverlayProps> = ({ anchor }) => {
  return (
    <div
      className="pdf-figure-overlay"
      data-anchor-id={anchor.id}
      style={{
        left: `${anchor.rect.x * 100}%`,
        top: `${anchor.rect.y * 100}%`,
        width: `${anchor.rect.width * 100}%`,
        height: `${anchor.rect.height * 100}%`,
      }}
    />
  );
};
