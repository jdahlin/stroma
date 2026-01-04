# Migrations

## Status

Planned.

## Goals

- repeatable schema creation
- versioned migrations
- safe upgrades
- no renderer DB access (main process owns the DB)

## Approach

- Keep migrations in the Electron main process package (`apps/desktop/src/main/...`) so they can run at app startup.
- Use a schema version table (or `PRAGMA user_version`) to track applied migrations.

Two common patterns:

### Option A: `PRAGMA user_version`

- Store an integer schema version directly in SQLite.
- On startup, read `PRAGMA user_version`, apply migrations until up to date.

Pros: simple and built-in.
Cons: doesn't record per-migration history.

### Option B: migrations table

```sql
CREATE TABLE IF NOT EXISTS migrations (
  id          TEXT PRIMARY KEY,
  applied_at  INTEGER NOT NULL
);
```

Pros: explicit history.
Cons: slightly more code.

## Foreign keys

Always enable foreign keys for each connection:

- `PRAGMA foreign_keys = ON;`

## Suggested migration granularity

- One migration per feature slice (core tables, pdf anchor tables, indexes).
- Keep migrations idempotent where possible (`IF NOT EXISTS` for indexes/tables).

## Dev workflow

- Resetting DB in development should be easy (delete the DB file).
- Provide a migration test that:
  - creates an empty DB
  - applies all migrations
  - validates that expected tables/indexes exist

