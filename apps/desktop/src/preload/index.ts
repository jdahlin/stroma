import { contextBridge, ipcRenderer } from 'electron';
import type { StromaAPI } from '../renderer/electron.d';

const api: StromaAPI = {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  onCommand: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, id: string) => callback(id);
    ipcRenderer.on('execute-command', subscription);
    return () => {
      ipcRenderer.removeListener('execute-command', subscription);
    };
  },
  setSidebarState: (state) => {
    ipcRenderer.send('sidebar-state', state);
  },
};

contextBridge.exposeInMainWorld('stroma', api);
