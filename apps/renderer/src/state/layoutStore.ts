import type { DockviewApi, SerializedDockview } from 'dockview'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let tabCounter = 0
let layoutApiCleanup: (() => void) | null = null

const getNoteIdFromPanel = (panel: { api?: { component?: string, getParameters?: () => unknown } } | null | undefined): string | null => {
  if (!panel?.api || panel.api.component !== 'notes') {
    return null
  }
  const params = panel.api.getParameters?.() as { noteId?: string } | undefined
  return params?.noteId ?? null
}

const buildNotePanelMap = (api: DockviewApi): Record<string, string> => {
  const next: Record<string, string> = {}
  api.panels.forEach(panel => {
    const noteId = getNoteIdFromPanel(panel)
    if (noteId) {
      next[noteId] = panel.id
    }
  })
  return next
}

interface LayoutState {
  serializedLayout: SerializedDockview | null
  api: DockviewApi | null
  notePanelMap: Record<string, string>
  // Actions
  setLayout: (layout: SerializedDockview) => void
  setApi: (api: DockviewApi | null) => void
  clearLayout: () => void
  openNewTab: () => void
  openNotesPane: (noteId?: string, title?: string) => void
  openPdfPane: (title?: string) => string | null
  closeActivePanel: () => void
  activateTabAtIndex: (index: number) => void
  splitRight: () => void
  splitDown: () => void
}

const removePanelFromMap = (panelId: string) => (
  state: LayoutState,
): Partial<LayoutState> => {
  const notePanelMap = state.notePanelMap ?? {}
  const entries = Object.entries(notePanelMap)
  const matches = entries.filter(([, id]) => id === panelId)
  if (matches.length === 0) {
    return {}
  }
  const nextMap = { ...notePanelMap }
  matches.forEach(([noteId]) => {
    delete nextMap[noteId]
  })
  return { notePanelMap: nextMap }
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      serializedLayout: null,
      api: null,
      notePanelMap: {},

      setLayout: layout => set({ serializedLayout: layout }),

      setApi: api => {
        layoutApiCleanup?.()
        if (!api) {
          layoutApiCleanup = null
          set({
            api: null,
            notePanelMap: {},
          })
          return
        }
        const disposal = api.onDidRemovePanel(panel => {
          set(removePanelFromMap(panel.id))
        })
        layoutApiCleanup = () => disposal.dispose()
        set({
          api,
          notePanelMap: buildNotePanelMap(api),
        })
      },

      clearLayout: () => set({ serializedLayout: null }),

      openNewTab: () => {
        const { api } = get()
        if (api) {
          tabCounter++
          api.addPanel({
            id: `home-${Date.now()}-${tabCounter}`,
            component: 'home',
            title: 'Home',
          })
        }
      },

      openNotesPane: (noteId, title) => {
        const { api, notePanelMap } = get()
        if (!api)
          return

        if (noteId) {
          const existingPanelId = notePanelMap[noteId]
          if (existingPanelId) {
            const existing = api.getPanel(existingPanelId)
            if (existing) {
              existing.api.setActive()
              return
            }
            set(state => {
              const next = { ...state.notePanelMap }
              delete next[noteId]
              return { notePanelMap: next }
            })
          }

          const fallbackPanel = api.panels.find(panel => getNoteIdFromPanel(panel) === noteId)
          if (fallbackPanel) {
            set(state => ({
              notePanelMap: {
                ...state.notePanelMap,
                [noteId]: fallbackPanel.id,
              },
            }))
            fallbackPanel.api.setActive()
            return
          }
        }

        tabCounter++
        const panel = api.addPanel({
          id: `notes-${Date.now()}-${tabCounter}`,
          component: 'notes',
          title: title ?? 'Notes',
          params: noteId ? { noteId } : undefined,
        })

        if (noteId) {
          set(state => ({
            notePanelMap: {
              ...state.notePanelMap,
              [noteId]: panel.id,
            },
          }))
        }
      },

      openPdfPane: (title = 'PDF') => {
        const { api } = get()
        if (!api)
          return null

        tabCounter++
        const id = `pdf-${Date.now()}-${tabCounter}`
        api.addPanel({
          id,
          component: 'pdf',
          title,
        })
        return id
      },

      closeActivePanel: () => {
        const { api } = get()
        if (api?.activePanel) {
          api.activePanel.api.close()
        }
      },

      activateTabAtIndex: (index) => {
        const { api } = get()
        const group = api?.activeGroup
        if (!group)
          return

        const panel = group.panels[index]
        if (!panel)
          return

        panel.api.setActive()
      },

      splitRight: () => {
        const { api, openNewTab } = get()
        if (!api?.activePanel) {
          openNewTab()
          return
        }

        tabCounter++
        const { activePanel } = api
        const component = (activePanel as { component?: string }).component ?? 'home'
        const title = (activePanel as { title?: string }).title ?? 'Home'

        api.addPanel({
          id: `${component}-${Date.now()}-${tabCounter}`,
          component,
          title,
          position: {
            referencePanel: activePanel,
            direction: 'right',
          },
        })
      },

      splitDown: () => {
        const { api, openNewTab } = get()
        if (!api?.activePanel) {
          openNewTab()
          return
        }

        tabCounter++
        const { activePanel } = api
        const component = (activePanel as { component?: string }).component ?? 'home'
        const title = (activePanel as { title?: string }).title ?? 'Home'

        api.addPanel({
          id: `${component}-${Date.now()}-${tabCounter}`,
          component,
          title,
          position: {
            referencePanel: activePanel,
            direction: 'below',
          },
        })
      },
    }),
    {
      name: 'stroma-layout',
      version: 3,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return persistedState
        }
        const state = persistedState as Partial<LayoutState>
        return {
          serializedLayout: state.serializedLayout ?? null,
          notePanelMap: state.notePanelMap ?? {},
        }
      },
      merge: (persistedState, currentState) => {
        const state = (persistedState ?? {}) as Partial<LayoutState>
        return {
          ...currentState,
          serializedLayout: state.serializedLayout ?? currentState.serializedLayout,
          notePanelMap: state.notePanelMap ?? currentState.notePanelMap,
        }
      },
      partialize: state => ({
        serializedLayout: state.serializedLayout,
        notePanelMap: state.notePanelMap,
      }),
    },
  ),
)
