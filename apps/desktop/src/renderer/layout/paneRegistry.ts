import type { PaneType } from '@repo/core'
import type { IDockviewPanelProps } from 'dockview'
import type React from 'react'
import { HomePane } from '../panes/HomePane'
import { NotesPane } from '../panes/NotesPane'
import { PdfPane } from '../panes/PdfPane'
import { QueuePane } from '../panes/QueuePane'
import { SearchPane } from '../panes/SearchPane'

/**
 * Registry mapping pane types to their React components.
 */
export const paneComponents: Record<PaneType, React.FC<IDockviewPanelProps>> = {
  home: HomePane,
  notes: NotesPane,
  queue: QueuePane,
  search: SearchPane,
  pdf: PdfPane,
}
