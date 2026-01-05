---
title: "What is the proposed SQLite schema?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the proposed SQLite schema?
This document explains the proposed SQLite schema for sources, anchors, and notes.

## Who is this for?
- Contributors implementing persistence.
- Maintainers reviewing schema trade-offs.

## What is the scope?
- In scope: table roles, key columns, and indexing strategy.
- Out of scope: full DDL listings.

## What is the mental model?
- Keep core entities normalized, and store PDF-specific anchor fields in dedicated tables.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Core tables | Shared tables for sources, anchors, notes. | "sources, anchors, notes" |
| PDF anchor tables | SQL-first tables for PDF locators. | "pdf_text_anchors" |
| Locator fallback | JSON locator for non-PDF types. | "web selector JSON" |

## What are the core tables?
| Table | Purpose | Example |
| --- | --- | --- |
| `references` | Store sources (PDF, web, image). | "type=pdf, title='Paper'" |
| `reference_assets` | Store concrete source assets. | "file URI and hash" |
| `anchors` | Store anchor identities. | "kind=pdf_text" |
| `notes` | Store editor content and derived title. | "title='...', tiptap_json note" |

## What PDF-specific tables are required?
| Table | Purpose | Example |
| --- | --- | --- |
| `pdf_anchors` | Common PDF fields like page index. | "page_index=4" |
| `pdf_text_anchors` | Text selection content. | "text='...'" |
| `pdf_text_anchor_rects` | Selection rectangles. | "x,y,width,height" |

## What indexes and constraints matter?
- Unique `(reference_id, local_no)` for anchors and notes.
- Indexes on `reference_id` and `kind` for anchor lookups.
- Foreign keys enabled via `PRAGMA foreign_keys = ON`.

## What is a concrete example?
```sql
-- Insert a PDF text anchor identity
INSERT INTO anchors (reference_id, local_no, kind, created_at, updated_at)
VALUES (?, ?, 'pdf_text', ?, ?);
```

## What are the facts?
- Timestamps are stored as unix epoch milliseconds.

## What decisions are recorded?
- PDF anchor geometry is stored in SQL columns.

## What are the open questions?
- When should non-PDF anchor tables replace JSON locators?

## What are the failure modes or edge cases?
- Missing indexes make anchor queries sluggish at scale.

## What assumptions and invariants apply?
- The renderer does not access the database directly.

## What related docs matter?
- Data model: [`model.md`](./model.md)
- Queries: [`queries.md`](./queries.md)
- Migrations: [`migrations.md`](./migrations.md)

## What this doc does not cover
- Full schema DDL or migration scripts.
