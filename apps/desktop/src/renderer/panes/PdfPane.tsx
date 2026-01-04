import type { PdfAnchor } from '@repo/core'
import type { IDockviewPanelProps } from 'dockview'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PdfLoadingOverlay } from '../components/pdf/PdfLoadingOverlay'
import { PdfToolbar } from '../components/pdf/PdfToolbar'
import { PdfViewer } from '../components/pdf/PdfViewer'
import { usePdfStore } from '../state'
import './Pane.css'
import './PdfPane.css'

export const PdfPane: React.FC<IDockviewPanelProps> = ({ api }) => {
  const paneId = api.id
  const paneState = usePdfStore(state => state.panes[paneId])
  const openPdfDialog = usePdfStore(state => state.openPdfDialog)
  const restorePane = usePdfStore(state => state.restorePane)
  const setPaneData = usePdfStore(state => state.setPaneData)
  const addTextAnchor = usePdfStore(state => state.addTextAnchor)
  const setActivePane = usePdfStore(state => state.setActivePane)
  const removePane = usePdfStore(state => state.removePane)
  const setScrollRatio = usePdfStore(state => state.setScrollRatio)

  const [scale, setScale] = useState(1)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const skipCleanupRef = useRef(true)
  const pendingScaleRef = useRef(scale)
  const rafRef = useRef<number | null>(null)

  const zoomByDelta = (factor: number) => {
    const next = Math.min(3, Math.max(0.5, pendingScaleRef.current * factor))
    pendingScaleRef.current = next

    if (rafRef.current !== null) {
      return
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      setScale(Number(pendingScaleRef.current.toFixed(3)))
    })
  }

  useEffect(() => {
    pendingScaleRef.current = scale
  }, [scale])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const filteredAnchors = useMemo<PdfAnchor[]>(() => {
    return paneState?.anchors ?? []
  }, [paneState])

  useEffect(() => {
    setActivePane(paneId)
    const disposable = api.onDidActiveChange((event) => {
      if (event.isActive) {
        setActivePane(paneId)
      }
    })

    return () => {
      disposable.dispose()
      if (skipCleanupRef.current) {
        skipCleanupRef.current = false
        return
      }
      removePane(paneId)
    }
  }, [api, paneId, removePane, setActivePane])

  useEffect(() => {
    if (paneState)
      return
    const restore = async () => {
      const payload = await restorePane(paneId)
      if (!payload)
        return
      setPaneData(paneId, payload)
      api.setTitle(payload.source.name)
    }
    void restore()
  }, [api, paneId, paneState, restorePane, setPaneData])

  useEffect(() => {
    if (!paneState?.data)
      return
    setLoadState('loading')
  }, [paneState?.data])

  const handleLoadStateChange = useCallback((state: 'loading' | 'ready' | 'error') => {
    if (state === 'loading')
      return
    setLoadState(state)
  }, [])

  const handleOpen = async () => {
    const payload = await openPdfDialog()
    if (!payload)
      return
    setPaneData(paneId, payload)
    api.setTitle(payload.source.name)
    setActivePane(paneId)
  }

  return (
    <div className="pane pane-pdf">
      <PdfToolbar
        title={paneState?.source.name ?? 'PDF'}
        scale={scale}
        onZoomIn={() => setScale(value => Math.min(3, value + 0.1))}
        onZoomOut={() => setScale(value => Math.max(0.5, value - 0.1))}
        onOpenPdf={() => void handleOpen()}
      />
      {paneState?.data
        ? (
            <PdfViewer
              data={paneState.data}
              scale={scale}
              anchors={filteredAnchors}
              focusedAnchorId={paneState.focusedAnchorId}
              onCreateTextAnchor={(pageIndex, text, rects) =>
                addTextAnchor(paneId, pageIndex, text, rects)}
              onZoomDelta={zoomByDelta}
              onLoadStateChange={handleLoadStateChange}
              initialScrollRatio={paneState.scrollRatio}
              onScrollRatioChange={ratio => setScrollRatio(paneId, ratio)}
            />
          )
        : (
            <div className="pdf-empty-state">
              <p>No PDF loaded.</p>
              <button type="button" onClick={() => void handleOpen()}>
                Open PDF
              </button>
            </div>
          )}
      {paneState?.data && loadState === 'loading' ? <PdfLoadingOverlay /> : null}
    </div>
  )
}
