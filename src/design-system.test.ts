import { existsSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { describe, expect, it } from 'vitest'

const racine = new URL('../', import.meta.url)
const lire = (chemin: string) => readFileSync(new URL(chemin, racine), 'utf8')

const inventaire = lire('design-system/components.md')
const tokens = new Set(lire('design-system/tokens.css').match(/--[a-z0-9-]+(?=\s*:)/g))

const primitives = [
  'Bouton',
  'Lien',
  'Carte',
  'Badge',
  'Étiquette',
  'Titre de Section',
  'Conteneur',
  'Sélecteur',
  'Champ',
  'Autocollant (sticker)',
]

for (const titre of ['## Primitives du kit', '## Hors kit', '## Écarts à valider']) {
  if (!inventaire.includes(titre)) throw new Error(`titre absent de components.md : ${titre}`)
}

const avantEcarts = inventaire.slice(0, inventaire.indexOf('## Écarts à valider'))
const sectionPrimitives = avantEcarts.slice(
  avantEcarts.indexOf('## Primitives du kit'),
  avantEcarts.indexOf('## Hors kit'),
)
const entrees = new Map(
  sectionPrimitives
    .split(/^### /m)
    .slice(1)
    .map((bloc) => [bloc.split('\n')[0].trim(), bloc] as const),
)

const developper = (chemin: string): string[] => {
  const accolades = /\{([^}]+)\}/.exec(chemin)
  if (!accolades) return [chemin]
  return accolades[1].split(',').flatMap((choix) => developper(chemin.replace(accolades[0], choix)))
}

const sources = (texte: string) =>
  [...texte.matchAll(/ancien-portfolio\/src\/(?:\{[^}]+\}|[^\s`,;){])+/g)].flatMap((m) =>
    developper(m[0]),
  )

const existe = (chemin: string) =>
  chemin.includes('*')
    ? existsSync(new URL(dirname(chemin), racine))
    : existsSync(new URL(chemin, racine))

describe('design-system/components.md', () => {
  it.each(primitives)('inventorie la primitive « %s » avec une source de l’ancien site', (nom) => {
    const bloc = entrees.get(nom)
    expect(bloc, `entrée « ${nom} » absente`).toBeDefined()
    expect(sources(bloc ?? '').length).toBeGreaterThan(0)
    expect(bloc).toMatch(/Chemin( prévu)? : `src\/components\/ui\//)
  })

  it.skipIf(!existsSync(new URL('ancien-portfolio/', racine)))(
    'ne cite que des fichiers de l’ancien site qui existent',
    () => {
      const introuvables = sources(inventaire).filter((chemin) => !existe(chemin))
      expect(introuvables).toEqual([])
    },
  )

  it('ne cite que des tokens existants hors liste des écarts', () => {
    const cites = [...avantEcarts.matchAll(/`(--[a-z0-9-]+)`/g)]
      .map((m) => m[1])
      .filter((nom) => !nom.endsWith('-'))
    const inconnus = [...new Set(cites)].filter((nom) => !tokens.has(nom))
    expect(inconnus).toEqual([])
  })

  it('classe les motifs uniques hors kit avec leur épopée', () => {
    const horsKit = inventaire.slice(
      inventaire.indexOf('## Hors kit'),
      inventaire.indexOf('## Échelle typographique'),
    )
    for (const motif of [
      'Bandeau défilant',
      'Confettis',
      'Curseur',
      'Carte à gratter',
      'Carte retournable',
    ]) {
      expect(horsKit).toContain(motif)
    }
  })

  it('fixe les échelles, les points de rupture et la liste des écarts', () => {
    for (const titre of [
      '## Échelle typographique',
      "## Échelle d'espacement",
      '## Points de rupture',
      '## Écarts à valider par Léandro',
    ]) {
      expect(inventaire).toContain(titre)
    }
  })

  it('est référencé par design-system/README.md', () => {
    expect(lire('design-system/README.md')).toContain('components.md')
  })
})
