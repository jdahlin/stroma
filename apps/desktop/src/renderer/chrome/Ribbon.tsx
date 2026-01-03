import React from 'react';
import { IconButton, Home, FileText, Search, Settings, PanelLeft, PanelRight } from '@repo/ux';
import { useUIStore } from '../state';
import './Ribbon.css';

export const Ribbon: React.FC = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <aside className="ribbon">
      <div className="ribbon-top">
        <IconButton
          icon={PanelLeft}
          label="Toggle left sidebar"
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
          onClick={() => toggleSidebar('right')}
        />
      </div>
    </aside>
  );
};
