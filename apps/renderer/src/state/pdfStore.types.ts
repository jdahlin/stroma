import type { PdfAnchor, PdfAnchorId, PdfRect, PdfSource } from '@repo/core'

export interface PdfScrollPosition {
  ratio: number
  top: number
  scale: number
}

export interface PdfPaneState {
  source: PdfSource
  data: Uint8Array
  anchors: PdfAnchor[]
  focusedAnchorId: PdfAnchorId | null
  scrollPosition: PdfScrollPosition
  scale: number
  scrollRestoreToken: number
}

export interface PdfOpenPayload {
  source: PdfSource
  data: Uint8Array
}

export interface PdfData {
  panes: Record<string, PdfPaneState>
  activePaneId: string | null
}

export interface PdfActions {
  openPdfDialog: () => Promise<PdfOpenPayload | null>
  restorePane: (paneId: string) => Promise<PdfOpenPayload | null>
  setPaneData: (paneId: string, payload: PdfOpenPayload) => void
  removePane: (paneId: string) => void
  setActivePane: (paneId: string | null) => void
  bumpScrollRestoreToken: (paneId: string) => void
  addTextAnchor: (paneId: string, pageIndex: number, text: string, rects: PdfRect[]) => void
  focusAnchor: (paneId: string, id: PdfAnchorId) => void
  clearFocus: (paneId: string) => void
  setScrollPosition: (paneId: string, position: PdfScrollPosition) => void
  flushPanePersistence: (paneId: string) => void
  setScale: (paneId: string, scale: number) => void
}

export interface PdfState extends PdfData, PdfActions {}
