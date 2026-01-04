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
│ │ ├─ state/ # Renderer state (merged from packages/state)
│ │ │ ├─ uiStore.ts # Theme, zoom, command palette, global UI flags
│ │ │ ├─ layoutStore.ts # Dock layout state + persistence orchestration
│ │ │ ├─ pdfStore.ts # PDF viewing state
│ │ │ ├─ persist.ts # Storage adapter + versioning/migrations helpers
│ │ │ └─ index.ts # Public state surface for renderer
│ │ │
│ │ ├─ panes/ # Built-in panes
│ │ │ ├─ HomePane.tsx
│ │ │ ├─ NotesPane.tsx
│ │ │ ├─ QueuePane.tsx
│ │ │ └─ SearchPane.tsx
│ │ │
│ │ ├─ chrome/ # Global UI chrome (non-pane UI)
│ │ │ ├─ Sidebar.tsx # Navigation + Anchors
│ │ │ ├─ Ribbon.tsx # Left-side vertical actions
│ │ │ └─ CommandPalette.tsx # Global command launcher
│ │ │
│ │ └─ styles/ # App-level style glue
│ │ ├─ base.css # App-specific base styles
│ │ └─ platform.css # Electron/platform tweaks
│ │
│ └─ package.json # Electron/Vite config
│
├─ packages/
│ ├─ core/ # Pure application contracts (no UI, no Electron)
│ │ └─ src/
│ │ ├─ panes.ts # Pane identity + input contracts
│ │ ├─ commands.ts # Global command definitions
│ │ └─ model/ # Shared data models
│ │
│ ├─ ux/ # Design system + layout (authoritative styling + components)
│ │ └─ src/
│ │ ├─ styles/ # Global CSS authority
│ │ │ ├─ tokens.css # CSS variables (colors, spacing, radii)
│ │ │ ├─ base.css # Reset + typography baseline
│ │ │ ├─ themes.css # Light/dark mappings
│ │ │ ├─ dockview-theme.css # Custom theme for Dockview
│ │ │ └─ index.css # Single import point
│ │ │
│ │ ├─ components/ # Reusable UI primitives (Button, Icon, etc.)
│ │ ├─ layout/ # DockHost root component
│ │ └─ index.ts # Public UX surface
│ │
│ └─ shared/ # Pure utilities, type helpers - NO dependencies
│
├─ configs/ # Centralized tooling configuration
│ ├─ ts/
│ ├─ eslint/
│ ├─ prettier/
│ └─ vitest/
│
├─ scripts/ # Repo maintenance scripts
│
├─ package.json # Workspace root
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
└─ turbo.json

Simple boundary rule to keep “core pure”
• packages/core must never import from apps/** or packages/ux.
• Renderer may import @repo/core, but @repo/core must stay dependency-light (types/contracts).