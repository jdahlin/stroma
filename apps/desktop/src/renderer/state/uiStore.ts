import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type SidebarSide = 'left' | 'right';

interface SidebarState {
  open: boolean;
  width: number; // in rem
}

interface UIState {
  theme: Theme;
  sidebars: Record<SidebarSide, SidebarState>;
  ribbonOpen: boolean;
  commandPaletteOpen: boolean;
  setTheme: (theme: Theme) => void;
  getSidebar: (side: SidebarSide) => SidebarState;
  toggleSidebar: (side: SidebarSide) => void;
  setSidebarWidth: (side: SidebarSide, width: number) => void;
  toggleRibbon: () => void;
  toggleCommandPalette: () => void;
}

const DEFAULT_SIDEBAR_WIDTH = 15; // rem

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebars: {
        left: { open: true, width: DEFAULT_SIDEBAR_WIDTH },
        right: { open: true, width: DEFAULT_SIDEBAR_WIDTH },
      },
      ribbonOpen: true,
      commandPaletteOpen: false,

      setTheme: (theme) => set({ theme }),

      getSidebar: (side) => get().sidebars[side],

      toggleSidebar: (side) =>
        set((state) => ({
          sidebars: {
            ...state.sidebars,
            [side]: {
              ...state.sidebars[side],
              open: !state.sidebars[side].open,
            },
          },
        })),

      setSidebarWidth: (side, width) =>
        set((state) => ({
          sidebars: {
            ...state.sidebars,
            [side]: {
              ...state.sidebars[side],
              width,
            },
          },
        })),

      toggleRibbon: () =>
        set((state) => ({
          ribbonOpen: !state.ribbonOpen,
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
        sidebars: state.sidebars,
        ribbonOpen: state.ribbonOpen,
      }),
    }
  )
);
