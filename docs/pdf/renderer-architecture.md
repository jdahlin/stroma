---
title: "How does the PDF renderer work?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How does the PDF renderer work?
This document explains the PDF renderer flow and its core components.

## Who is this for?
- Contributors modifying PDF rendering.
- Maintainers reviewing renderer changes.

## What is the scope?
- In scope: high-level flow, worker setup, and state behavior.
- Out of scope: performance optimization plans.

## What is the mental model?
- A pane hosts a viewer that loads a document, then renders a stack of pages with overlays.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Pane host | The container for the PDF UI. | "A Dockview pane showing a PDF." |
| Viewer | Orchestrates document loading and scale. | "Loads the worker and sets zoom." |
| Page | A canvas + text layer + overlays. | "Page 3 with highlights." |
| Worker | pdf.js background renderer. | "Worker URL wired at startup." |

## What is the high-level flow?
- Load the document via pdf.js.
- Render a scrollable stack of pages.
- Overlay anchors and highlights per page.
- Persist zoom and scroll state.

## How is the worker configured?
- The worker URL is imported from `pdfjs-dist/legacy/build/pdf.worker.min.mjs?url`.
- `GlobalWorkerOptions.workerSrc` is set during viewer initialization.

## How do zoom and scroll persist?
- Scale is stored per pane in the PDF state.
- Scroll position is persisted with a debounce.
- Fit-to-width reacts to resize events.

## Where is it implemented?
| Component | Purpose | Example |
| --- | --- | --- |
| Pane wrapper | Dockview host for PDF. | `apps/desktop/src/renderer/panes/PdfPane.tsx` |
| Viewer | Document orchestration. | `apps/desktop/src/renderer/components/pdf/PdfViewer.tsx` |
| Page | Canvas + text render. | `apps/desktop/src/renderer/components/pdf/PdfPage.tsx` |

## What are the facts?
- The renderer uses pdf.js with canvas + text layers.

## What decisions are recorded?
- Focused anchors are scrolled into view by selector lookup.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Mismatched scale between canvas and text layer causes selection drift.

## What assumptions and invariants apply?
- Renderer state is stored in the UI store, not in the DB.

## What related docs matter?
- Performance plan: [`performance-plan.md`](./performance-plan.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)
- Editor extensions: [`../editor/extensions.md`](../editor/extensions.md)

## What this doc does not cover
- Performance optimizations or virtualization strategies.
