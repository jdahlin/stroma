# Storage model (generalized)

## Status

Planned.

## Naming

This doc uses a generalized vocabulary:

- **Reference**: a source material unit (a PDF, web page, image, video, …).
- **Reference asset**: a concrete retrievable thing for a reference (a local file, a URL, a thumbnail).
- **Anchor**: a stable pointer into a reference (page/rects/text selection, timestamp range, selector, …).
- **Note**: editor content attached to a reference and optionally to an anchor.

This maps cleanly to existing domain types:

- `@repo/core` `PdfSource` ≈ **Reference** where `reference.type = 'pdf'`
- `@repo/core` `PdfAnchor` ≈ **Anchor** where `anchor.reference_id` points at the PDF reference

We don’t need to dogmatically choose “reference” vs “document/source” in the UI. Internally, **Reference** stays generic.

## Entities

### Reference
Represents the logical source.

Suggested fields:
- `id` (INTEGER PK)
- `type` (TEXT, e.g. `pdf`, `web`, `image`, `youtube`)
- `title` (TEXT)
- `created_at`, `updated_at` (INTEGER unix ms)

### ReferenceAsset
One reference can have multiple assets.

Examples:
- a PDF copied into app storage
- the original file path (optional)
- a remote URL
- a derived thumbnail

Suggested fields:
- `id` (INTEGER PK)
- `reference_id` (FK)
- `kind` (TEXT, e.g. `file`, `url`, `thumbnail`)
- `uri` (TEXT)
- `content_hash` (TEXT, optional)
- `byte_size` (INTEGER, optional)
- `metadata_json` (TEXT JSON, optional)

### Anchor
Anchors must be:
- stable as the library grows
- fast to lookup by reference
- suitable for SQL queries (especially for PDF anchors)

Suggested fields:
- `id` (INTEGER PK)
- `reference_id` (FK)
- `local_no` (INTEGER, unique within a reference)
- `kind` (TEXT, e.g. `pdf_text`, `pdf_point`, `pdf_figure`, `web_selector`, `youtube_time_range`)
- `created_at`, `updated_at`

For "proper SQL" PDF anchors, store PDF-specific details in separate tables keyed by `anchor_id`.
For other reference types, use a small table or JSON column for locators.

### Note
A note is editor content (likely JSON) plus metadata.

Suggested fields:
- `id` (INTEGER PK)
- `reference_id` (FK)
- `anchor_id` (FK, nullable)
- `local_no` (INTEGER, unique within a reference)
- `content` (TEXT)
- `content_type` (TEXT, e.g. `tiptap_json`)
- `created_at`, `updated_at`

MVP constraint (optional): one anchor has 0..1 note.

## ID strategy (no UUIDs)

Goals:
- easy to inspect/debug in SQLite
- short identifiers for logs and editor nodes
- document-unique at least

Recommendation:
- Use integer primary keys (`references.id`, `anchors.id`, `notes.id`) for joins.
- Use `(reference_id, local_no)` as the **human/debug identity** for anchors and notes.

Example debug IDs:
- `r12:a37` (reference 12, anchor local 37)
- `r12:n5`

If you later need globally unique IDs (sync/export), add an optional `public_id` column without removing integer keys.

