import React from 'react';
import type { IDockviewPanelProps } from 'dockview';

export const QueuePane: React.FC<IDockviewPanelProps> = () => {
  return (
    <div className="pane pane-queue">
      <h2>Reading Queue</h2>
      <p>Your reading queue will appear here.</p>
    </div>
  );
};
