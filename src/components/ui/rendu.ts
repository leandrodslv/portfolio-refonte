import axe from 'axe-core'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { JSDOM } from 'jsdom'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

interface Options {
  props?: Record<string, unknown>
  slots?: Record<string, string>
}

interface FenetreAxe {
  axe: typeof axe
  eval(code: string): unknown
}

export async function rendre(composant: AstroComponentFactory, options: Options = {}) {
  const conteneur = await AstroContainer.create()
  return conteneur.renderToString(composant, options)
}

export function analyser(html: string): Document {
  return new JSDOM(`<!doctype html><html lang="fr"><body>${html}</body></html>`).window.document
}

export async function violationsAxe(html: string): Promise<string[]> {
  const dom = new JSDOM(
    `<!doctype html><html lang="fr"><head><title>Essai</title></head><body><main>${html}</main></body></html>`,
    { runScripts: 'outside-only' },
  )
  try {
    const fenetre = dom.window as unknown as FenetreAxe
    fenetre.eval(axe.source)
    const resultat = await fenetre.axe.run(dom.window.document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      rules: { 'color-contrast': { enabled: false } },
    })
    return resultat.violations.map((v) => `${v.id} : ${v.help}`)
  } finally {
    dom.window.close()
  }
}
