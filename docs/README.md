---
title: "How are the docs organized?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How are the docs organized?
This document explains how Stroma documentation is organized and where to start.

## Who is this for?
- Contributors who need the right doc quickly.
- Maintainers curating the doc set.

## What is the scope?
- In scope: doc entry points and category map.
- Out of scope: detailed feature specs.

## What is the mental model?
- Use this as a table of contents that points to deeper, single-topic docs.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Product docs | Vision and roadmap. | "Start with the MVP roadmap." |
| Feature docs | Editor, PDF, and storage slices. | "Read PDF docs for anchor behavior." |
| Project docs | Repository and release process. | "Use the monorepo map for structure." |

## Where should I start?
- Product direction: [`product-vision.md`](./product-vision.md)
- MVP roadmap: [`roadmap-mvp.md`](./roadmap-mvp.md)

## Where are feature docs?
- Editor: [`editor/README.md`](./editor/README.md)
- PDF renderer: [`pdf/README.md`](./pdf/README.md)
- Storage: [`storage/README.md`](./storage/README.md)

## Where are project docs?
- Monorepo layout: [`monorepo.md`](./monorepo.md)
- Release process: [`release.md`](./release.md)

## What are the facts?
- This folder is the canonical entry point for Stroma docs.
- Each feature area has its own README index.

## What decisions are recorded?
- Docs are split into small, single-topic pages.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Links drift when files move and indexes are not updated.

## What assumptions and invariants apply?
- Use the same terms across docs: source, anchor, extract, note.
- Every doc follows the canonical template.

## What related docs matter?
- Template: [`template.md`](./template.md)

## What this doc does not cover
- Any feature details beyond pointers.
