# Migrate to Direct pdf.js Rendering (Remove react-pdf)

This plan outlines the steps to replace react-pdf with a direct pdf.js rendering pipeline while keeping the existing Stroma UX (PdfPane, toolbar, Dockview layout).

## Goals

- Improve scroll/zoom performance and reduce flicker.
- Make rendering fully controllable (render scheduling, cancellation, virtualization).
- Preserve existing UI/UX and PDF features (anchors, selection, overlays).
- Remove react-pdf dependency and any unused react-pdf code.

## Non-Goals

- Replacing Dockview, Zustand, or the current pane layout.
- Building a feature-complete PDF annotation system beyond current needs.
- Full parity with the pdf.js web viewer (toolbars, file manager, etc.).

## Current Baseline (Before Migration)

- PdfPane renders PdfViewer, PdfViewport, PdfPage components.
- Scroll/zoom state is managed in the store; PdfViewer computes scale and restores scroll.
- Rendering uses pdfjs-dist directly via React components for pages and layers.
- Need to remove any remaining react-pdf usage if present.

## Migration Phases

### Phase 0: Inventory and Removal Prep

1. Identify react-pdf usage (components, hooks, utils).
2. Confirm actual dependency in package.json (if present, remove).
3. Ensure no tests or UI paths depend on react-pdf types.
4. Add a feature flag (optional) for incremental rollout:
   - Example: `useDirectPdfRenderer` in store or env config.

### Phase 1: Rendering Core (Imperative)

1. Create a `PdfRenderer` service/module:
   - Responsibilities: load document, manage page cache, render queue, cancel tasks.
   - API:
     - `load(data: Uint8Array)`
     - `renderPage(pageIndex, scale, container)`
     - `cancelPage(pageIndex)`
     - `destroy()`
2. Establish a render task registry to cancel in-flight renders on scale change.
3. Implement a lightweight page cache:
   - `PDFPageProxy` caching (per document).
   - Optionally cache rendered canvases for current scale.

### Phase 2: Virtualized Page List

1. Replace React-driven page list with an imperative page host:
   - A single scroll container with placeholder page divs.
2. Compute visible page indices based on scrollTop and page heights.
3. Render only visible pages (+buffer).
4. Maintain total scroll height with placeholders:
   - Each page placeholder has the correct height at the current scale.
5. On scroll, update visible range and render/cancel pages.

### Phase 3: Zoom + Scroll Control

1. Implement a zoom controller:
   - Zoom in/out via wheel and toolbar.
   - Clamp zoom range (e.g., 0.5 to 3).
2. Ensure zoom changes cancel renders and re-render visible pages.
3. Preserve scroll position on zoom:
   - Save scroll position as `{ ratio, top, scale }`.
   - If scale unchanged, restore by `top`; otherwise restore by ratio.
4. Add a short stabilization pass:
   - Reapply scroll after layout settles (delayed or after first render tick).

### Phase 4: Text Layer and Selection

1. Add pdf.js text layer rendering per visible page:
   - Create a text layer container per page.
   - Render text layer after canvas render.
2. Restore selection logic:
   - Ensure selection overlay uses the new page DOM structure.
   - Verify selection coordinates align with scaled viewport.
3. Hook anchor overlays into the new page container hierarchy.

### Phase 5: Integration into PdfPane

1. Keep `PdfPane` and toolbar unchanged.
2. Replace `PdfViewer` internals:
   - Convert to an imperative host that creates the scroll container.
   - Attach `PdfRenderer` and virtualization logic.
3. Wire store updates:
   - Keep scroll position updates in store.
   - Keep scale updates in store.

### Phase 6: Cleanup and Removal

1. Remove react-pdf dependency from all package.json files.
2. Delete unused react-pdf wrappers/components.
3. Remove any tests or utilities that reference react-pdf.
4. Update docs and README if they mention react-pdf.

### Phase 7: Performance Verification

1. Manual checks:
   - Smooth scrolling across large PDFs.
   - Stable pinch zoom without flicker.
   - Restore scroll position after reload.
2. Automated checks (where feasible):
   - Unit tests for store scroll persistence.
   - Optional integration tests for scroll/zoom in Electron.

## Risks and Mitigations

- **Render flicker on zoom**: enforce render cancellation + debounced re-render.
- **Scroll position drift**: restore using pixel+scale with ratio fallback.
- **Text selection misalignment**: align text layer viewport to canvas viewport.
- **Memory growth**: cap cached pages and clean up on page exit.

## Estimated Effort

- MVP (canvas-only, virtualization, scroll/zoom): 2–3 days.
- Full parity (text layer, selection, anchors): +2–3 days.
- Total: 4–6 focused days.

## Deliverables

- `PdfRenderer` service (imperative pdf.js rendering).
- Virtualized scroll container with page placeholders.
- Updated `PdfViewer` (imperative host).
- Removed react-pdf dependency and unused code.
- Updated docs and tests.
