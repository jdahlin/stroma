---
title: "How far can SQLite scale for Stroma?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How far can SQLite scale for Stroma?
This document explains practical scaling expectations and trade-offs for SQLite.

## Who is this for?
- Contributors making performance decisions.
- Maintainers planning storage upgrades.

## What is the scope?
- In scope: scale drivers and mitigation guidelines.
- Out of scope: benchmarks and perf tooling.

## What is the mental model?
- Scaling limits are UX-driven: slow lists and searches appear before hard DB limits.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Anchor volume | Count of anchors and rects. | "Millions of anchors across sources." |
| Note size | Size of stored note content. | "Large JSON notes." |
| FTS | Full-text search index. | "FTS table for note content." |

## What are the scale drivers?
- Anchor rect tables grow faster than anchor identities.
- Note content size drives DB file growth.
- FTS adds a second copy of text content.

## What are the recommended limits?
- Hundreds of thousands to a few million anchors should be workable.
- Large notes may need external storage if they reach hundreds of KB.

## Should note content live in SQLite?
- Default: yes, for atomic updates and simple backups.
- Escape hatch: `notes.content_uri` for oversized notes.

## What are the facts?
- SQLite supports large DBs, but UX degradation is the practical limit.

## What decisions are recorded?
- Start with SQLite and optimize queries before changing storage.

## What are the open questions?
- When should FTS be introduced in the MVP timeline?

## What are the failure modes or edge cases?
- Loading full note content in list views causes memory spikes.

## What assumptions and invariants apply?
- Hot paths query indexed columns only.

## What related docs matter?
- Queries: [`queries.md`](./queries.md)
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)

## What this doc does not cover
- Detailed performance benchmarks or alternative databases.
