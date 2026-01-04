# Persistent Storage Plan (Notes + References)

> **Moved:** This document has been split into smaller topic docs under [`docs/storage/`](./storage/README.md).
>
> Start here: [`docs/storage/README.md`](./storage/README.md)

---

## Legacy notes

The content below is kept temporarily to avoid breaking deep links, but it will be removed once all references are updated.

---

## Goals

- Durable storage for notes, extracts, and anchors.
- Stable IDs and links between source material and notes.
- Support multiple reference types (PDF, web, image, video).
- Clear migration path as data shapes evolve.

## Non-goals

- Cloud sync or collaboration.
- Full-text search indexing (can be added later).
- Encryption at rest (can be added later).

---

## Storage Approach

Start with a local relational store in the app data directory. SQLite is the
default assumption, but the plan is implementation-agnostic as long as:
- It supports relational constraints (foreign keys).
- It supports migrations.
- It is accessible from the Electron main process.

Introduce a storage adapter boundary in the app so localStorage can be swapped
without large refactors.

---

## Data Model (Minimal)

This is a minimal schema that supports notes + references across source types.

Entities:
- Reference: id, type, title, createdAt
- ReferenceAsset: id, referenceId, kind, uri, metadata
- Anchor: id, referenceId, locator, createdAt
- Note: id, referenceId, anchorId, content, createdAt, updatedAt

Reference.type:
- "pdf"
- "web"
- "image"
- "youtube"

ReferenceAsset.kind:
- "file" (local path or app-managed)
- "url" (http/https)
- "thumbnail" (optional)

Anchor.locator:
- PDF: page + bounds (or page + text offset)
- Web: url + selector / text offset
- Image: bounding box
- YouTube: video id + timestamp range

Relationships:
- One reference has many anchors.
- One anchor has zero or one note (MVP).
- Notes are tied to a reference and optionally to an anchor.

---

## API Surface (Conceptual)

This is the minimal API the renderer should expect.

- createReference(type, title, assets) -> referenceId
- createAnchor(referenceId, locator) -> anchorId
- createNote(referenceId, anchorId, content) -> noteId
- updateNote(noteId, content) -> void
- listNotes(referenceId) -> Note[]
- getAnchor(anchorId) -> Anchor

The renderer should not access storage directly; use a typed IPC layer.

---

## Migration Strategy

- Use versioned migrations.
- Keep migration scripts in the main process package.
- Store a schema version in the database.

---

## MVP Decision Points

1. Pick SQLite library for Electron (e.g., better-sqlite3 or sqlite3).
2. Define the initial schema and migration tooling.
3. Implement storage adapter with a localStorage fallback (optional).
4. Wire extracts to use the new storage for notes + anchors.

## See also

- MVP roadmap: [`roadmap-mvp.md`](./roadmap-mvp.md)
- Editor integration (notes + references): [`editor/integration.md`](./editor/integration.md)
- PDF docs (anchors): [`pdf/README.md`](./pdf/README.md)
