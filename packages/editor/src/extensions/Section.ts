import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SectionBlock } from '../components/SectionBlock'

export interface SectionOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    section: {
      /**
       * Insert a new section
       */
      insertSection: (attributes?: { title?: string }) => ReturnType
      /**
       * Toggle section collapsed state
       */
      toggleSectionCollapsed: () => ReturnType
      /**
       * Update section title
       */
      updateSectionTitle: (title: string) => ReturnType
    }
  }
}

export const Section = Node.create<SectionOptions>({
  name: 'section',

  group: 'block',

  content: 'block+',

  defining: true,

  draggable: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-id'),
        renderHTML: (attributes: { id?: unknown }) => {
          const id = typeof attributes.id === 'string' ? attributes.id : null
          if (id === null || id.length === 0)
            return {}
          return { 'data-id': id }
        },
      },
      title: {
        default: 'Untitled Section',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-title'),
        renderHTML: (attributes: { title?: unknown }) => {
          const title = typeof attributes.title === 'string'
            ? attributes.title
            : 'Untitled Section'
          return { 'data-title': title }
        },
      },
      collapsed: {
        default: false,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-collapsed') === 'true',
        renderHTML: (attributes: { collapsed?: unknown }) => {
          const collapsed = attributes.collapsed === true
          return { 'data-collapsed': collapsed ? 'true' : 'false' }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'section[data-editor-section]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-editor-section': '',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SectionBlock)
  },

  addCommands() {
    return {
      insertSection:
        attributes =>
          ({ chain }) => {
            const id = crypto.randomUUID()
            return chain()
              .insertContent({
                type: this.name,
                attrs: {
                  id,
                  title: attributes?.title ?? 'Untitled Section',
                  collapsed: false,
                },
                content: [{ type: 'paragraph' }],
              })
              .run()
          },

      toggleSectionCollapsed:
        () =>
          ({ state, commands }) => {
            const { selection } = state
            const node = state.doc.nodeAt(selection.from)
            if (node?.type.name !== this.name)
              return false

            return commands.updateAttributes(this.name, {
              collapsed: node.attrs.collapsed !== true,
            })
          },

      updateSectionTitle:
        title =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, { title })
          },
    }
  },

  addKeyboardShortcuts() {
    return {
      // Allow Backspace at start of section to unwrap content
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        const { empty, $anchor } = selection

        if (!empty)
          return false

        const isAtStart = $anchor.parentOffset === 0
        if (!isAtStart)
          return false

        const parentSection = $anchor.node(-1)
        if (parentSection.type.name !== this.name)
          return false

        // If at start of first block in section, lift content out
        const indexInSection = $anchor.index(-1)
        if (indexInSection === 0) {
          return editor.commands.lift(this.name)
        }

        return false
      },
    }
  },
})
