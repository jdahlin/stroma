import baseConfig from '@repo/tailwind-config';
import type { Config } from 'tailwindcss';

export default {
  ...baseConfig,
  content: ['./src/**/*.{ts,tsx}'],
} satisfies Config;
