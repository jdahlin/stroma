import React, { useCallback, useEffect, useRef } from 'react';
import { useUIStore, type SidebarSide } from '../state';
import './Sidebar.css';

const MIN_WIDTH = 10; // rem
const MAX_WIDTH = 30; // rem

interface SidebarProps {
  side: SidebarSide;
  children?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ side, children }) => {
  const { sidebars, setSidebarWidth } = useUIStore();
  const { open: isOpen, width } = sidebars[side];

  const isDragging = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !sidebarRef.current) return;

      const rootFontSize = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );

      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidthPx =
        side === 'left' ? e.clientX - rect.left : rect.right - e.clientX;
      const newWidthRem = newWidthPx / rootFontSize;
      const clampedWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidthRem));

      setSidebarWidth(side, clampedWidth);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [side, setSidebarWidth]);

  const sashPosition = side === 'left' ? 'sidebar-sash-right' : 'sidebar-sash-left';

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar sidebar-${side} ${isOpen ? 'is-open' : 'is-closed'}`}
      style={{ width: isOpen ? `${width}rem` : '0rem' }}
      aria-hidden={!isOpen}
    >
      {isOpen && side === 'right' && (
        <div
          className={`sidebar-sash ${sashPosition}`}
          onMouseDown={handleMouseDown}
        />
      )}
      <div className="sidebar-content">{children}</div>
      {isOpen && side === 'left' && (
        <div
          className={`sidebar-sash ${sashPosition}`}
          onMouseDown={handleMouseDown}
        />
      )}
    </aside>
  );
};
