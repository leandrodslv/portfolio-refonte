import { JSDOM } from 'jsdom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SiteVue } from '../content/site'
import { analyser, rendre, violationsAxe } from './ui/rendu'
import Navbar from './Navbar.astro'

const site: Record<'fr' | 'en', SiteVue> = {
  fr: {
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
  },
  en: {
    nom: 'Léandro Da Silva',
    evitement: 'Skip to content',
    navigationPrincipale: 'Main navigation',
    navigation: { projets: 'Work', parcours: 'Journey', competences: 'Skills', contact: 'Contact' },
    menu: { ouvrir: 'Open menu', fermer: 'Close menu' },
  },
}

describe('Navbar', () => {
  it('contient les quatre liens dans le HTML, sans JavaScript, vers les bonnes Sections', async () => {
    const html = await rendre(Navbar, { props: { locale: 'fr', site: site.fr } })
    const liens = [...analyser(html).querySelectorAll('nav a')].map((a) => [
      a.textContent?.trim(),
      a.getAttribute('href'),
    ])
    expect(liens).toEqual([
      ['Projets', '/#work'],
      ['Parcours', '/#journey'],
      ['Compétences', '/#skills'],
      ['Contact', '/#contact'],
    ])
  })

  it('en anglais, les adresses sont préfixées par /en/ et les textes viennent du contenu', async () => {
    const html = await rendre(Navbar, { props: { locale: 'en', site: site.en } })
    const document = analyser(html)
    expect(document.querySelector('nav a')?.getAttribute('href')).toBe('/en/#work')
    expect(document.querySelector('nav')?.getAttribute('aria-label')).toBe('Main navigation')
    expect(document.querySelector('[data-menu-bouton]')?.getAttribute('aria-label')).toBe(
      'Open menu',
    )
  })

  it('relie le bouton au panneau et expose le logo avec son texte alternatif', async () => {
    const document = analyser(await rendre(Navbar, { props: { locale: 'fr', site: site.fr } }))
    const bouton = document.querySelector('[data-menu-bouton]')
    expect(bouton?.getAttribute('aria-expanded')).toBe('false')
    expect(document.getElementById(bouton?.getAttribute('aria-controls') ?? '')).not.toBeNull()
    expect(
      [...document.querySelectorAll('header img')].map((img) => img.getAttribute('alt')),
    ).toEqual(['Léandro Da Silva', 'Léandro Da Silva'])
  })

  it.each(['fr', 'en'] as const)('n’a aucune violation axe (%s)', async (locale) => {
    const html = await rendre(Navbar, { props: { locale, site: site[locale] } })
    expect(await violationsAxe(html)).toEqual([])
  })
})

describe('menu mobile', () => {
  let dom: JSDOM
  let ecranLarge = false
  let initialiser: () => void = () => undefined

  beforeEach(async () => {
    const html = await rendre(Navbar, { props: { locale: 'fr', site: site.fr } })
    dom = new JSDOM(`<!doctype html><html lang="fr"><body>${html}</body></html>`)
    ecranLarge = false
    dom.window.matchMedia = vi.fn(() => ({
      get matches() {
        return ecranLarge
      },
      addEventListener: vi.fn(),
    })) as unknown as typeof dom.window.matchMedia
    vi.resetModules()
    vi.stubGlobal('window', dom.window)
    vi.stubGlobal('document', dom.window.document)
    const { initialiserMenus } = await import('../islands/menu')
    initialiser = initialiserMenus
    initialiser()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    dom.window.close()
  })

  const bouton = () =>
    dom.window.document.querySelector<HTMLButtonElement>('[data-menu-bouton]') as HTMLButtonElement
  const panneau = () =>
    dom.window.document.querySelector<HTMLElement>('[data-menu-panneau]') as HTMLElement
  const echap = () =>
    dom.window.document.dispatchEvent(
      new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )

  it('ne masque jamais le panneau sur grand écran, où les liens sont toujours visibles', () => {
    ecranLarge = true
    initialiser()
    expect(panneau().hidden).toBe(false)
  })

  it('est fermé au départ, une fois le script chargé', () => {
    expect(panneau().hidden).toBe(true)
    expect(bouton().getAttribute('aria-expanded')).toBe('false')
  })

  it('s’ouvre au clic, met le focus dans le menu et annonce « fermer »', () => {
    bouton().click()
    expect(panneau().hidden).toBe(false)
    expect(bouton().getAttribute('aria-expanded')).toBe('true')
    expect(bouton().getAttribute('aria-label')).toBe('Fermer le menu')
    expect(panneau().contains(dom.window.document.activeElement)).toBe(true)
  })

  it('se ferme avec Échap et rend le focus au bouton d’ouverture', () => {
    bouton().click()
    echap()
    expect(panneau().hidden).toBe(true)
    expect(bouton().getAttribute('aria-expanded')).toBe('false')
    expect(bouton().getAttribute('aria-label')).toBe('Ouvrir le menu')
    expect(dom.window.document.activeElement).toBe(bouton())
  })

  it('se ferme au clic sur un lien sans voler le focus à la cible', () => {
    bouton().click()
    panneau().querySelector('a')?.click()
    expect(panneau().hidden).toBe(true)
    expect(dom.window.document.activeElement).not.toBe(bouton())
  })
})
