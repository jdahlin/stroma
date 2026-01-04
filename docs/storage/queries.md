# Canonical SQL queries

## Status

Planned.

These are example queries and access patterns for a SQLite-backed implementation.
They assume writes happen in the Electron main process.

## Reference + assets

### Create a reference with assets (transaction)

```sql
BEGIN;

INSERT INTO references (type, title, created_at, updated_at)
VALUES (?, ?, ?, ?);

-- Get last insert row id from your SQLite driver
-- ref_id := last_insert_rowid()

INSERT INTO reference_assets (
  reference_id, kind, uri, content_hash, byte_size, metadata_json, created_at, updated_at
)
VALUES
  (?, 'file', ?, ?, ?, ?, ?, ?);

COMMIT;
```

### List assets for a reference

```sql
SELECT id, kind, uri, content_hash, byte_size, metadata_json
FROM reference_assets
WHERE reference_id = ?
ORDER BY id ASC;
```

## Anchor numbering (no UUIDs)

Anchors have a per-reference `local_no`.

### Allocate the next local anchor number

In a transaction (or single-writer environment):

```sql
SELECT COALESCE(MAX(local_no), 0) + 1 AS next_local_no
FROM anchors
WHERE reference_id = ?;
```

If you later need strict atomic allocation under concurrent writers, introduce a `reference_counters` table.

## PDF text anchor creation

### Create PDF text anchor + rects (transaction)

```sql
BEGIN;

-- 1) Allocate local_no
-- next_local_no := SELECT...

-- 2) Insert anchor identity
INSERT INTO anchors (reference_id, local_no, kind, created_at, updated_at)
VALUES (?, ?, 'pdf_text', ?, ?);

-- anchor_id := last_insert_rowid()

-- 3) Common PDF fields
INSERT INTO pdf_anchors (anchor_id, page_index)
VALUES (?, ?);

-- 4) Text fields
INSERT INTO pdf_text_anchors (anchor_id, text)
VALUES (?, ?);

-- 5) Rects (repeat for each rect)
INSERT INTO pdf_text_anchor_rects (anchor_id, rect_index, x, y, width, height)
VALUES (?, ?, ?, ?, ?, ?);

COMMIT;
```

## Fetch anchors for rendering

### List anchors for a PDF reference

This returns enough to render the sidebar and overlays.

```sql
SELECT
  a.id                AS anchor_id,
  a.local_no          AS anchor_local_no,
  a.kind              AS kind,
  p.page_index        AS page_index,
  t.text              AS text
FROM anchors a
JOIN pdf_anchors p          ON p.anchor_id = a.id
LEFT JOIN pdf_text_anchors t ON t.anchor_id = a.id
WHERE a.reference_id = ?
ORDER BY p.page_index ASC, a.local_no ASC;
```

### Get rects for a text anchor

```sql
SELECT rect_index, x, y, width, height
FROM pdf_text_anchor_rects
WHERE anchor_id = ?
ORDER BY rect_index ASC;
```

### Lookup an anchor by (reference_id, local_no)

Useful if editor nodes store `reference_id` + `anchor_local_no`.

```sql
SELECT id
FROM anchors
WHERE reference_id = ? AND local_no = ?;
```

## Notes

### Upsert note content for an anchor (MVP: 0..1 note per anchor)

If you enable the unique index on `notes(anchor_id)` you can use an UPSERT:

```sql
INSERT INTO notes (
  reference_id, anchor_id, local_no, content_type, content, created_at, updated_at
)
VALUES (?, ?, ?, 'tiptap_json', ?, ?, ?)
ON CONFLICT(anchor_id) DO UPDATE SET
  content = excluded.content,
  updated_at = excluded.updated_at;
```

If notes can be many-per-anchor later, use `notes.id` and update by id instead.

### List notes for a reference (recent first)

```sql
SELECT id, anchor_id, local_no, content_type, content, created_at, updated_at
FROM notes
WHERE reference_id = ?
ORDER BY updated_at DESC;
```

### Fetch note(s) with anchor context for rendering backlinks

```sql
SELECT
  n.id          AS note_id,
  n.local_no    AS note_local_no,
  n.content     AS content,
  a.id          AS anchor_id,
  a.local_no    AS anchor_local_no,
  p.page_index  AS page_index,
  t.text        AS preview_text
FROM notes n
LEFT JOIN anchors a          ON a.id = n.anchor_id
LEFT JOIN pdf_anchors p      ON p.anchor_id = a.id
LEFT JOIN pdf_text_anchors t ON t.anchor_id = a.id
WHERE n.reference_id = ?
ORDER BY n.updated_at DESC;
```

