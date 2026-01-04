---
title: "What is the MVP roadmap?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the MVP roadmap?
This document explains the MVP roadmap for incremental reading features in Stroma.

## Who is this for?
- Contributors sequencing MVP work.
- Maintainers tracking scope guardrails.

## What is the scope?
- In scope: MVP definition, phases, and acceptance criteria.
- Out of scope: detailed task breakdowns and implementation choices.

## What is the mental model?
- The MVP is a thin but complete loop: read a source, create anchors, extract notes, and review on a schedule.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| MVP loop | Minimum viable read-extract-review cycle. | "Create an extract and see it resurface later." |
| Phase | A shippable milestone. | "Phase 2 delivers extracts + editor." |
| Acceptance criteria | Observable outcomes for a phase. | "A highlight reloads after restart." |
| FSRS | A scheduling algorithm for spaced review. | "Again/Hard/Good/Easy ratings update next due." |

## What is the MVP definition?
- Import a PDF and open it in a workspace.
- Create highlights and extracts linked to the source.
- Move through a small review queue over time.
- Persist work and resume after restart.

## What are the scope guardrails?
- In scope: single-user, local-only experience.
- In scope: one workspace layout.
- In scope: one PDF open at a time.
- Out of scope: cloud sync or collaboration.
- Out of scope: AI extraction, OCR, or external integrations.

## What are the phases?
| Phase | Goal | Example |
| --- | --- | --- |
| 1. PDF workspace | Durable PDF reading and anchors. | "Create a highlight and reload it later." |
| 2. Extracts + editor | Linked notes with navigation. | "Click an extract to jump to the source." |
| 3. Reading queue | Resurfacing for sources and extracts. | "A due list shows what to read now." |
| 4. FSRS scheduling | Stable spacing of reviews. | "Review ratings change the next due date." |
| 5. Core loop polish | Fast, keyboard-first workflow. | "Complete a cycle without the mouse." |

## What are the acceptance criteria?
- Each phase has at least one end-to-end user action that persists.
- Each milestone is shippable on its own.

## What are the facts?
- The roadmap is structured as phased deliverables.

## What decisions are recorded?
- The MVP prioritizes PDF reading and linked extracts.
- Scheduling uses FSRS when introduced.

## What are the open questions?
- How small can the queue UI be while still feeling useful?

## What are the failure modes or edge cases?
- A phase ships without persistence, breaking the loop.
- The queue resurfaces items without clear context.

## What assumptions and invariants apply?
- Sources are PDFs in the MVP.
- Anchors remain stable across sessions.

## What related docs matter?
- Product vision: [`product-vision.md`](./product-vision.md)
- Storage plan: [`storage/README.md`](./storage/README.md)
- Editor docs: [`editor/README.md`](./editor/README.md)
- PDF docs: [`pdf/README.md`](./pdf/README.md)

## What this doc does not cover
- Detailed implementation tasks or sprint planning.
