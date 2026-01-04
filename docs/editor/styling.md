# Editor styling

Follow existing codebase conventions:

1. Prefer inline styles via `React.CSSProperties`.
2. Use CSS variables from `packages/ux/src/styles/tokens.css`.
3. Put ProseMirror-specific selectors (that can’t be expressed cleanly inline) in a CSS file.

## ProseMirror CSS requirements

Common selectors that usually need CSS:
- `.ProseMirror` focus outline removal.
- Typography + spacing for paragraphs, headings, lists, blockquotes.
- `img` sizing.
- Placeholder pseudo-element (`.is-empty::before`).

## See also

- Public API (style entry point): [`public-api.md`](./public-api.md)

