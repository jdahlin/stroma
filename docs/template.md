---
title: "What is this document?"
status: draft
audience: [user, contributor, maintainer]
last_updated: 2026-01-04
---

# What is this document?
This document explains what belongs in a Stroma doc and how to structure it.

## Who is this for?
- Contributors writing or revising docs.
- Maintainers reviewing doc quality.

## What is the scope?
- In scope: the canonical structure, required sections, and metadata.
- Out of scope: product requirements, implementation details, or timelines.

## What is the mental model?
- Think of each doc as a contract: it declares purpose, audience, scope, and limits before details.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Purpose sentence | The first sentence stating why the doc exists. | "This document explains how releases work." |
| Audience | The primary reader roles. | "Audience: contributor." |
| Scope | The intended coverage and explicit non-goals. | "Out of scope: cloud sync." |
| Facts/Decisions/Questions | Separate current reality from choices and unknowns. | "Decision: use SQLite." |

## What are the required sections?
- Purpose sentence under the title.
- Audience, scope, and non-goals.
- Mental model and key concepts.
- Facts, decisions, and open questions.
- Failure modes and edge cases.
- Assumptions and invariants.
- Related docs and end section.

## What are the failure modes or edge cases?
- A doc mixes facts and decisions, making it hard to trust.
- A doc references files before defining the concept.

## What assumptions and invariants apply?
- Readers have no context beyond linked docs.
- Terminology is consistent across all Stroma docs.

## What related docs matter?
- Docs index: [`README.md`](./README.md)

## What this doc does not cover
- The content of any specific feature doc.
