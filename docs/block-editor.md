# Block Editor Specification

A TipTap-based rich text editor for creating and editing structured documents with support for rich formatting, math equations, images, and references to external objects.

## Goals

1. **Rich text editing** - Standard formatting (bold, italic, headings, lists, links, blockquotes, code)
2. **Structured documents** - Section/block-based organization with collapsible sections
3. **Math support** - Inline and block-level LaTeX equations rendered with KaTeX
4. **Media embedding** - Images with upload and URL support
5. **External references** - Inline references to PDF anchors and other external objects
6. **Standalone development** - Isolated dev environment for rapid iteration

## Architecture

### Package Location

Create a new `packages/editor/` package rather than adding to `packages/ux/`.

**Rationale:**
- Editor is a substantial feature with its own dependencies (TipTap ~200KB, KaTeX ~300KB)
- Keeps `packages/ux/` focused on primitive UI components
- Cleaner dependency graph: editor depends on `@repo/ux` and `@repo/core`
- Enables isolated testing and development
- Follows existing separation: `core` for logic, `ux` for primitives, `editor` for rich editing

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
    │   ├── MathBlock.ts                # Block-level math
    │   ├── MathInline.ts               # Inline math
    │   ├── PdfReference.ts             # PDF anchor references
    │   ├── Section.ts                  # Collapsible sections
    │   └── configureExtensions.ts      # Extension factory
    │
    ├── components/
    │   ├── MathRenderer.tsx            # KaTeX block renderer
    │   ├── MathInlineRenderer.tsx      # KaTeX inline renderer
    │   ├── PdfReferenceNode.tsx        # PDF reference chip
    │   ├── SectionBlock.tsx            # Section container
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
- Extension enable/disable toggles
- Export preview (HTML output)

**Run command:** `pnpm dev:editor`

## Dependencies

### TipTap Core

| Package | Purpose |
|---------|---------|
| `@tiptap/react` | React bindings and hooks |
| `@tiptap/pm` | ProseMirror peer dependencies |
| `@tiptap/starter-kit` | Core extensions bundle |
| `@tiptap/extension-image` | Image node support |
| `@tiptap/extension-link` | Link mark with URL attributes |
| `@tiptap/extension-placeholder` | Empty editor placeholder text |
| `@tiptap/extension-typography` | Smart quotes, dashes |

### Starter Kit Contents

The starter-kit provides: Document, Paragraph, Text, Bold, Italic, Strike, Code, Heading (1-6), BulletList, OrderedList, ListItem, Blockquote, HorizontalRule, HardBreak, History (undo/redo), Dropcursor, Gapcursor.

### Math Rendering

| Package | Purpose |
|---------|---------|
| `katex` | LaTeX rendering engine |
| `@types/katex` | TypeScript definitions |

KaTeX chosen over MathJax for:
- Faster rendering (10-100x)
- Smaller bundle (~300KB vs ~1MB)
- Sufficient LaTeX coverage for most use cases

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

### MathBlock

A block-level node for display math equations.

**Node Type:** Block, code-like (no marks allowed inside)

**Content:** Raw LaTeX text

**Attributes:**
| Attribute | Type | Description |
|-----------|------|-------------|
| `latex` | `string` | LaTeX source (synced from text content) |

**Behavior:**
- Click to edit: Shows textarea with LaTeX source
- Blur to preview: Renders equation with KaTeX in display mode
- Invalid LaTeX shows error message instead of crashing
- Empty block shows placeholder prompting for input

**Keyboard Shortcut:** `Cmd+Shift+M` to insert new math block

**HTML Serialization:** `<div data-math-block>LaTeX source</div>`

### MathInline

An inline node for inline math equations within text.

**Node Type:** Inline, code-like

**Content:** Raw LaTeX text

**Behavior:**
- Same edit/preview toggle as MathBlock
- Renders with KaTeX in inline mode (smaller, fits in text flow)
- Delimiters in source: `$...$` or `\(...\)`

**Keyboard Shortcut:** `Cmd+Shift+4` ($ key) to insert inline math

