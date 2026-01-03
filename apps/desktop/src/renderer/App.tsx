import React, { useEffect } from 'react';
import { commandRegistry, COMMANDS } from '@core';
import { DockRoot } from './layout/DockRoot';
import { TopBar } from './chrome/TopBar';
import { CommandPalette } from './chrome/CommandPalette';
import { useUIStore } from './state';
import { registerCommands } from './commands';

export const App: React.FC = () => {
  const { theme, commandPaletteOpen, toggleCommandPalette } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    return registerCommands();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const executed = await commandRegistry.executeFromShortcut(e);
      if (executed) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
