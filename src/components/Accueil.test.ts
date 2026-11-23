import { JSDOM } from 'jsdom'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'
import type { SiteVue } from '../content/site'
import { rendre } from './ui/rendu'
import Accueil from './Accueil.astro'

const site: SiteVue = {
  nom: 'Léandro Da Silva',
  evitement: 'Aller au contenu',
  navigationPrincipale: 'Navigation principale',
  navigation: {
    projets: 'Projets',
    parcours: 'Parcours',
    competences: 'Compétences',
    contact: 'Contact',
  },
  menu: { ouvrir: 'Ouvrir le menu', fermer: 'Fermer le menu' },
}

vi.mock('../content/site', () => ({ lireSite: () => Promise.resolve(site) }))

async function page(locale: 'fr' | 'en') {
  const html = await rendre(Accueil, { props: { locale } })
  return new JSDOM(html, { runScripts: 'outside-only' })
}

describe('Page d’accueil (gabarit)', () => {
  it('déclare sa Langue et ses landmarks, avec un seul h1', async () => {
    const { window } = await page('fr')
    const document = window.document
    expect(document.documentElement.lang).toBe('fr')
    expect(
      document.querySelectorAll('body > header, body > main, body > footer, nav'),
    ).toHaveLength(4)
    expect(document.querySelectorAll('h1')).toHaveLength(1)
    expect(document.title).toBe('Léandro Da Silva')
  })

  it('place le lien d’évitement en premier, vers le contenu', async () => {
    const { window } = await page('fr')
    const premier = window.document.querySelector('a[href]')
    expect(premier?.getAttribute('href')).toBe('#contenu')
    expect(window.document.querySelector('main')?.id).toBe('contenu')
  })

  it('rend une Section par lien du menu, titrée', async () => {
    const { window } = await page('en')
    const document = window.document
    const cibles = [...document.querySelectorAll('nav a')].map(
      (a) => (a.getAttribute('href') ?? '').split('#')[1],
    )
    expect(cibles).toEqual(['work', 'journey', 'skills', 'contact'])
    for (const id of cibles) {
      const section = document.getElementById(id ?? '')
      expect(section?.tagName).toBe('SECTION')
      const titre = document.getElementById(section?.getAttribute('aria-labelledby') ?? '')
      expect(titre?.tagName).toBe('H2')
    }
  })

  it.each(['fr', 'en'] as const)('n’a aucune violation axe (%s)', async (locale) => {
    const dom = await page(locale)
    const fenetre = dom.window as unknown as { eval(code: string): unknown; axe: typeof axe }
    fenetre.eval(axe.source)
    const resultat = await fenetre.axe.run(dom.window.document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(resultat.violations.map((v) => `${v.id} : ${v.help}`)).toEqual([])
    dom.window.close()
  })
})
