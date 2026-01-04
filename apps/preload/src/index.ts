import type { IpcRendererEvent } from 'electron'
import type { StromaAPI } from './electron.d'
import { contextBridge, ipcRenderer } from 'electron'

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
}

contextBridge.exposeInMainWorld('stroma', api)

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
})
