---
title: "What is the long-term product vision?"
status: planned
audience: [user, contributor, maintainer]
last_updated: 2026-01-04
---

# What is the long-term product vision?
This document explains Stroma's end-state product vision and the phased path to reach it.

## Who is this for?
- Contributors aligning work with the long-term vision.
- Maintainers prioritizing milestones.

## What is the scope?
- In scope: end-state capabilities, guiding principles, and phased steps.
- Out of scope: implementation details and near-term task lists.

## What is the mental model?
- Stroma is a knowledge workbench where sources, anchors, and extracts form a durable learning loop.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Source | A durable input like a PDF or web page. | "A PDF imported into the library." |
| Anchor | A stable pointer into a source. | "A highlight on page 12." |
| Extract | A note or question derived from an anchor. | "A short summary linked to a highlight." |
| Workspace | An IDE-like layout of panes. | "PDF pane + notes pane + queue pane." |
| Incremental reading | Read, extract, and review in a loop. | "Return to a source until it is exhausted." |
| Spaced review | Scheduled resurfacing of extracts. | "Again/Hard/Good/Easy rating cycle." |

## What are the guiding principles?
- Structure beats polish.
- Anchors over copied text.
- Queues over sessions.
- Keyboard over mouse.
- Longevity over novelty.

## What are the phased steps?
| Step | Goal | Example |
| --- | --- | --- |
| 1. Application shell | Stable desktop container. | "Dockable panes and persistent layouts." |
| 2. PDF workspace | Durable PDF reading and anchors. | "Create a highlight and reopen it later." |
| 3. Notes + extraction | Turn anchors into extracts. | "Create an extract linked to a highlight." |
| 4. Incremental reading | Prioritized reading and resurfacing. | "Return to a source via a queue." |
| 5. Review and retention | Scheduling and durable memory. | "Rate an extract and reschedule it." |

## What are the non-goals?
- Casual note-taking without sources.
- Cloud-first collaboration in early phases.
- Web-only constraints.
- Minimalist UI at the cost of control.

## What are the facts?
- Stroma is a desktop app focused on deep reading and long-term learning.

## What decisions are recorded?
- PDFs are first-class sources.
- Anchors must remain stable over time.

## What are the open questions?
- How much automation (if any) should assist extraction in early releases?

## What are the failure modes or edge cases?
- Anchors drift when rendering changes.
- Extracts lose their source context.

## What assumptions and invariants apply?
- Sources remain addressable over long time spans.
- The workspace must support multiple reading modes.

## What related docs matter?
- MVP roadmap: [`roadmap-mvp.md`](./roadmap-mvp.md)
- Incremental reading: [`incremental-reading.md`](./incremental-reading.md)
- Editor docs: [`editor/README.md`](./editor/README.md)
- PDF docs: [`pdf/README.md`](./pdf/README.md)
- Storage plan: [`storage/README.md`](./storage/README.md)

## What this doc does not cover
- Implementation details or project timelines.
