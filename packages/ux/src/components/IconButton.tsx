import type { LucideIcon } from 'lucide-react'
import type { IconSize } from './Icon'
import React from 'react'
import { Icon } from './Icon'
import './IconButton.css'

export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  'icon': LucideIcon
  'size'?: IconButtonSize
  /** Accessible label for screen readers */
  'label': string
  'data-active'?: boolean
}

const iconSizeMap: Record<IconButtonSize, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  label,
  disabled,
  style,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`icon-button icon-button--${size} ${className}`.trim()}
      style={style}
      disabled={disabled}
      title={label}
      aria-label={label}
      {...props}
    >
      <Icon icon={icon} size={iconSizeMap[size]} />
    </button>
  )
}
