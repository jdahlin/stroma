import React from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
};

export const Icon: React.FC<IconProps> = ({
  icon: LucideIcon,
  size = 'md',
  className,
  style,
}) => {
  const iconSize = sizeMap[size];

  return (
    <LucideIcon
      size={iconSize}
      className={className}
      style={{
        flexShrink: 0,
        ...style,
      }}
    />
  );
};

// Re-export commonly used icons for convenience
export {
  FileText,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  PanelRight,
  Home,
  ListTodo,
  FolderOpen,
  Plus,
  X,
} from 'lucide-react';
