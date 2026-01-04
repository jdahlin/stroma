# Editor architecture

## Package location

The editor lives in `packages/editor/` rather than `packages/ux/`.

Rationale:
- The editor is a substantial feature with its own dependencies (TipTap, etc.).
- Keeps `packages/ux/` focused on primitive UI components.
- Cleaner dependency graph: editor depends on `@repo/ux` and `@repo/core`.
- Enables isolated testing and development.
- Separate package enables lazy loading (only pay import cost when the editor is used).

## Directory structure

See `packages/editor/src/` for the authoritative structure.

## Standalone development app

`apps/editor-dev/` is a Vite app for isolated editor development (no Electron overhead).

Typical dev harness features:
- JSON inspector showing live TipTap document structure.
- Load/save sample documents.
- Mock PDF reference insertion.

## Lazy loading strategy

The editor should be safe to lazy-load in the desktop renderer to reduce initial bundle size.

- Desktop app integration can import the editor via `@repo/editor` or a dedicated lazy entry.
- Keep heavy extensions/features behind dynamic imports where it pays off.

## See also

- Dependencies: [`dependencies.md`](./dependencies.md)
- Integration points (desktop + PDF references): [`integration.md`](./integration.md)
- Monorepo layout: [`../monorepo.md`](../monorepo.md)

