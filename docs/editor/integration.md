---
title: "How does the editor integrate with the app?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How does the editor integrate with the app?
This document explains how the editor integrates with the desktop renderer and PDF flow.

## Who is this for?
- Contributors wiring editor into the UI.
- Maintainers reviewing cross-pane behavior.

## What is the scope?
- In scope: renderer integration, PDF reference flow, and persistence guidance.
- Out of scope: full persistence schema details.

## What is the mental model?
- The editor is a pane that reads and writes extracts linked to source anchors.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Pane integration | Where editor lives in the UI. | "Notes pane uses the editor." |
| Reference flow | Create and follow source links. | "Click a reference to jump to PDF." |
| Persistence | Store editor content per document. | "Debounced save to storage." |

## Where is the editor used?
- Notes pane and home panes in the renderer.
- The renderer imports `@repo/editor/styles` at startup.

## How does the PDF reference flow work?
1. User selects text/region in the PDF pane.
2. The app creates or updates an anchor in state/storage.
3. The user inserts a PDF reference node in the editor.
4. Clicking the reference navigates to the anchor.

## How should persistence work?
- Use per-document keys in local storage for MVP.
- Key pattern: `editor:document:{documentId}`.
- Store document JSON plus optional cursor/scroll state.

## What are the facts?
- Editor content persistence is separate from PDF pane state.

## What decisions are recorded?
- The editor is imported via `@repo/editor` in the renderer.

## What are the open questions?
- When should editor content move from local storage to SQLite?

## What are the failure modes or edge cases?
- References break if anchors are deleted but nodes remain.

## What assumptions and invariants apply?
- Renderer panes are the integration points for editor usage.

## What related docs matter?
- PDF docs: [`../pdf/README.md`](../pdf/README.md)
- Storage plan: [`../storage/README.md`](../storage/README.md)
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)

## What this doc does not cover
- Storage schemas or IPC details.
