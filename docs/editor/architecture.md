---
title: "How is the editor packaged and structured?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How is the editor packaged and structured?
This document explains the editor package location, development harness, and loading strategy.

## Who is this for?
- Contributors modifying editor architecture.
- Maintainers enforcing package boundaries.

## What is the scope?
- In scope: package placement, dev harness, and lazy-loading strategy.
- Out of scope: UI component details.

## What is the mental model?
- The editor is a standalone package that can be developed and loaded independently.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Editor package | A feature package with its own deps. | "Lives outside the design system." |
| Dev harness | A standalone app for editor iteration. | "A Vite app with mock data." |
| Lazy loading | Load editor only when needed. | "Dynamic import in the renderer." |

## Why is the editor a separate package?
- The editor is a substantial feature with heavy dependencies.
- The design system stays focused on primitives.
- The dependency graph remains clean and testable.

## How does the dev harness work?
- A standalone Vite app provides quick iteration.
- It includes a live document inspector and mock PDF references.

## How does lazy loading work?
- The renderer imports the editor via the package entry.
- Heavier extensions can be dynamically imported.

## Where is it implemented?
| Area | Purpose | Example |
| --- | --- | --- |
| Editor package | Core editor code. | `packages/editor` |
| Dev harness | Isolated editor app. | `apps/editor-dev` |

## What are the facts?
- The editor depends on `@repo/ux` and `@repo/core`.

## What decisions are recorded?
- The editor does not live inside `packages/ux`.

## What are the open questions?
- Which extensions merit dynamic imports first?

## What are the failure modes or edge cases?
- Lazy loading adds latency if the editor is needed on startup.

## What assumptions and invariants apply?
- The editor package should remain reusable outside the desktop app.

## What related docs matter?
- Dependencies: [`dependencies.md`](./dependencies.md)
- Integration: [`integration.md`](./integration.md)
- Monorepo layout: [`../monorepo.md`](../monorepo.md)

## What this doc does not cover
- Detailed component APIs or UI styling.
