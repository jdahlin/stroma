import React from 'react';
import type { PdfAnchor, PdfFigureAnchor, PdfPointAnchor, PdfTextAnchor } from '@repo/core';
import { PdfHighlightOverlay } from './PdfHighlightOverlay';
import { PdfAnchorMarker } from './PdfAnchorMarker';
import { PdfFigureOverlay } from './PdfFigureOverlay';
import './PdfOverlayLayer.css';

interface PdfOverlayLayerProps {
  anchors: PdfAnchor[];
}

export const PdfOverlayLayer: React.FC<PdfOverlayLayerProps> = ({ anchors }) => {
  const textAnchors = anchors.filter((anchor) => anchor.type === 'text') as PdfTextAnchor[];
  const pointAnchors = anchors.filter((anchor) => anchor.type === 'point') as PdfPointAnchor[];
  const figureAnchors = anchors.filter((anchor) => anchor.type === 'figure') as PdfFigureAnchor[];

  return (
    <div className="pdf-overlay-layer">
      {textAnchors.map((anchor) => (
        <PdfHighlightOverlay key={anchor.id} anchor={anchor} />
      ))}
      {pointAnchors.map((anchor) => (
        <PdfAnchorMarker key={anchor.id} anchor={anchor} />
      ))}
      {figureAnchors.map((anchor) => (
        <PdfFigureOverlay key={anchor.id} anchor={anchor} />
      ))}
    </div>
  );
};
