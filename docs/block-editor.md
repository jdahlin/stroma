# Block Editor Specification

A TipTap-based rich text editor for creating and editing structured documents with support for rich formatting, images, and references to external objects.

## Goals

1. **Rich text editing** - Standard formatting (bold, italic, headings, lists, links, blockquotes, code)
2. **Structured documents** - Section/block-based organization with collapsible sections
3. **Media embedding** - Images with upload and URL support
4. **External references** - Inline references to PDF anchors and other external objects
5. **Slash commands** - Modern `/` command menu for quick block insertion
6. **Standalone development** - Isolated dev environment for rapid iteration
7. **Lazy loading** - Editor loaded on-demand to minimize initial bundle impact

## Architecture

### Package Location

Create a new `packages/editor/` package rather than adding to `packages/ux/`.

**Rationale:**
- Editor is a substantial feature with its own dependencies (TipTap + KaTeX)
- Keeps `packages/ux/` focused on primitive UI components
- Cleaner dependency graph: editor depends on `@repo/ux` and `@repo/core`
- Enables isolated testing and development
- Follows existing separation: `core` for logic, `ux` for primitives, `editor` for rich editing
- Separate package enables lazy loading - only pay import cost when editor is used

### Directory Structure

```
packages/editor/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts                        # Public API exports
    │
    ├── Editor.tsx                      # Main editor component
    ├── EditorToolbar.tsx               # Formatting toolbar
    ├── EditorContent.tsx               # TipTap editor wrapper
    │
    ├── extensions/
    │   ├── index.ts                    # Extension bundle export
    │   ├── PdfReference.ts             # PDF anchor references
    │   ├── Section.ts                  # Collapsible sections
    │   ├── SlashCommand.ts             # Slash command menu trigger
    │   └── configureExtensions.ts      # Extension factory
    │
    ├── components/
    │   ├── PdfReferenceNode.tsx        # PDF reference chip
    │   ├── SectionBlock.tsx            # Section container
    │   ├── SlashCommandMenu.tsx        # Slash command dropdown menu
    │   └── LinkPopover.tsx             # Link editing UI
    │
    ├── hooks/
    │   ├── useEditor.ts                # Editor instance management
    │   ├── useEditorState.ts           # Reactive state selectors
    │   └── useToolbarState.ts          # Active format tracking
    │
    ├── types/
    │   ├── index.ts
    │   └── document.ts                 # Document schema types
    │
    └── styles/
        └── prosemirror.css             # ProseMirror style overrides
```

### Standalone Development App

Create `apps/editor-dev/` for isolated editor development.

```
apps/editor-dev/
├── package.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx                         # Dev harness
    ├── EditorPlayground.tsx            # Editor sandbox
    ├── JsonInspector.tsx               # Document JSON viewer
    └── fixtures/
        ├── sample-content.json
        └── sample-pdf-refs.json
```

**Purpose:** Pure Vite app without Electron overhead for fast iteration during editor development.

**Features:**
- JSON inspector showing live TipTap document structure
- Load/save sample documents
- Theme toggle (light/dark)
- Mock PDF reference insertion
- Slash command testing

**Run command:** `pnpm dev:editor`

### Lazy Loading Strategy

The editor package should be lazy-loaded to avoid impacting initial app bundle size.

**Desktop App Integration:**
- Editor imported via `React.lazy()` in NotesPane
- Only loaded when user navigates to notes
- Suspense boundary shows loading state

**Package Exports:**
- Main entry exports components directly (for editor-dev app)
- Separate lazy entry for desktop app consumption

**Feature-level Lazy Loading:**
- Image extension loaded on first image insert
- Heavy features imported dynamically as needed

## Dependencies

### TipTap Core

Use individual TipTap packages instead of starter-kit for smaller bundle and better tree-shaking:

