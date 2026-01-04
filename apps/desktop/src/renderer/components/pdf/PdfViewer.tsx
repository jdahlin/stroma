import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';
import type { PdfAnchor, PdfAnchorId, PdfRect } from '@repo/core';
import { PdfViewport } from './PdfViewport';
import { PdfPage } from './PdfPage';
import './PdfViewer.css';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfViewerProps {
  data: Uint8Array;
  scale: number;
  anchors: PdfAnchor[];
  focusedAnchorId: PdfAnchorId | null;
  onCreateTextAnchor: (pageIndex: number, text: string, rects: PdfRect[]) => void;
  onZoomDelta?: (factor: number) => void;
  onLoadStateChange?: (state: 'loading' | 'ready' | 'error') => void;
  initialScrollRatio?: number;
  onScrollRatioChange?: (ratio: number) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  data,
  scale,
  anchors,
  focusedAnchorId,
  onCreateTextAnchor,
  onZoomDelta,
  onLoadStateChange,
  initialScrollRatio,
  onScrollRatioChange,
}) => {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const dataCopy = data.slice();
    const task = getDocument({ data: dataCopy });
    const load = async () => {
      try {
        const loaded = await task.promise;
        if (!cancelled) {
          setDoc(loaded);
          onLoadStateChange?.('ready');
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('Failed to load PDF document.', error);
          onLoadStateChange?.('error');
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
      task.destroy().catch(() => undefined);
      setDoc(null);
    };
  }, [data, onLoadStateChange]);

  useEffect(() => {
    if (!focusedAnchorId) return;
    const target = document.querySelector(`[data-anchor-id="${focusedAnchorId}"]`);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('pdf-anchor-flash');
      window.setTimeout(() => target.classList.remove('pdf-anchor-flash'), 600);
    }
  }, [focusedAnchorId]);

  useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport || !doc) return;
    if (initialScrollRatio === undefined) return;

    const clamp = Math.max(0, Math.min(1, initialScrollRatio));
    let inner = 0;
    const applyScroll = () => {
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      if (maxScroll <= 0) return;
      viewport.scrollTop = maxScroll * clamp;
    };

    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(applyScroll);
    });

    return () => {
      window.cancelAnimationFrame(outer);
      if (inner) window.cancelAnimationFrame(inner);
    };
  }, [doc, initialScrollRatio, scale]);

  const pages = useMemo(() => {
    if (!doc) return [];
    return Array.from({ length: doc.numPages }, (_, index) => index + 1);
  }, [doc]);

  return (
    <PdfViewport
      onZoomDelta={onZoomDelta}
      onScrollRatioChange={onScrollRatioChange}
      scrollRef={scrollRef}
    >
      <div className="pdf-page-stack">
        {pages.map((pageNumber) => (
          <PdfPage
            key={pageNumber}
            doc={doc}
            pageNumber={pageNumber}
            scale={scale}
            anchors={anchors}
            onCreateTextAnchor={onCreateTextAnchor}
          />
        ))}
      </div>
    </PdfViewport>
  );
};
