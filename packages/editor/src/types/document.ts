import type { PdfAnchorId, PdfSourceId } from '@repo/core'
import type { JSONContent } from '@tiptap/core'

/** TipTap document content type alias */
export type DocumentContent = JSONContent

/** Props for the main Editor component */
export interface EditorProps {
  /** Unique ID for localStorage persistence */
  documentId: string
  /** Initial document content (overrides localStorage) */
  content?: DocumentContent
  /** Called on every change */
  onChange?: (content: DocumentContent) => void
  /** PDF reference click handler */
  onPdfReferenceClick?: (anchorId: string) => void
  /** Placeholder text when empty */
  placeholder?: string
  /** Disable editing */
  readOnly?: boolean
  /** Focus on mount */
  autoFocus?: boolean
}

/** PDF reference node attributes */
export interface PdfReferenceAttributes {
  /** Unique anchor identifier from @repo/core */
  anchorId: PdfAnchorId
  /** PDF document identifier */
  sourceId: PdfSourceId
  /** Display name of the PDF */
  sourceName: string
  /** Zero-based page number */
  pageIndex: number
  /** Optional text excerpt from the anchor */
  previewText?: string
}

/** Section node attributes */
export interface SectionAttributes {
  /** Unique section identifier (auto-generated UUID) */
  id: string
  /** Section title for display and navigation */
  title: string
  /** Whether section content is hidden */
  collapsed: boolean
}
