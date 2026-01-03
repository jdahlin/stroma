import React from 'react';
import { useUIStore, type Theme } from '../state';

const THEMES: readonly Theme[] = ['light', 'dark', 'system'] as const;

export const TopBar: React.FC = () => {
  const { theme, setTheme } = useUIStore();

  const toggleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    const nextTheme = THEMES[nextIndex];
    if (nextTheme) {
      setTheme(nextTheme);
    }
  };

  return (
    <header className="top-bar">
      <div className="top-bar-drag-region" />
      <div className="top-bar-content">
        <span className="app-title">Stroma</span>
        <div className="top-bar-spacer" />
        <div className="top-bar-controls">
          <button className="top-bar-button" onClick={toggleTheme} title={`Theme: ${theme}`}>
            {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
          </button>
        </div>
      </div>
    </header>
  );
};
