/**
 * Simple in-memory implementation of the Web Storage API.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value.toString())
  }
}

// Polyfill localStorage if it's missing or incomplete in the environment
if (typeof window !== 'undefined' && (typeof window.localStorage === 'undefined' || typeof window.localStorage.clear !== 'function')) {
  Object.defineProperty(window, 'localStorage', {
    value: new MemoryStorage(),
    writable: true,
  })
}