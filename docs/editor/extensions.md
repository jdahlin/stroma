---
title: "What editor extensions exist?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What editor extensions exist?
This document explains the custom editor extensions and their roles.

## Who is this for?
- Contributors adding or modifying extensions.
- Maintainers reviewing extension behavior.

## What is the scope?
- In scope: extension purpose, attributes, and behaviors.
- Out of scope: full implementation details.

## What is the mental model?
- Extensions define the document schema and interactive behaviors for sources and extracts.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| PDF reference | Inline node that links to a source anchor. | "A chip showing source name and page." |
| Section | Block container for hierarchy. | "A collapsible section titled 'Chapter 2'." |
| Slash command | Inline menu for block insertion. | "Type `/` to insert a divider." |

## What extensions are defined?
| Extension | Purpose | Example |
| --- | --- | --- |
| PdfReference | Inline node linking to a PDF anchor. | "Navigate to page 5 on click." |
| Section | Block container with collapse state. | "Nested sections for outlines." |
| SlashCommand | Suggestion-driven command menu. | "Insert a heading from the menu." |

## What are the key attributes?
| Extension | Attribute | Meaning | Example |
| --- | --- | --- | --- |
| PdfReference | `anchorId` | Anchor identity in core types. | "Anchor 12 in source 3." |
| PdfReference | `pageIndex` | Zero-based page number. | "Page 0 for first page." |
| Section | `id` | Section identifier. | "section-42" |
| Section | `collapsed` | Collapse state. | "true" |

## What are the behaviors?
- PdfReference renders as a chip and navigates to the anchor on click.
- Section supports collapsing and nesting.
- SlashCommand triggers when `/` appears at line start or after whitespace.

## What are the facts?
- PdfReference is an inline atomic node.

## What decisions are recorded?
- References to sources are rendered as chips for clarity.

## What are the open questions?
- Should sections support drag reordering in the MVP?

## What are the failure modes or edge cases?
- Missing anchor data results in a dead reference chip.

## What assumptions and invariants apply?
- Anchor identifiers are stable across sessions.

## What related docs matter?
- Components: [`components.md`](./components.md)
- Integration: [`integration.md`](./integration.md)
- PDF docs: [`../pdf/README.md`](../pdf/README.md)

## What this doc does not cover
- The concrete ProseMirror schema or command implementations.
