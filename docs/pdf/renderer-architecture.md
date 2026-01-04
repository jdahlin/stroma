# PDF renderer architecture

## Status

Implemented. The desktop renderer uses `pdfjs-dist` directly.

## High-level flow

- `PdfPane` is the Dockview pane wrapper.
- `PdfViewer` loads the document via `getDocument(...)`, wires the pdf.js worker, and renders a scrollable stack of pages.
- `PdfPage` renders:
  - a canvas layer (page bitmap)
  - a text layer (for selection)
  - overlay layers (anchors/highlights/figures)

## Worker setup

The worker is configured in `PdfViewer.tsx`, using a bundler URL import:

- `GlobalWorkerOptions.workerSrc = workerSrc`

(where `workerSrc` is imported from `pdfjs-dist/legacy/build/pdf.worker.min.mjs?url`).

## Zoom + scroll persistence

- Scale is stored in the renderer store (`pdfStore`) per pane.
- Scroll position is persisted with a debounce.
- Fit-to-width behavior is driven by a `ResizeObserver` in `PdfViewer` and can update scale.

## Anchors

- Page overlays filter anchors per page index.
- Focused anchors are located via a `data-anchor-id` selector and scrolled into view.

## See also

- Performance plan: [`performance-plan.md`](./performance-plan.md)
- Editor PDF references: [`../editor/extensions.md`](../editor/extensions.md)

