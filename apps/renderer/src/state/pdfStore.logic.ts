import type { PdfAnchorId, PdfRect, PdfSource, PdfSourceId, PdfTextAnchor } from '@repo/core'
import type { PdfData, PdfPaneState, PdfScrollPosition, PdfState } from './pdfStore.types'
import { persistState, restoreState } from './persist'

export const createSourceId = (): PdfSourceId => crypto.randomUUID() as PdfSourceId
export const createAnchorId = (): PdfAnchorId => crypto.randomUUID() as PdfAnchorId

export const PANE_PDF_KEY = 'stroma-pdf-panes'

export interface StoredPdfReference {
  referenceId?: number
  path: string
  name: string
  scrollPosition?: PdfScrollPosition
  // Legacy fields
  scrollRatio?: number
  scrollTop?: number
  scrollScale?: number
  scale?: number
}

export type StoredPaneMap = Record<string, StoredPdfReference>

export function loadPaneMap(): StoredPaneMap {
  return restoreState<StoredPaneMap>(PANE_PDF_KEY) ?? {}
}

export function savePaneMap(next: StoredPaneMap): void {
  persistState(PANE_PDF_KEY, next)
}

export function normalizeScrollPosition(position: PdfScrollPosition): PdfScrollPosition | null {
  if (!Number.isFinite(position.ratio) || !Number.isFinite(position.top))
    return null
  if (!Number.isFinite(position.scale) || position.scale <= 0)
    return null
  return {
    ratio: Math.max(0, Math.min(1, position.ratio)),
    top: Math.max(0, position.top),
    scale: position.scale,
  }
}

export function getStoredScrollPosition(stored?: StoredPdfReference): PdfScrollPosition {
  if (stored?.scrollPosition)
    return stored.scrollPosition

  return {
    ratio: stored?.scrollRatio ?? 0,
    top: stored?.scrollTop ?? 0,
    scale: stored?.scrollScale ?? (stored?.scale ?? 1),
  }
}

export function computeSetPaneData(
  state: PdfState,
  paneId: string,
  payload: { source: PdfSource, data: Uint8Array, referenceId?: number | null },
  stored?: StoredPdfReference,
): Partial<PdfData> {
  const scrollPosition = getStoredScrollPosition(stored)
  const paneState: PdfPaneState = {
    source: payload.source,
    referenceId: payload.referenceId ?? stored?.referenceId ?? null,
    data: payload.data,
    anchors: [],
    focusedAnchorId: null,
    scrollPosition,
    scale: stored?.scale ?? 1,
    scrollRestoreToken: 0,
  }

  return {
    panes: {
      ...state.panes,
      [paneId]: paneState,
    },
  }
}

export function computeRemovePane(state: PdfState, paneId: string): Partial<PdfData> {
  const { [paneId]: _, ...rest } = state.panes
  return {
    panes: rest,
    activePaneId: state.activePaneId === paneId ? null : state.activePaneId,
  }
}

export function computeAddTextAnchor(
  state: PdfState,
  paneId: string,
  pageIndex: number,
  text: string,
  rects: PdfRect[],
  anchorId: PdfAnchorId = createAnchorId(),
  createdAt: Date = new Date(),
  updatedAt: Date = createdAt,
): Partial<PdfData> {
  const pane = state.panes[paneId]
  if (!pane)
    return {}

  const anchor: PdfTextAnchor = {
    id: anchorId,
    sourceId: pane.source.id,
    pageIndex,
    type: 'text',
    text,
    rects,
    createdAt,
    updatedAt,
  }

  return {
    panes: {
      ...state.panes,
      [paneId]: {
        ...pane,
        anchors: [...pane.anchors, anchor],
      },
    },
  }
}

export function computeSetScrollPosition(
  state: PdfState,
  paneId: string,
  position: PdfScrollPosition,
): Partial<PdfData> | null {
  const normalized = normalizeScrollPosition(position)
  if (!normalized)
    return null

  const pane = state.panes[paneId]
  if (!pane)
    return null

  const prev = pane.scrollPosition
  if (
    Math.abs(prev.ratio - normalized.ratio) < 0.0001
    && Math.abs(prev.top - normalized.top) < 0.5
    && Math.abs(prev.scale - normalized.scale) < 0.0001
  ) {
    return null
  }

  return {
    panes: {
      ...state.panes,
      [paneId]: {
        ...pane,
        scrollPosition: normalized,
      },
    },
  }
}

export function computeSetScale(state: PdfState, paneId: string, scale: number): Partial<PdfData> | null {
  if (!Number.isFinite(scale))
    return null
  const clamped = Math.max(0.5, Math.min(3, scale))

  const pane = state.panes[paneId]
  if (!pane)
    return null

  if (Math.abs(pane.scale - clamped) < 0.001)
    return null

  return {
    panes: {
      ...state.panes,
      [paneId]: {
        ...pane,
        scale: clamped,
      },
    },
  }
}