**HTML Serialization:** `<span data-math-inline>LaTeX source</span>`

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

## Component Specifications

### Editor (Main Component)

The root editor component that composes toolbar, content area, and manages editor state.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `content` | `JSONContent?` | Initial document content |
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

**Sections (left to right):**
1. **Text formatting:** Bold, Italic, Strikethrough, Code
2. **Headings:** H1, H2, H3 dropdown or individual buttons
3. **Lists:** Bullet list, Numbered list
4. **Blocks:** Blockquote, Code block, Horizontal rule
5. **Insert:** Link, Image, Math block, PDF reference
6. **History:** Undo, Redo

**Active States:** Buttons reflect current selection state (e.g., Bold highlighted when cursor is in bold text)

**Keyboard Shortcuts:** Each action has standard shortcuts (Cmd+B for bold, etc.)

### MathRenderer

Renders KaTeX output for math blocks with edit/preview toggle.

**States:**
1. **Preview mode:** Rendered equation, click to edit
2. **Edit mode:** Textarea with LaTeX source, blur to preview
3. **Error mode:** Error message for invalid LaTeX

**KaTeX Options:**
- `displayMode: true` for block math
- `throwOnError: false` to gracefully handle errors
- `errorColor` uses design system error color

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
- `MathBlock` - Block math extension
- `MathInline` - Inline math extension
- `PdfReference` - PDF reference extension
- `Section` - Section container extension
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

Editor content stored in Zustand store with localStorage persistence:
- Document JSON content
- Cursor position (optional)
- Scroll position (optional)

## Implementation Phases

### Phase 1: Package Foundation
- Create `packages/editor/` directory structure
- Configure `package.json` with dependencies
- Configure `tsconfig.json` extending workspace config
- Configure `vitest.config.ts`
- Create minimal `Editor.tsx` with starter-kit only
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
- Implement `EditorToolbar` with all standard formatting buttons
- Add Link extension with popover for URL editing
- Add Image extension with URL input (file upload later)
- Add Placeholder extension
- Apply styling using CSS variables
- Create `prosemirror.css` with base styles
- Add keyboard shortcut documentation

### Phase 4: Math Extensions
- Implement `MathBlock` extension with node view
- Implement `MathInline` extension with node view
- Create `MathRenderer` component with KaTeX integration
- Handle LaTeX parsing errors gracefully
- Add edit/preview toggle behavior
- Test with various LaTeX expressions

### Phase 5: Structure Extensions
- Implement `Section` extension
- Create `SectionBlock` node view component
- Add collapse/expand functionality
- Add section reordering via drag-drop
- Test nested sections

### Phase 6: PDF Reference Extension
- Implement `PdfReference` extension
- Create `PdfReferenceNode` component
- Define insertion commands
- Style reference chips
- Add click handler prop to Editor

### Phase 7: Desktop Integration
- Update `NotesPane` to use Editor
- Connect state persistence
- Wire up PDF reference click handling
- Add PDF reference insertion from PDF pane
- End-to-end testing

## Testing Strategy

### Unit Tests
- Extension serialization/parsing (HTML to JSON, JSON to HTML)
- Extension commands (insert, toggle, etc.)
- Toolbar state derivation
- Math rendering with valid/invalid LaTeX

### Integration Tests
- Editor renders initial content correctly
- Formatting commands update content
- Custom nodes render their node views
- onChange fires with correct content
- Keyboard shortcuts trigger correct commands

### Manual Testing (via editor-dev)
- All toolbar buttons function correctly
- Math equations render properly
- PDF references display and click correctly
- Sections collapse/expand
- Copy/paste preserves formatting
- Undo/redo works across all operations

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
| `packages/core/src/model/pdf.ts` | `PdfAnchorId`, `PdfSourceId` type definitions |
| `packages/ux/src/styles/tokens.css` | CSS custom properties reference |
| `packages/core/package.json` | Package configuration pattern |
| `packages/core/tsconfig.json` | TypeScript config pattern |
| `packages/core/vitest.config.ts` | Vitest config pattern |
