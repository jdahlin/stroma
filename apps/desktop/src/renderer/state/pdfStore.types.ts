import type { PdfAnchor, PdfAnchorId, PdfRect, PdfSource } from '@repo/core'

export interface PdfPaneState {
  source: PdfSource
  data: Uint8Array
  anchors: PdfAnchor[]
  focusedAnchorId: PdfAnchorId | null
  scrollRatio: number
}

export interface PdfOpenPayload {
  source: PdfSource
  data: Uint8Array
}

export interface PdfState {
  panes: Record<string, PdfPaneState>
  activePaneId: string | null
  openPdfDialog: () => Promise<PdfOpenPayload | null>
  restorePane: (paneId: string) => Promise<PdfOpenPayload | null>
  setPaneData: (paneId: string, payload: PdfOpenPayload) => void
  removePane: (paneId: string) => void
  setActivePane: (paneId: string | null) => void
  addTextAnchor: (paneId: string, pageIndex: number, text: string, rects: PdfRect[]) => void
  focusAnchor: (paneId: string, id: PdfAnchorId) => void
  clearFocus: (paneId: string) => void
  setScrollRatio: (paneId: string, ratio: number) => void
}
