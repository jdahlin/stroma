import type { PdfAnchor } from '@repo/core';
import type { PdfState } from './pdfStore.types';

export const selectActiveAnchors = (state: PdfState): PdfAnchor[] => {
  if (!state.activePaneId) return [];
  return state.panes[state.activePaneId]?.anchors ?? [];
};
