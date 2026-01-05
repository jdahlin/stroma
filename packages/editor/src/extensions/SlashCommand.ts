import type { LucideIcon } from '@repo/ux'
import type { Editor, Range } from '@tiptap/core'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import {
  Code2,
  FolderOpen,
  Heading1,
  Heading2,
  Heading3,
  Image,
  List,
  ListOrdered,
  Minus,
  Quote,
} from '@repo/ux'
import { Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

export interface SlashCommandItem {
  id: string
  label: string
  description: string
  icon: LucideIcon
  command: (props: { editor: Editor, range: Range }) => void
}

export const slashCommandItems: SlashCommandItem[] = [
  {
    id: 'heading1',
    label: 'Heading 1',
    description: 'Large section heading',
    icon: Heading1,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
  },
  {
    id: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: Heading2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
  },
  {
    id: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading',
    icon: Heading3,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
  },
  {
    id: 'bullet',
    label: 'Bullet List',
    description: 'Unordered list with bullets',
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    id: 'numbered',
    label: 'Numbered List',
    description: 'Ordered list with numbers',
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    id: 'quote',
    label: 'Blockquote',
    description: 'Highlighted quote block',
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    id: 'code',
    label: 'Code Block',
    description: 'Code with syntax highlighting',
    icon: Code2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    id: 'divider',
    label: 'Divider',
    description: 'Horizontal line separator',
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Insert an image from URL',
    icon: Image,
    command: ({ editor, range }) => {
      // Image insertion will be handled via a modal in a future enhancement
      // For now, insert a placeholder that can be edited
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setImage({ src: 'https://via.placeholder.com/640x360', alt: 'Placeholder image' })
        .run()
    },
  },
  {
    id: 'section',
    label: 'Section',
    description: 'Collapsible section container',
    icon: FolderOpen,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertSection().run()
    },
  },
]

export interface SlashCommandOptions {
  suggestion: Omit<SuggestionOptions, 'editor'>
}

export type SlashCommandSuggestionProps = SuggestionProps<SlashCommandItem>

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    const suggestion: Omit<SuggestionOptions<SlashCommandItem>, 'editor'> = {
      char: '/',
      command: ({ editor, range, props }: { editor: Editor, range: Range, props: SlashCommandItem }) => {
        props.command({ editor, range })
      },
    }

    return {
      suggestion,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
