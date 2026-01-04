---
title: "How will PDF rendering performance improve?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How will PDF rendering performance improve?
This document explains the planned steps to reduce PDF rendering flicker and zoom jank.

## Who is this for?
- Contributors working on renderer performance.
- Maintainers planning optimization work.

## What is the scope?
- In scope: phased performance plan and risks.
- Out of scope: non-PDF performance work.

## What is the mental model?
- Treat rendering as a pipeline: schedule, render, and update only visible pages.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Virtualization | Render only visible pages. | "Only pages in view are on canvas." |
| Render queue | Prioritize visible work. | "Visible pages render first." |
| Zoom stabilization | Avoid re-render on every tick. | "Debounce scale changes." |

## What are the goals?
- Reduce flicker during pinch-zoom and resize.
- Minimize unnecessary renders and layout thrash.
- Preserve current UX and anchor behavior.

## What are the non-goals?
- Replacing Dockview or the state store.
- Building a full pdf.js web viewer.

## What are the phases?
| Phase | Goal | Example |
| --- | --- | --- |
| 0. Baseline audit | Profile pinch-zoom behavior. | "Capture a profile during resize." |
| 1. Stabilize zoom/scroll | Debounce scale updates. | "Cancel stale render tasks." |
| 2. Virtualize pages | Render visible pages only. | "Keep placeholders for offscreen pages." |
| 3. Refine pipeline | Prioritized render queue. | "Limit concurrent renders." |
| 4. Text layer stability | Align text and canvas. | "Delay text layer until canvas is ready." |
| 5. Integrate cleanup | Swap viewer internals. | "Remove unused React per-page code." |
| 6. Verify performance | Manual and automated checks. | "Scroll a large PDF smoothly." |

## What are the risks?
- Zoom flicker if render cancellation is unreliable.
- Scroll drift if scale changes are not reconciled.
- Selection misalignment if text layer scale diverges.

## What are the facts?
- The current renderer uses pdf.js with canvas + text layers.

## What decisions are recorded?
- Prefer an imperative renderer for virtualized pages.

## What are the open questions?
- How aggressive should page caching be without memory pressure?

## What are the failure modes or edge cases?
- A focused anchor page is offscreen and never rendered.

## What assumptions and invariants apply?
- The PDF pane and toolbar UX remain unchanged.

## What related docs matter?
- Renderer architecture: [`renderer-architecture.md`](./renderer-architecture.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)

## What this doc does not cover
- Specific implementation tasks or profiling data.