| Package | Purpose | Lazy Load |
|---------|---------|-----------|
| `@tiptap/react` | React bindings and hooks | No (core) |
| `@tiptap/pm` | ProseMirror peer dependencies | No (core) |
| `@tiptap/core` | Core editor functionality | No (core) |
| `@tiptap/extension-document` | Document node | No (core) |
| `@tiptap/extension-paragraph` | Paragraph node | No (core) |
| `@tiptap/extension-text` | Text node | No (core) |
| `@tiptap/extension-bold` | Bold mark | No (core) |
| `@tiptap/extension-italic` | Italic mark | No (core) |
| `@tiptap/extension-heading` | Heading nodes | No (core) |
| `@tiptap/extension-bullet-list` | Bullet list | No (core) |
| `@tiptap/extension-ordered-list` | Ordered list | No (core) |
| `@tiptap/extension-list-item` | List item | No (core) |
| `@tiptap/extension-blockquote` | Blockquote | No (core) |
| `@tiptap/extension-code-block` | Code block | No (core) |
| `@tiptap/extension-horizontal-rule` | Horizontal rule | No (core) |
| `@tiptap/extension-history` | Undo/redo | No (core) |
| `@tiptap/extension-dropcursor` | Drop cursor | No (core) |
| `@tiptap/extension-gapcursor` | Gap cursor | No (core) |
| `@tiptap/extension-link` | Link mark | No (core) |
| `@tiptap/extension-image` | Image node | Yes |
| `@tiptap/extension-placeholder` | Placeholder text | No (core) |
| `@tiptap/suggestion` | Suggestion/autocomplete | No (for slash commands) |

### Bundle Optimization

- Avoid `@tiptap/starter-kit` - import individual extensions for better tree-shaking
- Use dynamic imports for heavy features (images)
- CSS in separate file to enable parallel loading
- Use `@tiptap/core` ESM builds

## Custom Extensions

### PdfReference

An inline atomic node representing a reference to a PDF anchor.

**Node Type:** Inline, atomic (non-editable content)

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `anchorId` | `PdfAnchorId` | Unique anchor identifier from `@repo/core` |
| `sourceId` | `PdfSourceId` | PDF document identifier |
| `sourceName` | `string` | Display name of the PDF |
| `pageIndex` | `number` | Zero-based page number |
| `previewText` | `string?` | Optional text excerpt from the anchor |

**Rendering:** Displays as an inline chip/pill with PDF icon, document name, and page number. Clicking navigates to the referenced PDF location.

**HTML Serialization:** `<span data-pdf-reference data-anchor-id="..." data-source-id="...">...</span>`

**Insertion:** Via toolbar button, command palette, or drag-drop from PDF pane.

### Section

A block container for organizing document structure.

**Node Type:** Block, container

**Content:** One or more blocks (paragraphs, headings, lists, etc.)

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Unique section identifier (auto-generated UUID) |
| `title` | `string` | Section title for display and navigation |
| `collapsed` | `boolean` | Whether section content is hidden |

**Behavior:**
- Collapsible: Click header to toggle content visibility
- Draggable: Sections can be reordered via drag-drop
- Nested: Sections can contain other sections for hierarchy

**HTML Serialization:** `<section data-editor-section data-id="..." data-title="...">...</section>`

### SlashCommand

A suggestion-based extension that shows a command menu when user types `/`.

**Trigger:** `/` character at start of line or after whitespace

**Menu Items:**
| Command | Description | Icon |
|---------|-------------|------|
| `/heading1` | Heading 1 | Heading1 |
| `/heading2` | Heading 2 | Heading2 |
| `/heading3` | Heading 3 | Heading3 |
| `/bullet` | Bullet list | List |
| `/numbered` | Numbered list | ListOrdered |
| `/quote` | Blockquote | Quote |
| `/code` | Code block | Code |
| `/divider` | Horizontal rule | Minus |
| `/image` | Insert image | Image |
| `/section` | New section | FolderOpen |

**Behavior:**
- Menu appears below cursor as floating popover
- Keyboard navigation: Arrow keys to select, Enter to insert, Escape to close
- Type to filter: `/hea` filters to heading options
- Menu closes on click outside or Escape
- Selected item inserts corresponding block and removes `/` trigger text

**UI Components:**
- Uses existing `@repo/ux` components where possible
- Icons from lucide-react (already in project)
- Styling consistent with design system tokens

## Component Specifications

### Editor (Main Component)

