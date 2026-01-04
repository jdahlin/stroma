import type {
  Anchor,
  CreateAnchorInput,
  CreateNoteInput,
  CreatePdfTextAnchorInput,
  CreateReferenceAssetInput,
  CreateReferenceInput,
  Note,
  PdfTextAnchorFull,
  Reference,
  ReferenceAsset,
  ReferenceWithAsset,
  UpdateNoteInput,
  UpdateReferenceInput,
} from '@repo/core'

/**
 * Storage API exposed to the renderer process.
 */
export interface StorageAPI {
  // References
  reference: {
    create: (input: CreateReferenceInput) => Promise<Reference>
    get: (id: number) => Promise<Reference | null>
    getWithAsset: (id: number) => Promise<ReferenceWithAsset | null>
    list: () => Promise<Reference[]>
    listWithAssets: () => Promise<ReferenceWithAsset[]>
    update: (id: number, input: UpdateReferenceInput) => Promise<Reference | null>
    delete: (id: number) => Promise<boolean>
    createAsset: (input: CreateReferenceAssetInput) => Promise<ReferenceAsset>
    getAssets: (referenceId: number) => Promise<ReferenceAsset[]>
  }
  // Anchors
  anchor: {
    create: (input: CreateAnchorInput) => Promise<Anchor>
    createPdfText: (input: CreatePdfTextAnchorInput) => Promise<PdfTextAnchorFull>
    get: (id: number) => Promise<Anchor | null>
    getForReference: (referenceId: number) => Promise<Anchor[]>
    getPdfTextForReference: (referenceId: number) => Promise<PdfTextAnchorFull[]>
    getForPage: (referenceId: number, pageIndex: number) => Promise<PdfTextAnchorFull[]>
    delete: (id: number) => Promise<boolean>
  }
  // Notes
  note: {
    create: (input: CreateNoteInput) => Promise<Note>
    get: (id: number) => Promise<Note | null>
    getForReference: (referenceId: number) => Promise<Note[]>
    getForAnchor: (anchorId: number) => Promise<Note | null>
    update: (id: number, input: UpdateNoteInput) => Promise<Note | null>
    delete: (id: number) => Promise<boolean>
  }
  // Assets
  asset: {
    importPdf: (filePath: string, title?: string) => Promise<ReferenceWithAsset>
    importPdfFromBuffer: (data: ArrayBuffer, title: string) => Promise<ReferenceWithAsset>
    resolve: (uri: string) => Promise<string | null>
    getFilePath: (referenceId: number) => Promise<string | null>
  }
}

/**
 * API exposed to the renderer process via contextBridge.
 */
export interface StromaAPI {
  platform: NodeJS.Platform
  versions: {
    node: string
    chrome: string
    electron: string
  }
  appVersion: () => Promise<string>
  openPdfDialog: () => Promise<
    | {
      path: string
      name: string
      data: ArrayBuffer
    }
    | null
  >
  openPdfByPath: (path: string) => Promise<
    | {
      path: string
      name: string
      data: ArrayBuffer
    }
    | null
  >
  onCommand: (callback: (id: string) => void) => () => void
  setUiState: (state: {
    sidebars: { left: { open: boolean }, right: { open: boolean } }
    ribbonOpen: boolean
  }) => void
  storage: StorageAPI
}

declare global {
  interface Window {
    stroma?: StromaAPI
    versions: {
      node: () => string
      chrome: () => string
      electron: () => string
    }
  }
}
