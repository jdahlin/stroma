# Stroma

Desktop knowledge work environment for deep reading, extraction, and long-term learning.

## Development

```bash
pnpm install
pnpm dev
```

## Quality & Tooling

To maintain a high quality bar, this project uses several automated tools:

### Pre-commit Hooks (Husky & lint-staged)
On every `git commit`, the following are automatically run:
- **Linting & Formatting**: ESLint and Prettier run on changed files.
- **Typechecking**: `tsc --noEmit` runs on the whole project.
- **Tests**: All Vitest suites must pass.

If any check fails, the commit is blocked.

### Dead Code Detection (Knip)
To find unused files, exports, or dependencies, run:
```bash
pnpm knip
```

## Unsigned macOS builds

macOS may block unsigned builds with a "damaged" or "untrusted" warning.

Finder:
- Right-click `Stroma.app`
- Choose `Open`
- Click `Open` in the dialog

Terminal:
```bash
xattr -dr com.apple.quarantine /path/to/Stroma.app
open /path/to/Stroma.app
```

## Docs

- Docs index: [`docs/README.md`](./docs/README.md)
