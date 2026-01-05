import type { IpcRendererEvent } from 'electron'
import type { StorageAPI, StromaAPI } from './electron.d'
import { contextBridge, ipcRenderer } from 'electron'

const storage: StorageAPI = {
  reference: {
    create: input => ipcRenderer.invoke('storage:reference:create', input),
    get: id => ipcRenderer.invoke('storage:reference:get', id),
    getWithAsset: id => ipcRenderer.invoke('storage:reference:getWithAsset', id),
    list: () => ipcRenderer.invoke('storage:reference:list'),
    listWithAssets: () => ipcRenderer.invoke('storage:reference:listWithAssets'),
    update: (id, input) => ipcRenderer.invoke('storage:reference:update', id, input),
    delete: id => ipcRenderer.invoke('storage:reference:delete', id),
    createAsset: input => ipcRenderer.invoke('storage:reference:createAsset', input),
    getAssets: referenceId => ipcRenderer.invoke('storage:reference:getAssets', referenceId),
  },
  anchor: {
    create: input => ipcRenderer.invoke('storage:anchor:create', input),
    createPdfText: input => ipcRenderer.invoke('storage:anchor:createPdfText', input),
    get: id => ipcRenderer.invoke('storage:anchor:get', id),
    getForReference: referenceId => ipcRenderer.invoke('storage:anchor:getForReference', referenceId),
    getPdfTextForReference: referenceId => ipcRenderer.invoke('storage:anchor:getPdfTextForReference', referenceId),
    getForPage: (referenceId, pageIndex) => ipcRenderer.invoke('storage:anchor:getForPage', referenceId, pageIndex),
    delete: id => ipcRenderer.invoke('storage:anchor:delete', id),
  },
  note: {
    create: input => ipcRenderer.invoke('storage:note:create', input),
    get: id => ipcRenderer.invoke('storage:note:get', id),
    getForReference: referenceId => ipcRenderer.invoke('storage:note:getForReference', referenceId),
    getForAnchor: anchorId => ipcRenderer.invoke('storage:note:getForAnchor', anchorId),
    update: (id, input) => ipcRenderer.invoke('storage:note:update', id, input),
    delete: id => ipcRenderer.invoke('storage:note:delete', id),
  },
  asset: {
    importPdf: (filePath, title) => ipcRenderer.invoke('storage:asset:importPdf', filePath, title),
    importPdfFromBuffer: (data, title) => ipcRenderer.invoke('storage:asset:importPdfFromBuffer', data, title),
    resolve: uri => ipcRenderer.invoke('storage:asset:resolve', uri),
    getFilePath: referenceId => ipcRenderer.invoke('storage:asset:getFilePath', referenceId),
  },
}

const api: StromaAPI = {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  appVersion: () => ipcRenderer.invoke('app:get-version'),
  openPdfDialog: () => ipcRenderer.invoke('pdf:open-dialog'),
  openPdfByPath: (path: string) => ipcRenderer.invoke('pdf:open-path', path),
  onCommand: (callback: (id: string) => void) => {
    const subscription = (_event: IpcRendererEvent, id: string) => callback(id)
    ipcRenderer.on('execute-command', subscription)
    return () => {
      ipcRenderer.removeListener('execute-command', subscription)
    }
  },
  setUiState: (state: {
    sidebars: { left: { open: boolean }, right: { open: boolean } }
    ribbonOpen: boolean
  }) => {
    ipcRenderer.send('ui-state', state)
  },
  storage,
}

contextBridge.exposeInMainWorld('stroma', api)

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})
