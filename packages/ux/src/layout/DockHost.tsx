import type { DockviewReadyEvent, IDockviewHeaderActionsProps, IDockviewPanelProps } from 'dockview'
import {
  DockviewReact,

} from 'dockview'
import React, { useCallback } from 'react'
import { stromaTheme } from './stromaTheme'

export interface DockHostProps {
  /** Called when Dockview is ready */
  onReady?: (event: DockviewReadyEvent) => void
  /** Map of component names to React components */
  components: Record<string, React.FC<IDockviewPanelProps>>
  /** Optional group header prefix component */
  prefixHeaderActionsComponent?: React.FC<IDockviewHeaderActionsProps>
  /** Optional group header left component */
  leftHeaderActionsComponent?: React.FC<IDockviewHeaderActionsProps>
  /** Optional group header right component */
  rightHeaderActionsComponent?: React.FC<IDockviewHeaderActionsProps>
  /** Optional className for additional styling */
  className?: string
}

/**
 * Wrapper component for Dockview that applies the Stroma theme.
 */
export const DockHost: React.FC<DockHostProps> = ({
  onReady,
  components,
  prefixHeaderActionsComponent,
  leftHeaderActionsComponent,
  rightHeaderActionsComponent,
  className,
}) => {
  const handleReady = useCallback(
    (event: DockviewReadyEvent) => {
      onReady?.(event)
    },
    [onReady],
  )

  return (
    <DockviewReact
      className={`${stromaTheme.className}${className !== undefined ? ` ${className}` : ''}`}
      onReady={handleReady}
      components={components}
      prefixHeaderActionsComponent={prefixHeaderActionsComponent}
      leftHeaderActionsComponent={leftHeaderActionsComponent}
      rightHeaderActionsComponent={rightHeaderActionsComponent}
    />
  )
}
