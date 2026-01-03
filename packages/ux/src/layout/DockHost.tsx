import React, { useCallback } from 'react';
import { DockviewReact, type DockviewReadyEvent, type IDockviewPanelProps } from 'dockview';
import { stromaTheme } from './stromaTheme';

export interface DockHostProps {
  /** Called when Dockview is ready */
  onReady?: (event: DockviewReadyEvent) => void;
  /** Map of component names to React components */
  components: Record<string, React.FC<IDockviewPanelProps>>;
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Wrapper component for Dockview that applies the Stroma theme.
 */
export const DockHost: React.FC<DockHostProps> = ({ onReady, components, className }) => {
  const handleReady = useCallback(
    (event: DockviewReadyEvent) => {
      onReady?.(event);
    },
    [onReady]
  );

  return (
    <DockviewReact
      className={`${stromaTheme.className}${className ? ` ${className}` : ''}`}
      onReady={handleReady}
      components={components}
    />
  );
};
