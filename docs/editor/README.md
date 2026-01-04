---
title: "How are the editor docs organized?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How are the editor docs organized?
This document explains where to find editor documentation and key entry points.

## Who is this for?
- Contributors working on the editor.
- Maintainers reviewing editor changes.

## What is the scope?
- In scope: editor doc map and cross-links.
- Out of scope: detailed editor design decisions.

## What is the mental model?
- The editor is a self-contained feature package used by the desktop app and a dev harness.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Editor package | The reusable editor feature layer. | "Used by the desktop renderer." |
| Extension | A TipTap/ProseMirror node or command. | "PDF reference node." |
| Integration | Connections to other panes. | "Click a reference to jump to PDF." |

## Where are the editor docs?
- Overview: [`overview.md`](./overview.md)
- Architecture: [`architecture.md`](./architecture.md)
- Dependencies: [`dependencies.md`](./dependencies.md)
- Extensions: [`extensions.md`](./extensions.md)
- Components: [`components.md`](./components.md)
- Styling: [`styling.md`](./styling.md)
- Public API: [`public-api.md`](./public-api.md)
- Integration: [`integration.md`](./integration.md)
- Roadmap: [`roadmap.md`](./roadmap.md)

## What are the facts?
- The editor is implemented in `packages/editor`.

## What decisions are recorded?
- Editor docs are split by topic.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Stale links when editor docs move.

## What assumptions and invariants apply?
- The editor is a reusable package, not a renderer-only component.

## What related docs matter?
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)
- Storage plan: [`../storage/README.md`](../storage/README.md)
- PDF docs: [`../pdf/README.md`](../pdf/README.md)

## What this doc does not cover
- Editor implementation details or APIs.
