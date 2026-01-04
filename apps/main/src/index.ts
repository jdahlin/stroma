import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import process from 'node:process'
import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { setupMenu } from './menu'
import { closeStorage, initStorage, registerStorageHandlers } from './storage-ipc'
import { createMainWindow } from './windows'

app.commandLine.appendSwitch('remote-debugging-port', '9222')

void app.whenReady().then(async () => {
  // Initialize storage before creating window
  initStorage()
  registerStorageHandlers()

  ipcMain.handle('app:get-version', () => app.getVersion())
  ipcMain.handle('pdf:open-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const filePath = result.filePaths[0]
    if (filePath === undefined) {
      return null
    }

    const buffer = await readFile(filePath)
    const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

    return {
      path: filePath,
      name: basename(filePath),
      data,
    }
  })

  ipcMain.handle('pdf:open-path', async (_event, filePath: string) => {
    try {
      const buffer = await readFile(filePath)
      const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)

      return {
        path: filePath,
        name: basename(filePath),
        data,
      }
    }
    catch (error) {
      console.warn('Failed to reopen PDF:', filePath, error)
      return null
    }
  })

  setupMenu()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  closeStorage()
})
