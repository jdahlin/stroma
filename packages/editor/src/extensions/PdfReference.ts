import type { PdfReferenceAttributes } from '../types'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PdfReferenceNode } from '../components/PdfReferenceNode'

export interface PdfReferenceOptions {
  HTMLAttributes: Record<string, unknown>
  onReferenceClick?: (anchorId: string) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfReference: {
      /**
       * Insert a PDF reference node.
       */
      insertPdfReference: (attributes: PdfReferenceAttributes) => ReturnType
    }
  }
}

export const PdfReference = Node.create<PdfReferenceOptions>({
  name: 'pdfReference',

  inline: true,

  group: 'inline',

  atom: true,

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      onReferenceClick: undefined,
    }
  },

  addAttributes() {
    return {
      anchorId: {
        default: null,
        parseHTML: element => element.getAttribute('data-anchor-id'),
        renderHTML: attributes => ({
          'data-anchor-id': attributes.anchorId,
        }),
      },
      sourceId: {
        default: null,
        parseHTML: element => element.getAttribute('data-source-id'),
        renderHTML: attributes => ({
          'data-source-id': attributes.sourceId,
        }),
      },
      sourceName: {
        default: 'PDF',
        parseHTML: element => element.getAttribute('data-source-name'),
        renderHTML: attributes => ({
          'data-source-name': attributes.sourceName,
        }),
      },
      pageIndex: {
        default: 0,
        parseHTML: element => {
          const value = element.getAttribute('data-page-index')
          return value ? Number(value) : 0
        },
        renderHTML: attributes => ({
          'data-page-index': String(attributes.pageIndex ?? 0),
        }),
      },
      previewText: {
        default: null,
        parseHTML: element => element.getAttribute('data-preview-text'),
        renderHTML: attributes => {
          if (!attributes.previewText)
            return {}
          return { 'data-preview-text': attributes.previewText }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-pdf-reference]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-pdf-reference': '',
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfReferenceNode)
  },

  addCommands() {
    return {
      insertPdfReference:
        attributes =>
          ({ chain }) => {
            return chain()
              .insertContent({
                type: this.name,
                attrs: attributes,
              })
              .run()
          },
    }
  },
})
