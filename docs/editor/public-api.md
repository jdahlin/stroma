---
title: "What is the editor public API?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the editor public API?
This document explains the intended public API surface of `@repo/editor`.

## Who is this for?
- Contributors exporting editor features.
- Maintainers reviewing package boundaries.

## What is the scope?
- In scope: exported entry points and usage intent.
- Out of scope: full API reference.

## What is the mental model?
- The public API is a stable surface for the desktop renderer and future consumers.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Entry point | Package export used by apps. | "Import Editor from @repo/editor." |
| Style entry | Side-effect import for CSS. | "@repo/editor/styles" |
| Types | Shared editor data shapes. | "DocumentContent" |

## What is exported from `@repo/editor`?
- Components: `Editor`, `EditorToolbar`, `EditorContent`.
- Extension helpers (bundle exports).
- Hooks for editor state.
- Types for editor content and attributes.

## What is exported from `@repo/editor/styles`?
- Side-effect CSS for ProseMirror/editor styling.

## Where is the authoritative list?
- `packages/editor/src/index.ts`.

## What are the facts?
- The package exposes both UI and type exports.

## What decisions are recorded?
- Styles are imported via a dedicated entry point.

## What are the open questions?
- Should the public API include a default extension bundle?

## What are the failure modes or edge cases?
- Breaking exports without updating the desktop renderer.

## What assumptions and invariants apply?
- Public API changes require coordinated updates in the renderer.

## What related docs matter?
- Integration: [`integration.md`](./integration.md)
- Styling: [`styling.md`](./styling.md)

## What this doc does not cover
- Detailed TypeScript signatures for every export.
