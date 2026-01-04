/**
 * SQLite schema definition.
 * Version 1: Initial schema with references, anchors, notes.
 */

export const SCHEMA_VERSION = 1

export const SCHEMA_V1 = `
-- References (source documents)
CREATE TABLE IF NOT EXISTS "references" (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Reference assets (stored files/URLs)
CREATE TABLE IF NOT EXISTS reference_assets (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES "references"(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  uri TEXT NOT NULL,
  content_hash TEXT,
  byte_size INTEGER,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Anchors (highlights, selections)
CREATE TABLE IF NOT EXISTS anchors (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES "references"(id) ON DELETE CASCADE,
  local_no INTEGER NOT NULL,
  kind TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(reference_id, local_no)
);

-- PDF anchor common fields
CREATE TABLE IF NOT EXISTS pdf_anchors (
  anchor_id INTEGER PRIMARY KEY REFERENCES anchors(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL
);

-- PDF text anchor content
CREATE TABLE IF NOT EXISTS pdf_text_anchors (
  anchor_id INTEGER PRIMARY KEY REFERENCES anchors(id) ON DELETE CASCADE,
  text TEXT NOT NULL
);

-- PDF text anchor rectangles
CREATE TABLE IF NOT EXISTS pdf_text_anchor_rects (
  id INTEGER PRIMARY KEY,
  anchor_id INTEGER NOT NULL REFERENCES anchors(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL
);

-- Notes (editor content)
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES "references"(id) ON DELETE CASCADE,
  anchor_id INTEGER REFERENCES anchors(id) ON DELETE SET NULL,
  local_no INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(reference_id, local_no)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reference_assets_reference ON reference_assets(reference_id);
CREATE INDEX IF NOT EXISTS idx_anchors_reference ON anchors(reference_id);
CREATE INDEX IF NOT EXISTS idx_anchors_kind ON anchors(kind);
CREATE INDEX IF NOT EXISTS idx_pdf_anchors_page ON pdf_anchors(page_index);
CREATE INDEX IF NOT EXISTS idx_pdf_text_anchor_rects_anchor ON pdf_text_anchor_rects(anchor_id);
CREATE INDEX IF NOT EXISTS idx_notes_reference ON notes(reference_id);
CREATE INDEX IF NOT EXISTS idx_notes_anchor ON notes(anchor_id);
`
