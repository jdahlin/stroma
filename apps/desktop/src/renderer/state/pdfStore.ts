import type { PdfSource } from '@repo/core'
import type { PdfScrollPosition, PdfState } from './pdfStore.types'
import { create } from 'zustand'
import {
  computeAddTextAnchor,
  computeRemovePane,
  computeSetPaneData,
  computeSetScale,
  computeSetScrollPosition,
  createSourceId,
  loadPaneMap,
  normalizeScrollPosition,
  savePaneMap,
} from './pdfStore.logic'

interface ScrollPersistRecord {
  position: PdfScrollPosition
  timeoutId: number
}

const scrollPersistTimers = new Map<string, ScrollPersistRecord>()

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

    const nextState = computeSetPaneData(get(), paneId, payload, stored)
    const paneState = nextState.panes?.[paneId]
    if (!paneState)
      return

    paneMap[paneId] = {
      path: payload.source.path,
      name: payload.source.name,
      scrollPosition: paneState.scrollPosition,
      scale: paneState.scale,
    }
    savePaneMap(paneMap)

    set(nextState)
  },

  removePane: (paneId) => {
    clearScrollPersistence(paneId)
    const paneMap = loadPaneMap()
    if (paneMap[paneId]) {
      delete paneMap[paneId]
      savePaneMap(paneMap)
    }

    set(state => computeRemovePane(state, paneId))
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
    set(state => computeAddTextAnchor(state, paneId, pageIndex, text, rects))
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
      const next = computeSetScrollPosition(state, paneId, position)
      return next ?? state
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
    const next = computeSetScale(get(), paneId, scale)
    const nextPane = next?.panes?.[paneId]
    if (!next || !nextPane)
      return

    const clamped = nextPane.scale
    const paneMap = loadPaneMap()
    const stored = paneMap[paneId]
    if (stored && Math.abs((stored.scale ?? 1) - clamped) >= 0.001) {
      paneMap[paneId] = { ...stored, scale: clamped }
      savePaneMap(paneMap)
    }

    set(next)
  },
}))
