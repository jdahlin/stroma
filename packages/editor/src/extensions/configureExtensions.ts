import type { Extensions } from '@tiptap/react'
import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import BulletList from '@tiptap/extension-bullet-list'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import HardBreak from '@tiptap/extension-hard-break'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Link from '@tiptap/extension-link'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Text from '@tiptap/extension-text'
import { SlashCommand } from './SlashCommand'
import { slashCommandSuggestion } from './slashCommandSuggestion'

export interface ConfigureExtensionsOptions {
  /** Placeholder text when the editor is empty */
  placeholder?: string
}

/**
 * Configure the core TipTap extensions bundle.
 * Uses individual extensions instead of starter-kit for better tree-shaking.
 */
export function configureExtensions(
  options: ConfigureExtensionsOptions = {},
): Extensions {
  const { placeholder = 'Start writing...' } = options

  return [
    // Core document structure
    Document,
    Paragraph,
    Text,
    HardBreak,

    // Text formatting
    Bold,
    Italic,
    Strike,
    Code,

    // Headings
    Heading.configure({
      levels: [1, 2, 3],
    }),

    // Lists
    BulletList,
    OrderedList,
    ListItem,

    // Block elements
    Blockquote,
    CodeBlock,
    HorizontalRule,

    // Images
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),

    // Links
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),

    // Editor behavior
    History,
    Dropcursor.configure({
      color: 'var(--color-accent)',
      width: 2,
    }),
    Gapcursor,

    // Placeholder
    Placeholder.configure({
      placeholder,
    }),

    // Slash commands
    SlashCommand.configure({
      suggestion: slashCommandSuggestion,
    }),
  ]
}
