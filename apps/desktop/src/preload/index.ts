import { contextBridge } from 'electron';
import type { StromaAPI } from './types';

const api: StromaAPI = {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  // Add IPC methods here as needed
  // Example:
  // send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  // invoke: (channel: string, data: unknown) => ipcRenderer.invoke(channel, data),
};

contextBridge.exposeInMainWorld('stroma', api);
