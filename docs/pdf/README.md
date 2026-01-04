---
title: "How are the PDF docs organized?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How are the PDF docs organized?
This document explains where to find PDF renderer documentation and key entry points.

## Who is this for?
- Contributors working on the PDF renderer.
- Maintainers reviewing PDF-related changes.

## What is the scope?
- In scope: PDF doc map and key code entry points.
- Out of scope: detailed implementation notes.

## What is the mental model?
- The renderer is a pdf.js-based pipeline with a pane host, viewer orchestration, and page rendering.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| PDF pane | The Dockview pane for PDFs. | "A pane showing the current source." |
| Viewer | Orchestrates document loading and rendering. | "Loads pdf.js and sets scale." |
| Page render | Canvas + text layer for a page. | "Canvas with selectable text." |

## Where are the PDF docs?
- Renderer architecture: [`renderer-architecture.md`](./renderer-architecture.md)
- Performance plan: [`performance-plan.md`](./performance-plan.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)

## Where are the key code entry points?
| Area | Purpose | Example |
| --- | --- | --- |
| Pane | Dockview wrapper for PDFs. | `apps/desktop/src/renderer/panes/PdfPane.tsx` |
| Viewer | Document load and orchestration. | `apps/desktop/src/renderer/components/pdf/PdfViewer.tsx` |
| Page | Canvas + text rendering. | `apps/desktop/src/renderer/components/pdf/PdfPage.tsx` |
| State | PDF pane state. | `apps/desktop/src/renderer/state/pdfStore.ts` |

## What are the facts?
- The renderer uses `pdfjs-dist` directly.

## What decisions are recorded?
- PDF rendering stays inside the desktop renderer.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Worker loading fails when the bundler URL is misconfigured.

## What assumptions and invariants apply?
- The renderer must not rely on `react-pdf`.

## What related docs matter?
- Editor integration: [`../editor/integration.md`](../editor/integration.md)
- Storage plan: [`../storage/README.md`](../storage/README.md)

## What this doc does not cover
- Detailed renderer algorithms or performance tactics.
