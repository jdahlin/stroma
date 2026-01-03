import type { Brand } from '@repo/shared';

/**
 * Pane type identifiers. Each pane in the dock system has a unique type.
 */
export type PaneType = 'home' | 'notes' | 'queue' | 'search';

/**
 * Unique identifier for a pane instance.
 */
export type PaneId = Brand<string, 'PaneId'>;

/**
 * Input data that can be passed when opening a pane.
 */
export interface PaneInput<T = unknown> {
  type: PaneType;
  title?: string;
  data?: T;
}

/**
 * Pane definition for registration.
 */
export interface PaneDefinition {
  type: PaneType;
  displayName: string;
  icon?: string;
  /** Whether multiple instances of this pane can be open simultaneously */
  allowMultiple?: boolean;
}

/**
 * All available pane definitions.
 */
export const PANE_DEFINITIONS: Record<PaneType, PaneDefinition> = {
  home: {
    type: 'home',
    displayName: 'Home',
    allowMultiple: false,
  },
  notes: {
    type: 'notes',
    displayName: 'Notes',
    allowMultiple: true,
  },
  queue: {
    type: 'queue',
    displayName: 'Reading Queue',
    allowMultiple: false,
  },
  search: {
    type: 'search',
    displayName: 'Search',
    allowMultiple: false,
  },
};
