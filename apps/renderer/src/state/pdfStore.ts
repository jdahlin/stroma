import type {
  CreatePdfTextAnchorInput,
  PdfAnchorId,
  PdfRect,
  PdfSource,
  PdfSourceId,
  PdfTextAnchor,
  PdfTextAnchorFull,
} from '@repo/core'
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

function toPdfTextAnchor(sourceId: PdfSourceId, anchor: PdfTextAnchorFull): PdfTextAnchor {
  return {
    id: String(anchor.id) as PdfAnchorId,
    sourceId,
    pageIndex: anchor.pageIndex,
    type: 'text',
    text: anchor.text,
    rects: anchor.rects.map(rect => ({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    })),
    createdAt: new Date(anchor.createdAt),
    updatedAt: new Date(anchor.updatedAt),
  }
}

function toStorageRects(pageIndex: number, rects: PdfRect[]): CreatePdfTextAnchorInput['rects'] {
  return rects.map(rect => ({
    pageIndex,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  }))
}

export const usePdfStore = create<PdfState>((set, get) => ({
  panes: {},
  activePaneId: null,

  openPdfDialog: async () => {
    const result = await window.stroma?.openPdfDialog?.()
    if (!result)
      return null

    const storage = window.stroma?.storage
    let referenceId: number | null = null
    let name = result.name
    let path = result.path
    let createdAt = new Date()
    let updatedAt = new Date()

    if (storage?.asset?.importPdfFromBuffer) {
      const reference = await storage.asset.importPdfFromBuffer(result.data, result.name)
      referenceId = reference.id
      name = reference.title
      createdAt = new Date(reference.createdAt)
      updatedAt = new Date(reference.updatedAt)

      const storedPath = await storage.asset.getFilePath(reference.id)
      if (storedPath !== null) {
        path = storedPath
      }
    }

    const source: PdfSource = {
      id: (referenceId === null ? createSourceId() : String(referenceId) as PdfSourceId),
      name,
      path,
      createdAt,
      updatedAt,
    }

    return {
      source,
      referenceId,
      data: new Uint8Array(result.data),
    }
  },

  restorePane: async (paneId) => {
    const stored = loadPaneMap()[paneId]
    if (!stored)
      return null

    let path = stored.path
    let name = stored.name
    const referenceId = stored.referenceId ?? null
    let createdAt = new Date()
    let updatedAt = new Date()

    if (referenceId !== null) {
      const storage = window.stroma?.storage
      if (storage?.asset?.getFilePath) {
        const storedPath = await storage.asset.getFilePath(referenceId)
        if (storedPath !== null) {
          path = storedPath
        }
      }

      const reference = await storage?.reference?.get(referenceId)
      if (reference) {
        name = reference.title
        createdAt = new Date(reference.createdAt)
        updatedAt = new Date(reference.updatedAt)
      }
    }

    const result = await window.stroma?.openPdfByPath?.(path)
    if (!result)
      return null

    const source: PdfSource = {
      id: (referenceId === null ? createSourceId() : String(referenceId) as PdfSourceId),
      name: name ?? result.name ?? stored.name,
      path: result.path,
      createdAt,
      updatedAt,
    }

    return {
      source,
      referenceId,
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
      referenceId: payload.referenceId ?? undefined,
      path: payload.source.path,
      name: payload.source.name,
      scrollPosition: paneState.scrollPosition,
      scale: paneState.scale,
    }
    savePaneMap(paneMap)

    set(nextState)

    const payloadReferenceId = payload.referenceId
    if (payloadReferenceId !== null && payloadReferenceId !== undefined) {
      void (async () => {
        const anchors = await window.stroma?.storage?.anchor.getPdfTextForReference(payloadReferenceId)
        if (!anchors)
          return
        set((state) => {
          const pane = state.panes[paneId]
          if (!pane || pane.referenceId !== payloadReferenceId)
            return state
          return {
            panes: {
              ...state.panes,
              [paneId]: {
                ...pane,
                anchors: anchors.map(anchor => toPdfTextAnchor(pane.source.id, anchor)),
              },
            },
          }
        })
      })()
    }
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
    const pane = get().panes[paneId]
    if (!pane) {
      return
    }

    const referenceId = pane.referenceId
    if (referenceId === null) {
      set(state => computeAddTextAnchor(state, paneId, pageIndex, text, rects))
      return
    }

    void (async () => {
      const created = await window.stroma?.storage?.anchor.createPdfText({
        referenceId,
        pageIndex,
        text,
        rects: toStorageRects(pageIndex, rects),
      })

      if (!created) {
        return
      }

      set(state => computeAddTextAnchor(
        state,
        paneId,
        pageIndex,
        text,
        rects,
        String(created.id) as PdfAnchorId,
        new Date(created.createdAt),
        new Date(created.updatedAt),
      ))
    })()
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
      const next = computeSetScrollPosition(state, paneId, normalized)
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
