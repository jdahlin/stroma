import type { PdfSourceId } from '@repo/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../localStorage.polyfill'
import { usePdfStore } from './pdfStore'
import { persistState } from './persist'

const STORAGE_KEY = 'stroma-pdf-panes'

function createPayload() {
  const now = new Date('2025-01-01T00:00:00.000Z')
  return {
    source: {
      id: 'source-1' as PdfSourceId,
      name: 'Test PDF',
      path: '/tmp/test.pdf',
      createdAt: now,
      updatedAt: now,
    },
    data: new Uint8Array([1, 2, 3]),
  }
}

function readStoredPane(paneId: string) {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null)
    return null
  const parsed = JSON.parse(raw) as { data: Record<string, unknown> }
  const data = parsed.data as Record<string, { scrollPosition?: unknown }>
  return data[paneId]
}

function resetStore() {
  usePdfStore.setState(state => ({
    ...state,
    panes: {},
    activePaneId: null,
  }))
}

describe('pdfStore', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  afterEach(() => {
    localStorage.clear()
    resetStore()
    vi.useRealTimers()
  })

  it('restores scrollPosition from legacy fields', () => {
    persistState(STORAGE_KEY, {
      'pane-1': {
        path: '/tmp/test.pdf',
        name: 'Test PDF',
        scrollRatio: 0.4,
        scrollTop: 120,
        scrollScale: 1.25,
        scale: 1.25,
      },
    })

    const payload = createPayload()
    usePdfStore.getState().setPaneData('pane-1', payload)

    const pane = usePdfStore.getState().panes['pane-1']
    expect(pane?.scrollPosition).toEqual({
      ratio: 0.4,
      top: 120,
      scale: 1.25,
    })
  })

  it('debounces scroll persistence and flushes on demand', () => {
    vi.useFakeTimers()

    const payload = createPayload()
    usePdfStore.getState().setPaneData('pane-2', payload)

    const initialStored = readStoredPane('pane-2')
    expect(initialStored?.scrollPosition).toEqual({
      ratio: 0,
      top: 0,
      scale: 1,
    })

    usePdfStore.getState().setScrollPosition('pane-2', {
      ratio: 0.6,
      top: 240,
      scale: 1.5,
    })

    const beforeFlush = readStoredPane('pane-2')
    expect(beforeFlush?.scrollPosition).toEqual({
      ratio: 0,
      top: 0,
      scale: 1,
    })

    usePdfStore.getState().flushPanePersistence('pane-2')

    const afterFlush = readStoredPane('pane-2')
    expect(afterFlush?.scrollPosition).toEqual({
      ratio: 0.6,
      top: 240,
      scale: 1.5,
    })

    usePdfStore.getState().setScrollPosition('pane-2', {
      ratio: 0.7,
      top: 300,
      scale: 1.5,
    })

    vi.advanceTimersByTime(260)

    const afterDebounce = readStoredPane('pane-2')
    expect(afterDebounce?.scrollPosition).toEqual({
      ratio: 0.7,
      top: 300,
      scale: 1.5,
    })
  })
})
