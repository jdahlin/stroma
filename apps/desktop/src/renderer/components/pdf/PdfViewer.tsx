import type { PdfAnchor, PdfAnchorId, PdfRect } from '@repo/core'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PdfPage } from './PdfPage'
import { PdfViewport } from './PdfViewport'
import './PdfViewer.css'

GlobalWorkerOptions.workerSrc = workerSrc

interface PdfViewerProps {
  data: Uint8Array
  scale: number
  anchors: PdfAnchor[]
  focusedAnchorId: PdfAnchorId | null
  onCreateTextAnchor: (pageIndex: number, text: string, rects: PdfRect[]) => void
  onZoomDelta?: (factor: number) => void
  onLoadStateChange?: (state: 'loading' | 'ready' | 'error') => void
  initialScrollPosition?: { ratio: number, top: number, scale: number }
  onScrollPositionChange?: (position: { ratio: number, top: number, scale: number }) => void
  restoreScrollToken?: number
  onFitWidthScaleChange?: (scale: number) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const PdfViewer: React.FC<PdfViewerProps> = ({
  data,
  scale,
  anchors,
  focusedAnchorId,
  onCreateTextAnchor,
  onZoomDelta,
  onLoadStateChange,
  initialScrollPosition,
  onScrollPositionChange,
  restoreScrollToken,
  onFitWidthScaleChange,
}) => {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [basePageWidth, setBasePageWidth] = useState<number | null>(null)
  const [prevDoc, setPrevDoc] = useState<PDFDocumentProxy | null>(null)

  // Sync basePageWidth when doc becomes null
  if (doc !== prevDoc) {
    setPrevDoc(doc)
    if (!doc) {
      setBasePageWidth(null)
    }
  }
  const scrollRef = useRef<HTMLDivElement>(null)
  const fitRafRef = useRef<number | null>(null)
  const fitDebounceRef = useRef<number | null>(null)
  const pendingWidthRef = useRef<number | null>(null)
  const lastFitScaleRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const dataCopy = data.slice()
    const task = getDocument({ data: dataCopy })
    const load = async () => {
      try {
        const loaded = await task.promise
        if (!cancelled) {
          setDoc(loaded)
          onLoadStateChange?.('ready')
        }
      }
      catch (error) {
        if (!cancelled) {
          console.warn('Failed to load PDF document.', error)
          onLoadStateChange?.('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
      task.destroy().catch(() => undefined)
      setDoc(null)
    }
  }, [data, onLoadStateChange])

  useEffect(() => {
    if (!doc) {
      return
    }

    let cancelled = false
    doc
      .getPage(1)
      .then((page) => {
        if (cancelled)
          return
        const viewport = page.getViewport({ scale: 1 })
        setBasePageWidth(viewport.width)
      })
      .catch((error) => {
        console.warn('Failed to measure PDF page width.', error)
      })

    return () => {
      cancelled = true
    }
  }, [doc])

  useEffect(() => {
    const viewport = scrollRef.current
    if (!viewport || basePageWidth === null || !onFitWidthScaleChange)
      return

    const updateScale = (width: number) => {
      if (!Number.isFinite(width) || width <= 0)
        return
      if (!Number.isFinite(basePageWidth) || basePageWidth <= 0)
        return
      const nextScale = clamp(width / basePageWidth, 0.5, 3)
      if (!Number.isFinite(nextScale))
        return
      if (Math.abs(nextScale - scale) < 0.01)
        return
      const lastScale = lastFitScaleRef.current
      if (lastScale !== null && Math.abs(lastScale - nextScale) < 0.001)
        return
      lastFitScaleRef.current = nextScale
      onFitWidthScaleChange(nextScale)
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const width = entry?.contentRect.width ?? viewport.clientWidth
      pendingWidthRef.current = width
      if (fitRafRef.current === null) {
        fitRafRef.current = window.requestAnimationFrame(() => {
          fitRafRef.current = null
          if (fitDebounceRef.current !== null) {
            window.clearTimeout(fitDebounceRef.current)
          }
          fitDebounceRef.current = window.setTimeout(() => {
            fitDebounceRef.current = null
            if (pendingWidthRef.current !== null) {
              updateScale(pendingWidthRef.current)
            }
          }, 120)
        })
      }
    })

    observer.observe(viewport)
    updateScale(viewport.clientWidth)

    return () => {
      observer.disconnect()
      if (fitRafRef.current !== null) {
        window.cancelAnimationFrame(fitRafRef.current)
        fitRafRef.current = null
      }
      if (fitDebounceRef.current !== null) {
        window.clearTimeout(fitDebounceRef.current)
        fitDebounceRef.current = null
      }
    }
  }, [basePageWidth, onFitWidthScaleChange, scale])

  useEffect(() => {
    lastFitScaleRef.current = scale
  }, [scale])

  const handleScrollPositionChange = React.useCallback(
    (position: { ratio: number, top: number }) => {
      onScrollPositionChange?.({ ...position, scale })
    },
    [onScrollPositionChange, scale],
  )

  useEffect(() => {
    if (!focusedAnchorId)
      return
    const target = document.querySelector(`[data-anchor-id="${focusedAnchorId}"]`)
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      target.classList.add('pdf-anchor-flash')
      const timer = window.setTimeout(() => target.classList.remove('pdf-anchor-flash'), 600)
      return () => window.clearTimeout(timer)
    }
  }, [focusedAnchorId])

  useEffect(() => {
    const viewport = scrollRef.current
    if (!viewport || !doc)
      return
    if (!initialScrollPosition)
      return

    const shouldUseExact = Math.abs(initialScrollPosition.scale - scale) < 0.001
    const clampedRatio = Math.max(0, Math.min(1, initialScrollPosition.ratio))
    const desiredTop = initialScrollPosition.top
    let inner = 0
    const applyScroll = () => {
      const maxScroll = viewport.scrollHeight - viewport.clientHeight
      if (maxScroll <= 0)
        return
      if (shouldUseExact) {
        viewport.scrollTop = clamp(desiredTop, 0, maxScroll)
        return
      }
      viewport.scrollTop = maxScroll * clampedRatio
    }

    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(applyScroll)
    })

    const retry = window.setTimeout(() => {
      applyScroll()
    }, 120)

    return () => {
      window.cancelAnimationFrame(outer)
      if (inner)
        window.cancelAnimationFrame(inner)
      window.clearTimeout(retry)
    }
  }, [doc, initialScrollPosition, restoreScrollToken, scale])

  const pages = useMemo(() => {
    if (!doc)
      return []
    return Array.from({ length: doc.numPages }, (_, index) => index + 1)
  }, [doc])

  return (
    <PdfViewport
      onZoomDelta={onZoomDelta}
      onScrollPositionChange={handleScrollPositionChange}
      scrollRef={scrollRef}
    >
      <div className="pdf-page-stack">
        {pages.map(pageNumber => (
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
  )
}
