import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import type { SlashCommandMenuRef } from '../components/SlashCommandMenu'
import type { SlashCommandItem, SlashCommandSuggestionProps } from './SlashCommand'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { SlashCommandMenu } from '../components/SlashCommandMenu'
import { slashCommandItems } from './SlashCommand'

// Create a simple inline component wrapper
interface PopupComponentProps {
  items: SlashCommandItem[]
  command: SlashCommandSuggestionProps['command']
  menuRef: React.RefObject<SlashCommandMenuRef | null>
}

function PopupComponent({ items, command, menuRef }: PopupComponentProps) {
  return <SlashCommandMenu ref={menuRef} items={items} command={command} />
}

export const slashCommandSuggestion: Omit<SuggestionOptions<SlashCommandItem>, 'editor'> = {
  char: '/',

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
          <PopupComponent
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
          <PopupComponent
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
