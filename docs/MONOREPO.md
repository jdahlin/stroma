repo/
├─ apps/
│ └─ desktop/ # Electron application (entry point + composition layer)
│ ├─ src/
│ │ ├─ main/ # Electron main process (native side)
│ │ │ ├─ index.ts # App bootstrap (BrowserWindow, lifecycle)
│ │ │ ├─ windows.ts # Window creation + options
│ │ │ └─ menu.ts # Application menus + shortcuts
│ │ │
│ │ ├─ preload/ # Secure IPC bridge (contextBridge only)
│ │ │ ├─ index.ts # Exposed APIs (typed, minimal)
│ │ │ └─ types.ts # IPC type definitions
│ │ │
│ │ └─ renderer/ # UI runtime (no Node APIs)
│ │ ├─ index.html # Single HTML entry (static, minimal)
│ │ ├─ main.tsx # React bootstrap
│ │ ├─ App.tsx # Application shell (chrome + dock host)
│ │ │
│ │ ├─ layout/ # App-level layout glue (composition)
│ │ │ ├─ DockRoot.tsx # Dockview host instance wiring
│ │ │ ├─ paneRegistry.ts # PaneType → component mapping
│ │ │ └─ defaultLayout.ts # Default docking layout
│ │ │
│ │ ├─ state/ # Shared renderer state (merged from packages/state)
│ │ │ ├─ uiStore.ts # Theme, zoom, command palette, global UI flags
│ │ │ ├─ layoutStore.ts # Dock layout state + persistence orchestration
│ │ │ ├─ persist.ts # Storage adapter + versioning/migrations helpers
│ │ │ └─ index.ts # Public state surface for renderer
│ │ │
│ │ ├─ panes/ # Built-in panes (placeholders at Step 1)
│ │ │ ├─ HomePane.tsx
│ │ │ ├─ NotesPane.tsx
│ │ │ ├─ QueuePane.tsx
│ │ │ └─ SearchPane.tsx
│ │ │
│ │ ├─ chrome/ # Global UI chrome (non-pane UI)
│ │ │ ├─ TopBar.tsx # App title, zoom, theme
│ │ │ ├─ StatusBar.tsx # Optional status/debug output
│ │ │ └─ CommandPalette.tsx # Global command launcher
│ │ │
│ │ ├─ assets/ # App-specific static assets
│ │ │ ├─ icons/ # Window/app icons
│ │ │ └─ images/ # Branding / splash / misc
│ │ │
│ │ └─ styles/ # App-level style glue only
│ │ ├─ app.css # Imports shared UI styles
│ │ └─ platform.css # Electron/platform tweaks
│ │
│ └─ package.json # Electron/Vite config
│
├─ packages/
│ ├─ core/ # Pure application contracts (no UI, no Electron)
│ │ └─ src/
│ │ ├─ panes.ts # Pane identity + input contracts
│ │ ├─ commands.ts # Global command definitions
│ │ └─ model/ # Shared data models (IDs, anchors later)
│ │
│ ├─ ui/ # Design system (authoritative styling + components)
│ │ └─ src/
│ │ ├─ styles/ # Global CSS authority
│ │ │ ├─ tokens.css # CSS variables (colors, spacing, radii)
│ │ │ ├─ base.css # Reset + typography baseline
│ │ │ ├─ themes.css # Light/dark mappings
│ │ │ └─ index.css # Single import point
│ │ │
│ │ ├─ assets/ # Shared UI assets
│ │ │ ├─ fonts/ # Fonts (woff2/variable)
│ │ │ └─ icons/ # Shared SVG icons
│ │ │
│ │ ├─ components/ # Reusable UI primitives
│ │ │ ├─ layout/ # Panels, toolbars, containers
│ │ │ ├─ controls/ # Buttons, inputs, toggles
│ │ │ └─ overlays/ # Dialogs, popovers, palettes
│ │ │
│ │ └─ index.ts # Public UI surface
│ │
│ └─ layout/ # Docking integration (layout ≠ UI)
│ └─ src/
│ ├─ DockHost.tsx # Dockview root component
│ ├─ persistence.ts # Layout serialization/restore helpers
│ └─ index.ts
│
├─ configs/ # Centralized tooling configuration
│ ├─ ts/
│ ├─ eslint/
│ ├─ prettier/
│ └─ tailwind/
│
├─ scripts/ # Repo maintenance scripts
│
├─ package.json # Workspace root
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
└─ turbo.json

What changed
• Removed packages/state/
• Added apps/desktop/src/renderer/state/ with the same responsibilities.

Simple boundary rule to keep “core pure”
• packages/core must never import from apps/\*\* or packages/ui|layout.
• Renderer may import @repo/core, but @repo/core must stay dependency-light (types/contracts).
