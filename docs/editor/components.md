---
title: "What editor components matter?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What editor components matter?
This document explains the main editor components and why they exist.

## Who is this for?
- Contributors wiring editor UI.
- Maintainers reviewing component changes.

## What is the scope?
- In scope: primary components and their responsibilities.
- Out of scope: detailed prop documentation for every component.

## What is the mental model?
- The editor composes a root component, a toolbar, and node views that align with extensions.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Root editor | The component that owns state and composition. | "Editor with toolbar and content." |
| Toolbar | Formatting and insertion controls. | "Buttons for bold and headings." |
| Node view | Custom UI for schema nodes. | "PDF reference chip." |

## What are the key components?
| Component | Responsibility | Example |
| --- | --- | --- |
| `Editor` | Compose toolbar + content and manage state. | "Provides onChange to persistence." |
| `EditorToolbar` | Formatting and insertion controls. | "Reflect active marks." |
| `PdfReferenceNode` | Render source links in content. | "Click to jump to PDF." |

## What are example props for the root editor?
| Prop | Purpose | Example |
| --- | --- | --- |
| `documentId` | Persistence key for a note. | "note-123" |
| `content` | Initial document content. | "Loaded JSON from storage." |
| `onChange` | Save content updates. | "Debounced save handler." |
| `onPdfReferenceClick` | Navigate to source anchors. | "Open page on click." |

## What are the facts?
- The root editor component composes toolbar and content.

## What decisions are recorded?
- Toolbar uses `@repo/ux` primitives for consistency.

## What are the open questions?
- Should the toolbar be optional for certain panes?

## What are the failure modes or edge cases?
- Missing `onPdfReferenceClick` leaves references inert.

## What assumptions and invariants apply?
- Node views match the corresponding extensions.

## What related docs matter?
- Extensions: [`extensions.md`](./extensions.md)
- Styling: [`styling.md`](./styling.md)

## What this doc does not cover
- Complete prop tables for every component.
