---
title: "How should source assets be stored?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How should source assets be stored?
This document explains how to store source assets like PDFs and thumbnails.

## Who is this for?
- Contributors implementing asset import.
- Maintainers reviewing storage trade-offs.

## What is the scope?
- In scope: asset storage strategy and directory layout.
- Out of scope: UI for asset management.

## What is the mental model?
- Store large binaries on disk and reference them from SQLite.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Asset store | App-managed files on disk. | "{userData}/assets" |
| Content hash | Dedup and integrity key. | "sha256 of a PDF" |
| Asset URI | Stable reference in the DB. | "app-asset://blobs/sha" |

## What is the recommendation?
- Store PDFs on disk, not as SQLite BLOBs.
- Store metadata and URIs in `reference_assets`.

## What directory layout is suggested?
- `{userData}/assets/`
- `{userData}/assets/references/{reference_id}/` or a content-addressable store at `{userData}/assets/blobs/{sha256}`.

## What is the import flow for a PDF?
1. User selects a PDF.
2. Main process computes a hash and normalizes metadata.
3. App copies the file into the asset store.
4. Create source and asset rows in a transaction.
5. Renderer opens the app-managed URI.

## What are the facts?
- BLOB storage makes the DB harder to back up and inspect.

## What decisions are recorded?
- Asset storage uses disk files with DB metadata.

## What are the open questions?
- Should we store original file paths as optional hints?

## What are the failure modes or edge cases?
- Absolute paths break if the app data directory moves.

## What assumptions and invariants apply?
- The app controls the asset directory lifecycle.

## What related docs matter?
- Storage model: [`model.md`](./model.md)
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)

## What this doc does not cover
- File import UX or permission prompts.
