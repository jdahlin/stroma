/**
 * Asset storage - content-addressable file storage for PDFs and other binaries.
 */

import type { Buffer } from 'node:buffer'
import type { ReferenceWithAsset } from './types'

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

import { createReference, createReferenceAsset } from './repositories/references'

const ASSET_URI_PREFIX = 'app-asset://blobs/'

/**
 * Asset storage configuration.
 */
export interface AssetStorageConfig {
  /** Base directory for asset storage (e.g., app.getPath('userData')) */
  baseDir: string
}

let config: AssetStorageConfig | null = null

/**
 * Initialize asset storage with configuration.
 */
export function initAssetStorage(cfg: AssetStorageConfig): void {
  config = cfg
  ensureDirExists(getBlobsDir())
}

/**
 * Get the configured asset storage.
 */
function getConfig(): AssetStorageConfig {
  if (!config) {
    throw new Error('Asset storage not initialized. Call initAssetStorage() first.')
  }
  return config
}

/**
 * Get the blobs directory path.
 */
function getBlobsDir(): string {
  return join(getConfig().baseDir, 'assets', 'blobs')
}

/**
 * Compute SHA-256 hash of a buffer.
 */
export function computeHash(data: Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

/**
 * Compute SHA-256 hash of a file.
 */
export async function computeFileHash(filePath: string): Promise<string> {
  const data = await readFile(filePath)
  return computeHash(data)
}

/**
 * Get the storage path for a content hash.
 */
function getAssetPath(contentHash: string): string {
  // Use first 2 chars as subdirectory for sharding
  const subdir = contentHash.slice(0, 2)
  return join(getBlobsDir(), subdir, contentHash)
}

/**
 * Convert a content hash to an asset URI.
 */
export function hashToUri(contentHash: string): string {
  return `${ASSET_URI_PREFIX}${contentHash}`
}

/**
 * Extract content hash from an asset URI.
 */
export function uriToHash(uri: string): string | null {
  if (!uri.startsWith(ASSET_URI_PREFIX)) {
    return null
  }
  return uri.slice(ASSET_URI_PREFIX.length)
}

/**
 * Resolve an asset URI to a file path.
 */
export function resolveAssetUri(uri: string): string | null {
  const hash = uriToHash(uri)
  if (hash === null) {
    return null
  }
  const path = getAssetPath(hash)
  if (!existsSync(path)) {
    return null
  }
  return path
}

/**
 * Store a file in the asset storage.
 * Returns the content hash and byte size.
 */
export async function storeAsset(filePath: string): Promise<{ hash: string, size: number }> {
  const data = await readFile(filePath)
  const hash = computeHash(data)
  const size = data.length

  const destPath = getAssetPath(hash)

  // Skip if already exists (content-addressable)
  if (!existsSync(destPath)) {
    ensureDirExists(dirname(destPath))
    await writeFile(destPath, data)
  }

  return { hash, size }
}

/**
 * Store a buffer directly in asset storage.
 */
export async function storeAssetFromBuffer(data: Buffer): Promise<{ hash: string, size: number }> {
  const hash = computeHash(data)
  const size = data.length

  const destPath = getAssetPath(hash)

  if (!existsSync(destPath)) {
    ensureDirExists(dirname(destPath))
    await writeFile(destPath, data)
  }

  return { hash, size }
}

/**
 * Read an asset by its content hash.
 */
export async function readAsset(contentHash: string): Promise<Buffer | null> {
  const path = getAssetPath(contentHash)
  if (!existsSync(path)) {
    return null
  }
  return readFile(path)
}

/**
 * Check if an asset exists.
 */
export function assetExists(contentHash: string): boolean {
  return existsSync(getAssetPath(contentHash))
}

/**
 * Import a PDF file into the storage system.
 * Creates a reference, stores the file, and links them.
 */
export async function importPdf(filePath: string, title?: string): Promise<ReferenceWithAsset> {
  // Store the file
  const { hash, size } = await storeAsset(filePath)

  // Create reference
  const ref = createReference({
    type: 'pdf',
    title: title ?? basename(filePath, '.pdf'),
  })

  // Create asset link
  const asset = createReferenceAsset({
    referenceId: ref.id,
    kind: 'file',
    uri: hashToUri(hash),
    contentHash: hash,
    byteSize: size,
  })

  return {
    ...ref,
    asset,
  }
}

/**
 * Import a PDF from a buffer.
 */
export async function importPdfFromBuffer(
  data: Buffer,
  title: string,
): Promise<ReferenceWithAsset> {
  // Store the buffer
  const { hash, size } = await storeAssetFromBuffer(data)

  // Create reference
  const ref = createReference({
    type: 'pdf',
    title,
  })

  // Create asset link
  const asset = createReferenceAsset({
    referenceId: ref.id,
    kind: 'file',
    uri: hashToUri(hash),
    contentHash: hash,
    byteSize: size,
  })

  return {
    ...ref,
    asset,
  }
}

/**
 * Get the file path for a reference's asset.
 */
export function getAssetFilePath(reference: ReferenceWithAsset): string | null {
  if (!reference.asset) {
    return null
  }
  return resolveAssetUri(reference.asset.uri)
}

/**
 * Ensure a directory exists, creating it if necessary.
 */
function ensureDirExists(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}
