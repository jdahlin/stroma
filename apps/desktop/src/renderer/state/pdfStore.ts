import type { PdfAnchorId, PdfSource, PdfSourceId, PdfTextAnchor } from '@repo/core'
import type { PdfPaneState, PdfScrollPosition, PdfState } from './pdfStore.types'
import { create } from 'zustand'
import { persistState, restoreState } from './persist'

const createSourceId = (): PdfSourceId => crypto.randomUUID() as PdfSourceId
const createAnchorId = (): PdfAnchorId => crypto.randomUUID() as PdfAnchorId
const PANE_PDF_KEY = 'stroma-pdf-panes'

interface StoredPdfReference {
  path: string
  name: string
  scrollPosition?: PdfScrollPosition
  scrollRatio?: number
  scrollTop?: number
  scrollScale?: number
  scale?: number
}

type StoredPaneMap = Record<string, StoredPdfReference>

type ScrollPersistRecord = {
  position: PdfScrollPosition
  timeoutId: number
}

const scrollPersistTimers = new Map<string, ScrollPersistRecord>()

function loadPaneMap(): StoredPaneMap {
  return restoreState<StoredPaneMap>(PANE_PDF_KEY) ?? {}
}

function savePaneMap(next: StoredPaneMap): void {
  persistState(PANE_PDF_KEY, next)
}

