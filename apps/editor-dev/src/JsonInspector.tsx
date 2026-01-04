import type { DocumentContent } from '@repo/editor'
import React from 'react'

export interface JsonInspectorProps {
  content: DocumentContent
}

const containerStyles: React.CSSProperties = {
  padding: 'var(--space-4)',
}

const headerStyles: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const preStyles: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  lineHeight: 'var(--leading-relaxed)',
  color: 'var(--color-text-primary)',
  backgroundColor: 'var(--color-bg-secondary)',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-md)',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}

export const JsonInspector: React.FC<JsonInspectorProps> = ({ content }) => {
  return (
    <div style={containerStyles}>
      <h2 style={headerStyles}>Document JSON</h2>
      <pre style={preStyles}>
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  )
}
