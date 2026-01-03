import type { DockviewApi } from 'dockview';

/**
 * Creates the default layout when no saved layout exists.
 */
export function createDefaultLayout(api: DockviewApi): void {
  // Add the home pane as the initial panel
  api.addPanel({
    id: 'home',
    component: 'home',
    title: 'Home',
  });
}