function normalizeScrollPosition(position: PdfScrollPosition): PdfScrollPosition | null {
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

function getStoredScrollPosition(stored?: StoredPdfReference): PdfScrollPosition {
  if (stored?.scrollPosition)
    return stored.scrollPosition

  return {
    ratio: stored?.scrollRatio ?? 0,
    top: stored?.scrollTop ?? 0,
    scale: stored?.scrollScale ?? (stored?.scale ?? 1),
  }
}

function persistScrollPosition(paneId: string, position: PdfScrollPosition): void {
  const paneMap = loadPaneMap()
  const stored = paneMap[paneId]
  if (!stored)
    return

  paneMap[paneId] = {
    ...stored,
    scrollPosition: position,
  }
  savePaneMap(paneMap)
}

function scheduleScrollPersistence(paneId: string, position: PdfScrollPosition): void {
  const existing = scrollPersistTimers.get(paneId)
  if (existing) {
    window.clearTimeout(existing.timeoutId)
  }

  const timeoutId = window.setTimeout(() => {
    scrollPersistTimers.delete(paneId)
    persistScrollPosition(paneId, position)
  }, 250)

  scrollPersistTimers.set(paneId, { position, timeoutId })
}

function clearScrollPersistence(paneId: string): void {
  const existing = scrollPersistTimers.get(paneId)
  if (existing) {
    window.clearTimeout(existing.timeoutId)
    scrollPersistTimers.delete(paneId)
  }
}

export const usePdfStore = create<PdfState>((set, get) => ({
  panes: {},
  activePaneId: null,

  openPdfDialog: async () => {
    const result = await window.stroma?.openPdfDialog?.()
    if (!result)
      return null

    const now = new Date()
    const source: PdfSource = {
      id: createSourceId(),
      name: result.name,
      path: result.path,
      createdAt: now,
      updatedAt: now,
    }

    return {
      source,
      data: new Uint8Array(result.data),
    }
  },

  restorePane: async (paneId) => {
    const stored = loadPaneMap()[paneId]
    if (!stored)
      return null

    const result = await window.stroma?.openPdfByPath?.(stored.path)
    if (!result)
      return null

    const now = new Date()
    const source: PdfSource = {
      id: createSourceId(),
      name: result.name ?? stored.name,
      path: result.path,
      createdAt: now,
      updatedAt: now,
    }

    return {
      source,
      data: new Uint8Array(result.data),
    }
  },

  setPaneData: (paneId, payload) => {
    const paneMap = loadPaneMap()
    const stored = paneMap[paneId]
    const scrollPosition = getStoredScrollPosition(stored)
    const paneState: PdfPaneState = {
      source: payload.source,
      data: payload.data,
      anchors: [],
      focusedAnchorId: null,
      scrollPosition,
      scale: stored?.scale ?? 1,
      scrollRestoreToken: 0,
    }

    paneMap[paneId] = {
      path: payload.source.path,
      name: payload.source.name,
      scrollPosition: paneState.scrollPosition,
      scale: paneState.scale,
    }
    savePaneMap(paneMap)

    set(state => ({
      panes: {
        ...state.panes,
        [paneId]: paneState,
      },
    }))
  },

  removePane: (paneId) => {
    clearScrollPersistence(paneId)
    const paneMap = loadPaneMap()
    if (paneMap[paneId]) {
      delete paneMap[paneId]
      savePaneMap(paneMap)
    }

    set((state) => {
      const { [paneId]: _, ...rest } = state.panes
      return {
        panes: rest,
        activePaneId: state.activePaneId === paneId ? null : state.activePaneId,
      }
    })
  },

  setActivePane: (paneId) => {
    set({ activePaneId: paneId })
  },

  bumpScrollRestoreToken: (paneId) => {
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane)
        return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            scrollRestoreToken: pane.scrollRestoreToken + 1,
          },
        },
      }
    })
  },

  addTextAnchor: (paneId, pageIndex, text, rects) => {
    const { panes } = get()
    const pane = panes[paneId]
    if (!pane)
      return

    const now = new Date()
    const anchor: PdfTextAnchor = {
      id: createAnchorId(),
      sourceId: pane.source.id,
      pageIndex,
      type: 'text',
      text,
      rects,
      createdAt: now,
      updatedAt: now,
    }

    set((state) => {
      const currentPane = state.panes[paneId]
      if (!currentPane)
        return {}

      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...currentPane,
            anchors: [...currentPane.anchors, anchor],
          },
        },
      }
    })
  },

  focusAnchor: (paneId, id) => {
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane)
        return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            focusedAnchorId: id,
          },
        },
      }
    })
  },

  clearFocus: (paneId) => {
    set((state) => {
      const pane = state.panes[paneId]
      if (!pane)
        return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            focusedAnchorId: null,
          },
        },
      }
    })
  },

  setScrollPosition: (paneId, position) => {
    const normalized = normalizeScrollPosition(position)
    if (!normalized)
      return

    scheduleScrollPersistence(paneId, normalized)

    set((state) => {
      const pane = state.panes[paneId]
      if (!pane)
        return state
      const prev = pane.scrollPosition
      if (
        Math.abs(prev.ratio - normalized.ratio) < 0.0001
        && Math.abs(prev.top - normalized.top) < 0.5
        && Math.abs(prev.scale - normalized.scale) < 0.0001
      ) {
        return state
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
    })
  },

  flushPanePersistence: (paneId) => {
    const pane = get().panes[paneId]
    if (!pane)
      return
    const existing = scrollPersistTimers.get(paneId)
    if (existing) {
      window.clearTimeout(existing.timeoutId)
      scrollPersistTimers.delete(paneId)
      persistScrollPosition(paneId, existing.position)
      return
    }
    persistScrollPosition(paneId, pane.scrollPosition)
  },

  setScale: (paneId, scale) => {
    if (!Number.isFinite(scale))
      return
    const clamped = Math.max(0.5, Math.min(3, scale))
    const paneMap = loadPaneMap()
    const stored = paneMap[paneId]
    if (stored && Math.abs((stored.scale ?? 1) - clamped) >= 0.001) {
      paneMap[paneId] = { ...stored, scale: clamped }
      savePaneMap(paneMap)
    }

    set((state) => {
      const pane = state.panes[paneId]
      if (!pane)
        return state
      if (Math.abs(pane.scale - clamped) < 0.001)
        return state
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            scale: clamped,
          },
        },
      }
    })
  },
}))
