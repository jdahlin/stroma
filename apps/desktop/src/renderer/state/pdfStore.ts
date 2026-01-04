import { create } from 'zustand';
import type { PdfAnchorId, PdfSource, PdfSourceId, PdfTextAnchor } from '@repo/core';
import type { PdfOpenPayload, PdfPaneState, PdfState } from './pdfStore.types';
import { persistState, restoreState } from './persist';

const createSourceId = (): PdfSourceId => crypto.randomUUID() as PdfSourceId;
const createAnchorId = (): PdfAnchorId => crypto.randomUUID() as PdfAnchorId;
const PANE_PDF_KEY = 'stroma-pdf-panes';

interface StoredPdfReference {
  path: string;
  name: string;
  scrollRatio?: number;
}

type StoredPaneMap = Record<string, StoredPdfReference>;

function loadPaneMap(): StoredPaneMap {
  return restoreState<StoredPaneMap>(PANE_PDF_KEY) ?? {};
}

function savePaneMap(next: StoredPaneMap): void {
  persistState(PANE_PDF_KEY, next);
}

export const usePdfStore = create<PdfState>((set, get) => ({
  panes: {},
  activePaneId: null,

  openPdfDialog: async () => {
    const result = await window.stroma?.openPdfDialog?.();
    if (!result) return null;

    const now = new Date();
    const source: PdfSource = {
      id: createSourceId(),
      name: result.name,
      path: result.path,
      createdAt: now,
      updatedAt: now,
    };

    return {
      source,
      data: new Uint8Array(result.data),
    };
  },

  restorePane: async (paneId) => {
    const stored = loadPaneMap()[paneId];
    if (!stored) return null;

    const result = await window.stroma?.openPdfByPath?.(stored.path);
    if (!result) return null;

    const now = new Date();
    const source: PdfSource = {
      id: createSourceId(),
      name: result.name ?? stored.name,
      path: result.path,
      createdAt: now,
      updatedAt: now,
    };

    return {
      source,
      data: new Uint8Array(result.data),
    };
  },

  setPaneData: (paneId, payload) => {
    const paneMap = loadPaneMap();
    const stored = paneMap[paneId];
    const paneState: PdfPaneState = {
      source: payload.source,
      data: payload.data,
      anchors: [],
      focusedAnchorId: null,
      scrollRatio: stored?.scrollRatio ?? 0,
    };

    paneMap[paneId] = {
      path: payload.source.path,
      name: payload.source.name,
      scrollRatio: paneState.scrollRatio,
    };
    savePaneMap(paneMap);

    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: paneState,
      },
    }));
  },

  removePane: (paneId) => {
    const paneMap = loadPaneMap();
    if (paneMap[paneId]) {
      delete paneMap[paneId];
      savePaneMap(paneMap);
    }

    set((state) => {
      const { [paneId]: _, ...rest } = state.panes;
      return {
        panes: rest,
        activePaneId: state.activePaneId === paneId ? null : state.activePaneId,
      };
    });
  },

  setActivePane: (paneId) => {
    set({ activePaneId: paneId });
  },

  addTextAnchor: (paneId, pageIndex, text, rects) => {
    const { panes } = get();
    const pane = panes[paneId];
    if (!pane) return;

    const now = new Date();
    const anchor: PdfTextAnchor = {
      id: createAnchorId(),
      sourceId: pane.source.id,
      pageIndex,
      type: 'text',
      text,
      rects,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      panes: {
        ...state.panes,
        [paneId]: {
          ...state.panes[paneId],
          anchors: [...state.panes[paneId].anchors, anchor],
        },
      },
    }));
  },

  focusAnchor: (paneId, id) => {
    set((state) => {
      const pane = state.panes[paneId];
      if (!pane) return state;
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            focusedAnchorId: id,
          },
        },
      };
    });
  },

  clearFocus: (paneId) => {
    set((state) => {
      const pane = state.panes[paneId];
      if (!pane) return state;
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            focusedAnchorId: null,
          },
        },
      };
    });
  },

  setScrollRatio: (paneId, ratio) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const paneMap = loadPaneMap();
    const stored = paneMap[paneId];
    if (stored) {
      paneMap[paneId] = { ...stored, scrollRatio: clamped };
      savePaneMap(paneMap);
    }

    set((state) => {
      const pane = state.panes[paneId];
      if (!pane) return state;
      return {
        panes: {
          ...state.panes,
          [paneId]: {
            ...pane,
            scrollRatio: clamped,
          },
        },
      };
    });
  },
}));
