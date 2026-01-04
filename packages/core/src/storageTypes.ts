/**
 * Storage entity types and input interfaces.
 */

// ============================================================================
// Reference (Source) Types
// ============================================================================

export type ReferenceType = 'pdf' | 'web' | 'image'

export interface Reference {
  id: number
  type: ReferenceType
  title: string
  createdAt: number // Unix epoch ms
  updatedAt: number
}

export interface CreateReferenceInput {
  type: ReferenceType
  title: string
}

export interface UpdateReferenceInput {
  title?: string
}

// ============================================================================
// Reference Asset Types
// ============================================================================

export type AssetKind = 'file' | 'url'

export interface ReferenceAsset {
  id: number
  referenceId: number
  kind: AssetKind
  uri: string
  contentHash: string | null
  byteSize: number | null
  metadataJson: string | null
  createdAt: number
  updatedAt: number
}

export interface CreateReferenceAssetInput {
  referenceId: number
  kind: AssetKind
  uri: string
  contentHash?: string
  byteSize?: number
  metadataJson?: string
}

// ============================================================================
// Anchor Types
// ============================================================================

export type AnchorKind = 'pdf_text' | 'pdf_point' | 'pdf_figure' | 'web_selector'

export interface Anchor {
  id: number
  referenceId: number
  localNo: number
  kind: AnchorKind
  createdAt: number
  updatedAt: number
}

export interface CreateAnchorInput {
  referenceId: number
  kind: AnchorKind
}

export interface UpdateAnchorInput {
  // Currently no updatable fields on anchor identity
}

// ============================================================================
// PDF Anchor Types
// ============================================================================

export interface PdfAnchorData {
  anchorId: number
  pageIndex: number
}

export interface PdfTextAnchorData {
  anchorId: number
  text: string
}

export interface PdfTextAnchorRect {
  id: number
  anchorId: number
  pageIndex: number
  x: number
  y: number
  width: number
  height: number
}

export interface CreatePdfTextAnchorInput {
  referenceId: number
  pageIndex: number
  text: string
  rects: Array<{
    pageIndex: number
    x: number
    y: number
    width: number
    height: number
  }>
}

// ============================================================================
// Note Types
// ============================================================================

export type NoteContentType = 'tiptap_json' | 'plain_text'

export interface Note {
  id: number
  referenceId: number
  anchorId: number | null
  localNo: number
  contentType: NoteContentType
  content: string
  createdAt: number
  updatedAt: number
}

export interface CreateNoteInput {
  referenceId: number
  anchorId?: number
  contentType: NoteContentType
  content: string
}

export interface UpdateNoteInput {
  content?: string
  anchorId?: number | null
}

// ============================================================================
// Composite Types (for queries that join tables)
// ============================================================================

export interface PdfTextAnchorFull extends Anchor {
  kind: 'pdf_text'
  pageIndex: number
  text: string
  rects: PdfTextAnchorRect[]
}

export interface ReferenceWithAsset extends Reference {
  asset: ReferenceAsset | null
}
