---
title: "Undo-Redo System Architecture"
status: draft
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# Undo-Redo System Architecture
This document outlines the design and architectural decisions for Stroma's undo-redo system, ensuring user confidence during deep knowledge work.

## Who is this for?
- Developers implementing new features that mutate application state.
- Maintainers ensuring consistency across different state domains (PDF, Editor, Extracts).

## What is the scope?
- In scope: state snapshots, memento pattern, coordinated transactions across multiple stores, and integration with SQLite.
- Out of scope: collaborative real-time editing (CRDTs), long-term version history (snapshots over weeks/months).

## What is the mental model?
The application state is a sequence of immutable transitions. The undo system allows "teleporting" the application back to a previous valid state. Every destructive or creative action should be wrapped in a **Command** that can be reverted.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Pure Logic | State transitions defined as pure functions `(state, payload) => newState`. | `computeAddTextAnchor(...)` |
| Snapshot | A deep-clone of a specific store's state at a point in time. | `JSON.parse(JSON.stringify(pdfState))` |
| Transaction | A coordinated set of changes across multiple stores that succeed or fail together. | Deleting an Extract (removes PDF anchor + Editor block). |
| Ephemeral Stack | An in-memory list of undo/redo actions that is cleared on app restart. | `const undoStack = []` |
| Write-Through | SQLite acts as the source of truth; any state change (including undo) syncs to the DB. | `useEffect(() => syncToSqlite(store), [store])` |

## Facts, Decisions, and Open Questions

### Facts
- The project has already refactored `pdfStore` logic into pure functions (`pdfStore.logic.ts`).
- Complex state exists across PDF highlights, Block Editor content, and the Reading Queue.

### Decisions
- **Decision: Ephemeral History.** The undo/redo stack will reside in memory. Persisting the entire undo history to SQLite adds significant complexity and risk of corruption if the environment changes between sessions.
- **Decision: Snapshot/Memento over Closures.** We will avoid returning `undo` functions from command handlers. Instead, we will capture the state "Memento" (the data required to revert) to keep the history stack transparent and inspectable.
- **Decision: Command-Driven Transitions.** Every state change intended to be undoable must go through the `CommandRegistry`. This ensures consistent capture of "before" states.
- **Decision: Coordinated Transactions.** For actions affecting multiple stores, a central `HistoryManager` will treat them as a single atomic unit in the undo stack.

### Questions
- Should we use **Immer.js** to generate JSON Patches instead of full snapshots to save memory as the state grows?
- How do we gracefully suppress the internal undo-redo system of third-party libraries (like Editor.js)?

## Failure Modes and Edge Cases
- **Stale State:** An undo action might try to restore an ID that has been fundamentally changed or deleted in a way that breaks foreign key constraints in SQLite.
- **Side Effect Leakage:** An undo action reverts the state but fails to trigger the corresponding delete/insert in SQLite, leading to a de-sync between memory and disk.
- **Editor Focus:** Performing an undo should ideally restore the user's focus (e.g., cursor position or selected pane) to where it was during that state.

## Assumptions and Invariants
- **Assumption:** Memory is cheap enough to hold ~100 snapshots of the JSON-based application state.
- **Invariant:** A state reached via "Undo" must be functionally identical to the state that existed before the original action was taken.
- **Invariant:** The SQLite database must always reflect the *current* state of the Zustand stores.

## What related docs matter?
- Project Goals: [`GOALS.md`](./GOALS.md)
- Block Editor Evaluation: [`block-editor.md`](./block-editor.md)
- Monorepo Structure: [`MONOREPO.md`](./MONOREPO.md)

## What this doc does not cover
- The specific schema design for SQLite.
- The UI implementation of the "Undo" button or history panel.
