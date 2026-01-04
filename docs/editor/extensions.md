# Editor extensions

This doc describes custom TipTap extensions used by `@repo/editor`.

## PdfReference

An inline atomic node representing a reference to a PDF anchor.

Node type: inline, atomic.

Attributes:

| Attribute | Type | Description |
|---|---|---|
| `anchorId` | `PdfAnchorId` | Unique anchor identifier from `@repo/core` |
| `sourceId` | `PdfSourceId` | PDF document identifier |
| `sourceName` | `string` | Display name of the PDF |
| `pageIndex` | `number` | Zero-based page number |
| `previewText` | `string?` | Optional excerpt from the anchor |

Rendering: displays as an inline chip/pill with PDF icon, document name, and page number. Clicking navigates to the referenced PDF location.

HTML serialization: `<span data-pdf-reference data-anchor-id="..." data-source-id="...">...</span>`

Insertion: toolbar button, command palette, or drag-drop from PDF pane.

## Section

A block container for organizing document structure.

Node type: block container.

Attributes:

| Attribute | Type | Description |
|---|---|---|
| `id` | `string` | Unique section identifier |
| `title` | `string` | Section title for display and navigation |
| `collapsed` | `boolean` | Whether section content is hidden |

Behavior:
- Collapsible: click header to toggle.
- Draggable/reorderable (if implemented).
- Nested sections for hierarchy.

HTML serialization: `<section data-editor-section data-id="..." data-title="...">...</section>`

## SlashCommand

A suggestion-based extension that shows a command menu when the user types `/`.

Trigger: `/` at start of line or after whitespace.

Typical menu items:
- headings, lists, quote, code block, divider
- insert image
- insert section

## See also

- Components (node views and UI): [`components.md`](./components.md)
- Integration with PDF pane: [`integration.md`](./integration.md)
- PDF docs: [`../pdf/README.md`](../pdf/README.md)

