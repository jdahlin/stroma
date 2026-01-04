import type { PdfAnchor } from '@repo/core'
import type { PdfState } from './pdfStore.types'

export function selectActiveAnchors(state: PdfState): PdfAnchor[] {
  if (state.activePaneId === null)
    return []
  return state.panes[state.activePaneId]?.anchors ?? []
}
