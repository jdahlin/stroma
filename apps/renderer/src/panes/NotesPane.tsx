import type { PdfAnchorId } from '@repo/core'
import type { DocumentContent } from '@repo/editor'
import type { IDockviewPanelProps } from 'dockview'
import { Editor } from '@repo/editor'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLibraryStore, usePdfStore } from '../state'
import { PaneMenu } from './PaneMenu'
import './Pane.css'

export const NotesPane: React.FC<IDockviewPanelProps> = ({ api, params }) => {
  const activePaneId = usePdfStore(state => state.activePaneId)
  const focusAnchor = usePdfStore(state => state.focusAnchor)
  const activePane = usePdfStore((state) => {
    const activeId = state.activePaneId
    if (activeId === null) {
      return null
    }
    return state.panes[activeId] ?? null
  })

  const referenceId = activePane?.referenceId ?? null
  const noteTargetId = params?.noteId as string | undefined
  const noteMode = Boolean(noteTargetId)
  const noteTitle = useLibraryStore(state => (
    noteTargetId ? state.notes.find(note => note.id === noteTargetId)?.title ?? null : null
  ))
  const noteContent = useLibraryStore(state => (
    noteTargetId ? state.noteContents[noteTargetId] : undefined
  ))
  const setNoteContent = useLibraryStore(state => state.setNoteContent)
  const addNote = useLibraryStore(state => state.addNote)
  const updateNote = useLibraryStore(state => state.updateNote)
  const [content, setContent] = useState<DocumentContent | undefined>(undefined)
  const [noteId, setNoteId] = useState<number | null>(null)
  const [editorKey, setEditorKey] = useState(`notes:${api.id}:empty`)
  const saveTimerRef = useRef<number | null>(null)
  const noteIdRef = useRef<number | null>(null)
  const referenceIdRef = useRef<number | null>(referenceId)
  const titleRef = useRef<string>('Notes')
  const paneRef = useRef<HTMLDivElement | null>(null)

  const handlePdfReferenceClick = useCallback(
    (anchorId: string) => {
      if (activePaneId === null) {
        console.warn('No active PDF pane to focus.', anchorId)
        return
      }

      focusAnchor(activePaneId, anchorId as PdfAnchorId)
    },
    [activePaneId, focusAnchor],
  )

  const parseContent = useCallback((raw: string): DocumentContent | undefined => {
    try {
      const parsed = JSON.parse(raw) as DocumentContent
      if (parsed !== null && typeof parsed === 'object') {
        return parsed
      }
    }
    catch (error) {
      console.warn('Failed to parse stored note content.', error)
    }
    return undefined
  }, [])

  const extractTitle = useCallback((doc?: DocumentContent): string | null => {
    if (!doc || !Array.isArray(doc.content) || doc.content.length === 0) {
      return null
    }

    const collectText = (node: DocumentContent): string => {
      if (node.type === 'text' && typeof node.text === 'string') {
        return node.text
      }
      if (!Array.isArray(node.content)) {
        return ''
      }
      return node.content.map(child => collectText(child)).join('')
    }

    const firstNode = doc.content[0]
    const text = firstNode ? collectText(firstNode) : ''
    const firstLine = text.split('\n').map(line => line.trim()).find(Boolean) ?? null
    return firstLine && firstLine.length > 0 ? firstLine : null
  }, [])

  const toExtractTitle = useCallback((raw: string): string => {
    const firstLine = raw.split('\n').map(line => line.trim()).find(Boolean) ?? ''
    if (firstLine.length > 0) {
      return firstLine.slice(0, 80)
    }
    return 'New extract'
  }, [])

  const toDocumentContent = useCallback((text: string): DocumentContent => {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text }],
        },
      ],
    }
  }, [])

  const setPaneTitle = useCallback((nextTitle: string | null) => {
    const title = nextTitle && nextTitle.trim().length > 0 ? nextTitle.trim() : 'Notes'
    if (titleRef.current === title) {
      return
    }
    titleRef.current = title
    api.setTitle(title)
  }, [api])

  useEffect(() => {
    noteIdRef.current = noteId
  }, [noteId])

  useEffect(() => {
    referenceIdRef.current = referenceId
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    if (referenceId === null) {
      setPaneTitle('Notes')
    }
  }, [referenceId, setPaneTitle])

  useEffect(() => {
    let cancelled = false

    const loadNote = async () => {
      if (noteMode && noteTargetId) {
        setContent(noteContent)
        setNoteId(null)
        setEditorKey(`note:${noteTargetId}`)
        setPaneTitle(noteTitle ?? 'Note')
        return
      }

      if (referenceId === null) {
        setContent(undefined)
        setNoteId(null)
        setEditorKey(`notes:${api.id}:empty`)
        setPaneTitle('Notes')
        return
      }

      const storage = window.stroma?.storage
      if (!storage?.note?.getForReference) {
        setContent(undefined)
        setNoteId(null)
        setEditorKey(`notes:${api.id}:${referenceId}:missing`)
        setPaneTitle('Notes')
        return
      }

      const notes = await storage.note.getForReference(referenceId)
      if (cancelled)
        return

      const note = notes.find(item => item.anchorId === null) ?? notes[0] ?? null
      setNoteId(note?.id ?? null)
      const parsedContent = note ? parseContent(note.content) : undefined
      setContent(parsedContent)
      setEditorKey(`notes:${api.id}:${referenceId}:${note?.id ?? 'new'}`)
      const derivedTitle = note?.title ?? extractTitle(parsedContent)
      setPaneTitle(derivedTitle)
    }

    void loadNote()

    return () => {
      cancelled = true
    }
  }, [api.id, extractTitle, noteContent, noteMode, noteTargetId, noteTitle, parseContent, referenceId, setPaneTitle])

  useEffect(() => {
    if (!noteMode || !noteTargetId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.metaKey || event.key.toLowerCase() !== 'x') {
        return
      }
      const activeElement = document.activeElement
      if (!paneRef.current || !activeElement || !paneRef.current.contains(activeElement)) {
        return
      }
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (!text) {
        return
      }

      event.preventDefault()
      const title = toExtractTitle(text)
      const extract = addNote({ title, type: 'extract', parentId: noteTargetId })
      setNoteContent(extract.id, toDocumentContent(text))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [addNote, noteMode, noteTargetId, setNoteContent, toDocumentContent, toExtractTitle])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [])

  const persistContent = useCallback(async (nextContent: DocumentContent, title: string | null) => {
    const storage = window.stroma?.storage
    const activeReferenceId = referenceIdRef.current
    if (activeReferenceId === null || !storage?.note) {
      return
    }

    const contentJson = JSON.stringify(nextContent)
    const existingId = noteIdRef.current

    if (existingId === null) {
      const created = await storage.note.create({
        referenceId: activeReferenceId,
        title,
        contentType: 'tiptap_json',
        content: contentJson,
      })

      if (referenceIdRef.current === activeReferenceId) {
        noteIdRef.current = created.id
        setNoteId(created.id)
      }
      return
    }

    await storage.note.update(existingId, { title, content: contentJson })
  }, [])

  const handleChange = useCallback((nextContent: DocumentContent) => {
    if (noteMode && noteTargetId) {
      const nextTitle = extractTitle(nextContent)
      setPaneTitle(nextTitle ?? noteTitle ?? 'Note')
      if (nextTitle && nextTitle !== noteTitle) {
        updateNote(noteTargetId, { title: nextTitle })
      }
      setNoteContent(noteTargetId, nextContent)
      return
    }

    if (referenceId === null) {
      return
    }

    const nextTitle = extractTitle(nextContent)
    setPaneTitle(nextTitle)

    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      void persistContent(nextContent, nextTitle)
    }, 300)
  }, [extractTitle, noteMode, noteTargetId, noteTitle, persistContent, referenceId, setNoteContent, setPaneTitle, updateNote])

  const documentId = useMemo(() => {
    if (noteMode && noteTargetId) {
      return `note:${noteTargetId}`
    }
    if (referenceId === null) {
      return `notes:${api.id}:empty`
    }
    return `notes:${api.id}:${referenceId}`
  }, [api.id, noteMode, noteTargetId, referenceId])

  return (
    <div className="pane pane-notes" ref={paneRef}>
      <PaneMenu />
      <Editor
        key={editorKey}
        documentId={documentId}
        content={content}
        onChange={handleChange}
        onPdfReferenceClick={handlePdfReferenceClick}
      />
    </div>
  )
}
