/**
 * Storage utilities for persisting state.
 * Used by Zustand persist middleware.
 */

const STORAGE_VERSION = 1

interface PersistedState<T> {
  version: number
  data: T
}

/**
 * Persist data to localStorage with versioning.
 */
export function persistState<T>(key: string, data: T): void {
  const payload: PersistedState<T> = { version: STORAGE_VERSION, data }
  try {
    localStorage.setItem(key, JSON.stringify(payload))
  }
  catch (e) {
    console.error(`Failed to persist state for key "${key}":`, e)
  }
}

/**
 * Restore data from localStorage.
 * Returns null if the data doesn't exist or is from an incompatible version.
 */
export function restoreState<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw)
      return null

    const payload = JSON.parse(raw) as unknown as PersistedState<T>

    if (payload.version !== STORAGE_VERSION) {
      console.warn(
        `State version mismatch for "${key}": expected ${STORAGE_VERSION}, got ${payload.version}`,
      )
      // Could implement migrations here in the future
      return null
    }

    return payload.data
  }
  catch (e) {
    console.error(`Failed to restore state for key "${key}":`, e)
    return null
  }
}

/**
 * Clear persisted state for a key.
 */
export function clearPersistedState(key: string): void {
  localStorage.removeItem(key)
}
