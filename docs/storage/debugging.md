---
title: "How do I inspect the SQLite database?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How do I inspect the SQLite database?
This document lists quick sqlite3 commands for checking internal storage state.

## Where is the database?
- macOS: `~/Library/Application Support/Stroma/stroma.db`
- Linux: `~/.config/Stroma/stroma.db`
- Windows: `%APPDATA%\\Stroma\\stroma.db`
- The app uses `app.getPath('userData')/stroma.db`

## Open sqlite3
```bash
sqlite3 "$HOME/Library/Application Support/Stroma/stroma.db"
```

## Quick inspection commands
```sql
.tables
PRAGMA user_version;
PRAGMA foreign_keys;

SELECT id, type, title, created_at, updated_at
FROM references
ORDER BY id DESC
LIMIT 20;

SELECT id, reference_id, kind, uri, content_hash, byte_size
FROM reference_assets
ORDER BY id DESC
LIMIT 20;

SELECT id, reference_id, local_no, kind, created_at
FROM anchors
ORDER BY id DESC
LIMIT 20;

SELECT id, anchor_id, text
FROM pdf_text_anchors
ORDER BY id DESC
LIMIT 20;

SELECT id, anchor_id, page_index, x, y, width, height
FROM pdf_text_anchor_rects
ORDER BY id DESC
LIMIT 20;

SELECT id, reference_id, anchor_id, local_no, content_type, updated_at
FROM notes
ORDER BY id DESC
LIMIT 20;
```

## Helpful joins
```sql
-- PDF anchors for a specific reference
SELECT
  a.id,
  a.local_no,
  p.page_index,
  t.text
FROM anchors a
JOIN pdf_anchors p ON p.anchor_id = a.id
JOIN pdf_text_anchors t ON t.anchor_id = a.id
WHERE a.reference_id = 1
ORDER BY a.local_no ASC;

-- Notes for a specific reference
SELECT id, local_no, anchor_id, content_type, updated_at
FROM notes
WHERE reference_id = 1
ORDER BY local_no ASC;
```
