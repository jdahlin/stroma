import React from 'react';
import { useUIStore } from '../state';
import './Sidebar.css';

export const LeftSidebar: React.FC = () => {
  const { leftSidebarOpen, leftSidebarWidth } = useUIStore();

  if (!leftSidebarOpen) {
    return null;
  }

  return (
    <aside
      className="sidebar sidebar-left"
      style={{ width: `${leftSidebarWidth}rem` }}
    >
      <div className="sidebar-content">
        <div className="sidebar-placeholder">Left Sidebar</div>
      </div>
    </aside>
  );
};
