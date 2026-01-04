# Scaling guidance (SQLite)

## Status

Planned.

This is pragmatic guidance for how far we can scale with SQLite for anchors/notes.
Real limits depend on index choices, query patterns, and whether we add full-text search.

## SQLite size limits (practical)

SQLite itself supports very large database files (multi-terabyte in theory).
In practice on a desktop app, the limits are usually:

- disk space
- backup/export time
- vacuum/maintenance time
- memory pressure from big queries

For this product, a "too big" SQLite DB is usually about **UX degradation** (slow listing/search) not hard limits.

## Expected scale drivers

### Anchors
Anchor rows are small; the bigger cost is:
- per-anchor rect rows (text selections)
- indexes on `(reference_id, local_no)` and per-reference listing

A realistic upper bound on a single machine before you need special work:
- **hundreds of thousands to a few million anchors** total
- if rects are modest and queries are indexed

### Notes
Notes are usually the dominant factor if you store rich JSON text.
SQLite handles lots of TEXT fine, but large note content increases:
- DB size
- write amplification (page rewrites)
- bandwidth of IPC payloads

Practical guidance:
- Many small/medium notes (1–50 KB each): store in SQLite.
- Very large notes (hundreds of KB to MB each): consider storing content externally.

### Full-text search (FTS)
If/when you add FTS:
- you effectively store additional indexed content
- DB size can increase noticeably
- writes cost more (updating FTS indexes)

FTS is still feasible for large libraries, but it changes your sizing assumptions.

## Should note content be stored in SQLite?

### Store note content in SQLite (recommended default)
Pros:
- atomic transactions with metadata + links
- easy backup/export as a single DB + assets folder
- simple consistency model

Cons:
- big documents mean big DB file
- expensive rewrites for frequent edits of very large content

### Store note content outside SQLite (only when needed)
Pros:
- DB stays compact
- can stream large content files
- easy to dedup/partial load

Cons:
- more moving parts (consistency, file lifecycle)
- harder to back up atomically (need a manifest or careful copy)

Recommendation:
- Store note content in SQLite until you have clear evidence it’s too large.
- Add an escape hatch: `notes.content_uri` to point to an external file for oversized notes.

## Performance safety checks

- Always query by indexed columns for hot paths (`reference_id`, `anchor_id`).
- Avoid loading full note content when listing (select metadata; fetch content lazily).
- Use transactions for multi-row writes (anchor + pdf tables + rects).
- Paginate lists when counts go high.

