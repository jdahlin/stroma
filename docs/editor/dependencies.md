# Editor dependencies

The editor is built on TipTap / ProseMirror.

## TipTap core

The original spec preferred importing individual TipTap extensions instead of `@tiptap/starter-kit` for better tree-shaking.

When adding new features, prefer the smallest set of extensions needed.

## Bundle optimization notes

- Keep CSS in a separate file when it benefits parallel loading.
- Consider dynamic imports for heavier features (e.g. image handling) if it impacts the desktop bundle.

## See also

- Styling: [`styling.md`](./styling.md)
- Public API: [`public-api.md`](./public-api.md)

