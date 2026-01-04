# PDF troubleshooting

## Worker not loading

Symptoms:
- Blank pages.
- Console warnings about worker loading.

Checks:
- Confirm `GlobalWorkerOptions.workerSrc` is set in `PdfViewer`.
- Confirm the worker import uses `?url` so the bundler emits a file URL.

## Text layer misalignment

Potential causes:
- Using a viewport/scale mismatch between canvas render and text layer render.
- Not calling `setLayerDimensions(..., viewport)`.

## Zoom flicker / render jank

Potential causes:
- Frequent scale changes triggering full page rerenders.
- Render tasks not being cancelled reliably on scale change.
- Text layer work happening on every intermediate zoom step.

See the performance plan for mitigation steps.

## See also

- Renderer architecture: [`renderer-architecture.md`](./renderer-architecture.md)
- Performance plan: [`performance-plan.md`](./performance-plan.md)

