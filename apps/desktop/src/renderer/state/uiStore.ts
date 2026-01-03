import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface UIState {
  theme: Theme;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number; // in rem
  rightSidebarWidth: number; // in rem
  commandPaletteOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
  toggleCommandPalette: () => void;
}

const DEFAULT_SIDEBAR_WIDTH = 15; // rem

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      leftSidebarOpen: true,
      rightSidebarOpen: true,
      leftSidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      rightSidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      commandPaletteOpen: false,

      setTheme: (theme) => set({ theme }),

      toggleLeftSidebar: () =>
        set((state) => ({
          leftSidebarOpen: !state.leftSidebarOpen,
        })),

      toggleRightSidebar: () =>
        set((state) => ({
          rightSidebarOpen: !state.rightSidebarOpen,
        })),

      setLeftSidebarWidth: (width) => set({ leftSidebarWidth: width }),

      setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),

      toggleCommandPalette: () =>
        set((state) => ({
          commandPaletteOpen: !state.commandPaletteOpen,
        })),
    }),
    {
      name: 'stroma-ui',
      partialize: (state) => ({
        theme: state.theme,
        leftSidebarOpen: state.leftSidebarOpen,
        rightSidebarOpen: state.rightSidebarOpen,
        leftSidebarWidth: state.leftSidebarWidth,
        rightSidebarWidth: state.rightSidebarWidth,
      }),
    }
  )
);
