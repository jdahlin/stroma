import React, { useEffect } from 'react';
import { commandRegistry } from '@repo/core';
import { DockRoot } from './layout/DockRoot';
import { TopBar } from './chrome/TopBar';
import { Ribbon } from './chrome/Ribbon';
import { Sidebar } from './chrome/Sidebar';
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
        <Sidebar side="left">
          <div className="sidebar-placeholder">Left Sidebar</div>
        </Sidebar>
        <main className="app-main">
          <DockRoot />
        </main>
        <Sidebar side="right">
          <div className="sidebar-placeholder">Right Sidebar</div>
        </Sidebar>
      </div>
      <CommandPalette isOpen={commandPaletteOpen} onClose={toggleCommandPalette} />
    </div>
  );
};
