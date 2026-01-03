import { Menu, app, shell, BrowserWindow, ipcMain, type MenuItemConstructorOptions } from 'electron';
import { COMMANDS } from '@repo/core';

type UiState = {
  sidebars: {
    left: { open: boolean };
    right: { open: boolean };
  };
  ribbonOpen: boolean;
};

function updateMenuState(state: UiState): void {
  const menu = Menu.getApplicationMenu();
  if (!menu) {
    return;
  }

  const leftItem = menu.getMenuItemById('sidebar-left');
  const rightItem = menu.getMenuItemById('sidebar-right');
  const ribbonItem = menu.getMenuItemById('ribbon-toggle');

  if (leftItem) {
    leftItem.checked = state.sidebars.left.open;
  }
  if (rightItem) {
    rightItem.checked = state.sidebars.right.open;
  }
  if (ribbonItem) {
    ribbonItem.checked = state.ribbonOpen;
  }
}

export function setupMenu(): void {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    // App menu (macOS only)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Tab',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.newTab);
          },
        },
        {
          label: 'Close Tab',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.closeTab);
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
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' as const },
              { role: 'delete' as const },
              { role: 'selectAll' as const },
            ]
          : [
              { role: 'delete' as const },
              { type: 'separator' as const },
              { role: 'selectAll' as const },
            ]),
      ],
    },

    // View menu
    {
      label: 'View',
      submenu: [
        {
          label: 'Split Right',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.splitRight);
          },
        },
        {
          label: 'Split Down',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.splitDown);
          },
        },
        { type: 'separator' },
        {
          label: 'Ribbon',
          id: 'ribbon-toggle',
          type: 'checkbox',
          checked: true,
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.toggleRibbon);
          },
        },
        {
          label: 'Left Sidebar',
          id: 'sidebar-left',
          type: 'checkbox',
          accelerator: 'CmdOrCtrl+\\',
          checked: true,
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.toggleLeftSidebar);
          },
        },
        {
          label: 'Right Sidebar',
          id: 'sidebar-right',
          type: 'checkbox',
          accelerator: 'CmdOrCtrl+Shift+\\',
          checked: true,
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (!window) {
              console.error('No focused window found');
              return;
            }
            window.webContents.send('execute-command', COMMANDS.toggleRightSidebar);
          },
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
      ],
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'togglefullscreen' },
        { type: 'separator' as const },
        { role: 'front' as const },
        { type: 'separator' as const },
        { role: 'window' as const },
      ],
    },

    // Help menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://github.com/your-repo/stroma');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  ipcMain.on('ui-state', (_event, state: UiState) => {
    updateMenuState(state);
  });
}
