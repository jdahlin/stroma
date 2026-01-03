import type React from 'react';
import type { IDockviewPanelProps } from 'dockview';
import type { PaneType } from '@core';
import { HomePane } from '../panes/HomePane';
import { NotesPane } from '../panes/NotesPane';
import { QueuePane } from '../panes/QueuePane';
import { SearchPane } from '../panes/SearchPane';

/**
 * Registry mapping pane types to their React components.
 */
export const paneComponents: Record<PaneType, React.FC<IDockviewPanelProps>> = {
  home: HomePane,
  notes: NotesPane,
  queue: QueuePane,
  search: SearchPane,
};
