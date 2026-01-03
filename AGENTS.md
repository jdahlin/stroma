# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stroma is a desktop knowledge work environment for deep reading, extraction, and long-term learning. Built with Electron + React + TypeScript using an IDE-like multi-pane workspace. Currently in early development (Step 1: Application shell).

## Tech Stack

- **Desktop**: Electron (main/preload/renderer architecture)
- **UI**: React + TypeScript + Zustand
- **Build**: Vite + pnpm workspaces + Turbo
- **Layout**: Dockview (IDE-style docking)
- **Styling**: CSS design tokens + Tailwind CSS
- **Testing**: Vitest

## Development Commands

```bash
pnpm install                      # Install dependencies
pnpm dev                          # Start development (all packages)
pnpm dev:desktop                  # Start Electron app without Turbo
pnpm build                        # Production build
pnpm test                         # Run all tests
pnpm test:watch                   # Run tests in watch mode
pnpm format                       # Format code with Prettier
pnpm --filter @repo/desktop dev   # Start Electron app in dev mode
```

## Path Aliases & Import Boundaries

| Alias          | Package                     | Can Import                               | Cannot Import                                  |
| -------------- | --------------------------- | ---------------------------------------- | ---------------------------------------------- |
| `@repo/shared` | `packages/shared`           | (none)                                   | `@repo/core`, `@repo/ux`, `@main`, `@renderer` |
| `@repo/core`   | `packages/core`             | `@repo/shared`                           | `@repo/ux`, `@main`, `@renderer`               |
| `@repo/ux`     | `packages/ux`               | `@repo/core`, `@repo/shared`             | `@main`, `@renderer`                           |
| `@main`        | `apps/desktop/src/main`     | `@repo/core`, `@repo/shared`             | `@repo/ux`, `@renderer`                        |
| `@renderer`    | `apps/desktop/src/renderer` | `@repo/core`, `@repo/shared`, `@repo/ux` | `@main`                                        |

Import boundaries are enforced by ESLint rules in `configs/eslint/boundaries.mjs`.

## Monorepo Structure

```
apps/desktop/              # Electron application
  src/main/               # Electron main process (Node.js)
  src/preload/            # IPC bridge (contextBridge)
  src/renderer/           # React UI (no Node APIs)

packages/shared/           # Pure utilities, type helpers - NO dependencies
packages/core/             # Domain types/contracts - can import @repo/shared
packages/ux/               # Design system + Dockview - can import @repo/core, @repo/shared

configs/                   # Shared tooling configs
  ts/                     # TypeScript (base.json, react.json, node.json)
  eslint/                 # ESLint with import boundary rules
  prettier/               # Prettier config
  tailwind/               # Tailwind CSS config
  vitest/                 # Vitest shared config
```

## State Management

**Zustand** for global/persistent state:

- `uiStore.ts`: Theme, zoom, sidebar, command palette
- `layoutStore.ts`: Dockview layout serialization

**React hooks** for local/ephemeral state:

- `useState`: Form inputs, local loading states
- `useRef`: DOM refs, mutable values

## Electron Security

- Main: `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`
- Preload: Minimal typed API via `contextBridge` → `window.stroma`
- Renderer: No Node.js access

## Custom Dockview Theme

Theme defined in `packages/ux/src/styles/dockview-theme.css` using CSS variables from `tokens.css`. Theme object exported from `packages/ux/src/layout/stromaTheme.ts`.
