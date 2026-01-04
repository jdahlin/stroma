import type { LucideIcon } from 'lucide-react'
import type { IconSize } from './Icon'
import React, { useState } from 'react'
import { Icon } from './Icon'

export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon
  size?: IconButtonSize
  /** Accessible label for screen readers */
  label: string
}

const sizeStyles: Record<IconButtonSize, { button: string, icon: IconSize }> = {
  sm: { button: '1.75rem', icon: 'sm' },
  md: { button: '2.25rem', icon: 'md' },
  lg: { button: '2.75rem', icon: 'lg' },
}

const baseStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-text-secondary)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
}

const hoverStyles: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-tertiary)',
  color: 'var(--color-text-primary)',
}

const activeStyles: React.CSSProperties = {
  backgroundColor: 'var(--color-bg-active)',
}

const disabledStyles: React.CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  label,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const sizeConfig = sizeStyles[size]
  const buttonSize = sizeConfig.button

  const computedStyle: React.CSSProperties = {
    ...baseStyles,
    width: buttonSize,
    height: buttonSize,
    ...(isHovered && !(disabled === true) ? hoverStyles : {}),
    ...(isActive && !(disabled === true) ? activeStyles : {}),
    ...(disabled === true ? disabledStyles : {}),
    ...style,
  }

  return (
    <button
      type="button"
      style={computedStyle}
      disabled={disabled}
      title={label}
      aria-label={label}
      onMouseEnter={(e) => {
        setIsHovered(true)
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        setIsHovered(false)
        setIsActive(false)
        onMouseLeave?.(e)
      }}
      onMouseDown={(e) => {
        setIsActive(true)
        onMouseDown?.(e)
      }}
      onMouseUp={(e) => {
        setIsActive(false)
        onMouseUp?.(e)
      }}
      {...props}
    >
      <Icon icon={icon} size={sizeConfig.icon} />
    </button>
  )
}
