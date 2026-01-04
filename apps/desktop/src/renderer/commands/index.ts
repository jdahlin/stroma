import { type CommandId, commandRegistry, COMMANDS } from '@repo/core'
import { useLayoutStore, usePdfStore, useUIStore } from '../state'

const THEMES = ['light', 'dark', 'system'] as const

export function registerCommands(): () => void {
  const unregisterFns = [
    // App commands
    commandRegistry.register(COMMANDS.toggleCommandPalette, () => {
      useUIStore.getState().toggleCommandPalette()
    }),
    commandRegistry.register(COMMANDS.reload, () => {
      window.location.reload()
    }),
    commandRegistry.register(COMMANDS.toggleTheme, () => {
      const { theme, setTheme } = useUIStore.getState()
      const currentIndex = THEMES.indexOf(theme)
      const nextIndex = (currentIndex + 1) % THEMES.length
      setTheme(THEMES[nextIndex] ?? 'light')
    }),
    commandRegistry.register(COMMANDS.toggleRibbon, () => {
      useUIStore.getState().toggleRibbon()
    }),

    // Sidebar commands
    commandRegistry.register(COMMANDS.toggleLeftSidebar, () => {
      useUIStore.getState().toggleSidebar('left')
    }),
    commandRegistry.register(COMMANDS.toggleRightSidebar, () => {
      useUIStore.getState().toggleSidebar('right')
    }),

    // File commands
    commandRegistry.register(COMMANDS.openPdf, async () => {
      const payload = await usePdfStore.getState().openPdfDialog()
      if (!payload)
        return

      const paneId = useLayoutStore.getState().openPdfPane(payload.source.name)
      if (paneId === null)
        return

      usePdfStore.getState().setPaneData(paneId, payload)
      usePdfStore.getState().setActivePane(paneId)
    }),

    // Tab commands
    commandRegistry.register(COMMANDS.newTab, () => {
      useLayoutStore.getState().openNewTab()
    }),
    commandRegistry.register(COMMANDS.closeTab, () => {
      useLayoutStore.getState().closeActivePanel()
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
      useLayoutStore.getState().splitRight()
    }),
    commandRegistry.register(COMMANDS.splitDown, () => {
      useLayoutStore.getState().splitDown()
    }),
  ]

  // Listen for commands from main process (e.g. menu bar)
  const cleanupIPC = window.stroma?.onCommand((id: string) => {
    console.warn('Received command:', id)
    void commandRegistry.execute(id as CommandId)
  })

  return () => {
    unregisterFns.forEach(fn => fn())
    cleanupIPC?.()
  }
}
