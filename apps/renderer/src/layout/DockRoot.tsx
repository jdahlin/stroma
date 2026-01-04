import type { DockviewReadyEvent } from 'dockview'
import { DockHost } from '@repo/ux'
import React, { useCallback } from 'react'
import { useLayoutStore } from '../state'
import { createDefaultLayout } from './defaultLayout'
import { paneComponents } from './paneRegistry'
import './DockRoot.css'

export const DockRoot: React.FC = () => {
  const { serializedLayout, setLayout, setApi } = useLayoutStore()

  const handleReady = useCallback(
    (event: DockviewReadyEvent) => {
      // Store the API reference
      setApi(event.api)

      // Restore saved layout or create default
      if (serializedLayout) {
        try {
          event.api.fromJSON(serializedLayout)
        }
        catch (e) {
          console.warn('Failed to restore layout, using default:', e)
          createDefaultLayout(event.api)
        }
      }
      else {
        createDefaultLayout(event.api)
      }

      // Save layout on changes
      const disposable = event.api.onDidLayoutChange(() => {
        setLayout(event.api.toJSON())
      })

      // Cleanup on unmount
      return () => {
        disposable.dispose()
      }
    },
    [serializedLayout, setLayout, setApi],
  )

  return <DockHost onReady={handleReady} components={paneComponents} />
}
