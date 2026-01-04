import React from 'react';
import type { PdfTextAnchor } from '@repo/core';
import './PdfHighlightOverlay.css';

interface PdfHighlightOverlayProps {
  anchor: PdfTextAnchor;
}

export const PdfHighlightOverlay: React.FC<PdfHighlightOverlayProps> = ({ anchor }) => {
  return (
    <>
      {anchor.rects.map((rect, index) => (
        <div
          key={`${anchor.id}-${index}`}
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
  );
};
