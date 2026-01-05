import type { MenuItemConstructorOptions } from 'electron'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { COMMANDS } from '@repo/core'
import { app, BrowserWindow, dialog, ipcMain, Menu, shell } from 'electron'

interface UiState {
  sidebars: {
    left: { open: boolean }
    right: { open: boolean }
  }
  ribbonOpen: boolean
}

function updateMenuState(state: UiState): void {
  const menu = Menu.getApplicationMenu()
  if (!menu) {
    return
  }

  const leftItem = menu.getMenuItemById('sidebar-left')
  const rightItem = menu.getMenuItemById('sidebar-right')
  const ribbonItem = menu.getMenuItemById('ribbon-toggle')

  if (leftItem) {
    leftItem.checked = state.sidebars.left.open
  }
  if (rightItem) {
    rightItem.checked = state.sidebars.right.open
  }
  if (ribbonItem) {
    ribbonItem.checked = state.ribbonOpen
  }
}

interface AppMetadata {
  name: string
  version: string
  releaseDate: string | null
}

function getAppMetadata(): AppMetadata {
  const fallback: AppMetadata = {
    name: app.name,
    version: app.getVersion(),
    releaseDate: null,
  }

  try {
    const packageJsonPath = join(app.getAppPath(), 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      name?: string
      productName?: string
      version?: string
      releaseDate?: string
    }

    return {
      name: packageJson.productName ?? packageJson.name ?? fallback.name,
      version: packageJson.version ?? fallback.version,
      releaseDate: packageJson.releaseDate ?? null,
    }
  }
  catch (error) {
    console.warn('Failed to read app metadata:', error)
    return fallback
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function showAboutDialog(): void {
  const { name, version, releaseDate } = getAppMetadata()
  const releaseLabel = releaseDate ?? 'unreleased'

  void dialog.showMessageBox({
    type: 'info',
    // Capitalize name
    title: `About ${capitalize(name)}`,
    message: capitalize(name),
    detail: `Version: ${version}\nRelease date: ${releaseLabel}`,
    buttons: ['OK'],
  })
}

export function setupMenu(): void {
  const isMac = process.platform === 'darwin'
  const zoomStep = 0.5

  const withFocusedWindow = (action: (window: BrowserWindow) => void): void => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) {
      console.error('No focused window found')
      return
    }
    action(window)
  }

  const withFocusedWebContents = (action: (window: BrowserWindow) => void): void => {
    withFocusedWindow(action)
  }

  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                label: `About ${app.name}`,
                click: () => {
                  showAboutDialog()
                },
              },
              { type: 'separator' as const },
              {
                label: `Quit ${app.name}`,
                accelerator: 'Cmd+Q',
                click: () => {
                  app.quit()
                },
              },
            ],
          },
        ]
      : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const window = BrowserWindow.getFocusedWindow()
            if (!window) {
              console.error('No focused window found')
              return
            }
            window.webContents.send('execute-command', COMMANDS.newNote)
          },
        },
        { type: 'separator' },
        {
          label: 'New Tab',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            const window = BrowserWindow.getFocusedWindow()
            if (!window) {
              console.error('No focused window found')
              return
            }
            window.webContents.send('execute-command', COMMANDS.newTab)
          },
        },
        {
          label: 'Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            const window = BrowserWindow.getFocusedWindow()
            if (!window) {
              console.error('No focused window found')
              return
            }
            window.webContents.send('execute-command', COMMANDS.closeTab)
          },
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => withFocusedWebContents(window => window.webContents.undo()),
        },
        {
          label: 'Redo',
          accelerator: isMac ? 'Shift+Command+Z' : 'Ctrl+Y',
          click: () => withFocusedWebContents(window => window.webContents.redo()),
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          click: () => withFocusedWebContents(window => window.webContents.cut()),
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          click: () => withFocusedWebContents(window => window.webContents.copy()),
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          click: () => withFocusedWebContents(window => window.webContents.paste()),
        },
        ...(isMac
          ? [
              {
                label: 'Paste and Match Style',
                accelerator: 'Shift+Command+V',
                click: () => withFocusedWebContents(window => window.webContents.pasteAndMatchStyle()),
              },
              {
                label: 'Delete',
                accelerator: 'Backspace',
                click: () => withFocusedWebContents(window => window.webContents.delete()),
              },
              {
                label: 'Select All',
                accelerator: 'Cmd+A',
                click: () => withFocusedWebContents(window => window.webContents.selectAll()),
              },
            ]
          : [
              {
                label: 'Delete',
                accelerator: 'Delete',
                click: () => withFocusedWebContents(window => window.webContents.delete()),
              },
              { type: 'separator' as const },
              {
                label: 'Select All',
                accelerator: 'Ctrl+A',
                click: () => withFocusedWebContents(window => window.webContents.selectAll()),
              },
            ]),
      ],
    },

    // Import menu
    {
      label: 'Import',
      submenu: [
        {
          label: 'PDF',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const window = BrowserWindow.getFocusedWindow()
            if (!window) {
              console.error('No focused window found')
              return
            }
            window.webContents.send('execute-command', COMMANDS.openPdf)
          },
        },
        // TODO: Website
        // TODO: Text file
        // TODO: Youtube video
        // TODO: Anki deck
      ],
    },

    // View menu
    {
      label: 'View',
      submenu: [
        // TODO Reading Mode
        // TODO Source Mode
        { type: 'separator' },
        {
          label: 'Left Sidebar',
          id: 'sidebar-left',
          type: 'checkbox',
          accelerator: 'CmdOrCtrl+\\',
          checked: true,
          click: () => {
            withFocusedWindow(window => window.webContents.send('execute-command', COMMANDS.toggleLeftSidebar))
          },
        },
        {
          label: 'Right Sidebar',
          id: 'sidebar-right',
          type: 'checkbox',
          accelerator: 'CmdOrCtrl+Shift+\\',
          checked: true,
          click: () => {
            withFocusedWindow(window => window.webContents.send('execute-command', COMMANDS.toggleRightSidebar))
          },
        },
        { type: 'separator' },
        {
          label: 'Ribbon',
          id: 'ribbon-toggle',
          type: 'checkbox',
          checked: true,
          click: () => {
            withFocusedWindow(window => window.webContents.send('execute-command', COMMANDS.toggleRibbon))
          },
        },
        { type: 'separator' },
        {
          label: 'Split Right',
          click: () => {
            withFocusedWindow(window => window.webContents.send('execute-command', COMMANDS.splitRight))
          },
        },
        {
          label: 'Split Down',
          click: () => {
            withFocusedWindow(window => window.webContents.send('execute-command', COMMANDS.splitDown))
          },
        },
        // TODO: separator when implementing the next items
        // TODO: Navigate Back
        // TODO: Navigate Forward
        { type: 'separator' },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => withFocusedWebContents(window => window.webContents.setZoomLevel(0)),
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          click: () => withFocusedWebContents(window => {
            const next = window.webContents.getZoomLevel() + zoomStep
            window.webContents.setZoomLevel(next)
          }),
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => withFocusedWebContents(window => {
            const next = window.webContents.getZoomLevel() - zoomStep
            window.webContents.setZoomLevel(next)
          }),
        },
        { type: 'separator' },
        { label: 'Force Reload', role: 'forceReload'},
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => {
            const window = BrowserWindow.getFocusedWindow()
            if (!window) {
              console.error('No focused window found')
              return
            }
            window.webContents.toggleDevTools()
          },
        },
        { type: 'separator' },
      ],
    },

    // Window menu
    {
      label: 'Window',
      role: 'windowMenu',
    },

    // Help menu
    {
      label: 'Help',
      submenu: [
        {
          label: `About ${app.name}`,
          click: () => {
            showAboutDialog()
          },
        },
        { type: 'separator' as const },
        {
          label: 'Learn More',
          click: () => {
            void shell.openExternal('https://github.com/your-repo/stroma')
          },
        },
      ],
    },

  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  ipcMain.on('ui-state', (_event, state: UiState) => {
    updateMenuState(state)
  })
}
