import type { SlashCommandItem, SlashCommandSuggestionProps } from '../extensions/SlashCommand'
import { Icon } from '@repo/ux'
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'

export interface SlashCommandMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean
}

export interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: SlashCommandSuggestionProps['command']
}

const menuStyles: React.CSSProperties = {
  position: 'relative',
  backgroundColor: 'var(--color-bg-primary)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-lg)',
  overflow: 'hidden',
  maxHeight: '300px',
  overflowY: 'auto',
}

const itemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-2) var(--space-3)',
  cursor: 'pointer',
  transition: 'background-color var(--transition-fast)',
}

const selectedItemStyles: React.CSSProperties = {
  ...itemStyles,
  backgroundColor: 'var(--color-bg-tertiary)',
}

const iconContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  backgroundColor: 'var(--color-bg-secondary)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-secondary)',
}

const labelStyles: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
}

const descriptionStyles: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
}

const emptyStyles: React.CSSProperties = {
  padding: 'var(--space-3)',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-sm)',
}

export function SlashCommandMenu({ ref, items, command }: SlashCommandMenuProps & { ref?: React.RefObject<SlashCommandMenuRef | null> }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    },
    [items, command],
  )

  const upHandler = useCallback(() => {
    setSelectedIndex((prev) => {
      const newIndex = prev - 1
      return newIndex < 0 ? items.length - 1 : newIndex
    })
  }, [items.length])

  const downHandler = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % items.length)
  }, [items.length])

  const enterHandler = useCallback(() => {
    selectItem(selectedIndex)
  }, [selectItem, selectedIndex])

  useImperativeHandle(ref, () => ({
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (items.length === 0) {
    return (
      <div style={menuStyles}>
        <div style={emptyStyles}>No matching commands</div>
      </div>
    )
  }

  return (
    <div style={menuStyles}>
      {items.map((item, index) => (
        <div
          key={item.id}
          style={index === selectedIndex ? selectedItemStyles : itemStyles}
          onClick={() => selectItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div style={iconContainerStyles}>
            <Icon icon={item.icon} size="sm" />
          </div>
          <div>
            <div style={labelStyles}>{item.label}</div>
            <div style={descriptionStyles}>{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

SlashCommandMenu.displayName = 'SlashCommandMenu'
