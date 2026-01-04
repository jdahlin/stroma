import type { PdfSource, PdfSourceId, PdfState } from './pdfStore.types'
import { describe, expect, it } from 'vitest'
import {
  computeAddTextAnchor,
  computeRemovePane,
  computeSetPaneData,
  computeSetScale,
  computeSetScrollPosition,
  getStoredScrollPosition,
  normalizeScrollPosition,
} from './pdfStore.logic'

const mockDate = new Date('2025-01-01T00:00:00.000Z')

const createInitialState = (): PdfState => ({
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
})

const createMockSource = (id: string): PdfSource => ({
  id: id as PdfSourceId,
  name: 'Test PDF',
  path: '/tmp/test.pdf',
  createdAt: mockDate,
  updatedAt: mockDate,
})

describe('pdfStore logic', () => {
  describe('normalizeScrollPosition', () => {
    it('normalizes valid positions', () => {
      const pos = { ratio: 0.5, top: 100, scale: 1.5 }
      expect(normalizeScrollPosition(pos)).toEqual(pos)
    })

    it('clumps ratio between 0 and 1', () => {
      expect(normalizeScrollPosition({ ratio: -0.1, top: 100, scale: 1 })?.ratio).toBe(0)
      expect(normalizeScrollPosition({ ratio: 1.5, top: 100, scale: 1 })?.ratio).toBe(1)
    })

    it('returns null for invalid values', () => {
      expect(normalizeScrollPosition({ ratio: NaN, top: 100, scale: 1 })).toBeNull()
      expect(normalizeScrollPosition({ ratio: 0.5, top: 100, scale: 0 })).toBeNull()
    })
  })

  describe('computeSetPaneData', () => {
    it('creates new pane state', () => {
      const state = createInitialState()
      const source = createMockSource('src-1')
      const payload = { source, data: new Uint8Array([1, 2, 3]) }

      const result = computeSetPaneData(state, 'pane-1', payload)

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

      const result = computeSetPaneData(state, 'pane-1', { source, data: new Uint8Array() }, stored)

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
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result = computeRemovePane(state, 'pane-1')
      expect(result.panes).toEqual({})
    })

    it('clears activePaneId if it was the removed pane', () => {
      const state: PdfState = {
        ...createInitialState(),
        activePaneId: 'pane-1',
        panes: {
          'pane-1': {
            source: createMockSource('s1'),
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result = computeRemovePane(state, 'pane-1')
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
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      const result = computeAddTextAnchor(state, paneId, 0, 'test text', [], 'anchor-1' as any)
      const anchors = result.panes?.[paneId]?.anchors
      expect(anchors).toHaveLength(1)
      expect(anchors?.[0]?.text).toBe('test text')
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
      expect(computeSetScrollPosition(state, paneId, { ratio: 0.51, top: 100, scale: 1 })).not.toBeNull()
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
            data: new Uint8Array(),
            anchors: [],
            focusedAnchorId: null,
            scrollPosition: { ratio: 0, top: 0, scale: 1 },
            scale: 1,
            scrollRestoreToken: 0,
          },
        },
      }

      expect(computeSetScale(state, paneId, 2.5)?.panes?.[paneId]?.scale).toBe(2.5)
      expect(computeSetScale(state, paneId, 10)?.panes?.[paneId]?.scale).toBe(3) // clamped to 3
      expect(computeSetScale(state, paneId, 0.1)?.panes?.[paneId]?.scale).toBe(0.5) // clamped to 0.5
    })
  })
})
