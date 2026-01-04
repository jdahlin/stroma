import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { createMainWindow } from './windows';
import { setupMenu } from './menu';

app.commandLine.appendSwitch('remote-debugging-port', '9222');

app.whenReady().then(() => {
  ipcMain.handle('pdf:open-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0]!;
    const buffer = await readFile(filePath);
    const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    return {
      path: filePath,
      name: basename(filePath),
      data,
    };
  });

  ipcMain.handle('pdf:open-path', async (_event, filePath: string) => {
    try {
      const buffer = await readFile(filePath);
      const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

      return {
        path: filePath,
        name: basename(filePath),
        data,
      };
    } catch (error) {
      console.warn('Failed to reopen PDF:', filePath, error);
      return null;
    }
  });

  setupMenu();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
