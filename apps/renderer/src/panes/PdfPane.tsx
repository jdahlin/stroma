import type { PdfAnchor } from '@repo/core'
import type { IDockviewPanelProps } from 'dockview'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PdfLoadingOverlay } from '../components/pdf/PdfLoadingOverlay'
import { PdfToolbar } from '../components/pdf/PdfToolbar'
import { usePdfStore } from '../state'
import './Pane.css'
import './PdfPane.css'

const PdfViewer = React.lazy(async () => {
  const module = await import('../components/pdf/PdfViewer')
  return { default: module.PdfViewer }
})

export const PdfPane: React.FC<IDockviewPanelProps> = ({ api }) => {
  const paneId = api.id
  const paneState = usePdfStore(state => state.panes[paneId])
  const openPdfDialog = usePdfStore(state => state.openPdfDialog)
  const restorePane = usePdfStore(state => state.restorePane)
  const setPaneData = usePdfStore(state => state.setPaneData)
  const addTextAnchor = usePdfStore(state => state.addTextAnchor)
  const setActivePane = usePdfStore(state => state.setActivePane)
  const removePane = usePdfStore(state => state.removePane)
  const setScrollPosition = usePdfStore(state => state.setScrollPosition)
  const flushPanePersistence = usePdfStore(state => state.flushPanePersistence)
  const setStoredScale = usePdfStore(state => state.setScale)
  const bumpScrollRestoreToken = usePdfStore(state => state.bumpScrollRestoreToken)

  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [prevData, setPrevData] = useState<Uint8Array | undefined>(paneState?.data)

  // Sync loadState when data changes
  if (paneState?.data !== prevData) {
    setPrevData(paneState?.data)
    if (paneState?.data) {
      setLoadState('loading')
    }
  }
  const skipCleanupRef = useRef(true)
  const isUnloadingRef = useRef(false)
  const scale = paneState?.scale ?? 1
  const scrollRestoreToken = paneState?.scrollRestoreToken ?? 0
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
      setStoredScale(paneId, Number(pendingScaleRef.current.toFixed(3)))
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

  useEffect(() => {
    const handleUnload = () => {
      isUnloadingRef.current = true
      flushPanePersistence(paneId)
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [flushPanePersistence, paneId])

  const filteredAnchors = useMemo<PdfAnchor[]>(() => {
    return paneState?.anchors ?? []
  }, [paneState])

  useEffect(() => {
    setActivePane(paneId)
    const disposable = api.onDidActiveChange((event) => {
      if (event.isActive) {
        setActivePane(paneId)
        bumpScrollRestoreToken(paneId)
      }
    })

    return () => {
      disposable.dispose()
      if (skipCleanupRef.current) {
        skipCleanupRef.current = false
        return
      }
      if (isUnloadingRef.current) {
        return
      }
      removePane(paneId)
    }
  }, [api, paneId, bumpScrollRestoreToken, removePane, setActivePane])

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
        onZoomIn={() => setStoredScale(paneId, Math.min(3, scale + 0.1))}
        onZoomOut={() => setStoredScale(paneId, Math.max(0.5, scale - 0.1))}
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
              initialScrollPosition={paneState.scrollPosition}
              onScrollPositionChange={position =>
                setScrollPosition(paneId, position)}
              restoreScrollToken={scrollRestoreToken}
              onFitWidthScaleChange={nextScale => setStoredScale(paneId, nextScale)}
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
