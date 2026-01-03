import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      commandPaletteOpen: false,

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      toggleCommandPalette: () =>
        set((state) => ({
          commandPaletteOpen: !state.commandPaletteOpen,
        })),
    }),
    {
      name: 'stroma-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
