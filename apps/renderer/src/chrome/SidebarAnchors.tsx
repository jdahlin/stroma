import React from 'react'
import { usePdfStore } from '../state'
import './SidebarAnchors.css'

export const SidebarAnchors: React.FC = () => {
  const activePaneId = usePdfStore(state => state.activePaneId)
  const paneState = usePdfStore(state => (activePaneId !== null ? state.panes[activePaneId] : undefined))
  const focusAnchor = usePdfStore(state => state.focusAnchor)

  if (!paneState) {
    return (
      <section className="sidebar-anchors">
        <div className="sidebar-anchors-header">
          <h3>Anchors</h3>
        </div>
        <p className="sidebar-anchors-empty">No PDF loaded.</p>
      </section>
    )
  }

  const activeAnchors = paneState.anchors

  return (
    <section className="sidebar-anchors">
      <div className="sidebar-anchors-header">
        <h3>Anchors</h3>
        <span>{activeAnchors.length}</span>
      </div>
      <div className="sidebar-anchors-list">
        {activeAnchors.length === 0
          ? (
              <p className="sidebar-anchors-empty">No anchors yet.</p>
            )
          : (
              activeAnchors.map(anchor => (
                <button
                  key={anchor.id}
                  type="button"
                  className="sidebar-anchor-item"
                  onClick={() => {
                    if (activePaneId !== null) {
                      focusAnchor(activePaneId, anchor.id)
                    }
                  }}
                >
                  <div className="sidebar-anchor-title">
                    {anchor.type === 'text' ? anchor.text : anchor.type}
                  </div>
                  <div className="sidebar-anchor-meta">
                    Page
                    {anchor.pageIndex + 1}
                  </div>
                </button>
              ))
            )}
      </div>
    </section>
  )
}
