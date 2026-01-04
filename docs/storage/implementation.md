---
title: "How should persistent storage be implemented?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How should persistent storage be implemented?
This document explains the implementation plan for persistent storage in Stroma.

## Who is this for?
- Contributors implementing the storage layer.
- Maintainers reviewing architectural decisions.

## What is the scope?
- In scope: module structure, schema, repositories, IPC layer, and renderer integration.
- Out of scope: localStorage migration (no existing data), cloud sync.

## What is the mental model?
- Storage is a Node-only package in `@repo/storage` so the core types stay portable.
- The desktop app wraps storage with IPC for renderer access.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Repository | A module encapsulating DB queries for an entity. | `references.ts` handles reference CRUD. |
| Asset store | Content-addressable file storage for binaries. | PDFs stored at `{userData}/assets/blobs/{sha256}`. |
| IPC wrapper | Thin Electron layer exposing storage to renderer. | `storage-ipc.ts` in desktop app. |

## What is the module structure?

```
packages/storage/src/storage/
├── db.ts              # Connection, init, migrations
├── schema.ts          # DDL as string constant
├── assets.ts          # File storage for PDFs
├── repositories/
│   ├── references.ts
│   ├── anchors.ts
│   └── notes.ts
└── index.ts

packages/core/src/
└── storageTypes.ts    # Entity types and inputs

apps/desktop/src/main/
├── storage-ipc.ts     # IPC handlers calling @repo/storage
```

## What is the schema?

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE references (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE reference_assets (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES references(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  uri TEXT NOT NULL,
  content_hash TEXT,
  byte_size INTEGER,
  metadata_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE anchors (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES references(id) ON DELETE CASCADE,
  local_no INTEGER NOT NULL,
  kind TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(reference_id, local_no)
);

CREATE TABLE pdf_anchors (
  anchor_id INTEGER PRIMARY KEY REFERENCES anchors(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL
);

CREATE TABLE pdf_text_anchors (
  anchor_id INTEGER PRIMARY KEY REFERENCES anchors(id) ON DELETE CASCADE,
  text TEXT NOT NULL
);

CREATE TABLE pdf_text_anchor_rects (
  id INTEGER PRIMARY KEY,
  anchor_id INTEGER NOT NULL REFERENCES anchors(id) ON DELETE CASCADE,
  page_index INTEGER NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  width REAL NOT NULL,
  height REAL NOT NULL
);

CREATE TABLE notes (
  id INTEGER PRIMARY KEY,
  reference_id INTEGER NOT NULL REFERENCES references(id) ON DELETE CASCADE,
  anchor_id INTEGER REFERENCES anchors(id) ON DELETE SET NULL,
  local_no INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(reference_id, local_no)
);

CREATE INDEX idx_anchors_reference ON anchors(reference_id);
CREATE INDEX idx_pdf_anchors_page ON pdf_anchors(page_index);
CREATE INDEX idx_notes_reference ON notes(reference_id);
```

## What is the IPC API?

```typescript
interface StorageAPI {
  // References
  createReference(input: CreateReferenceInput): Promise<Reference>
  getReference(id: number): Promise<Reference | null>
  listReferences(): Promise<Reference[]>
  deleteReference(id: number): Promise<void>

  // Anchors
  createAnchor(input: CreateAnchorInput): Promise<Anchor>
  getAnchorsForReference(refId: number): Promise<Anchor[]>
  updateAnchor(id: number, input: UpdateAnchorInput): Promise<Anchor>
  deleteAnchor(id: number): Promise<void>

  // Notes
  createNote(input: CreateNoteInput): Promise<Note>
  getNote(id: number): Promise<Note | null>
  getNotesForReference(refId: number): Promise<Note[]>
  updateNote(id: number, input: UpdateNoteInput): Promise<Note>
  deleteNote(id: number): Promise<void>

  // Assets
  importPdf(filePath: string): Promise<Reference>
  getAssetPath(uri: string): Promise<string>
}
```

## What is the asset storage strategy?
- Store PDFs at `{userData}/assets/blobs/{sha256}`.
- Content-addressable for deduplication.
- DB stores URI as `app-asset://blobs/{sha256}`.
- Compute SHA-256 hash on import.

## What is the migration strategy?
- Use `PRAGMA user_version` for schema versioning.
- Run migrations at app startup before window creation.
- Enable `PRAGMA foreign_keys = ON` for every connection.

## What are the implementation steps?
1. Add `better-sqlite3` to `packages/core`.
2. Create storage module with `db.ts` and `schema.ts`.
3. Implement references repository.
4. Implement anchors repository.
5. Implement notes repository.
6. Implement asset storage.
7. Add storage IPC layer in desktop app.
8. Update preload to expose storage API.
9. Update renderer state to use DB.

## What are the facts?
- Storage lives in `@repo/storage` for CLI tool reuse.
- Anchor `local_no` is computed via `MAX(local_no) + 1` query.
- Note content is inline JSON in SQLite.

## What decisions are recorded?
- No localStorage migration needed (no existing data).
- `better-sqlite3` for synchronous SQLite access.
- Content-addressable asset storage for deduplication.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Native module ABI mismatch: use `ELECTRON_RUN_AS_NODE=1` for CLI tools.
- Asset directory moves: use relative URIs within app data.

## What assumptions and invariants apply?
- Main process owns DB access in Electron context.
- CLI tools access DB directly via `@repo/storage`.

## What related docs matter?
- Data model: [`model.md`](./model.md)
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Queries: [`queries.md`](./queries.md)
- Assets: [`assets.md`](./assets.md)

## What this doc does not cover
- Full repository implementation details.
- Renderer component changes.
