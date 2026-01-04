/**
 * Anchors repository - CRUD operations for anchors (highlights, selections).
 */

import type {
  Anchor,
  AnchorKind,
  CreateAnchorInput,
  CreatePdfTextAnchorInput,
  PdfTextAnchorFull,
  PdfTextAnchorRect,
} from '../types'

import { getDb, now } from '../db'

/**
 * Create a new anchor with auto-generated local_no.
 */
export function createAnchor(input: CreateAnchorInput): Anchor {
  const db = getDb()
  const timestamp = now()

  // Get next local_no for this reference
  const localNo = getNextLocalNo(input.referenceId)

  const result = db.prepare(`
    INSERT INTO anchors (reference_id, local_no, kind, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(input.referenceId, localNo, input.kind, timestamp, timestamp)

  return {
    id: result.lastInsertRowid as number,
    referenceId: input.referenceId,
    localNo,
    kind: input.kind,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/**
 * Create a complete PDF text anchor with all related data.
 * Uses a transaction to ensure atomicity.
 */
export function createPdfTextAnchor(input: CreatePdfTextAnchorInput): PdfTextAnchorFull {
  const db = getDb()
  const timestamp = now()

  return db.transaction(() => {
    // Get next local_no for this reference
    const localNo = getNextLocalNo(input.referenceId)

    // Create anchor identity
    const anchorResult = db.prepare(`
      INSERT INTO anchors (reference_id, local_no, kind, created_at, updated_at)
      VALUES (?, ?, 'pdf_text', ?, ?)
    `).run(input.referenceId, localNo, timestamp, timestamp)

    const anchorId = anchorResult.lastInsertRowid as number

    // Create PDF anchor common fields
    db.prepare(`
      INSERT INTO pdf_anchors (anchor_id, page_index)
      VALUES (?, ?)
    `).run(anchorId, input.pageIndex)

    // Create PDF text anchor content
    db.prepare(`
      INSERT INTO pdf_text_anchors (anchor_id, text)
      VALUES (?, ?)
    `).run(anchorId, input.text)

    // Create rectangles
    const insertRect = db.prepare(`
      INSERT INTO pdf_text_anchor_rects (anchor_id, page_index, x, y, width, height)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const rects: PdfTextAnchorRect[] = []
    for (const rect of input.rects) {
      const rectResult = insertRect.run(
        anchorId,
        rect.pageIndex,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
      )
      rects.push({
        id: rectResult.lastInsertRowid as number,
        anchorId,
        pageIndex: rect.pageIndex,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      })
    }

    return {
      id: anchorId,
      referenceId: input.referenceId,
      localNo,
      kind: 'pdf_text' as const,
      pageIndex: input.pageIndex,
      text: input.text,
      rects,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  })()
}

/**
 * Get an anchor by ID.
 */
