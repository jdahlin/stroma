import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow } from 'electron'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
  })

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win.show()
  })

  // Load from Vite dev server or built files
  const devServerUrl = process.env.ELECTRON_RENDERER_URL ?? process.env.VITE_DEV_SERVER_URL
  if (devServerUrl !== undefined) {
    void win.loadURL(devServerUrl)
    win.webContents.openDevTools()
  }
  else {
    void win.loadFile(join(__dirname, '../../renderer/dist/index.html'))
  }

  return win
}
