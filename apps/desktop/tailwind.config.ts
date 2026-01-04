import type { Config } from 'tailwindcss'
import baseConfig from '@repo/tailwind-config'

export default {
  ...baseConfig,
  content: ['./src/renderer/**/*.{ts,tsx}', '../../packages/ux/src/**/*.{ts,tsx}'],
} satisfies Config
