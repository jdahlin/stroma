import { commandRegistry } from '@repo/core'
import { IconButton, PanelRight } from '@repo/ux'
import React, { useEffect } from 'react'
import { CommandPalette } from './chrome/CommandPalette'
import { Ribbon } from './chrome/Ribbon'
import { Sidebar } from './chrome/Sidebar'
import { SidebarAnchors } from './chrome/SidebarAnchors'
import { registerCommands } from './commands'
import { DockRoot } from './layout/DockRoot'
import { useLayoutStore, useUIStore } from './state'
import './App.css'

export const App: React.FC = () => {
  const { theme, commandPaletteOpen, toggleCommandPalette, toggleSidebar } = useUIStore()
  const sidebars = useUIStore(state => state.sidebars)
  const ribbonOpen = useUIStore(state => state.ribbonOpen)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    return registerCommands()
  }, [])

  useEffect(() => {
    window.stroma?.setUiState?.({
      sidebars: {
        left: { open: sidebars.left.open },
        right: { open: sidebars.right.open },
      },
      ribbonOpen,
    })
  }, [sidebars.left.open, sidebars.right.open, ribbonOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && !e.shiftKey && !e.altKey) {
        const index = Number(e.key)
        if (Number.isInteger(index) && index >= 1 && index <= 5) {
          useLayoutStore.getState().activateTabAtIndex(index - 1)
          e.preventDefault()
          return
        }
      }

      void (async () => {
        const executed = await commandRegistry.executeFromShortcut(e)
        if (executed) {
          e.preventDefault()
        }
      })()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
            {ribbonOpen ? <Ribbon /> : null}
            <Sidebar side="left">
              <div className="sidebar-placeholder">Left Sidebar</div>
            </Sidebar>
          </div>
        </div>
        <main className="app-main">
          <DockRoot />
        </main>
        <Sidebar side="right">
          <SidebarAnchors />
        </Sidebar>
      </div>
      <CommandPalette isOpen={commandPaletteOpen} onClose={toggleCommandPalette} />
    </div>
  )
}
