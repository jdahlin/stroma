import type { PdfReferenceAttributes } from '../types'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PdfReferenceNode } from '../components/PdfReferenceNode'

export interface PdfReferenceOptions {
  HTMLAttributes: Record<string, unknown>
  onReferenceClick?: (anchorId: string) => void
}

interface PdfReferenceAttributeMap {
  anchorId?: string | null
  sourceId?: string | null
  sourceName?: string | null
  pageIndex?: number | null
  previewText?: string | null
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
        parseHTML: (element: HTMLElement) => element.getAttribute('data-anchor-id'),
        renderHTML: (attributes: PdfReferenceAttributeMap) => {
          if (typeof attributes.anchorId !== 'string')
            return {}
          return { 'data-anchor-id': attributes.anchorId }
        },
      },
      sourceId: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-source-id'),
        renderHTML: (attributes: PdfReferenceAttributeMap) => {
          if (typeof attributes.sourceId !== 'string')
            return {}
          return { 'data-source-id': attributes.sourceId }
        },
      },
      sourceName: {
        default: 'PDF',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-source-name'),
        renderHTML: (attributes: PdfReferenceAttributeMap) => {
          const sourceName = typeof attributes.sourceName === 'string'
            ? attributes.sourceName
            : 'PDF'
          return { 'data-source-name': sourceName }
        },
      },
      pageIndex: {
        default: 0,
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute('data-page-index')
          return value === null ? 0 : Number(value)
        },
        renderHTML: (attributes: PdfReferenceAttributeMap) => {
          const pageIndex = Number.isFinite(attributes.pageIndex)
            ? attributes.pageIndex
            : 0
          return { 'data-page-index': String(pageIndex) }
        },
      },
      previewText: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-preview-text'),
        renderHTML: (attributes: PdfReferenceAttributeMap) => {
          if (typeof attributes.previewText !== 'string' || attributes.previewText.length === 0)
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
