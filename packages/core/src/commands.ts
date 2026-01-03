import type { Brand } from '@repo/shared';

export type CommandId = Brand<string, 'CommandId'>;

export function commandId(id: string): CommandId {
  return id as CommandId;
}

/** Mirrors DOM KeyboardEvent for platform independence */
export interface KeyboardEvent {
  key: string;
  code?: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export interface CommandDefinition {
  id: CommandId;
  label: string;
  shortcut?: KeyboardEvent;
  category?: string;
}

export type CommandHandler = () => void | Promise<void>;

function shortcutMatches(shortcut: KeyboardEvent, event: KeyboardEvent): boolean {
  const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
  const codeMatches = shortcut.code && event.code === shortcut.code;

  if (!keyMatches && !codeMatches) return false;

  const modPressed = event.metaKey || event.ctrlKey;
  const modRequired = shortcut.metaKey || shortcut.ctrlKey;

  if (modRequired && !modPressed) return false;
  if (!modRequired && modPressed) return false;
  if (shortcut.shiftKey !== event.shiftKey) return false;
  if (shortcut.altKey !== event.altKey) return false;

  return true;
}

export class CommandRegistry {
  private definitions = new Map<CommandId, CommandDefinition>();
  private handlers = new Map<CommandId, CommandHandler>();

  define(definition: CommandDefinition): void {
    this.definitions.set(definition.id, definition);
  }

  register(id: CommandId, handler: CommandHandler): () => void {
    this.handlers.set(id, handler);
    return () => this.handlers.delete(id);
  }

  async execute(id: CommandId): Promise<void> {
    const handler = this.handlers.get(id);
    if (handler) await handler();
  }

  isRegistered(id: CommandId): boolean {
    return this.handlers.has(id);
  }

  getDefinition(id: CommandId): CommandDefinition | undefined {
    return this.definitions.get(id);
  }

  getAllDefinitions(): CommandDefinition[] {
    return Array.from(this.definitions.values());
  }

  getAvailableCommands(): CommandDefinition[] {
    return this.getAllDefinitions().filter((def) => this.isRegistered(def.id));
  }

  async executeFromShortcut(event: KeyboardEvent): Promise<boolean> {
    for (const def of this.definitions.values()) {
      if (!def.shortcut) continue;
      if (shortcutMatches(def.shortcut, event)) {
        await this.execute(def.id);
        return true;
      }
    }
    return false;
  }
}

export const commandRegistry = new CommandRegistry();

export const COMMANDS = {
  toggleCommandPalette: commandId('app.toggleCommandPalette'),
  toggleTheme: commandId('app.toggleTheme'),
  toggleRibbon: commandId('ribbon.toggle'),
  toggleLeftSidebar: commandId('sidebar.toggleLeft'),
  toggleRightSidebar: commandId('sidebar.toggleRight'),
  openHome: commandId('pane.openHome'),
  openNotes: commandId('pane.openNotes'),
  openQueue: commandId('pane.openQueue'),
  openSearch: commandId('pane.openSearch'),
  splitRight: commandId('pane.splitRight'),
  splitDown: commandId('pane.splitDown'),
  newTab: commandId('tab.new'),
  closeTab: commandId('tab.close'),
} as const;

const key = (
  k: string,
  mods: { meta?: boolean; shift?: boolean; alt?: boolean; code?: string } = {}
): KeyboardEvent => ({
  key: k,
  code: mods.code,
  metaKey: mods.meta ?? false,
  ctrlKey: false,
  shiftKey: mods.shift ?? false,
  altKey: mods.alt ?? false,
});

commandRegistry.define({
  id: COMMANDS.toggleCommandPalette,
  label: 'Toggle Command Palette',
  shortcut: key('k', { meta: true }),
  category: 'App',
});
commandRegistry.define({ id: COMMANDS.toggleTheme, label: 'Toggle Theme', category: 'App' });
commandRegistry.define({ id: COMMANDS.toggleRibbon, label: 'Toggle Ribbon', category: 'View' });
commandRegistry.define({
  id: COMMANDS.toggleLeftSidebar,
  label: 'Toggle Left Sidebar',
  shortcut: key('\\', { meta: true }),
  category: 'Sidebar',
});
commandRegistry.define({
  id: COMMANDS.toggleRightSidebar,
  label: 'Toggle Right Sidebar',
  shortcut: key('\\', { meta: true, shift: true }),
  category: 'Sidebar',
});
commandRegistry.define({ id: COMMANDS.openHome, label: 'Open Home', category: 'Panes' });
commandRegistry.define({ id: COMMANDS.openNotes, label: 'Open Notes', category: 'Panes' });
commandRegistry.define({ id: COMMANDS.openQueue, label: 'Open Queue', category: 'Panes' });
commandRegistry.define({ id: COMMANDS.openSearch, label: 'Open Search', category: 'Panes' });
commandRegistry.define({ id: COMMANDS.splitRight, label: 'Split Right', category: 'Panes' });
commandRegistry.define({ id: COMMANDS.splitDown, label: 'Split Down', category: 'Panes' });
commandRegistry.define({
  id: COMMANDS.newTab,
  label: 'New Tab',
  shortcut: key('t', { meta: true }),
  category: 'Tabs',
});
commandRegistry.define({
  id: COMMANDS.closeTab,
  label: 'Close Tab',
  shortcut: key('w', { meta: true }),
  category: 'Tabs',
});