export function getAnchor(id: number): Anchor | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT id, reference_id, local_no, kind, created_at, updated_at
    FROM anchors
    WHERE id = ?
  `).get(id) as AnchorRow | undefined

  if (!row) {
    return null
  }

  return rowToAnchor(row)
}

/**
 * Get all anchors for a reference.
 */
export function getAnchorsForReference(referenceId: number): Anchor[] {
  const db = getDb()

  const rows = db.prepare(`
    SELECT id, reference_id, local_no, kind, created_at, updated_at
    FROM anchors
    WHERE reference_id = ?
    ORDER BY local_no ASC
  `).all(referenceId) as AnchorRow[]

  return rows.map(rowToAnchor)
}

/**
 * Get all PDF text anchors for a reference with full data.
 */
export function getPdfTextAnchorsForReference(referenceId: number): PdfTextAnchorFull[] {
  const db = getDb()

  // Get all anchors with their PDF data
  const anchorRows = db.prepare(`
    SELECT
      a.id, a.reference_id, a.local_no, a.kind, a.created_at, a.updated_at,
      p.page_index, t.text
    FROM anchors a
    JOIN pdf_anchors p ON p.anchor_id = a.id
    JOIN pdf_text_anchors t ON t.anchor_id = a.id
    WHERE a.reference_id = ? AND a.kind = 'pdf_text'
    ORDER BY p.page_index ASC, a.local_no ASC
  `).all(referenceId) as PdfTextAnchorRow[]

  if (anchorRows.length === 0) {
    return []
  }

  // Get all rects for these anchors in one query
  const anchorIds = anchorRows.map(r => r.id)
  const placeholders = anchorIds.map(() => '?').join(',')
  const rectRows = db.prepare(`
    SELECT id, anchor_id, page_index, x, y, width, height
    FROM pdf_text_anchor_rects
    WHERE anchor_id IN (${placeholders})
    ORDER BY anchor_id, id
  `).all(...anchorIds) as PdfTextAnchorRectRow[]

  // Group rects by anchor_id
  const rectsByAnchor = new Map<number, PdfTextAnchorRect[]>()
  for (const rect of rectRows) {
    const rects = rectsByAnchor.get(rect.anchor_id) ?? []
    rects.push({
      id: rect.id,
      anchorId: rect.anchor_id,
      pageIndex: rect.page_index,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    })
    rectsByAnchor.set(rect.anchor_id, rects)
  }

  return anchorRows.map(row => ({
    id: row.id,
    referenceId: row.reference_id,
    localNo: row.local_no,
    kind: 'pdf_text' as const,
    pageIndex: row.page_index,
    text: row.text,
    rects: rectsByAnchor.get(row.id) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Get anchors for a specific page.
 */
export function getAnchorsForPage(referenceId: number, pageIndex: number): PdfTextAnchorFull[] {
  const db = getDb()

  const anchorRows = db.prepare(`
    SELECT
      a.id, a.reference_id, a.local_no, a.kind, a.created_at, a.updated_at,
      p.page_index, t.text
    FROM anchors a
    JOIN pdf_anchors p ON p.anchor_id = a.id
    LEFT JOIN pdf_text_anchors t ON t.anchor_id = a.id
    WHERE a.reference_id = ? AND p.page_index = ?
    ORDER BY a.local_no ASC
  `).all(referenceId, pageIndex) as PdfTextAnchorRow[]

  if (anchorRows.length === 0) {
    return []
  }

  // Get rects for these anchors
  const anchorIds = anchorRows.map(r => r.id)
  const placeholders = anchorIds.map(() => '?').join(',')
  const rectRows = db.prepare(`
    SELECT id, anchor_id, page_index, x, y, width, height
    FROM pdf_text_anchor_rects
    WHERE anchor_id IN (${placeholders}) AND page_index = ?
    ORDER BY anchor_id, id
  `).all(...anchorIds, pageIndex) as PdfTextAnchorRectRow[]

  const rectsByAnchor = new Map<number, PdfTextAnchorRect[]>()
  for (const rect of rectRows) {
    const rects = rectsByAnchor.get(rect.anchor_id) ?? []
    rects.push({
      id: rect.id,
      anchorId: rect.anchor_id,
      pageIndex: rect.page_index,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    })
    rectsByAnchor.set(rect.anchor_id, rects)
  }

  return anchorRows.map(row => ({
    id: row.id,
    referenceId: row.reference_id,
    localNo: row.local_no,
    kind: 'pdf_text' as const,
    pageIndex: row.page_index,
    text: row.text,
    rects: rectsByAnchor.get(row.id) ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Delete an anchor and all related data (cascades via FK).
 */
export function deleteAnchor(id: number): boolean {
  const db = getDb()
  const result = db.prepare(`DELETE FROM anchors WHERE id = ?`).run(id)
  return result.changes > 0
}

/**
 * Get the next local_no for a reference.
 */
function getNextLocalNo(referenceId: number): number {
  const db = getDb()
  const result = db.prepare(`
    SELECT COALESCE(MAX(local_no), 0) + 1 AS next_local_no
    FROM anchors
    WHERE reference_id = ?
  `).get(referenceId) as { next_local_no: number }
  return result.next_local_no
}

// ============================================================================
// Internal row types and converters
// ============================================================================

interface AnchorRow {
  id: number
  reference_id: number
  local_no: number
  kind: string
  created_at: number
  updated_at: number
}

interface PdfTextAnchorRow extends AnchorRow {
  page_index: number
  text: string
}

interface PdfTextAnchorRectRow {
  id: number
  anchor_id: number
  page_index: number
  x: number
  y: number
  width: number
  height: number
}

function rowToAnchor(row: AnchorRow): Anchor {
  return {
    id: row.id,
    referenceId: row.reference_id,
    localNo: row.local_no,
    kind: row.kind as AnchorKind,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
