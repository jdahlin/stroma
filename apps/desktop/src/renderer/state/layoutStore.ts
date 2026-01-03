import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SerializedDockview, DockviewApi } from 'dockview';

interface LayoutState {
  serializedLayout: SerializedDockview | null;
  api: DockviewApi | null;
  // Actions
  setLayout: (layout: SerializedDockview) => void;
  setApi: (api: DockviewApi) => void;
  clearLayout: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      serializedLayout: null,
      api: null,

      setLayout: (layout) => set({ serializedLayout: layout }),

      setApi: (api) => set({ api }),

      clearLayout: () => set({ serializedLayout: null }),
    }),
    {
      name: 'stroma-layout',
      partialize: (state) => ({
        serializedLayout: state.serializedLayout,
        // Don't persist api reference
      }),
    }
  )
);
