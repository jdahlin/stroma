import { FileText, Home, IconButton, PanelLeft, PanelRight, Search, Settings } from '@repo/ux'
import React from 'react'
import { useUIStore } from '../state'
import './Ribbon.css'

export const Ribbon: React.FC = () => {
  const { toggleSidebar, sidebars } = useUIStore()
  const leftOpen = sidebars.left.open
  const rightOpen = sidebars.right.open

  return (
    <aside className="ribbon">
      <div className="ribbon-top">
        <IconButton
          icon={PanelLeft}
          label="Toggle left sidebar"
          aria-pressed={leftOpen}
          className={leftOpen ? 'is-active' : ''}
          onClick={() => toggleSidebar('left')}
        />
        <IconButton icon={Home} label="Home" />
        <IconButton icon={FileText} label="Files" />
        <IconButton icon={Search} label="Search" />
      </div>
      <div className="ribbon-bottom">
        <IconButton icon={Settings} label="Settings" />
        <IconButton
          icon={PanelRight}
          label="Toggle right sidebar"
          aria-pressed={rightOpen}
          className={rightOpen ? 'is-active' : ''}
          onClick={() => toggleSidebar('right')}
        />
      </div>
    </aside>
  )
}
