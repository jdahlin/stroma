---
title: "What is the incremental reading workflow?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the incremental reading workflow?
This document explains the incremental reading workflow and the UX capabilities it requires.

## Who is this for?
- Contributors designing reading, extraction, and review flows.
- Maintainers validating MVP scope against the workflow.

## What is the scope?
- In scope: workflow concepts, required actions, and UX surfaces.
- Out of scope: detailed UI design and implementation choices.

## What is the mental model?
- Knowledge flows through a funnel: source -> selection -> extract -> question -> review.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Source | Input material the user reads. | "A PDF in the library." |
| Selection | A highlight or capture inside a source. | "A highlighted paragraph." |
| Extract | A refined note tied to a selection. | "A short summary linked to the highlight." |
| Question | A reviewable prompt. | "A cloze card derived from an extract." |
| Review loop | Scheduled resurfacing of extracts/questions. | "A due list for today." |

## What UX capabilities are required?
| Capability | Why it matters | Example |
| --- | --- | --- |
| Source intake | Build a prioritized reading queue. | "Add a PDF with a due date." |
| Incremental extraction | Create extracts without leaving the source. | "Extract text inline while reading." |
| Progressive refinement | Break extracts into smaller units. | "Turn a summary into a question." |
| Review loop | Resurface material on schedule. | "Rate a question as Good." |
| Low friction | Keep the flow fast and keyboard-first. | "Jump source <-> note with one action." |

## What screens and actions are required?
- Home/Today: start next read or review, postpone, resume last item.
- Library/Sources: add, open, prioritize, archive sources.
- Reader: navigate, highlight, extract, open linked note.
- Extract editor: edit, refine, jump to anchor, rate when prompted.
- Review queue: rate, see context, skip or postpone, jump to source.
- Note tree: browse hierarchy and jump to related items.

## What are the non-goals?
- One-time reading flows without resurfacing.
- Review-only systems without source context.

## What are the facts?
- Incremental reading blends reading, extraction, and review in one loop.

## What decisions are recorded?
- Spaced review is a first-class requirement.
- Extracts must remain linked to their sources.

## What are the open questions?
- How much of the workflow should be keyboard-only in the MVP?

## What are the failure modes or edge cases?
- Extracts lose their source anchors.
- The queue resurfaces items without showing context.

## What assumptions and invariants apply?
- Sources can be revisited indefinitely.
- Users need a clear "what next" signal.

## What related docs matter?
- Product vision: [`product-vision.md`](./product-vision.md)
- MVP roadmap: [`roadmap-mvp.md`](./roadmap-mvp.md)
- PDF docs: [`pdf/README.md`](./pdf/README.md)
- Editor docs: [`editor/README.md`](./editor/README.md)
- SuperMemo Guru (background): [Incremental reading](https://supermemo.guru/wiki/Incremental_reading)
- Wikipedia (definition): [Incremental reading](https://en.wikipedia.org/wiki/Incremental_reading)

## What this doc does not cover
- Detailed UI layouts or scheduling algorithms.
