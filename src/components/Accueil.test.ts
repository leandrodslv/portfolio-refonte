import { JSDOM } from 'jsdom'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'
import type { EnteteVue, HeroVue } from '../content/accueil'
import type { ProjetVue } from '../content/projets'
import type { SectionsVue } from '../content/sections'
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

const hero: HeroVue = {
  badge: 'Disponible',
  titre: ['Product', 'Designer', 'UX/UI'],
  sousTitre: 'Je conçois des interfaces.',
  boutonPrincipal: 'Voir mes projets',
  boutonSecondaire: 'Me contacter',
  visuels: { pop: 'Collage pop', terminal: 'Code vert', wireframe: 'Maillage bleu' },
}

const entete: EnteteVue = { titre: 'Mes', titreMisEnAvant: 'projets', sousTitre: 'Une sélection.' }

const projets: ProjetVue[] = [1, 2].map((n) => ({
  slug: `projet-${n}`,
  titre: `Projet ${n}`,
  categorie: 'Web',
  description: `Description ${n}`,
  etiquettes: ['UX', 'UI', 'Code', 'Quatrième'],
  couverture: {
    source: `https://cdn.sanity.io/images/p/d/img${n}-800x600.jpg`,
    largeur: 800,
    hauteur: 600,
    alt: `Couverture ${n}`,
  },
  template: 'standard',
  accent: 'accent-2',
}))

const enteteSection = (titre: string, mis: string) => ({ titre, titreMisEnAvant: mis })

const sections: SectionsVue = {
  parcours: {
    entete: enteteSection('Mon', 'parcours'),
    etapes: [
      { periode: '2024', titre: 'BUT MMI', lieu: 'IUT', description: 'Formation.' },
      { periode: '2023', titre: 'Bac', lieu: 'Lycée', description: 'Diplôme.' },
    ],
  },
  competences: {
    entete: {
      ...enteteSection('Hard & soft', 'skills'),
      sousTitre: 'Glissez-déposez pour jouer !',
    },
    competences: [
      { nom: 'Figma', famille: 'hard', teinte: 'pink' },
      { nom: 'Écoute', famille: 'soft', teinte: 'teal' },
    ],
  },
  services: {
    entete: enteteSection('Mes', 'services'),
    services: [1, 2, 3, 4].map((n) => ({ titre: `Service ${n}`, description: `Détail ${n}` })),
  },
  aPropos: {
    entete: enteteSection('À', 'propos'),
    badge: 'Étudiant',
    paragraphes: ['Premier.', 'Second.'],
    altPortrait: 'Portrait de Léandro',
    libelleCv: 'Télécharger mon CV',
    libelleLocalisation: 'Basé à',
    valeurLocalisation: 'Île-de-France',
  },
}

vi.mock('../content/sections', () => ({ lireSections: () => Promise.resolve(sections) }))
vi.mock('../content/site', () => ({ lireSite: () => Promise.resolve(site) }))
vi.mock('../content/accueil', () => ({
  lireAccueil: () => Promise.resolve({ hero, projets: entete }),
}))
vi.mock('../content/projets', () => ({ lireProjets: () => Promise.resolve(projets) }))

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

  it('rend le Hero avec son h1, ses deux boutons et le visuel de chaque Thème', async () => {
    const { window } = await page('en')
    const document = window.document
    expect(document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Product Designer UX/UI',
    )
    const boutons = [...document.querySelectorAll('.hero__actions a')].map((a) =>
      a.getAttribute('href'),
    )
    expect(boutons).toEqual(['/en/#work', '/en/#contact'])
    expect(
      [...document.querySelectorAll('.hero__visuel img')].map((i) => i.getAttribute('alt')),
    ).toEqual(['Collage pop', 'Code vert', 'Maillage bleu'])
  })

  it('rend une Carte par Projet, sans bouton, avec trois étiquettes au plus', async () => {
    const { window } = await page('fr')
    const document = window.document
    const section = document.getElementById('work')
    expect(section?.querySelectorAll('.ui-card')).toHaveLength(2)
    expect(section?.querySelector('button, a')).toBeNull()
    expect(section?.querySelectorAll('.ui-card:first-child .projets__etiquettes li')).toHaveLength(
      3,
    )
    expect(section?.querySelector('.ui-card img')?.getAttribute('alt')).toBe('Couverture 1')
    expect(section?.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Mes projets',
    )
  })

  it('rend Parcours, Compétences, Services et À propos dans le HTML, chacun sous un h2', async () => {
    const { window } = await page('fr')
    const document = window.document
    const ordre = [...document.querySelectorAll('main > section[id]')].map((s) => s.id)
    expect(ordre).toEqual(['work', 'journey', 'skills', 'services', 'about', 'contact'])
    for (const id of ['journey', 'skills', 'services', 'about']) {
      const section = document.getElementById(id)
      const titre = document.getElementById(section?.getAttribute('aria-labelledby') ?? '')
      expect(titre?.tagName).toBe('H2')
    }
    expect(document.querySelectorAll('#journey ol > li')).toHaveLength(2)
    expect(document.querySelectorAll('#services .ui-card')).toHaveLength(4)
    expect(document.querySelectorAll('h1')).toHaveLength(1)
  })

  it('rend les puces de compétence selon leur famille et leur teinte', async () => {
    const { window } = await page('fr')
    const puces = [...window.document.querySelectorAll('#skills li')]
    expect(puces.map((p) => p.className)).toEqual([
      'competences__puce competences__puce--hard competences__puce--pink',
      'competences__puce competences__puce--soft competences__puce--teal',
    ])
  })

  it('n’affiche pas la consigne de glisser-déposer tant que les puces ne sont pas déplaçables', async () => {
    const { window } = await page('fr')
    expect(window.document.getElementById('skills')?.textContent).not.toContain('Glissez')
    expect(window.document.querySelectorAll('#skills button')).toHaveLength(0)
  })

  it('rend À propos avec portrait, localisation en texte et lien CV sans iframe', async () => {
    const { window } = await page('en')
    const section = window.document.getElementById('about')
    expect(section?.querySelector('img')?.getAttribute('alt')).toBe('Portrait de Léandro')
    expect(section?.querySelector('iframe')).toBeNull()
    const cv = section?.querySelector('a[download]')
    expect(cv?.getAttribute('href')).toBe('/CV_Leandro_Da_Silva.pdf')
    expect(cv?.textContent?.trim()).toBe('Télécharger mon CV')
    expect(section?.textContent).toContain('Île-de-France')
    expect(section?.querySelectorAll('svg[aria-hidden], [aria-hidden] svg').length).toBeGreaterThan(
      0,
    )
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
