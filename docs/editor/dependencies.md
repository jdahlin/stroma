---
title: "What dependencies does the editor rely on?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What dependencies does the editor rely on?
This document explains the editor's primary dependencies and how to keep them lean.

## Who is this for?
- Contributors adding editor features.
- Maintainers reviewing dependency changes.

## What is the scope?
- In scope: core dependencies and bundle considerations.
- Out of scope: full dependency list.

## What is the mental model?
- Prefer the smallest set of editor extensions to keep the bundle light.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| TipTap | Editor framework on top of ProseMirror. | "Custom nodes for anchors." |
| Extension | Feature unit in TipTap. | "Section node." |
| Bundle size | Cost of shipped editor code. | "Avoid unused starter kits." |

## What are the dependency guidelines?
- Prefer explicit extensions over `@tiptap/starter-kit`.
- Add only what the current feature requires.
- Consider dynamic imports for heavy optional features.

## What are the bundle optimization notes?
- Keep CSS in a separate file when it improves loading.
- Delay heavy features if they affect initial load.

## What are the facts?
- The editor is built on TipTap/ProseMirror.

## What decisions are recorded?
- Extensions are selected individually for tree-shaking.

## What are the open questions?
- Which features should ship as optional bundles first?

## What are the failure modes or edge cases?
- Overeager dependency additions bloat the renderer bundle.

## What assumptions and invariants apply?
- Editor dependencies must remain compatible with the desktop renderer.

## What related docs matter?
- Styling: [`styling.md`](./styling.md)
- Public API: [`public-api.md`](./public-api.md)

## What this doc does not cover
- Exact versions or upgrade procedures.
