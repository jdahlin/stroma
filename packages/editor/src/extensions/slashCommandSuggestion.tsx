import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import type { SlashCommandMenuRef } from '../components/SlashCommandMenu'
import type { SlashCommandItem } from './SlashCommand'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { SlashCommandMenu } from '../components/SlashCommandMenu'
import { slashCommandItems } from './SlashCommand'

export const slashCommandSuggestion: Omit<SuggestionOptions<SlashCommandItem>, 'editor'> = {
  char: '/',

  allow: ({ state, range }) => {
    const $from = state.doc.resolve(range.from)
    const isStartOfBlock = $from.parentOffset === 0

    if (isStartOfBlock)
      return true

    const textBefore = $from.parent.textBetween(0, $from.parentOffset, '\n', '\0')
    const charBefore = textBefore.slice(-1)

    return /\s/.test(charBefore)
  },

  items: ({ query }) => {
    return slashCommandItems.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase())
      || item.id.toLowerCase().includes(query.toLowerCase()),
    )
  },

  render: () => {
    let popup: HTMLDivElement | null = null
    let root: ReturnType<typeof createRoot> | null = null
    let menuRef: React.RefObject<SlashCommandMenuRef | null> = { current: null }

    return {
      onStart: (props: SuggestionProps<SlashCommandItem>) => {
        popup = document.createElement('div')
        popup.style.position = 'absolute'
        popup.style.zIndex = 'var(--z-popover, 500)'

        // Position popup below the cursor
        const { clientRect } = props
        if (clientRect) {
          const rect = clientRect()
          if (rect) {
            popup.style.left = `${rect.left}px`
            popup.style.top = `${rect.bottom + 4}px`
          }
        }

        document.body.appendChild(popup)
        root = createRoot(popup)
        menuRef = { current: null }
        root.render(
          <SlashCommandMenu
            items={props.items}
            command={props.command}
            menuRef={menuRef}
          />,
        )
      },

      onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
        if (!popup || !root)
          return

        // Update position
        const { clientRect } = props
        if (clientRect) {
          const rect = clientRect()
          if (rect) {
            popup.style.left = `${rect.left}px`
            popup.style.top = `${rect.bottom + 4}px`
          }
        }

        // Re-render with new props
        root.render(
          <SlashCommandMenu
            items={props.items}
            command={props.command}
            menuRef={menuRef}
          />,
        )
      },

      onKeyDown: (props) => {
        if (props.event.key === 'Escape') {
          popup?.remove()
          popup = null
          root?.unmount()
          root = null
          return true
        }

        return menuRef.current?.onKeyDown(props.event) ?? false
      },

      onExit: () => {
        popup?.remove()
        popup = null
        root?.unmount()
        root = null
      },
    }
  },

  command: ({ editor, range, props }) => {
    props.command({ editor, range })
  },
}
