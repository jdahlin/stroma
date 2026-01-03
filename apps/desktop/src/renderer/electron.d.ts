/**
 * API exposed to the renderer process via contextBridge.
 */
export interface StromaAPI {
  platform: NodeJS.Platform;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  onCommand: (callback: (id: string) => void) => () => void;
}

declare global {
  interface Window {
    stroma?: StromaAPI;
  }
}
