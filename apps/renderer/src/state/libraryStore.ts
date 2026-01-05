import type { DocumentContent } from '@repo/editor'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Id = string

export interface Collection {
  id: Id
  name: string
  description: string
}

export interface ImportSource {
  id: Id
  title: string
  path: string
  referenceId: number | null
  createdAt: Date
}

export type NoteType = 'topic' | 'subtopic' | 'extract' | 'item'

export interface NoteNode {
  id: Id
  title: string
  type: NoteType
  parentId: Id | null
  createdAt: Date
}

export type QueueTargetType = 'note' | 'import' | 'free'

export interface QueueEntry {
  id: Id
  title: string
  targetType: QueueTargetType
  targetNoteType: NoteType | null
  targetId: Id | null
  priority: number
  intervalDays: number
  nextDue: Date
  createdAt: Date
}

interface LibraryState {
  collection: Collection
  imports: ImportSource[]
  notes: NoteNode[]
  noteContents: Record<Id, DocumentContent | undefined>
  queue: QueueEntry[]
  setCollectionName: (name: string) => void
  setCollectionDescription: (description: string) => void
  addImport: (payload: Omit<ImportSource, 'id' | 'createdAt'>) => ImportSource
  updateImport: (id: Id, updates: Partial<Omit<ImportSource, 'id' | 'createdAt'>>) => void
  removeImport: (id: Id) => void
  addNote: (payload: { title: string, type: NoteType, parentId?: Id | null }) => NoteNode
  updateNote: (id: Id, updates: Partial<Pick<NoteNode, 'title' | 'type' | 'parentId'>>) => void
  removeNote: (id: Id) => void
  setNoteContent: (id: Id, content: DocumentContent | undefined) => void
  addQueueEntry: (payload: {
    title: string
    targetType?: QueueTargetType
    targetId?: Id | null
    targetNoteType?: NoteType | null
    priority?: number
    intervalDays?: number
  }) => QueueEntry
  updateQueueEntry: (id: Id, updates: Partial<Pick<QueueEntry, 'title' | 'priority' | 'intervalDays' | 'targetNoteType'>>) => void
  removeQueueEntry: (id: Id) => void
}

const createId = (): Id => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

const clampPriority = (value: number): number => {
  if (Number.isNaN(value)) return 1
  return Math.min(5, Math.max(1, Math.round(value)))
}

const clampInterval = (value: number): number => {
  if (Number.isNaN(value)) return 1
  return Math.max(1, Math.round(value))
}

const deriveNextDue = (intervalDays: number): Date => {
  const clamped = clampInterval(intervalDays)
  return new Date(Date.now() + clamped * 24 * 60 * 60 * 1000)
}

const hydrateDates = (state: Partial<LibraryState> | undefined): void => {
  if (!state)
    return

  if (state.imports) {
    state.imports = state.imports.map(entry => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
    }))
  }
  if (state.notes) {
    state.notes = state.notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
    }))
  }
  if (state.queue) {
    state.queue = state.queue.map(entry => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
      nextDue: new Date(typeof entry.nextDue === 'string' ? entry.nextDue : entry.nextDue),
    }))
  }
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      collection: {
        id: createId(),
        name: 'Stroma Collection',
        description: 'Single working collection for imported sources and extracts.',
      },
      imports: [],
      notes: [],
      noteContents: {},
      queue: [],
      setCollectionName: name => set(state => ({
        collection: { ...state.collection, name },
      })),
      setCollectionDescription: description => set(state => ({
        collection: { ...state.collection, description },
      })),
      addImport: payload => {
        const entry: ImportSource = {
          id: createId(),
          title: payload.title,
          path: payload.path,
          referenceId: payload.referenceId,
          createdAt: new Date(),
        }
        set(state => ({ imports: [entry, ...state.imports] }))
        return entry
      },
      updateImport: (id, updates) => {
        set(state => ({
          imports: state.imports.map(item => (item.id === id ? { ...item, ...updates } : item)),
        }))
      },
      removeImport: (id) => {
        set(state => ({
          imports: state.imports.filter(item => item.id !== id),
          queue: state.queue.filter(entry => !(entry.targetType === 'import' && entry.targetId === id)),
        }))
      },
      addNote: payload => {
        const entry: NoteNode = {
          id: createId(),
          title: payload.title,
          type: payload.type,
          parentId: payload.parentId ?? null,
          createdAt: new Date(),
        }
        set(state => ({ notes: [entry, ...state.notes] }))
        return entry
      },
      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(item => (item.id === id ? { ...item, ...updates } : item)),
        }))
      },
      removeNote: (id) => {
        set(state => {
          const idsToRemove = new Set<Id>()
          const stack = [id]
          while (stack.length) {
            const current = stack.pop()
            if (!current || idsToRemove.has(current)) continue
            idsToRemove.add(current)
            state.notes
              .filter(note => note.parentId === current)
              .forEach(note => stack.push(note.id))
          }

          const nextContents = { ...state.noteContents }
          idsToRemove.forEach(noteId => {
            delete nextContents[noteId]
          })
          return {
            notes: state.notes.filter(note => !idsToRemove.has(note.id)),
            noteContents: nextContents,
            queue: state.queue.filter(entry => !(
              entry.targetType === 'note' && entry.targetId && idsToRemove.has(entry.targetId)
            )),
          }
        })
      },
      addQueueEntry: payload => {
        const priority = clampPriority(payload.priority ?? 3)
        const intervalDays = clampInterval(payload.intervalDays ?? 7)
        const entry: QueueEntry = {
          id: createId(),
          title: payload.title,
          targetType: payload.targetType ?? 'free',
          targetNoteType: payload.targetNoteType ?? null,
          targetId: payload.targetId ?? null,
          priority,
          intervalDays,
          nextDue: deriveNextDue(intervalDays),
          createdAt: new Date(),
        }
        set(state => ({ queue: [entry, ...state.queue] }))
        return entry
      },
      updateQueueEntry: (id, updates) => {
        set(state => ({
          queue: state.queue.map(entry => {
            if (entry.id !== id) {
              return entry
            }
            const intervalDays = updates.intervalDays ?? entry.intervalDays
            return {
              ...entry,
              ...updates,
              priority: clampPriority(updates.priority ?? entry.priority),
              intervalDays: clampInterval(intervalDays),
              nextDue: updates.intervalDays !== undefined
                ? deriveNextDue(intervalDays)
                : entry.nextDue,
            }
          }),
        }))
      },
      removeQueueEntry: (id) => {
        set(state => ({
          queue: state.queue.filter(entry => entry.id !== id),
        }))
      },
      setNoteContent: (id, content) => {
        set(state => ({
          noteContents: {
            ...state.noteContents,
            [id]: content,
          },
        }))
      },
    }),
    {
      name: 'stroma-library',
      partialize: state => ({
        collection: state.collection,
        imports: state.imports,
        notes: state.notes,
        noteContents: state.noteContents,
        queue: state.queue,
      }),
      onRehydrateStorage: () => state => {
        hydrateDates(state)
      },
    },
  ),
)
