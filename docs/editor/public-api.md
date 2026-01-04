# Editor public API

This doc describes the intended public API surface of `@repo/editor`.

## `@repo/editor`

Exports include:

- Components: `Editor`, `EditorToolbar`, `EditorContent`
- Extensions bundle helpers (see `packages/editor/src/extensions`)
- Hooks (see `packages/editor/src/hooks`)
- Types: `DocumentContent`, `EditorProps`, `PdfReferenceAttributes`, `SectionAttributes`

The authoritative list lives in `packages/editor/src/index.ts`.

## `@repo/editor/styles`

Side-effect CSS import for ProseMirror/editor styling.

## See also

- Integration: [`integration.md`](./integration.md)
- Styling: [`styling.md`](./styling.md)

