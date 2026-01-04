# Imported assets (PDFs, thumbnails, etc.)

## Status

Planned.

## Recommendation

Store large/binary assets (PDFs) **on disk**, not inside SQLite.

The database stores:
- metadata (title, page count, byte size)
- a stable identifier/URI to a file managed by the app
- content hash for deduplication/integrity

Why not store PDFs as BLOBs in SQLite?
- DB file grows quickly and becomes costly to vacuum/backup/repair.
- Harder to inspect/debug.
- You often want streaming file IO and OS-level caching.

## Asset directory layout

Use the OS app data directory (Electron `app.getPath('userData')`) and keep assets under:

- `{userData}/assets/`

Suggested structure:

- `{userData}/assets/references/{reference_id}/` for derived assets
- or content-addressable store: `{userData}/assets/blobs/{sha256}`

Content-addressable is recommended if you want deduplication.

## Reference assets in the DB

Use `reference_assets` rows to record concrete items:

- `kind='file'` and `uri='app-asset://blobs/{sha256}'` (or an absolute path)
- optional `kind='file.original'` and `uri='file:///Users/.../paper.pdf'` if you want to remember where it came from
- `kind='thumbnail'` for cached previews

Keep `content_hash` and `byte_size` for integrity checks and quick UI.

## Import flow (PDF)

1. User selects a PDF.
2. Main process computes a hash (e.g. sha256) and normalizes filename metadata.
3. App copies the file into the app-managed asset store (or hard-links if safe).
4. Create `reference` + `reference_assets` in a transaction.
5. Renderer opens PDF by reading the app-managed file path/URI.

## Notes about paths

Prefer storing an app-managed URI rather than raw absolute paths in the DB.
Absolute paths break when:
- user moves the app data directory
- user switches machines
- sandboxing rules differ

You can still store the original path as a best-effort hint.

