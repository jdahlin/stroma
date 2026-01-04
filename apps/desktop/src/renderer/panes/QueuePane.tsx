import type { IDockviewPanelProps } from 'dockview'
import React from 'react'
import { PaneMenu } from './PaneMenu'
import './Pane.css'

export const QueuePane: React.FC<IDockviewPanelProps> = () => {
  return (
    <div className="pane pane-queue">
      <PaneMenu />
      <h2>Reading Queue</h2>
      <p>Your reading queue will appear here.</p>
    </div>
  )
}
