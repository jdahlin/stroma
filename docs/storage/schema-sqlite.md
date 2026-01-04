# SQLite schema proposal

## Status

Planned.

## Design goals

- Generalized core tables (`references`, `reference_assets`, `anchors`, `notes`).
- PDF anchors stored in **proper SQL columns**.
- Other anchor locator types can use JSON as an extensibility escape hatch.
- Foreign keys enabled (`PRAGMA foreign_keys = ON`).

Timestamps are stored as unix epoch milliseconds (`INTEGER`) for easy interop with JS `Date`.

## Core tables

```sql
-- References: generalized sources (PDF, web, image, video, ...)
CREATE TABLE references (
  id            INTEGER PRIMARY KEY,
  type          TEXT NOT NULL, -- 'pdf' | 'web' | 'image' | 'youtube' | ...
  title         TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);

CREATE INDEX references_type_idx ON references(type);

-- Assets: concrete retrievable items for a reference.
CREATE TABLE reference_assets (
  id            INTEGER PRIMARY KEY,
  reference_id  INTEGER NOT NULL,
  kind          TEXT NOT NULL, -- 'file' | 'url' | 'thumbnail' | ...
  uri           TEXT NOT NULL,
  content_hash  TEXT,          -- e.g. sha256 hex
  byte_size     INTEGER,
  metadata_json TEXT,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,

  FOREIGN KEY(reference_id) REFERENCES references(id) ON DELETE CASCADE
);

CREATE INDEX reference_assets_reference_idx ON reference_assets(reference_id);
CREATE INDEX reference_assets_kind_idx ON reference_assets(kind);

-- Anchors: generalized pointers into a reference.
CREATE TABLE anchors (
  id            INTEGER PRIMARY KEY,
  reference_id  INTEGER NOT NULL,
  local_no      INTEGER NOT NULL, -- document-unique, debuggable ID
  kind          TEXT NOT NULL,     -- 'pdf_text' | 'pdf_point' | ...
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,

  FOREIGN KEY(reference_id) REFERENCES references(id) ON DELETE CASCADE,
  UNIQUE(reference_id, local_no)
);

CREATE INDEX anchors_reference_idx ON anchors(reference_id);
CREATE INDEX anchors_kind_idx ON anchors(kind);

-- Notes: editor documents tied to a reference and optionally to an anchor.
CREATE TABLE notes (
  id            INTEGER PRIMARY KEY,
  reference_id  INTEGER NOT NULL,
  anchor_id     INTEGER,          -- nullable: notes can be general to a reference
  local_no      INTEGER NOT NULL,  -- reference-unique note numbering
  content_type  TEXT NOT NULL,     -- e.g. 'tiptap_json'
  content       TEXT NOT NULL,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL,

  FOREIGN KEY(reference_id) REFERENCES references(id) ON DELETE CASCADE,
  FOREIGN KEY(anchor_id) REFERENCES anchors(id) ON DELETE SET NULL,
  UNIQUE(reference_id, local_no)
);

CREATE INDEX notes_reference_idx ON notes(reference_id);
CREATE INDEX notes_anchor_idx ON notes(anchor_id);
CREATE INDEX notes_updated_idx ON notes(updated_at DESC);

-- Optional MVP constraint: 0..1 note per anchor.
-- Uncomment if desired.
-- CREATE UNIQUE INDEX notes_one_per_anchor_idx ON notes(anchor_id) WHERE anchor_id IS NOT NULL;
```

## PDF anchor tables (SQL-first)

The `anchors` row is the stable identity; PDF-specific details live in tables keyed by `anchor_id`.

```sql
-- Common PDF fields.
CREATE TABLE pdf_anchors (
  anchor_id     INTEGER PRIMARY KEY,
  page_index    INTEGER NOT NULL, -- zero-based

  FOREIGN KEY(anchor_id) REFERENCES anchors(id) ON DELETE CASCADE
);

CREATE INDEX pdf_anchors_page_idx ON pdf_anchors(page_index);

-- Text anchors
CREATE TABLE pdf_text_anchors (
  anchor_id     INTEGER PRIMARY KEY,
  text          TEXT NOT NULL,

  FOREIGN KEY(anchor_id) REFERENCES pdf_anchors(anchor_id) ON DELETE CASCADE
);

-- Rects for text selections.
-- Storing as REAL keeps it simple; if you want exactness/dedup, consider scaled INTEGER.
CREATE TABLE pdf_text_anchor_rects (
  anchor_id     INTEGER NOT NULL,
  rect_index    INTEGER NOT NULL,
  x             REAL NOT NULL,
  y             REAL NOT NULL,
  width         REAL NOT NULL,
  height        REAL NOT NULL,

  PRIMARY KEY(anchor_id, rect_index),
  FOREIGN KEY(anchor_id) REFERENCES pdf_text_anchors(anchor_id) ON DELETE CASCADE
);

-- Point anchors (optional, used for precise clicks)
CREATE TABLE pdf_point_anchors (
  anchor_id     INTEGER PRIMARY KEY,
  x             REAL NOT NULL,
  y             REAL NOT NULL,

  FOREIGN KEY(anchor_id) REFERENCES pdf_anchors(anchor_id) ON DELETE CASCADE
);

-- Figure anchors (optional, used for captured regions)
CREATE TABLE pdf_figure_anchors (
  anchor_id     INTEGER PRIMARY KEY,
  x             REAL NOT NULL,
  y             REAL NOT NULL,
  width         REAL NOT NULL,
  height        REAL NOT NULL,

  FOREIGN KEY(anchor_id) REFERENCES pdf_anchors(anchor_id) ON DELETE CASCADE
);

CREATE INDEX pdf_text_rects_anchor_idx ON pdf_text_anchor_rects(anchor_id);
```

## Generic locator fallback (for non-PDF anchors)

For non-PDF anchors, you can either:

A) Create per-kind SQL tables later (preferred for performance-critical types)

B) Store a structured locator JSON payload:

```sql
CREATE TABLE anchor_locators (
  anchor_id     INTEGER PRIMARY KEY,
  locator_json  TEXT NOT NULL,

  FOREIGN KEY(anchor_id) REFERENCES anchors(id) ON DELETE CASCADE
);
```

## Notes on mapping to existing code

- `@repo/core` already defines `PdfSource` and `PdfAnchor` shapes.
- This schema is intentionally generalized but keeps PDF anchors query-friendly.
- The Electron renderer should not open the DB directly; the main process should offer typed IPC methods.

