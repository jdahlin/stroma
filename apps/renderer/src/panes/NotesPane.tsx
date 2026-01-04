import type { PdfAnchorId } from '@repo/core'
import type { IDockviewPanelProps } from 'dockview'
import { Editor } from '@repo/editor'
import React, { useCallback } from 'react'
import { usePdfStore } from '../state'
import { PaneMenu } from './PaneMenu'
import './Pane.css'

export const NotesPane: React.FC<IDockviewPanelProps> = ({ api }) => {
  const activePaneId = usePdfStore(state => state.activePaneId)
  const focusAnchor = usePdfStore(state => state.focusAnchor)

  const handlePdfReferenceClick = useCallback(
    (anchorId: string) => {
      if (activePaneId === null) {
        console.warn('No active PDF pane to focus.', anchorId)
        return
      }

      focusAnchor(activePaneId, anchorId as PdfAnchorId)
    },
    [activePaneId, focusAnchor],
  )

  return (
    <div className="pane pane-notes">
      <PaneMenu />
      <Editor
        documentId={`notes:${api.id}`}
        onPdfReferenceClick={handlePdfReferenceClick}
      />
    </div>
  )
}
