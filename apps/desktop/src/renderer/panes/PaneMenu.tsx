import React, { useEffect, useRef, useState } from 'react'
import './Pane.css'

export const PaneMenu: React.FC = () => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current) {
        return
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="pane-menu" ref={rootRef}>
      <button
        type="button"
        className="pane-menu-button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="pane-menu-icon" aria-hidden="true" />
      </button>
      {open && (
        <div className="pane-menu-popover" role="menu">
          <button type="button" className="pane-menu-item" role="menuitem">
            Todo
          </button>
        </div>
      )}
    </div>
  )
}
