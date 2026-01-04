import type { StromaAPI } from '../renderer/electron.d'
import process from 'node:process'
import { contextBridge, ipcRenderer } from 'electron'

const api: StromaAPI = {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  openPdfDialog: () => ipcRenderer.invoke('pdf:open-dialog'),
  openPdfByPath: path => ipcRenderer.invoke('pdf:open-path', path),
  onCommand: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, id: string) => callback(id)
    ipcRenderer.on('execute-command', subscription)
    return () => {
      ipcRenderer.removeListener('execute-command', subscription)
    }
  },
  setUiState: (state) => {
    ipcRenderer.send('ui-state', state)
  },
}

contextBridge.exposeInMainWorld('stroma', api)
