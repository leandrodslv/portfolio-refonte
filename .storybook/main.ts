import type { StorybookConfig } from '@storybook/preact-vite'
import { mergeConfig } from 'vite'
import { preactAlias } from '../config/preact-alias.mjs'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/preact-vite',
  viteFinal: (viteConfig) => mergeConfig(viteConfig, { resolve: { alias: preactAlias } }),
}

export default config
