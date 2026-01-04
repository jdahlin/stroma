# PDF docs

Stroma’s PDF viewer is implemented directly on top of `pdfjs-dist` (not `react-pdf`).

## Docs

- Renderer architecture: [`renderer-architecture.md`](./renderer-architecture.md)
- Performance plan: [`performance-plan.md`](./performance-plan.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)

## Key code references

- Pane: `apps/desktop/src/renderer/panes/PdfPane.tsx`
- Viewer: `apps/desktop/src/renderer/components/pdf/PdfViewer.tsx`
- Page render + text layer: `apps/desktop/src/renderer/components/pdf/PdfPage.tsx`
- State: `apps/desktop/src/renderer/state/pdfStore.ts`

## See also

- Storage (anchors/notes): [`../storage/README.md`](../storage/README.md)
- Editor integration (PDF references): [`../editor/integration.md`](../editor/integration.md)
