import baseConfig from '@repo/vitest-config'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(baseConfig, defineConfig({}))
