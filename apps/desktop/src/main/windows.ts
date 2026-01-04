import { join } from 'node:path'
import process from 'node:process'
import { BrowserWindow } from 'electron'

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
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
  if (process.env.VITE_DEV_SERVER_URL !== undefined) {
    void win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  }
  else {
    void win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}
