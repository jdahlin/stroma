import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="top-bar">
      <div className="top-bar-drag-region" />
      <div className="top-bar-content">
        <span className="app-title">Stroma</span>
      </div>
    </header>
  );
};
