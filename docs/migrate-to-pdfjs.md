# Improve pdf.js Rendering Performance (Reduce Flicker/Zoom Jank)

This plan outlines steps to improve performance and reduce flicker in the existing pdf.js-based renderer while keeping the current Stroma UX (PdfPane, toolbar, Dockview layout).

## Goals

- Reduce flicker during pinch-zoom and resize.
- Minimize unnecessary renders and layout thrash.
- Preserve existing UI/UX and PDF features (anchors, selection, overlays).
- Keep the store-driven scroll/zoom model stable.

## Non-Goals

- Replacing Dockview, Zustand, or the current pane layout.
- Building a feature-complete PDF annotation system beyond current needs.
- Full parity with the pdf.js web viewer (toolbars, file manager, etc.).

## Current Baseline (Before Changes)

- PdfPane renders PdfViewer, PdfViewport, PdfPage components.
- Scroll/zoom state is managed in the store; PdfViewer computes scale and restores scroll.
- Rendering uses pdfjs-dist directly via React components for pages and layers.

## Migration Phases

### Phase 0: Baseline Audit and Profiling

1. Capture a short profile during pinch-zoom and resize.
2. Identify render hotspots (canvas render vs text layer render).
3. Add a feature flag (optional) for incremental rollout:
   - Example: `useVirtualizedPdfRenderer` in store or env config.

### Phase 1: Stabilize Zoom/Scroll (Low-Risk)

1. Suspend fit-to-width logic during active pinch-zoom.
2. Debounce scale updates from ResizeObserver and wheel events.
3. Ensure render task cancellation on scale change is reliable.
4. Throttle text layer rendering (delay until zoom settles).

### Phase 2: Virtualized Page Rendering (Moderate)

1. Keep React for chrome/toolbar, but move page rendering to an imperative host.
2. Compute visible page indices based on scrollTop and cached page heights.
3. Render only visible pages (+buffer).
4. Maintain total scroll height with placeholders:
   - Page heights derived from cached page dimensions at current scale.
5. On scroll, update visible range and render/cancel pages.

### Phase 3: Render Pipeline Refinement

1. Render queue with prioritization (visible pages first).
2. Limit concurrent renders and cancel stale tasks.
3. Cache `PDFPageProxy` instances and reuse across renders.
4. Optional: cache rendered canvas bitmaps per scale for fast zoom snaps.

### Phase 4: Text Layer and Selection Stability

1. Render text layers only after canvas render completes.
2. Batch text layer updates (avoid re-rendering on every scroll tick).
3. Ensure selection overlay uses the new page DOM structure.
4. Force-render the focused anchor page even if offscreen.

### Phase 5: Integration and Cleanup

1. Keep `PdfPane` and toolbar unchanged.
2. Replace `PdfViewer` internals with the imperative renderer.
3. Ensure store updates for scroll position + scale remain stable.
4. Delete unused React page components if fully replaced.

### Phase 6: Performance Verification

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

- MVP (virtualization + stable zoom/scroll): 2–3 days.
- Full parity (text layer, selection, anchors): +2–3 days.
- Total: 4–6 focused days.

## Deliverables

- Imperative renderer + virtualization.
- Updated PdfViewer internals (no React-per-page rendering).
- Reduced scroll/zoom jank with render throttling and task cancellation.
- Updated docs and tests.
