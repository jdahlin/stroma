/**
 * Theme configuration for Dockview.
 * In Dockview v4, gap is handled via CSS custom properties.
 */
export interface StromaTheme {
  name: string
  className: string
}

/**
 * Custom Stroma theme for Dockview.
 * CSS variables are defined in styles/dockview-theme.css
 */
export const stromaTheme: StromaTheme = {
  name: 'stroma',
  className: 'dockview-theme-stroma',
}
