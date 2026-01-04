# Editor components

## Editor (main component)

The root editor component that composes toolbar + content area and manages editor state.

Common props:

| Prop | Type | Description |
|---|---|---|
| `documentId` | `string` | Unique ID for persistence (if enabled) |
| `content` | `DocumentContent?` | Initial document content |
| `onChange` | `(content: DocumentContent) => void` | Called on change |
| `onPdfReferenceClick` | `(anchorId: string) => void` | PDF reference click handler |
| `placeholder` | `string?` | Placeholder text |
| `readOnly` | `boolean?` | Disable editing |
| `autoFocus` | `boolean?` | Focus on mount |

## EditorToolbar

Horizontal toolbar with formatting controls.

Guidelines:
- Reuse `IconButton` from `@repo/ux`.
- Reflect active marks/nodes (e.g. bold highlighted when active).

## PdfReferenceNode

Inline chip displaying a PDF reference.

Accessibility:
- Role: button.
- Keyboard focusable and activatable.

## See also

- Extensions: [`extensions.md`](./extensions.md)
- Styling: [`styling.md`](./styling.md)

