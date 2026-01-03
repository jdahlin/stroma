import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clamp } from '@shared';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  zoom: number;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  // Actions
  setTheme: (theme: Theme) => void;
  setZoom: (zoom: number) => void;
  toggleSidebar: () => void;
  toggleCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      zoom: 100,
      sidebarOpen: true,
      commandPaletteOpen: false,

      setTheme: (theme) => set({ theme }),

      setZoom: (zoom) =>
        set({
          zoom: clamp(zoom, 50, 200),
        }),

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
        zoom: state.zoom,
        sidebarOpen: state.sidebarOpen,
        // Don't persist commandPaletteOpen - always start closed
      }),
    }
  )
);
