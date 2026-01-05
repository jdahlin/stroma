/**
 * Database connection and initialization.
 */

import Database from 'better-sqlite3'
import { SCHEMA_V1, SCHEMA_V2, SCHEMA_VERSION } from './schema'

export type { Database } from 'better-sqlite3'

let db: Database.Database | null = null

/**
 * Get the database instance.
 * Throws if not initialized.
 */
export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}

/**
 * Initialize the database connection.
 * Creates the database file if it doesn't exist.
 * Runs migrations if needed.
 */
export function initDb(dbPath: string): Database.Database {
  if (db) {
    return db
  }

  db = new Database(dbPath)

  // Enable foreign keys
  db.pragma('foreign_keys = ON')

  // Run migrations
  runMigrations(db)

  return db
}

/**
 * Close the database connection.
 */
export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}

/**
 * Run database migrations.
 * Uses PRAGMA user_version to track schema version.
 */
function runMigrations(database: Database.Database): void {
  const currentVersion = database.pragma('user_version', { simple: true }) as number

  if (currentVersion < SCHEMA_VERSION) {
    // Run migrations in a transaction
    database.transaction(() => {
      // V1: Initial schema
      if (currentVersion < 1) {
        database.exec(SCHEMA_V1)
      }

      if (currentVersion < 2) {
        if (!hasColumn(database, 'notes', 'title')) {
          database.exec(SCHEMA_V2)
        }
      }

      // Update schema version
      database.pragma(`user_version = ${SCHEMA_VERSION}`)
    })()
  }
}

function hasColumn(database: Database.Database, table: string, column: string): boolean {
  const rows = database.pragma(`table_info(${table})`) as Array<{ name: string }>
  return rows.some(row => row.name === column)
}

/**
 * Get current timestamp as Unix epoch milliseconds.
 */
export function now(): number {
  return Date.now()
}
