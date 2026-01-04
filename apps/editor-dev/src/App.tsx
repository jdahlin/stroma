import { IconButton } from '@repo/ux'
import { Moon, Sun } from 'lucide-react'
import React, { useState } from 'react'
import { EditorPlayground } from './EditorPlayground'

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-3) var(--space-4)',
  backgroundColor: 'var(--color-bg-primary)',
  borderBottom: '1px solid var(--color-border)',
}

const titleStyles: React.CSSProperties = {
  fontSize: 'var(--text-lg)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

export const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark')
  }

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>Editor Dev</h1>
        <IconButton
          icon={isDark ? Sun : Moon}
          label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
        />
      </header>
      <EditorPlayground />
    </div>
  )
}
