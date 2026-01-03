import React, { useEffect } from 'react';
import { commandRegistry } from '@repo/core';
import { DockRoot } from './layout/DockRoot';
import { IconButton, PanelRight } from '@repo/ux';
import { Ribbon } from './chrome/Ribbon';
import { Sidebar } from './chrome/Sidebar';
import { CommandPalette } from './chrome/CommandPalette';
import { useUIStore } from './state';
import { registerCommands } from './commands';
import './App.css';

export const App: React.FC = () => {
  const { theme, commandPaletteOpen, toggleCommandPalette, toggleSidebar } = useUIStore();
  const sidebars = useUIStore((state) => state.sidebars);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    return registerCommands();
  }, []);

  useEffect(() => {
    window.stroma?.setSidebarState?.({
      left: { open: sidebars.left.open },
      right: { open: sidebars.right.open },
    });
  }, [sidebars.left.open, sidebars.right.open]);

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
      <div className="app-corner-toggle">
        <IconButton
          icon={PanelRight}
          label="Toggle right sidebar"
          onClick={() => toggleSidebar('right')}
        />
      </div>
      <div className="app-content">
        <div className="left-stack">
          <div className="traffic-lights-spacer" />
          <div className="left-row">
            <Ribbon />
            <Sidebar side="left">
              <div className="sidebar-placeholder">Left Sidebar</div>
            </Sidebar>
          </div>
        </div>
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
