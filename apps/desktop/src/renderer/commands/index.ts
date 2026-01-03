import { commandRegistry, COMMANDS, type CommandId } from '@repo/core';
import { useUIStore, useLayoutStore } from '../state';

const THEMES = ['light', 'dark', 'system'] as const;

export function registerCommands(): () => void {
  const unregisterFns = [
    // App commands
    commandRegistry.register(COMMANDS.toggleCommandPalette, () => {
      useUIStore.getState().toggleCommandPalette();
    }),
    commandRegistry.register(COMMANDS.toggleTheme, () => {
      const { theme, setTheme } = useUIStore.getState();
      const currentIndex = THEMES.indexOf(theme);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      setTheme(THEMES[nextIndex]!);
    }),
    commandRegistry.register(COMMANDS.toggleRibbon, () => {
      useUIStore.getState().toggleRibbon();
    }),

    // Sidebar commands
    commandRegistry.register(COMMANDS.toggleLeftSidebar, () => {
      useUIStore.getState().toggleSidebar('left');
    }),
    commandRegistry.register(COMMANDS.toggleRightSidebar, () => {
      useUIStore.getState().toggleSidebar('right');
    }),

    // Tab commands
    commandRegistry.register(COMMANDS.newTab, () => {
      useLayoutStore.getState().openNewTab();
    }),
    commandRegistry.register(COMMANDS.closeTab, () => {
      useLayoutStore.getState().closeActivePanel();
    }),

    // Pane commands - TODO
    commandRegistry.register(COMMANDS.openHome, () => {
      // TODO: switch to or open home pane
    }),
    commandRegistry.register(COMMANDS.openNotes, () => {
      // TODO: switch to or open notes pane
    }),
    commandRegistry.register(COMMANDS.openQueue, () => {
      // TODO: switch to or open queue pane
    }),
    commandRegistry.register(COMMANDS.openSearch, () => {
      // TODO: switch to or open search pane
    }),
    commandRegistry.register(COMMANDS.splitRight, () => {
      useLayoutStore.getState().splitRight();
    }),
    commandRegistry.register(COMMANDS.splitDown, () => {
      useLayoutStore.getState().splitDown();
    }),
  ];

  // Listen for commands from main process (e.g. menu bar)
  const cleanupIPC = window.stroma?.onCommand((id: string) => {
    console.log('Received command:', id);
    commandRegistry.execute(id as CommandId);
  });

  return () => {
    unregisterFns.forEach((fn) => fn());
    cleanupIPC?.();
  };
}
