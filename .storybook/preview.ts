import type { Decorator, Preview } from '@storybook/preact-vite'
import '../design-system/tokens.css'

const THEMES = ['pop', 'terminal', 'wireframe'] as const
const LOCALES = ['fr', 'en'] as const

const withTheme: Decorator = (Story, context) => {
  document.documentElement.setAttribute('data-theme', context.globals.theme)
  return Story()
}

const withLocale: Decorator = (Story, context) => {
  document.documentElement.setAttribute('lang', context.globals.locale)
  return Story()
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Thème du Site',
      toolbar: { title: 'Thème', icon: 'paintbrush', items: [...THEMES], dynamicTitle: true },
    },
    locale: {
      description: 'Langue du Site',
      toolbar: { title: 'Langue', icon: 'globe', items: [...LOCALES], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'pop', locale: 'fr', viewport: { value: 'mobile', isRotated: false } },
  decorators: [withTheme, withLocale],
  parameters: {
    a11y: { test: 'error' },
    viewport: {
      options: {
        mobile: { name: 'Mobile', styles: { width: '320px', height: '640px' } },
        bureau: { name: 'Bureau', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
  afterEach: () => {
    const racine = document.documentElement
    if (racine.scrollWidth > racine.clientWidth) {
      throw new Error('Défilement horizontal : le composant déborde de la fenêtre.')
    }
  },
}

export default preview
