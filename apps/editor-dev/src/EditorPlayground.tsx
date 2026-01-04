import type { DocumentContent } from '@repo/editor'
import { Editor } from '@repo/editor'
import React, { useState } from 'react'
import sampleContent from './fixtures/sample-content.json'
import { JsonInspector } from './JsonInspector'

const playgroundStyles: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
}

const editorPaneStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--color-border)',
}

const editorWrapperStyles: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  margin: 'var(--space-4)',
  backgroundColor: 'var(--color-bg-primary)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
}

const inspectorPaneStyles: React.CSSProperties = {
  width: '400px',
  overflow: 'auto',
  backgroundColor: 'var(--color-bg-primary)',
}

export const EditorPlayground: React.FC = () => {
  const [content, setContent] = useState<DocumentContent>(sampleContent)

  return (
    <div style={playgroundStyles}>
      <div style={editorPaneStyles}>
        <div style={editorWrapperStyles}>
          <Editor
            documentId="playground"
            content={sampleContent}
            onChange={setContent}
            placeholder="Start writing here..."
            autoFocus
          />
        </div>
      </div>
      <div style={inspectorPaneStyles}>
        <JsonInspector content={content} />
      </div>
    </div>
  )
}
