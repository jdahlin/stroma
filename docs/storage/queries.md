---
title: "What are the canonical storage queries?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What are the canonical storage queries?
This document explains example SQLite queries for core storage workflows.

## Who is this for?
- Contributors implementing storage access.
- Maintainers reviewing query patterns.

## What is the scope?
- In scope: representative queries and access patterns.
- Out of scope: full query catalog.

## What is the mental model?
- Use transactions for multi-row writes and indexed lookups for read paths.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Transaction | Grouped writes that must succeed together. | "Insert source + asset." |
| Local numbering | Per-source anchor numbering. | "local_no increments per source." |
| Render query | Fetch anchors for overlays. | "List anchors by page." |

## What is a reference write example?
```sql
BEGIN;
INSERT INTO references (type, title, created_at, updated_at)
VALUES (?, ?, ?, ?);
INSERT INTO reference_assets (
  reference_id, kind, uri, content_hash, byte_size, metadata_json, created_at, updated_at
) VALUES (?, 'file', ?, ?, ?, ?, ?, ?);
COMMIT;
```

## How is the next anchor number allocated?
```sql
SELECT COALESCE(MAX(local_no), 0) + 1 AS next_local_no
FROM anchors
WHERE reference_id = ?;
```

## How are anchors fetched for rendering?
```sql
SELECT a.id, a.local_no, a.kind, p.page_index, t.text
FROM anchors a
JOIN pdf_anchors p ON p.anchor_id = a.id
LEFT JOIN pdf_text_anchors t ON t.anchor_id = a.id
WHERE a.reference_id = ?
ORDER BY p.page_index ASC, a.local_no ASC;
```

## What are the facts?
- Canonical queries assume writes happen in the main process.

## What decisions are recorded?
- Anchor numbering uses per-source local numbers.

## What are the open questions?
- Should we introduce a `reference_counters` table for concurrency?

## What are the failure modes or edge cases?
- Concurrent anchor inserts can duplicate local numbers without a lock.

## What assumptions and invariants apply?
- Foreign keys are enabled for each connection.

## What related docs matter?
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Migrations: [`migrations.md`](./migrations.md)

## What this doc does not cover
- Full query set or ORM abstractions.
