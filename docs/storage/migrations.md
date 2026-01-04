---
title: "How should storage migrations work?"
status: planned
audience: [contributor, maintainer]
last_updated: 2026-01-04
---

# How should storage migrations work?
This document explains the migration strategy for the SQLite database.

## Who is this for?
- Contributors implementing migrations.
- Maintainers reviewing upgrade safety.

## What is the scope?
- In scope: migration patterns and safety rules.
- Out of scope: specific migration scripts.

## What is the mental model?
- Migrations are deterministic steps applied by the main process at startup.

## What are the key concepts?
| Concept | Definition | Example |
| --- | --- | --- |
| Schema version | The current DB version. | "PRAGMA user_version" |
| Migration table | History of applied changes. | "migrations(id, applied_at)" |
| Upgrade path | Ordered steps to latest schema. | "Apply v1 then v2." |

## What migration patterns are supported?
- Option A: `PRAGMA user_version` integer.
- Option B: `migrations` history table.

## What safety rules apply?
- Enable `PRAGMA foreign_keys = ON` for every connection.
- Use idempotent DDL when possible.
- One migration per feature slice.

## What is a concrete example?
```sql
CREATE TABLE IF NOT EXISTS migrations (
  id TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL
);
```

## What are the facts?
- The main process owns DB access.

## What decisions are recorded?
- Migrations run at app startup.

## What are the open questions?
- Which migration approach should be the default?

## What are the failure modes or edge cases?
- Skipping a migration corrupts version ordering.

## What assumptions and invariants apply?
- Development resets are allowed by deleting the DB file.

## What related docs matter?
- Schema proposal: [`schema-sqlite.md`](./schema-sqlite.md)
- Queries: [`queries.md`](./queries.md)

## What this doc does not cover
- The actual migration runner implementation.
