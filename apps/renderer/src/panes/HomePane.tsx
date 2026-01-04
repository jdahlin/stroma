import type { IDockviewPanelProps } from 'dockview'
import { Editor } from '@repo/editor'
import React from 'react'
import { PaneMenu } from './PaneMenu'
import './Pane.css'

export const HomePane: React.FC<IDockviewPanelProps> = () => {
  const content = React.useMemo(
    () => ({
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Welcome to Stroma' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Your knowledge work environment.' }],
        },
      ],
    }),
    [],
  )

  return (
    <div className="pane pane-home">
      <PaneMenu />
      <Editor documentId="welcome" content={content} />
    </div>
  )
}
