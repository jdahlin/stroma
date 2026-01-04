import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TextLayer, setLayerDimensions } from 'pdfjs-dist/legacy/build/pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import type { PdfAnchor, PdfRect } from '@repo/core';
import { PdfSelectionLayer } from './PdfSelectionLayer';
import { PdfOverlayLayer } from './PdfOverlayLayer';
import './PdfPage.css';

interface PdfPageProps {
  doc: PDFDocumentProxy | null;
  pageNumber: number;
  scale: number;
  anchors: PdfAnchor[];
  onCreateTextAnchor: (pageIndex: number, text: string, rects: PdfRect[]) => void;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  doc,
  pageNumber,
  scale,
  anchors,
  onCreateTextAnchor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);

  const pageIndex = pageNumber - 1;

  const pageAnchors = useMemo(() => {
    return anchors.filter((anchor) => anchor.pageIndex === pageIndex);
  }, [anchors, pageIndex]);

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;

    const renderPage = async () => {
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      if (cancelled) return;

      setPageSize({ width: viewport.width, height: viewport.height });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const textLayer = textLayerRef.current;
      if (textLayer) {
        textLayer.innerHTML = '';
        setLayerDimensions(textLayer, viewport);
        const textContent = await page.getTextContent();
        const layer = new TextLayer({
          textContentSource: textContent,
          container: textLayer,
          viewport,
        });
        await layer.render();
      }
    };

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [doc, pageNumber, scale]);

  const pageStyle: React.CSSProperties | undefined = pageSize
    ? {
        width: pageSize.width,
        height: pageSize.height,
        ['--scale-factor' as string]: scale,
      }
    : { ['--scale-factor' as string]: scale };

  return (
    <div
      ref={pageRef}
      className="pdf-page"
      style={pageStyle}
      data-page-index={pageIndex}
    >
      <canvas ref={canvasRef} className="pdf-page-canvas" />
      <div ref={textLayerRef} className="pdf-page-text textLayer" />
      <PdfSelectionLayer pageRef={pageRef} onCreateTextAnchor={onCreateTextAnchor} />
      <PdfOverlayLayer anchors={pageAnchors} />
    </div>
  );
};
