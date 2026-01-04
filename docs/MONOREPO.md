---
title: "How is the monorepo structured?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How is the monorepo structured?
This document explains the Stroma monorepo layout and the import boundaries between packages.

## Who is this for?
- Contributors navigating the codebase.
- Maintainers enforcing boundaries.

## What is the scope?
- In scope: top-level structure and dependency rules.
- Out of scope: detailed file-by-file listings.

## What is the mental model?
- Apps assemble features; packages provide reusable layers with strict import boundaries.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| App | A runnable product entry point. | "apps/desktop is the Electron app." |
| Package | A reusable layer with controlled dependencies. | "packages/ux provides UI primitives." |
| Boundary | A rule limiting imports between layers. | "@repo/core cannot import @repo/ux." |

## What is the top-level layout?
| Path | Purpose | Example |
| --- | --- | --- |
| `apps/` | Application entry points. | "desktop app with main/preload/renderer." |
| `packages/` | Shared layers and features. | "core, shared, ux." |
| `configs/` | Shared tooling config. | "TypeScript and ESLint config." |
| `scripts/` | Repo maintenance utilities. | "Release scripts." |

## What are the import boundaries?
- `@repo/shared` has no dependencies.
- `@repo/core` can import `@repo/shared` only.
- `@repo/ux` can import `@repo/core` and `@repo/shared`.
- `@main` can import `@repo/core` and `@repo/shared`.
- `@renderer` can import `@repo/core`, `@repo/shared`, and `@repo/ux`.

## Where are key app areas?
| Area | Purpose | Example |
| --- | --- | --- |
| Main process | Electron lifecycle and windows. | `apps/desktop/src/main` |
| Preload bridge | Typed IPC layer. | `apps/desktop/src/preload` |
| Renderer UI | React UI with Dockview. | `apps/desktop/src/renderer` |

## What are the facts?
- Import boundaries are enforced by ESLint rules.
- The renderer cannot import from `@main`.

## What decisions are recorded?
- `@repo/core` stays dependency-light and UI-free.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- A boundary violation compiles locally but breaks lint in CI.

## What assumptions and invariants apply?
- Apps are the only runtime entry points.
- Packages remain import-stable across apps.

## What related docs matter?
- Docs index: [`README.md`](./README.md)
- Editor docs: [`editor/README.md`](./editor/README.md)
- PDF docs: [`pdf/README.md`](./pdf/README.md)
- Storage docs: [`storage/README.md`](./storage/README.md)

## What this doc does not cover
- The internal file structure of each package.
