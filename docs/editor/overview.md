---
title: "What is the editor for?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the editor for?
This document explains the editor's purpose, goals, and current status.

## Who is this for?
- Contributors building editor features.
- Maintainers validating scope.

## What is the scope?
- In scope: editor goals and non-goals.
- Out of scope: internal implementation details.

## What is the mental model?
- The editor is where extracts become structured notes linked to sources.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Structured note | A document organized into blocks and sections. | "A section with collapsible content." |
| Source link | A reference back to a PDF anchor. | "Click a reference to open the PDF page." |
| Command palette | Inline command menu. | "Type `/` to insert a block." |

## What are the goals?
- Rich text editing with standard formatting.
- Structured documents with sections.
- Media embedding.
- Source-linked references.
- Slash-command insertion.
- Standalone dev harness.
- Lazy-loading where appropriate.

## What are the non-goals?
- Real-time collaboration.
- Full word-processor parity.

## What is the current status?
- Implemented: `@repo/editor` is used by the desktop app and editor dev harness.

## What are the facts?
- The editor is TipTap-based.

## What decisions are recorded?
- The editor supports structured sections as first-class blocks.

## What are the open questions?
- How much of the editor should be loaded lazily in the desktop app?

## What are the failure modes or edge cases?
- References that cannot resolve to a source anchor.

## What assumptions and invariants apply?
- Extracts and references must remain linked to sources.

## What related docs matter?
- Architecture: [`architecture.md`](./architecture.md)
- Integration: [`integration.md`](./integration.md)
- Public API: [`public-api.md`](./public-api.md)

## What this doc does not cover
- Editor component APIs or code structure.
