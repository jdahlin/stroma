import React, { useMemo, useState } from 'react'
import { useLayoutStore, useLibraryStore } from '../state'
import type { NoteNode, NoteType } from '../state/libraryStore'
import './SidebarLibrary.css'

const noteTypeOrder: Record<NoteType, number> = {
  topic: 0,
  subtopic: 1,
  extract: 2,
  item: 3,
}

export const SidebarLibrary: React.FC = () => {
  const { collection, notes } = useLibraryStore()
  const openNotesPane = useLayoutStore(state => state.openNotesPane)
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({})

  const childrenByParent = useMemo(() => {
    const map = new Map<string, NoteNode[]>()
    notes.forEach(note => {
      const key = note.parentId ?? 'root'
      const bucket = map.get(key)
      if (bucket) {
        bucket.push(note)
      } else {
        map.set(key, [note])
      }
    })
    map.forEach(bucket => {
      bucket.sort((a, b) => {
        const order = noteTypeOrder[a.type] - noteTypeOrder[b.type]
        if (order !== 0) return order
        return a.title.localeCompare(b.title)
      })
    })
    return map
  }, [notes])

  const rootNotes = childrenByParent.get('root') ?? []

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderNote = (note: NoteNode, depth: number) => {
    const children = childrenByParent.get(note.id) ?? []
    const hasChildren = children.length > 0
    const expanded = expandedNotes[note.id] ?? true
    const prefix = hasChildren ? (expanded ? 'v' : '>') : ' '

    return (
      <React.Fragment key={note.id}>
        <div
          className={`library-tree-row ${hasChildren ? 'is-branch' : 'is-leaf'}`}
          style={{ '--tree-depth': depth } as React.CSSProperties}
          onClick={() => {
            openNotesPane(note.id, note.title)
          }}
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openNotesPane(note.id, note.title)
            }
          }}
        >
          <span
            className="library-tree-prefix"
            role={hasChildren ? 'button' : undefined}
            tabIndex={hasChildren ? 0 : -1}
            onClick={event => {
              if (!hasChildren) return
              event.stopPropagation()
              toggleNote(note.id)
            }}
            onKeyDown={event => {
              if (!hasChildren) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                event.stopPropagation()
                toggleNote(note.id)
              }
            }}
            aria-label={hasChildren ? (expanded ? 'Collapse' : 'Expand') : undefined}
          >
            {prefix}
          </span>
          <span className="library-tree-title">{note.title}</span>
        </div>
        {hasChildren && expanded
          ? children.map(child => renderNote(child, depth + 1))
          : null}
      </React.Fragment>
    )
  }

  return (
    <div className="library-sidebar">
      <section className="library-section">
        <div className="library-section-header">
          <div className="library-section-title">Library</div>
          <div className="library-section-subtitle">{collection.name}</div>
        </div>
        <div className="library-tree">
          {rootNotes.length === 0
            ? <div className="library-empty">No notes yet.</div>
            : rootNotes.map(note => renderNote(note, 0))}
        </div>
        <div className="library-hint">Create new notes from the editor to grow the tree.</div>
      </section>
    </div>
  )
}
