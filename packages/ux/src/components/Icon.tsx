import type { LucideIcon } from 'lucide-react'
import React from 'react'
import './Icon.css'

export type IconSize = 'sm' | 'md' | 'lg'

export interface IconProps {
  icon: LucideIcon
  size?: IconSize
  className?: string
  style?: React.CSSProperties
}

const sizeMap: Record<IconSize, string> = {
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
}

export const Icon: React.FC<IconProps> = ({
  icon: LucideIcon,
  size = 'md',
  className = '',
  style,
}) => {
  const iconSize = sizeMap[size]
  const classes = `icon ${className}`.trim()

  return (
    <LucideIcon
      size={iconSize}
      className={classes}
      style={style}
    />
  )
}

// Re-export commonly used icons for convenience
