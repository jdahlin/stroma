---
title: "What is the storage data model?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the storage data model?
This document explains the generalized storage data model for sources, anchors, and notes.

## Who is this for?
- Contributors designing persistence.
- Maintainers reviewing schema choices.

## What is the scope?
- In scope: entity definitions and naming rules.
- Out of scope: specific SQL schema or queries.

## What is the mental model?
- Sources have assets and anchors; notes attach to sources or anchors.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Source | A logical input like a PDF or web page. | "A PDF source titled 'Paper A'." |
| Asset | A concrete retrievable item for a source. | "A stored PDF file." |
| Anchor | A stable pointer into a source. | "A page+rect selection." |
| Note | Editor content tied to a source or anchor. | "An extract linked to a highlight." |

## What naming rules apply?
- Use "source" in docs; the schema table is named `references` for historical reasons.
- Anchors and notes use per-source local numbers for debug-friendly IDs.

## What entities are required?
| Entity | Purpose | Example |
| --- | --- | --- |
| Source | Identify a logical item. | "A PDF source" |
| Source asset | Store file/URL metadata. | "app-asset://blobs/sha256" |
| Anchor | Locate a point in a source. | "pdf_text anchor" |
| Note | Store editor content. | "tiptap_json content" |

## What ID strategy is recommended?
- Use integer primary keys for joins.
- Use `(source_id, local_no)` for human-readable IDs.
- Add optional public IDs later if sync requires them.

## What are the facts?
- Anchors must be queryable by source and type.

## What decisions are recorded?
- SQLite schema keeps PDF anchor fields in SQL columns.

## What are the open questions?
- Should notes allow multiple anchors per note in later phases?

## What are the failure modes or edge cases?
- Overloaded JSON locators make anchor queries slow.

## What assumptions and invariants apply?
- A source can have many anchors and notes.

## What related docs matter?
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Queries: [`queries.md`](./queries.md)
- Assets: [`assets.md`](./assets.md)

## What this doc does not cover
- Concrete SQL DDL or migration steps.
