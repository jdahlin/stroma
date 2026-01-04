import React from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  style,
  disabled,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`.trim()}
      style={style}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
