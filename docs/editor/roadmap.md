---
title: "What is the editor roadmap?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# What is the editor roadmap?
This document explains the planned phases for editor development.

## Who is this for?
- Contributors planning editor work.
- Maintainers sequencing milestones.

## What is the scope?
- In scope: phase ordering and testing strategy.
- Out of scope: detailed task lists.

## What is the mental model?
- The editor roadmap builds from foundation to features to integration.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Phase | A shippable milestone. | "Core editor features before extensions." |
| Harness | Standalone app for testing. | "apps/editor-dev" |
| Extension | Incremental feature addition. | "PDF reference node." |

## What are the phases?
1. Package foundation (`packages/editor`).
2. Standalone dev harness (`apps/editor-dev`).
3. Core editor features (toolbar, links, placeholder, images).
4. Slash commands.
5. Structure extensions (sections).
6. PDF reference extension.
7. Persistence and desktop integration.

## What is the testing strategy?
- Unit tests for extension commands and serialization.
- Manual testing in the dev harness for UX behavior.

## What are the facts?
- The roadmap is directional and may change as the editor evolves.

## What decisions are recorded?
- The dev harness is required early to de-risk UI work.

## What are the open questions?
- Which extensions should be part of the initial foundation phase?

## What are the failure modes or edge cases?
- Shipping extensions before the harness makes regressions harder to spot.

## What assumptions and invariants apply?
- Editor features must remain compatible with the desktop renderer.

## What related docs matter?
- MVP roadmap: [`../roadmap-mvp.md`](../roadmap-mvp.md)
- Editor architecture: [`architecture.md`](./architecture.md)

## What this doc does not cover
- Detailed implementation tasks or timelines.
