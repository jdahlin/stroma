/**
 * Global type declarations for the renderer process.
 * Extends Window with the stroma API exposed from preload.
 */

export interface StromaAPI {
  platform: NodeJS.Platform;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

declare global {
  interface Window {
    stroma?: StromaAPI;
  }
}
