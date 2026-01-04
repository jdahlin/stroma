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
  openPdfDialog: () => Promise<
    | {
        path: string;
        name: string;
        data: ArrayBuffer;
      }
    | null
  >;
  openPdfByPath: (path: string) => Promise<
    | {
        path: string;
        name: string;
        data: ArrayBuffer;
      }
    | null
  >;
  onCommand: (callback: (id: string) => void) => () => void;
  setUiState: (state: {
    sidebars: { left: { open: boolean }; right: { open: boolean } };
    ribbonOpen: boolean;
  }) => void;
}

declare global {
  interface Window {
    stroma?: StromaAPI;
  }
}
