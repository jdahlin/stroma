import type { Brand } from '@shared';

/**
 * Command identifier type.
 */
export type CommandId = Brand<string, 'CommandId'>;

/**
 * Command definition for the command palette.
 */
export interface Command {
  id: CommandId;
  label: string;
  /** Optional keyboard shortcut (e.g., "Cmd+K", "Ctrl+Shift+P") */
  shortcut?: string;
  /** Optional category for grouping in command palette */
  category?: string;
  /** Whether this command is currently enabled */
  enabled?: boolean;
  /** Execute the command */
  execute: () => void | Promise<void>;
}

/**
 * Creates a typed CommandId from a string.
 */
export function commandId(id: string): CommandId {
  return id as CommandId;
}

/**
 * Built-in command IDs.
 */
export const COMMANDS = {
  toggleCommandPalette: commandId('app.toggleCommandPalette'),
  toggleTheme: commandId('app.toggleTheme'),
  zoomIn: commandId('app.zoomIn'),
  zoomOut: commandId('app.zoomOut'),
  resetZoom: commandId('app.resetZoom'),
  openHome: commandId('pane.openHome'),
  openNotes: commandId('pane.openNotes'),
  openQueue: commandId('pane.openQueue'),
  openSearch: commandId('pane.openSearch'),
} as const;
