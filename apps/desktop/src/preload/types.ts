/**
 * API exposed to the renderer process via contextBridge.
 * Keep this minimal and typed.
 */
export interface StromaAPI {
  platform: NodeJS.Platform;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  // Add IPC method types here as needed
  // send: (channel: string, data: unknown) => void;
  // invoke: (channel: string, data: unknown) => Promise<unknown>;
}

declare global {
  interface Window {
    stroma?: StromaAPI;
  }
}

export {};
