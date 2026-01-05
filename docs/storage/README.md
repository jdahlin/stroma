---
title: "How are the storage docs organized?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How are the storage docs organized?
This document explains the storage documentation map and key decisions.

## Who is this for?
- Contributors working on persistence.
- Maintainers reviewing storage decisions.

## What is the scope?
- In scope: storage doc map and core decisions.
- Out of scope: complete implementation design.

## What is the mental model?
- Storage centers on sources, anchors, and notes with SQLite as the default store.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Source | A durable input like a PDF. | "A PDF in the library." |
| Anchor | A stable pointer into a source. | "A highlight on page 3." |
| Note | Editor content linked to a source or anchor. | "An extract tied to a highlight." |
| Asset | A stored file like a PDF. | "A file stored under app data." |

## Where are the storage docs?
- Data model and naming: [`model.md`](./model.md)
- SQLite schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Canonical queries: [`queries.md`](./queries.md)
- Asset storage: [`assets.md`](./assets.md)
- Scaling guidance: [`scaling.md`](./scaling.md)
- Migrations approach: [`migrations.md`](./migrations.md)
- Debugging commands: [`debugging.md`](./debugging.md)

## What are the key decisions?
- IDs are integer primary keys with per-source local numbering.
- PDF anchor geometry is stored in SQL columns, not only JSON.
- Binary assets live on disk; the DB stores metadata and URIs.

## What are the facts?
- SQLite is the default assumption for local persistence.

## What decisions are recorded?
- The DB is owned by the Electron main process, not the renderer.

## What are the open questions?
- When should full-text search be introduced?

## What are the failure modes or edge cases?
- Storing large PDFs as BLOBs bloats the DB.

## What assumptions and invariants apply?
- Sources, anchors, and notes are the core storage entities.

## What related docs matter?
- Editor integration: [`../editor/integration.md`](../editor/integration.md)
- PDF docs: [`../pdf/README.md`](../pdf/README.md)
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)

## What this doc does not cover
- Full IPC API design or DB implementation details.
