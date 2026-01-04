# Editor overview

A TipTap-based rich text editor for creating and editing structured documents with support for rich formatting, images, and references to external objects.

## Goals

1. **Rich text editing**: standard formatting (bold, italic, headings, lists, links, blockquotes, code)
2. **Structured documents**: section/block-based organization with collapsible sections
3. **Media embedding**: images with upload and URL support
4. **External references**: inline references to PDF anchors and other external objects
5. **Slash commands**: modern `/` command menu for quick block insertion
6. **Standalone development**: isolated dev environment for rapid iteration
7. **Lazy loading**: editor loaded on-demand to minimize initial bundle impact

## Non-goals (for now)

- Collaboration or concurrent editing.
- Perfect parity with a full word processor.

## Status

Implemented: the `@repo/editor` package exists and is used in `apps/desktop` and `apps/editor-dev`.

## See also

- Architecture: [`architecture.md`](./architecture.md)
- Integration: [`integration.md`](./integration.md)
- Public API: [`public-api.md`](./public-api.md)

