import React, { useState } from 'react';
import type { IDockviewPanelProps } from 'dockview';
import { PaneMenu } from './PaneMenu';
import './Pane.css';

export const SearchPane: React.FC<IDockviewPanelProps> = () => {
  const [query, setQuery] = useState('');

  return (
    <div className="pane pane-search">
      <PaneMenu />
      <h2>Search</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your knowledge..."
        className="search-input"
      />
      {query && <p>Searching for: {query}</p>}
    </div>
  );
};