The root editor component that composes toolbar, content area, and manages editor state.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `documentId` | `string` | Unique ID for localStorage persistence |
| `content` | `JSONContent?` | Initial document content (overrides localStorage) |
| `onChange` | `(content: JSONContent) => void` | Called on every change |
| `onPdfReferenceClick` | `(anchorId: string) => void` | PDF reference click handler |
| `placeholder` | `string?` | Placeholder text when empty |
| `readOnly` | `boolean?` | Disable editing |
| `autoFocus` | `boolean?` | Focus on mount |

**Layout:**
- Vertical flex container filling available space
- Toolbar fixed at top
- Scrollable content area below

### EditorToolbar

Horizontal toolbar with formatting controls.

**Component Reuse:**
- Use `IconButton` from `@repo/ux` for all toolbar buttons
- Use `Icon` from `@repo/ux` for icons
- All icons from lucide-react (already used throughout app)

**Sections (left to right):**
1. **Text formatting:** Bold, Italic, Strikethrough, Code
2. **Headings:** H1, H2, H3 dropdown or individual buttons
3. **Lists:** Bullet list, Numbered list
4. **Blocks:** Blockquote, Code block, Horizontal rule
5. **Insert:** Link, Image, PDF reference
6. **History:** Undo, Redo

**Active States:** Buttons reflect current selection state (e.g., Bold highlighted when cursor is in bold text). Use `data-active` attribute pattern from existing `IconButton`.

**Keyboard Shortcuts:** Each action has standard shortcuts (Cmd+B for bold, etc.)

### PdfReferenceNode

Inline chip displaying a PDF reference.

**Visual Design:**
- Inline-flex container with pill shape
- PDF icon (FileText from lucide-react)
- Document name (truncated if long)
- Page number badge
- Hover state with subtle highlight
- Click triggers `onPdfReferenceClick` callback

**Accessibility:**
- Role: button
- aria-label: Full reference description
- Keyboard focusable and activatable

## Styling Approach

Follow existing codebase conventions:

1. **Inline styles** using `React.CSSProperties` objects
2. **CSS variables** from `packages/ux/src/styles/tokens.css`
3. **CSS file** only for ProseMirror-specific selectors that can't be applied inline

