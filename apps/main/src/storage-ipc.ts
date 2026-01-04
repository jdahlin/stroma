/**
 * Storage IPC handlers for the renderer.
 * Thin wrapper around @repo/storage that exposes operations via IPC.
 */

<<<<<<< HEAD:apps/main/src/storage-ipc.ts
import type {
  CreateAnchorInput,
  CreateNoteInput,
  CreatePdfTextAnchorInput,
  CreateReferenceAssetInput,
  CreateReferenceInput,
  UpdateNoteInput,
  UpdateReferenceInput,
} from '@repo/core'

import { Buffer } from 'node:buffer'
import { join } from 'node:path'
import { app, ipcMain } from 'electron'
import {
  closeDb,
  createAnchor,
  createNote,
  createPdfTextAnchor,
  createReference,
  createReferenceAsset,
  deleteAnchor,
  deleteNote,
  deleteReference,
  getAnchor,
  getAnchorsForPage,
  getAnchorsForReference,
  getAssetFilePath,
  getAssetsForReference,
  getNote,
  getNoteForAnchor,
  getNotesForReference,
  getPdfTextAnchorsForReference,
  getReference,
  getReferenceWithAsset,
  importPdf,
  importPdfFromBuffer,
  initAssetStorage,
  initDb,
  listReferences,
  listReferencesWithAssets,
  resolveAssetUri,
  updateNote,
  updateReference,
} from '@repo/storage'

/**
 * Initialize storage in the main process.
 * Should be called during app startup before the window is created.
 */
export function initStorage(): void {
  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'stroma.db')

  // Initialize database
  initDb(dbPath)

  // Initialize asset storage
  initAssetStorage({ baseDir: userDataPath })
}

/**
 * Close storage connections.
 * Should be called during app shutdown.
 */
export function closeStorage(): void {
  closeDb()
}

/**
 * Register all storage IPC handlers.
 */
export function registerStorageHandlers(): void {
  // ============================================================================
  // Reference handlers
  // ============================================================================

  ipcMain.handle('storage:reference:create', (_event, input: CreateReferenceInput) => {
    return createReference(input)
  })

  ipcMain.handle('storage:reference:get', (_event, id: number) => {
    return getReference(id)
  })

  ipcMain.handle('storage:reference:getWithAsset', (_event, id: number) => {
    return getReferenceWithAsset(id)
  })

  ipcMain.handle('storage:reference:list', () => {
    return listReferences()
  })

  ipcMain.handle('storage:reference:listWithAssets', () => {
    return listReferencesWithAssets()
  })

  ipcMain.handle('storage:reference:update', (_event, id: number, input: UpdateReferenceInput) => {
    return updateReference(id, input)
  })

  ipcMain.handle('storage:reference:delete', (_event, id: number) => {
    return deleteReference(id)
  })

  ipcMain.handle('storage:reference:createAsset', (_event, input: CreateReferenceAssetInput) => {
    return createReferenceAsset(input)
  })

  ipcMain.handle('storage:reference:getAssets', (_event, referenceId: number) => {
    return getAssetsForReference(referenceId)
  })

  // ============================================================================
  // Anchor handlers
  // ============================================================================

  ipcMain.handle('storage:anchor:create', (_event, input: CreateAnchorInput) => {
    return createAnchor(input)
  })

  ipcMain.handle('storage:anchor:createPdfText', (_event, input: CreatePdfTextAnchorInput) => {
    return createPdfTextAnchor(input)
  })

  ipcMain.handle('storage:anchor:get', (_event, id: number) => {
    return getAnchor(id)
  })

  ipcMain.handle('storage:anchor:getForReference', (_event, referenceId: number) => {
    return getAnchorsForReference(referenceId)
  })

  ipcMain.handle('storage:anchor:getPdfTextForReference', (_event, referenceId: number) => {
    return getPdfTextAnchorsForReference(referenceId)
  })

  ipcMain.handle('storage:anchor:getForPage', (_event, referenceId: number, pageIndex: number) => {
    return getAnchorsForPage(referenceId, pageIndex)
  })

  ipcMain.handle('storage:anchor:delete', (_event, id: number) => {
    return deleteAnchor(id)
  })

  // ============================================================================
  // Note handlers
  // ============================================================================

  ipcMain.handle('storage:note:create', (_event, input: CreateNoteInput) => {
    return createNote(input)
  })

  ipcMain.handle('storage:note:get', (_event, id: number) => {
    return getNote(id)
  })

  ipcMain.handle('storage:note:getForReference', (_event, referenceId: number) => {
    return getNotesForReference(referenceId)
  })

  ipcMain.handle('storage:note:getForAnchor', (_event, anchorId: number) => {
    return getNoteForAnchor(anchorId)
  })

  ipcMain.handle('storage:note:update', (_event, id: number, input: UpdateNoteInput) => {
    return updateNote(id, input)
  })

  ipcMain.handle('storage:note:delete', (_event, id: number) => {
    return deleteNote(id)
  })

  // ============================================================================
  // Asset handlers
  // ============================================================================

  ipcMain.handle('storage:asset:importPdf', async (_event, filePath: string, title?: string) => {
    return importPdf(filePath, title)
  })

  ipcMain.handle('storage:asset:importPdfFromBuffer', async (_event, data: ArrayBuffer, title: string) => {
    return importPdfFromBuffer(Buffer.from(data), title)
  })

  ipcMain.handle('storage:asset:resolve', (_event, uri: string) => {
    return resolveAssetUri(uri)
  })

  ipcMain.handle('storage:asset:getFilePath', (_event, referenceId: number) => {
    const ref = getReferenceWithAsset(referenceId)
    if (!ref) {
      return null
    }
    return getAssetFilePath(ref)
  })
}
