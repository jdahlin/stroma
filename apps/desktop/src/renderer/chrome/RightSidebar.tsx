import React from 'react';
import { useUIStore } from '../state';
import './Sidebar.css';

export const RightSidebar: React.FC = () => {
  const { rightSidebarOpen, rightSidebarWidth } = useUIStore();

  if (!rightSidebarOpen) {
    return null;
  }

  return (
    <aside
      className="sidebar sidebar-right"
      style={{ width: `${rightSidebarWidth}rem` }}
    >
      <div className="sidebar-content">
        <div className="sidebar-placeholder">Right Sidebar</div>
      </div>
    </aside>
  );
};
