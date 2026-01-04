# MVP Plan: SuperMemo-Style Incremental Reading

This plan expands the phased goals in `docs/product-vision.md` into an MVP-friendly,
commit-ready roadmap. It focuses on the minimum behaviors needed to make
incremental reading feel real, while keeping implementation choices open.
See `docs/storage/README.md` for the storage plan.

## MVP Definition (What "done" means)

A user can:
- Import a PDF and open it in a workspace.
- Create highlights and extracts that remain linked to the source.
- Move through a small review queue that resurfaces items over time.
- Persist their work and resume where they left off.

## Scope Guardrails

In scope:
- Single-user, local-only experience.
- One workspace layout.
- One PDF open at a time (multi-doc later).

Out of scope:
- Cloud sync or collaboration.
- AI extraction, OCR, or external integrations.

---

## Phase 1: PDF Workspace (Foundation)

Goal: Make PDFs a durable, addressable source.

Deliverables:
- PDF viewer with basic navigation (pages, zoom, scroll).
- Anchors for selections (page + bounding box, or equivalent stable reference).
- Highlight creation and persistence.

Acceptance criteria:
- A highlight can be created, stored, and reloaded with the PDF.
- A highlight resolves to the same location after app restart.
- Minimal metadata for each highlight: id, page ref, bounds, createdAt.

Key risks:
- Anchor stability across viewport changes.
- Consistent coordinate space across zoom levels.

---

## Phase 2: Extracts + Editor (Knowledge Capture)

Goal: Turn reading into structured knowledge with linked notes.

Deliverables:
- Create an "extract" from a highlight or selection.
- Extracts live in a simple block-based editor (text only).
- Bi-directional navigation between extract and source anchor.
- Note tree panel that lists a document's highlights and extracts.
- Distinct icons for highlights vs extracts (and future types).

Acceptance criteria:
- An extract is linked to exactly one source anchor.
- Clicking the extract jumps to the correct PDF location.
- Extracts are persisted and reloaded intact.
- Note tree shows a stable hierarchy and reflects selection state.

Key risks:
- Maintaining source links as the editor changes.
- Avoiding accidental edits that break anchor references.

---

## Phase 3: Incremental Reading Queue (Core Loop)

Goal: A minimal review loop that makes resurfacing real.

Deliverables:
- "Reading queue" of source items (PDFs or sections).
- "Extract queue" of atomic items for review.
- Simple actions: "Review now", "Postpone", "Extract more".

Acceptance criteria:
- User can move items through a queue and see them return later.
- Items have a scheduledAt timestamp (or simple integer priority).
- A single screen shows what's due "now".

Key risks:
- Confusing user flow between reading and extracting.
- Queue semantics feel arbitrary without feedback.

---

## Phase 4: FSRS Scheduling (Persistence + Rhythm)

Goal: Preserve momentum with FSRS-based scheduling.

Deliverables:
- Integrate FSRS scheduling (targeting `ts-fsrs`).
- Review history stored per item (lastReviewedAt, stability, difficulty, interval).
- "Due soon" indicator to make resurfacing predictable.
- Simple review ratings mapped to FSRS inputs (e.g., Again/Hard/Good/Easy).

Acceptance criteria:
- Review outcomes update nextDue using FSRS.
- A user can complete a session and return to a meaningful queue.

Key risks:
- Scheduling that feels opaque without explainers.
- Parameter tuning could stall MVP progress.

---

## Phase 5: Polishing the Core Loop (UX Hardening)

Goal: Make the workflow feel coherent and fast.

Deliverables:
- Keyboard-first navigation for review/extract flow.
- Fast jump between PDF and extract.
- Minimal affordances for "what should I do next?"

Acceptance criteria:
- A user can complete a full cycle without mouse.
- The next action is always visible (button or shortcut).

Key risks:
- UX fragmentation across panes.
- Overloading the user with UI choices.

---

## Data Model Sketch (Non-binding)

This is conceptual only and can change during implementation.

Entities:
- Document: id, title, filePath, createdAt
- Anchor: id, documentId, page, bounds, createdAt
- Highlight: id, anchorId, color, createdAt
- Extract: id, anchorId, content, createdAt
- QueueItem: id, targetType, targetId, scheduledAt, lastReviewedAt, interval

Relationships:
- One document has many anchors.
- One anchor can have many highlights.
- One anchor can have zero or one extract (MVP).
- Queue items reference either a document or extract.

---

## MVP Milestones (Commit-Friendly)

1. PDF viewer + highlights + persistence.
2. Extract creation + linked editor + persistence.
3. Minimal queue UI + due list.
4. Scheduling rules + review history.
5. Keyboard-first review flow.

Each milestone should be shippable on its own, with visible user progress.

## See also

- Storage plan: [`storage/README.md`](./storage/README.md)
- Editor docs (extracts + references): [`editor/README.md`](./editor/README.md)
- PDF docs (renderer, anchors): [`pdf/README.md`](./pdf/README.md)
