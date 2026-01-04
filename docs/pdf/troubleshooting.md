---
title: "How do I troubleshoot PDF renderer issues?"
status: implemented
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How do I troubleshoot PDF renderer issues?
This document explains common PDF renderer failures and how to diagnose them.

## Who is this for?
- Contributors debugging PDF rendering issues.
- Maintainers triaging regressions.

## What is the scope?
- In scope: worker, text layer, and zoom issues.
- Out of scope: general app troubleshooting.

## What is the mental model?
- Most issues come from worker setup, layer alignment, or render scheduling.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Worker | Background renderer used by pdf.js. | "Worker URL not loading." |
| Text layer | DOM layer for selection. | "Selection boxes drift." |
| Render scheduling | Timing for page renders. | "Zoom flicker on scroll." |

## What are the common issues and checks?
| Issue | Likely cause | Example check |
| --- | --- | --- |
| Worker not loading | Worker URL misconfigured. | "Is `workerSrc` set?" |
| Text misalignment | Mismatched scale or viewport. | "Is the same viewport used?" |
| Zoom flicker | Too many scale changes. | "Are render tasks cancelled?" |

## What are the facts?
- Worker failures produce blank pages and console warnings.

## What decisions are recorded?
- Troubleshooting focuses on worker setup and layer alignment first.

## What are the open questions?
- None.

## What are the failure modes or edge cases?
- Selection overlays drift when text layer dimensions are stale.

## What assumptions and invariants apply?
- The renderer uses pdf.js with a worker file.

## What related docs matter?
- Renderer architecture: [`renderer-architecture.md`](./renderer-architecture.md)
- Performance plan: [`performance-plan.md`](./performance-plan.md)

## What this doc does not cover
- Deep performance analysis or profiling techniques.
