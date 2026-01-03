import React from 'react';
import { IconButton, Home, FileText, Search, Settings, PanelLeft, PanelRight } from '@repo/ux';
import { useUIStore } from '../state';
import './Ribbon.css';

export const Ribbon: React.FC = () => {
  const { toggleSidebar, sidebars } = useUIStore();
  const leftOpen = sidebars.left.open;
  const rightOpen = sidebars.right.open;

  return (
    <aside className="ribbon">
      <div className="ribbon-top">
        <IconButton
          icon={PanelLeft}
          label="Toggle left sidebar"
          aria-pressed={leftOpen}
          style={
            leftOpen
              ? {
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                }
              : undefined
          }
          onClick={() => toggleSidebar('left')}
        />
        <IconButton icon={Home} label="Home" />
        <IconButton icon={FileText} label="Files" />
        <IconButton icon={Search} label="Search" />
      </div>
      <div className="ribbon-bottom">
        <IconButton icon={Settings} label="Settings" />
        <IconButton
          icon={PanelRight}
          label="Toggle right sidebar"
          aria-pressed={rightOpen}
          style={
            rightOpen
              ? {
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                }
              : undefined
          }
          onClick={() => toggleSidebar('right')}
        />
      </div>
    </aside>
  );
};
