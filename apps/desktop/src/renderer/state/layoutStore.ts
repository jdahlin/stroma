import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SerializedDockview, DockviewApi } from 'dockview';

let tabCounter = 0;

interface LayoutState {
  serializedLayout: SerializedDockview | null;
  api: DockviewApi | null;
  // Actions
  setLayout: (layout: SerializedDockview) => void;
  setApi: (api: DockviewApi) => void;
  clearLayout: () => void;
  openNewTab: () => void;
  openPdfPane: (title?: string) => string | null;
  closeActivePanel: () => void;
  activateTabAtIndex: (index: number) => void;
  splitRight: () => void;
  splitDown: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      serializedLayout: null,
      api: null,

      setLayout: (layout) => set({ serializedLayout: layout }),

      setApi: (api) => set({ api }),

      clearLayout: () => set({ serializedLayout: null }),

      openNewTab: () => {
        const { api } = get();
        if (api) {
          tabCounter++;
          api.addPanel({
            id: `home-${Date.now()}-${tabCounter}`,
            component: 'home',
            title: 'Home',
          });
        }
      },

      openPdfPane: (title = 'PDF') => {
        const { api } = get();
        if (!api) return null;

        tabCounter++;
        const id = `pdf-${Date.now()}-${tabCounter}`;
        api.addPanel({
          id,
          component: 'pdf',
          title,
        });
        return id;
      },

      closeActivePanel: () => {
        const { api } = get();
        if (api?.activePanel) {
          api.activePanel.api.close();
        }
      },

      activateTabAtIndex: (index) => {
        const { api } = get();
        const group = api?.activeGroup;
        if (!group) return;

        const panel = group.panels[index];
        if (!panel) return;

        panel.api.setActive();
      },

      splitRight: () => {
        const { api, openNewTab } = get();
        if (!api?.activePanel) {
          openNewTab();
          return;
        }

        tabCounter++;
        const { activePanel } = api;
        const component = (activePanel as { component?: string }).component ?? 'home';
        const title = (activePanel as { title?: string }).title ?? 'Home';

        api.addPanel({
          id: `${component}-${Date.now()}-${tabCounter}`,
          component,
          title,
          position: {
            referencePanel: activePanel,
            direction: 'right',
          },
        });
      },

      splitDown: () => {
        const { api, openNewTab } = get();
        if (!api?.activePanel) {
          openNewTab();
          return;
        }

        tabCounter++;
        const { activePanel } = api;
        const component = (activePanel as { component?: string }).component ?? 'home';
        const title = (activePanel as { title?: string }).title ?? 'Home';

        api.addPanel({
          id: `${component}-${Date.now()}-${tabCounter}`,
          component,
          title,
          position: {
            referencePanel: activePanel,
            direction: 'below',
          },
        });
      },
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
