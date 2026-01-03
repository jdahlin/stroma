import React from 'react';
import type { IDockviewPanelProps } from 'dockview';
import { PaneMenu } from './PaneMenu';
import './Pane.css';

export const NotesPane: React.FC<IDockviewPanelProps> = () => {
  return (
    <div className="pane pane-notes">
      <PaneMenu />
      <h2>Notes</h2>
      <p>Note editor will be implemented here.</p>
    </div>
  );
};
