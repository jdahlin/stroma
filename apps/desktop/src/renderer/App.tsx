import React, { useEffect } from 'react';
import { DockRoot } from './layout/DockRoot';
import { TopBar } from './chrome/TopBar';
import { CommandPalette } from './chrome/CommandPalette';
import { useUIStore } from './state';

export const App: React.FC = () => {
  const { theme, commandPaletteOpen, toggleCommandPalette } = useUIStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      // Escape to close command palette
      if (e.key === 'Escape' && commandPaletteOpen) {
        toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, toggleCommandPalette]);

  return (
    <div className="app-container">
      <TopBar />
      <main className="app-main">
        <DockRoot />
      </main>
      <CommandPalette isOpen={commandPaletteOpen} onClose={toggleCommandPalette} />
    </div>
  );
};
