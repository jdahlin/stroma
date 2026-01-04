---
title: "How should the editor be styled?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How should the editor be styled?
This document explains styling conventions for the editor.

## Who is this for?
- Contributors adding editor UI.
- Maintainers reviewing styling changes.

## What is the scope?
- In scope: styling conventions and required CSS selectors.
- Out of scope: full design system rules.

## What is the mental model?
- Use design tokens for consistency and limit CSS to selectors the editor requires.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Tokens | Shared CSS variables for theme. | "Use spacing tokens for margins." |
| Inline styles | Prefer component-level styles. | "React.CSSProperties for layout." |
| ProseMirror CSS | Required selectors for editing. | "Placeholder styling." |

## What are the styling rules?
- Prefer inline styles via `React.CSSProperties`.
- Use CSS variables from `packages/ux/src/styles/tokens.css`.
- Keep ProseMirror-specific selectors in a CSS file.

## What selectors are commonly required?
- `.ProseMirror` focus outline removal.
- Typography and spacing for paragraphs and lists.
- `img` sizing rules.
- Placeholder pseudo-element styling (`.is-empty::before`).

## What are the facts?
- ProseMirror requires some CSS selectors to render correctly.

## What decisions are recorded?
- Tokens are the source of truth for editor styling.

## What are the open questions?
- Should the editor ship a minimal theme override for note panes?

## What are the failure modes or edge cases?
- Missing placeholder styles make empty documents look broken.

## What assumptions and invariants apply?
- The editor inherits base typography from the design system.

## What related docs matter?
- Public API: [`public-api.md`](./public-api.md)

## What this doc does not cover
- Full theme definitions or Dockview theming.
