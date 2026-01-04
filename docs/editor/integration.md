# Editor integration

## Desktop app integration

The desktop renderer imports the editor in pane(s) such as:
- `apps/desktop/src/renderer/panes/NotesPane.tsx`
- `apps/desktop/src/renderer/panes/HomePane.tsx`

The desktop app also imports `@repo/editor/styles` in its renderer bootstrap.

## PDF reference flow

1. User selects text/region in the PDF pane.
2. App creates/updates a `PdfAnchor` in state/storage.
3. User inserts a `PdfReference` node in the editor.
4. Clicking the reference navigates to the anchor in the PDF pane.

## Persistence

Editor content persistence is a separate concern from PDF pane persistence.

If using localStorage as an MVP persistence layer, prefer per-document keys:

- Key pattern: `editor:document:{documentId}`
- Store: document JSON content (+ optional cursor/scroll position)
- Autosave on change with a debounce

For longer-term persistence, see the SQLite-oriented plan:
- [`../storage/README.md`](../storage/README.md)

## See also

- PDF docs: [`../pdf/README.md`](../pdf/README.md)
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)