**CSS Variables Used:**
- Colors: `--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-text-muted`, `--color-accent`, `--color-border`
- Spacing: `--space-1` through `--space-8`
- Typography: `--font-sans`, `--font-mono`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`
- Radii: `--radius-sm`, `--radius-md`

**ProseMirror CSS Requirements:**
- `.ProseMirror` focus outline removal
- `.ProseMirror p`, `h1-h6`, `ul`, `ol`, `blockquote`, `pre` - typography and spacing
- `.ProseMirror img` - responsive images
- `.ProseMirror .is-empty::before` - placeholder text via pseudo-element

## Public API

### Exports from `@repo/editor`

**Components:**
- `Editor` - Main editor component
- `EditorToolbar` - Standalone toolbar (for custom layouts)
- `EditorContent` - Content area only (for custom layouts)

**Hooks:**
- `useEditor` - Create and manage editor instance
- `useEditorState` - Subscribe to editor state changes
- `useToolbarState` - Track active formatting for toolbar

**Extensions:**
- `PdfReference` - PDF reference extension
- `Section` - Section container extension
- `SlashCommand` - Slash command menu extension
- `configureExtensions` - Helper to configure extension bundle

**Types:**
- `EditorProps` - Props for Editor component
- `DocumentContent` - TipTap JSONContent type alias
- `PdfReferenceAttributes` - PDF reference node attributes

### Exports from `@repo/editor/styles`

- CSS file with ProseMirror styles (import for side effects)

## Integration Points

### Desktop App Integration

**File:** `apps/desktop/src/renderer/panes/NotesPane.tsx`

The existing NotesPane is a placeholder ready for editor integration. It will:
- Render the Editor component
- Connect `onChange` to persist document state
- Connect `onPdfReferenceClick` to navigate to PDF pane

**Vite Config:** Add `@repo/editor` path alias in `apps/desktop/vite.config.ts`

### PDF Reference Flow

1. User selects text/region in PDF pane
2. User triggers "Add to notes" action (context menu, keyboard shortcut, or drag)
3. Desktop app calls editor method to insert PdfReference node
4. Editor inserts reference at cursor position
5. User clicks reference to navigate back to PDF location

### State Persistence

Per-document localStorage persistence to avoid conflicts between documents:

**Storage Key Pattern:** `editor:document:{documentId}`

**Stored Data:**
- Document JSON content
- Cursor position (optional)
- Scroll position (optional)

**Implementation:**
- Each document gets its own localStorage key based on unique document ID
- Prevents different documents from overwriting each other's state
- Document ID passed as prop to Editor component
- Autosave on change with debounce (e.g., 500ms)
- Load from localStorage on mount if content prop not provided

## Implementation Phases

### Phase 1: Package Foundation
- Create `packages/editor/` directory structure
- Configure `package.json` with individual TipTap extensions (not starter-kit)
- Configure `tsconfig.json` extending workspace config
- Configure `vitest.config.ts`
- Create minimal `Editor.tsx` with core extensions only
- Set up lazy loading entry point for desktop app
- Verify package builds and integrates with workspace
- Add `@repo/editor` alias to desktop Vite config

### Phase 2: Standalone Dev Environment
- Create `apps/editor-dev/` Vite application
- Implement dev harness with editor instance
- Add JSON inspector panel showing document structure
- Add sample content fixtures
- Add `dev:editor` script and Turbo task
- Verify hot reload works correctly

### Phase 3: Core Editor Features
- Implement `EditorToolbar` using `IconButton` from `@repo/ux`
- Add Link extension with popover for URL editing
- Add Image extension with URL input (lazy loaded)
- Add Placeholder extension
- Apply styling using CSS variables from `@repo/ux/styles`
- Create `prosemirror.css` with base styles (separate file)
- Add keyboard shortcut documentation

### Phase 4: Slash Commands
- Implement `SlashCommand` extension using `@tiptap/suggestion`
- Create `SlashCommandMenu` component
- Define all command items (headings, lists, blocks, etc.)
- Add keyboard navigation (arrows, enter, escape)
- Add type-to-filter functionality
- Style menu using design system tokens

### Phase 5: Structure Extensions
- Implement `Section` extension
- Create `SectionBlock` node view component
- Add collapse/expand functionality
- Add section reordering via drag-drop

### Phase 6: PDF Reference Extension
- Implement `PdfReference` extension
- Create `PdfReferenceNode` component using `@repo/ux` components
- Define insertion commands
- Style reference chips
- Add click handler prop to Editor

### Phase 7: Persistence & Integration
- Implement per-document localStorage persistence
- Add `documentId` prop handling
- Update `NotesPane` to use Editor (lazy loaded)
- Wire up PDF reference click handling
- Add PDF reference insertion from PDF pane

## Testing Strategy

### Unit Tests
- Extension serialization/parsing (HTML to JSON, JSON to HTML)
- Extension commands (insert, toggle, etc.)
- Toolbar state derivation
- Slash command filtering logic

### Manual Testing (via editor-dev)
- All toolbar buttons function correctly
- Slash command menu appears and filters correctly
- PDF references display and click correctly
- Sections collapse/expand
- Copy/paste preserves formatting
- Undo/redo works across all operations
- Per-document persistence works correctly

## Files to Modify

| File | Change |
|------|--------|
| `pnpm-workspace.yaml` | Add `packages/editor` to workspace |
| `turbo.json` | Add `dev:editor` task |
| `package.json` (root) | Add `dev:editor` script |
| `apps/desktop/vite.config.ts` | Add `@repo/editor` alias |
| `apps/desktop/src/renderer/panes/NotesPane.tsx` | Integrate Editor component |

## Reference Files

| File | Relevance |
|------|-----------|
| `packages/ux/src/components/Button.tsx` | Styling pattern with CSS variables |
| `packages/ux/src/components/IconButton.tsx` | Toolbar button component to reuse |
| `packages/ux/src/components/Icon.tsx` | Icon component to reuse |
| `packages/core/src/model/pdf.ts` | `PdfAnchorId`, `PdfSourceId` type definitions |
| `packages/ux/src/styles/tokens.css` | CSS custom properties reference |
| `packages/core/package.json` | Package configuration pattern |
| `packages/core/tsconfig.json` | TypeScript config pattern |
