import type { PdfAnchorId, PdfSource, PdfSourceId } from '@repo/core'
import type { PdfData, PdfState } from './pdfStore.types'
import { describe, expect, it } from 'vitest'
import {
  computeAddTextAnchor,
  computeRemovePane,
  computeSetPaneData,
  computeSetScale,
  computeSetScrollPosition,
  normalizeScrollPosition,
} from './pdfStore.logic'

const mockDate = new Date('2025-01-01T00:00:00.000Z')

function createInitialState(): PdfState {
  return {
    panes: {},
    activePaneId: null,
    openPdfDialog: async () => null,
    restorePane: async () => null,
    setPaneData: () => {},
    removePane: () => {},
    setActivePane: () => {},
    bumpScrollRestoreToken: () => {},
    addTextAnchor: () => {},
    focusAnchor: () => {},
    clearFocus: () => {},
    setScrollPosition: () => {},
    flushPanePersistence: () => {},
    setScale: () => {},
  }
}

function createMockSource(id: string): PdfSource {
  return {
    id: id as PdfSourceId,
    name: 'Test PDF',
    path: '/tmp/test.pdf',
    createdAt: mockDate,
    updatedAt: mockDate,
  }
}

describe('pdfStore logic', () => {
  describe('normalizeScrollPosition', () => {
    it('normalizes valid positions', () => {
      const pos = { ratio: 0.5, top: 100, scale: 1.5 }
      expect(normalizeScrollPosition(pos)).toEqual(pos)
    })

    it('clamps ratio between 0 and 1', () => {
      expect(normalizeScrollPosition({ ratio: -0.1, top: 100, scale: 1 })?.ratio).toBe(0)
      expect(normalizeScrollPosition({ ratio: 1.5, top: 100, scale: 1 })?.ratio).toBe(1)
    })

    it('returns null for invalid values', () => {
      expect(normalizeScrollPosition({ ratio: Number.NaN, top: 100, scale: 1 })).toBeNull()
      expect(normalizeScrollPosition({ ratio: 0.5, top: 100, scale: 0 })).toBeNull()
    })
  })

  describe('computeSetPaneData', () => {
    it('creates new pane state', () => {
      const state = createInitialState()
      const source = createMockSource('src-1')
      const payload = { source, data: new Uint8Array([1, 2, 3]), referenceId: null }

      const result: Partial<PdfData> = computeSetPaneData(state, 'pane-1', payload)

      expect(result.panes?.['pane-1']).toBeDefined()
      expect(result.panes?.['pane-1']?.source).toBe(source)
      expect(result.panes?.['pane-1']?.scrollPosition.ratio).toBe(0)
    })

    it('uses stored scroll position if available', () => {
      const state = createInitialState()
      const source = createMockSource('src-1')
      const stored = {
        path: '/tmp/test.pdf',
        name: 'Test PDF',
        scrollPosition: { ratio: 0.8, top: 500, scale: 2 },
      }

      const result: Partial<PdfData> = computeSetPaneData(
        state,
        'pane-1',
        { source, data: new Uint8Array(), referenceId: null },
        stored,
      )

      expect(result.panes?.['pane-1']?.scrollPosition).toEqual(stored.scrollPosition)
    })
  })

  describe('computeRemovePane', () => {
    it('removes the specified pane', () => {
      const source = createMockSource('src-1')
      const state: PdfState = {
        ...createInitialState(),
        panes: {
          'pane-1': {
            source,
            referenceId: null,
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result: Partial<PdfData> = computeRemovePane(state, 'pane-1')
      expect(result.panes).toEqual({})
    })

    it('clears activePaneId if it was the removed pane', () => {
      const state: PdfState = {
        ...createInitialState(),
        activePaneId: 'pane-1',
        panes: {
          'pane-1': {
            source: createMockSource('s1'),
            referenceId: null,
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result: Partial<PdfData> = computeRemovePane(state, 'pane-1')
      expect(result.activePaneId).toBeNull()
    })
  })

  describe('computeAddTextAnchor', () => {
    it('adds an anchor to the correct pane', () => {
      const paneId = 'pane-1'
      const state: PdfState = {
        ...createInitialState(),
        panes: {
          [paneId]: {
            source: createMockSource('s1'),
            referenceId: null,
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result: Partial<PdfData> = computeAddTextAnchor(state, paneId, 0, 'test text', [], 'anchor-1' as PdfAnchorId)
      const anchors = result.panes?.[paneId]?.anchors
      expect(anchors).toHaveLength(1)
      const anchor = anchors?.[0]
      if (anchor?.type === 'text') {
        expect(anchor.text).toBe('test text')
      }
      else {
        throw new Error('Expected text anchor')
      }
    })
  })

  describe('computeSetScrollPosition', () => {
    it('returns null if position is unchanged (with tolerance)', () => {
      const paneId = 'pane-1'
      const pos = { ratio: 0.5, top: 100, scale: 1 }
      const state: PdfState = {
        ...createInitialState(),
        panes: {
          [paneId]: {
            source: createMockSource('s1'),
            referenceId: null,
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: pos,
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      // Exact same
      expect(computeSetScrollPosition(state, paneId, pos)).toBeNull()

      // Within tolerance
      expect(computeSetScrollPosition(state, paneId, { ratio: 0.500001, top: 100.1, scale: 1 })).toBeNull()

      // Outside tolerance
      const result: Partial<PdfData> | null = computeSetScrollPosition(state, paneId, { ratio: 0.51, top: 100, scale: 1 })
      expect(result).not.toBeNull()
    })
  })

  describe('computeSetScale', () => {
    it('updates scale with clamping', () => {
      const paneId = 'pane-1'
      const state: PdfState = {
        ...createInitialState(),
        panes: {
          [paneId]: {
            source: createMockSource('s1'),
            referenceId: null,
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result1: Partial<PdfData> | null = computeSetScale(state, paneId, 2.5)
      expect(result1?.panes?.[paneId]?.scale).toBe(2.5)

      const result2: Partial<PdfData> | null = computeSetScale(state, paneId, 10)
      expect(result2?.panes?.[paneId]?.scale).toBe(3) // clamped to 3

      const result3: Partial<PdfData> | null = computeSetScale(state, paneId, 0.1)
      expect(result3?.panes?.[paneId]?.scale).toBe(0.5) // clamped to 0.5
    })
  })
})
