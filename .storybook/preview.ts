import type { Decorator, Preview } from '@storybook/preact-vite'
import '../design-system/tokens.css'

const THEMES = ['pop', 'terminal', 'wireframe'] as const

const withTheme: Decorator = (Story, context) => {
  document.documentElement.setAttribute('data-theme', context.globals.theme)
  return Story()
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Thème du Site',
      toolbar: { title: 'Thème', icon: 'paintbrush', items: [...THEMES], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'pop' },
  decorators: [withTheme],
  parameters: { a11y: { test: 'error' } },
}

export default preview
