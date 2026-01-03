import React, { useEffect } from 'react';
import { commandRegistry } from '@repo/core';
import { DockRoot } from './layout/DockRoot';
import { TopBar } from './chrome/TopBar';
import { Ribbon } from './chrome/Ribbon';
import { LeftSidebar } from './chrome/LeftSidebar';
import { RightSidebar } from './chrome/RightSidebar';
import { CommandPalette } from './chrome/CommandPalette';
import { useUIStore } from './state';
import { registerCommands } from './commands';
import './App.css';

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
      <div className="app-content">
        <Ribbon />
        <LeftSidebar />
        <main className="app-main">
          <DockRoot />
        </main>
        <RightSidebar />
      </div>
      <CommandPalette isOpen={commandPaletteOpen} onClose={toggleCommandPalette} />
    </div>
  );
};
