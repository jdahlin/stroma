import React from 'react';
import type { IDockviewPanelProps } from 'dockview';
import './Pane.css';

export const HomePane: React.FC<IDockviewPanelProps> = () => {
  return (
    <div className="pane pane-home">
      <h1>Welcome to Stroma</h1>
      <p>Your knowledge work environment.</p>
      <div className="home-info">
        <p>
          Platform: <code>{window.stroma?.platform ?? 'unknown'}</code>
        </p>
        <p>
          Electron: <code>{window.stroma?.versions.electron ?? 'unknown'}</code>
        </p>
      </div>
    </div>
  );
};
