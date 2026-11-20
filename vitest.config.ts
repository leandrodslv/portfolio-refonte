/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'
import { preactAlias } from './config/preact-alias.mjs'

export default getViteConfig({
  resolve: { alias: preactAlias },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { provider: 'v8', reporter: ['text', 'html'], include: ['src/lib/**'] },
  },
})
