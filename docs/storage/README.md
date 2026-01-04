# Storage

## Status

Planned.

## Goal

Define a local, durable persistence layer for:
- sources (PDF now; web/image/video later)
- anchors into sources (PDF page/text/rects, future locators)
- notes/extracts linked to sources and anchors
- imported assets (like PDFs) stored on disk, referenced from the database

The default assumption is **SQLite**, accessed from the Electron **main process** via a typed IPC layer.

## Start here

- Data model and naming: [`model.md`](./model.md)
- SQLite schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Canonical SQL queries: [`queries.md`](./queries.md)
- Imported assets (PDF storage on disk): [`assets.md`](./assets.md)
- Scaling guidance (how far SQLite can go): [`scaling.md`](./scaling.md)
- Migrations approach: [`migrations.md`](./migrations.md)

## Key decisions

- IDs: prefer **small, debuggable IDs**. Use integer primary keys internally + per-reference local numbering for anchors/notes.
- PDF data: store PDF anchor geometry in **proper SQL columns** (page/rects/text), not just JSON.
- Binary assets: store PDFs on disk; the DB stores metadata + a stable app-managed URI/path.

## See also

- Editor integration (PDF references): [`../editor/integration.md`](../editor/integration.md)
- PDF renderer docs: [`../pdf/README.md`](../pdf/README.md)
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)

