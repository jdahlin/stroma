/**
 * Notes repository - CRUD operations for notes (editor content).
 */

import type {
  CreateNoteInput,
  Note,
  NoteContentType,
  UpdateNoteInput,
} from '@repo/core'

import { getDb, now } from '../db'

/**
 * Create a new note with auto-generated local_no.
 */
export function createNote(input: CreateNoteInput): Note {
  const db = getDb()
  const timestamp = now()

  // Get next local_no for this reference
  const localNo = getNextLocalNo(input.referenceId)

  const result = db.prepare(`
    INSERT INTO notes (reference_id, anchor_id, local_no, content_type, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.referenceId,
    input.anchorId ?? null,
    localNo,
    input.contentType,
    input.content,
    timestamp,
    timestamp,
  )

  return {
    id: result.lastInsertRowid as number,
    referenceId: input.referenceId,
    anchorId: input.anchorId ?? null,
    localNo,
    contentType: input.contentType,
    content: input.content,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/**
 * Get a note by ID.
 */
export function getNote(id: number): Note | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT id, reference_id, anchor_id, local_no, content_type, content, created_at, updated_at
    FROM notes
    WHERE id = ?
  `).get(id) as NoteRow | undefined

  if (!row) {
    return null
  }

  return rowToNote(row)
}

/**
 * Get a note by reference and local_no.
 */
export function getNoteByLocalNo(referenceId: number, localNo: number): Note | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT id, reference_id, anchor_id, local_no, content_type, content, created_at, updated_at
    FROM notes
    WHERE reference_id = ? AND local_no = ?
  `).get(referenceId, localNo) as NoteRow | undefined

  if (!row) {
    return null
  }

  return rowToNote(row)
}

/**
 * Get all notes for a reference.
 */
export function getNotesForReference(referenceId: number): Note[] {
  const db = getDb()

  const rows = db.prepare(`
    SELECT id, reference_id, anchor_id, local_no, content_type, content, created_at, updated_at
    FROM notes
    WHERE reference_id = ?
    ORDER BY local_no ASC
  `).all(referenceId) as NoteRow[]

  return rows.map(rowToNote)
}

/**
 * Get the note for a specific anchor.
 */
export function getNoteForAnchor(anchorId: number): Note | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT id, reference_id, anchor_id, local_no, content_type, content, created_at, updated_at
    FROM notes
    WHERE anchor_id = ?
  `).get(anchorId) as NoteRow | undefined

  if (!row) {
    return null
  }

  return rowToNote(row)
}

/**
 * Update a note.
 */
export function updateNote(id: number, input: UpdateNoteInput): Note | null {
  const db = getDb()
  const timestamp = now()

  const existing = getNote(id)
  if (!existing) {
    return null
  }

  const newContent = input.content ?? existing.content
  const newAnchorId = input.anchorId !== undefined ? input.anchorId : existing.anchorId

  db.prepare(`
    UPDATE notes
    SET content = ?, anchor_id = ?, updated_at = ?
    WHERE id = ?
  `).run(newContent, newAnchorId, timestamp, id)

  return {
    ...existing,
    content: newContent,
    anchorId: newAnchorId,
    updatedAt: timestamp,
  }
}

/**
 * Delete a note.
 */
export function deleteNote(id: number): boolean {
  const db = getDb()
  const result = db.prepare(`DELETE FROM notes WHERE id = ?`).run(id)
  return result.changes > 0
}

/**
 * Get the next local_no for notes in a reference.
 */
function getNextLocalNo(referenceId: number): number {
  const db = getDb()
  const result = db.prepare(`
    SELECT COALESCE(MAX(local_no), 0) + 1 AS next_local_no
    FROM notes
    WHERE reference_id = ?
  `).get(referenceId) as { next_local_no: number }
  return result.next_local_no
}

// ============================================================================
// Internal row types and converters
// ============================================================================

interface NoteRow {
  id: number
  reference_id: number
  anchor_id: number | null
  local_no: number
  content_type: string
  content: string
  created_at: number
  updated_at: number
}

function rowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    referenceId: row.reference_id,
    anchorId: row.anchor_id,
    localNo: row.local_no,
    contentType: row.content_type as NoteContentType,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
