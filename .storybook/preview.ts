import type { Decorator, Preview } from '@storybook/preact-vite'
import '../src/styles/global.css'

const THEMES = ['pop', 'terminal', 'wireframe'] as const
const LOCALES = ['fr', 'en'] as const

const withTheme: Decorator = (Story, context) => {
  document.documentElement.setAttribute('data-theme', context.globals.theme)
  return Story()
}

const withZoom: Decorator = (Story, context) => {
  document.documentElement.style.fontSize = context.globals.zoom === '200' ? '200%' : ''
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
    zoom: {
      description: 'Zoom de texte',
      toolbar: { title: 'Zoom', icon: 'zoom', items: ['100', '200'], dynamicTitle: true },
    },
    locale: {
      description: 'Langue du Site',
      toolbar: { title: 'Langue', icon: 'globe', items: [...LOCALES], dynamicTitle: true },
    },
  },
  initialGlobals: {
    theme: 'pop',
    locale: 'fr',
    zoom: '100',
    viewport: { value: 'mobile', isRotated: false },
  },
  decorators: [withTheme, withLocale, withZoom],
  parameters: {
    a11y: { test: 'error' },
    viewport: {
      options: {
        mobile: { name: 'Mobile', styles: { width: '320px', height: '640px' } },
        zoom200: {
          name: 'Zoom 200 % (écran de 1280 px)',
          styles: { width: '640px', height: '640px' },
        },
        tablette: { name: 'Tablette', styles: { width: '768px', height: '1024px' } },
        bureau: { name: 'Bureau', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
  beforeEach: async () => {
    try {
      const { commands } = await import('vitest/browser')
      await commands.emulerMedia({ contrast: 'no-preference', forcedColors: 'none' })
    } catch {
      return
    }
  },
  afterEach: () => {
    const racine = document.documentElement
    if (racine.scrollWidth > racine.clientWidth) {
      const coupables = [...document.body.querySelectorAll('*')]
        .filter((e) => e.getBoundingClientRect().right > racine.clientWidth)
        .slice(0, 3)
        .map((e) => `${e.tagName.toLowerCase()}.${e.getAttribute('class') ?? ''}`)
      throw new Error(
        `Défilement horizontal : le composant déborde de la fenêtre (${racine.scrollWidth}>${racine.clientWidth} : ${coupables.join(', ')}).`,
      )
    }
  },
}

export default preview
