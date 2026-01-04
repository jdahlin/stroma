import type { SlashCommandItem, SlashCommandSuggestionProps } from '../extensions/SlashCommand'
import { Icon } from '@repo/ux'
import React, { useCallback, useImperativeHandle, useState } from 'react'
import './SlashCommandMenu.css'

export interface SlashCommandMenuRef {
  onKeyDown: (event: KeyboardEvent) => boolean
}

export interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: SlashCommandSuggestionProps['command']
  menuRef?: React.RefObject<SlashCommandMenuRef | null>
}

export function SlashCommandMenu({ items, command, menuRef }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevItems, setPrevItems] = useState(items)

  // Reset selection when items change
  if (items !== prevItems) {
    setPrevItems(items)
    setSelectedIndex(0)
  }

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
    if (items.length === 0)
      return
    setSelectedIndex((prev) => {
      const newIndex = prev - 1
      return newIndex < 0 ? items.length - 1 : newIndex
    })
  }, [items.length])

  const downHandler = useCallback(() => {
    if (items.length === 0)
      return
    setSelectedIndex(prev => (prev + 1) % items.length)
  }, [items.length])

  const enterHandler = useCallback(() => {
    if (items.length === 0)
      return
    selectItem(selectedIndex)
  }, [items.length, selectItem, selectedIndex])

  useImperativeHandle(menuRef, () => ({
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
      <div className="editor-slash-menu">
        <div className="editor-slash-menu__empty">No matching commands</div>
      </div>
    )
  }

  return (
    <div className="editor-slash-menu">
      {items.map((item, index) => (
        <div
          key={item.id}
          className={
            index === selectedIndex
              ? 'editor-slash-menu__item editor-slash-menu__item--selected'
              : 'editor-slash-menu__item'
          }
          onClick={() => selectItem(index)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <div className="editor-slash-menu__icon">
            <Icon icon={item.icon} size="sm" />
          </div>
          <div>
            <div className="editor-slash-menu__label">{item.label}</div>
            <div className="editor-slash-menu__description">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

SlashCommandMenu.displayName = 'SlashCommandMenu'
