import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@repo/vitest-config';

export default mergeConfig(baseConfig, defineConfig({}));
