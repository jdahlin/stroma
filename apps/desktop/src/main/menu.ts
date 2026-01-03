import { Menu, app, shell, BrowserWindow, ipcMain, type MenuItemConstructorOptions } from 'electron';
import { COMMANDS } from '@repo/core';

type SidebarState = {
  left: { open: boolean };
  right: { open: boolean };
};

function updateSidebarMenuState(state: SidebarState): void {
  const menu = Menu.getApplicationMenu();
  if (!menu) {
    return;
  }

  const leftItem = menu.getMenuItemById('sidebar-left');
  const rightItem = menu.getMenuItemById('sidebar-right');

  if (leftItem) {
    leftItem.checked = state.left.open;
  }
  if (rightItem) {
    rightItem.checked = state.right.open;
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
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
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
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' as const },
              { role: 'front' as const },
              { type: 'separator' as const },
              { role: 'window' as const },
            ]
          : [{ role: 'close' as const }]),
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

  ipcMain.on('sidebar-state', (_event, state: SidebarState) => {
    updateSidebarMenuState(state);
  });
}
