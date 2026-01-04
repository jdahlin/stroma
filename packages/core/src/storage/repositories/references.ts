/**
 * References repository - CRUD operations for source documents.
 */

import { getDb, now } from '../db'
import type {
  CreateReferenceAssetInput,
  CreateReferenceInput,
  Reference,
  ReferenceAsset,
  ReferenceWithAsset,
  UpdateReferenceInput,
} from '../types'

/**
 * Create a new reference.
 */
export function createReference(input: CreateReferenceInput): Reference {
  const db = getDb()
  const timestamp = now()

  const result = db.prepare(`
    INSERT INTO "references" (type, title, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(input.type, input.title, timestamp, timestamp)

  return {
    id: result.lastInsertRowid as number,
    type: input.type,
    title: input.title,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/**
 * Get a reference by ID.
 */
export function getReference(id: number): Reference | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT id, type, title, created_at, updated_at
    FROM "references"
    WHERE id = ?
  `).get(id) as ReferenceRow | undefined

  if (!row) {
    return null
  }

  return rowToReference(row)
}

/**
 * Get a reference with its primary asset.
 */
export function getReferenceWithAsset(id: number): ReferenceWithAsset | null {
  const db = getDb()

  const row = db.prepare(`
    SELECT
      r.id, r.type, r.title, r.created_at, r.updated_at,
      a.id as asset_id, a.kind as asset_kind, a.uri as asset_uri,
      a.content_hash as asset_content_hash, a.byte_size as asset_byte_size,
      a.metadata_json as asset_metadata_json,
      a.created_at as asset_created_at, a.updated_at as asset_updated_at
    FROM "references" r
    LEFT JOIN reference_assets a ON a.reference_id = r.id
    WHERE r.id = ?
    LIMIT 1
  `).get(id) as ReferenceWithAssetRow | undefined

  if (!row) {
    return null
  }

  return rowToReferenceWithAsset(row)
}

/**
 * List all references.
 */
export function listReferences(): Reference[] {
  const db = getDb()

  const rows = db.prepare(`
    SELECT id, type, title, created_at, updated_at
    FROM "references"
    ORDER BY updated_at DESC
  `).all() as ReferenceRow[]

  return rows.map(rowToReference)
}

/**
 * List all references with their assets.
 */
export function listReferencesWithAssets(): ReferenceWithAsset[] {
  const db = getDb()

  const rows = db.prepare(`
    SELECT
      r.id, r.type, r.title, r.created_at, r.updated_at,
      a.id as asset_id, a.kind as asset_kind, a.uri as asset_uri,
      a.content_hash as asset_content_hash, a.byte_size as asset_byte_size,
      a.metadata_json as asset_metadata_json,
      a.created_at as asset_created_at, a.updated_at as asset_updated_at
    FROM "references" r
    LEFT JOIN reference_assets a ON a.reference_id = r.id
    ORDER BY r.updated_at DESC
  `).all() as ReferenceWithAssetRow[]

  return rows.map(rowToReferenceWithAsset)
}

/**
 * Update a reference.
 */
export function updateReference(id: number, input: UpdateReferenceInput): Reference | null {
  const db = getDb()
  const timestamp = now()

  const existing = getReference(id)
  if (!existing) {
    return null
  }

  db.prepare(`
    UPDATE "references"
    SET title = ?, updated_at = ?
    WHERE id = ?
  `).run(input.title ?? existing.title, timestamp, id)

  return {
    ...existing,
    title: input.title ?? existing.title,
    updatedAt: timestamp,
  }
}

/**
 * Delete a reference and all associated data (cascades via FK).
 */
export function deleteReference(id: number): boolean {
  const db = getDb()
  const result = db.prepare(`DELETE FROM "references" WHERE id = ?`).run(id)
  return result.changes > 0
}

/**
 * Create a reference asset.
 */
export function createReferenceAsset(input: CreateReferenceAssetInput): ReferenceAsset {
  const db = getDb()
  const timestamp = now()

  const result = db.prepare(`
    INSERT INTO reference_assets (
      reference_id, kind, uri, content_hash, byte_size, metadata_json, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.referenceId,
    input.kind,
    input.uri,
    input.contentHash ?? null,
    input.byteSize ?? null,
    input.metadataJson ?? null,
    timestamp,
    timestamp,
  )

  return {
    id: result.lastInsertRowid as number,
    referenceId: input.referenceId,
    kind: input.kind,
    uri: input.uri,
    contentHash: input.contentHash ?? null,
    byteSize: input.byteSize ?? null,
    metadataJson: input.metadataJson ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/**
 * Get assets for a reference.
 */
export function getAssetsForReference(referenceId: number): ReferenceAsset[] {
  const db = getDb()

  const rows = db.prepare(`
    SELECT id, reference_id, kind, uri, content_hash, byte_size, metadata_json, created_at, updated_at
    FROM reference_assets
    WHERE reference_id = ?
    ORDER BY created_at ASC
  `).all(referenceId) as ReferenceAssetRow[]

  return rows.map(rowToReferenceAsset)
}

// ============================================================================
// Internal row types and converters
// ============================================================================

interface ReferenceRow {
  id: number
  type: string
  title: string
  created_at: number
  updated_at: number
}

interface ReferenceAssetRow {
  id: number
  reference_id: number
  kind: string
  uri: string
  content_hash: string | null
  byte_size: number | null
  metadata_json: string | null
  created_at: number
  updated_at: number
}

interface ReferenceWithAssetRow extends ReferenceRow {
  asset_id: number | null
  asset_kind: string | null
  asset_uri: string | null
  asset_content_hash: string | null
  asset_byte_size: number | null
  asset_metadata_json: string | null
  asset_created_at: number | null
  asset_updated_at: number | null
}

function rowToReference(row: ReferenceRow): Reference {
  return {
    id: row.id,
    type: row.type as Reference['type'],
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function rowToReferenceAsset(row: ReferenceAssetRow): ReferenceAsset {
  return {
    id: row.id,
    referenceId: row.reference_id,
    kind: row.kind as ReferenceAsset['kind'],
    uri: row.uri,
    contentHash: row.content_hash,
    byteSize: row.byte_size,
    metadataJson: row.metadata_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function rowToReferenceWithAsset(row: ReferenceWithAssetRow): ReferenceWithAsset {
  const ref = rowToReference(row)

  if (row.asset_id === null) {
    return { ...ref, asset: null }
  }

  return {
    ...ref,
    asset: {
      id: row.asset_id,
      referenceId: ref.id,
      kind: row.asset_kind as ReferenceAsset['kind'],
      uri: row.asset_uri!,
      contentHash: row.asset_content_hash,
      byteSize: row.asset_byte_size,
      metadataJson: row.asset_metadata_json,
      createdAt: row.asset_created_at!,
      updatedAt: row.asset_updated_at!,
    },
  }
}
