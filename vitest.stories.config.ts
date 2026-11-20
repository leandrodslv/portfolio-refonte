import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { preactAlias } from './config/preact-alias.mjs'

export default defineConfig({
  resolve: { alias: preactAlias },
  plugins: [storybookTest({ configDir: '.storybook' })],
  test: {
    name: 'stories',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
})
