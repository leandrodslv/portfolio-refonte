import { readFileSync } from 'node:fs'
import { renderToString } from 'preact-render-to-string'
import { describe, expect, it } from 'vitest'
import { textesFondations } from '../fixtures/ui-strings'
import {
  CATEGORIES,
  classer,
  lireTokens,
  resoudre,
  valeurToken,
  type Tokens,
} from '../styles/tokens-lecture'
import { Fondations, THEMES } from './Fondations'

const tokensCss = readFileSync(new URL('../../design-system/tokens.css', import.meta.url), 'utf8')
const tokens = lireTokens(tokensCss)

function tousLesNoms({ racine, themes, preferences }: Tokens): string[] {
  const cartes = [racine, ...themes.values(), ...preferences.values()]
  return [...new Set(cartes.flatMap((t) => [...t.keys()]))]
}

function nonClasses(lus: Tokens): string[] {
  return tousLesNoms(lus).filter((nom) => classer(nom) === undefined)
}

function absentsParTheme(lus: Tokens): string[] {
  const semantiques = new Set([...lus.themes.values()].flatMap((t) => [...t.keys()]))
  return THEMES.flatMap((theme) => {
    const vars = lus.themes.get(theme)
    if (!vars) return [`${theme} : Thème absent`]
    return [...semantiques].filter((nom) => !vars.has(nom)).map((nom) => `${theme} : ${nom}`)
  })
}

const cssEssai = `
:root { --color-a: #000000; --inconnu-x: 1; }
[data-theme="pop"] { --bg: var(--color-a); --text: var(--color-a); }
[data-theme="pop"] .carte { --bg: #ffffff; }
[data-theme="terminal"] { --bg: var(--color-a); --text: var(--color-a); }
[data-theme="wireframe"] { --text: var(--color-a); }
@media (prefers-reduced-motion: reduce) { :root { --duration-x: 0s; } }
`

const entites: Record<string, string> = { '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>' }
const decoder = (texte: string) => texte.replace(/&(quot|amp|lt|gt);/g, (e) => entites[e] ?? e)

function blocsDuTheme(html: string, theme: string): string {
  return html
    .split(/(?=<div data-theme=")/)
    .filter((morceau) => morceau.startsWith(`<div data-theme="${theme}"`))
    .map((morceau) => morceau.split('<section')[0])
    .join('')
}

function valeursAffichees(bloc: string): Map<string, string> {
  const lignes = bloc.matchAll(/>(--[\w-]+)<\/code><br\/?><span[^>]*>([^<]*)<\/span>/g)
  return new Map([...lignes].map(([, nom, valeur]) => [nom, decoder(valeur)]))
}

describe('Fondations : lecture de tokens.css', () => {
  it('classe chaque token, préférences comprises, dans une catégorie', () => {
    expect(nonClasses(tokens), 'tokens sans catégorie').toEqual([])
  })

  it('déclare les mêmes tokens sémantiques dans les trois Thèmes', () => {
    expect(absentsParTheme(tokens), 'tokens absents d’un Thème').toEqual([])
  })

  it('signale un token non classé par son nom', () => {
    expect(nonClasses(lireTokens(cssEssai))).toEqual(['--inconnu-x'])
  })

  it('signale un token absent d’un Thème avec le Thème et le token', () => {
    expect(absentsParTheme(lireTokens(cssEssai))).toEqual(['wireframe : --bg'])
  })

  it('ignore une règle qui ne cible pas exactement un Thème', () => {
    expect(lireTokens(cssEssai).themes.get('pop')?.get('--bg')).toBe('var(--color-a)')
  })

  it('lit les surcharges des blocs @media', () => {
    const lus = lireTokens(cssEssai)
    expect(lus.preferences.get('(prefers-reduced-motion: reduce)')?.get('--duration-x')).toBe('0s')
  })

  it('résout les var() à l’intérieur d’une valeur composée', () => {
    const racine = new Map([
      ['--a', '4px'],
      ['--b', 'var(--a)'],
    ])
    expect(resoudre('0 0 0 var(--b) var(--a)', new Map(), racine)).toBe('0 0 0 4px 4px')
  })
})

describe('Fondations : page', () => {
  const html = renderToString(<Fondations css={tokensCss} textes={textesFondations.fr} />)
  const partieThemes = html.slice(0, html.indexOf('data-section="preferences"'))

  it('affiche chaque token exactement une fois par Thème', () => {
    const ecarts = tousLesNoms({ ...tokens, preferences: new Map() })
      .map((nom) => [nom, partieThemes.split(`>${nom}</code>`).length - 1] as const)
      .filter(([, nombre]) => nombre !== THEMES.length)
      .map(([nom, nombre]) => `${nom} : ${nombre}`)
    expect(ecarts, 'tokens affichés un nombre de fois différent du nombre de Thèmes').toEqual([])
  })

  it.each(THEMES)('affiche dans le bloc %s la valeur résolue de ce Thème', (theme) => {
    const vars = tokens.themes.get(theme)
    if (!vars) throw new Error(`Thème absent : ${theme}`)
    const affichees = valeursAffichees(blocsDuTheme(partieThemes, theme))
    const fausses = [...affichees]
      .filter(([nom, valeur]) => valeur !== valeurToken(nom, vars, tokens.racine))
      .map(([nom, valeur]) => `${nom} : ${valeur}`)
    expect(affichees.size).toBe(tousLesNoms({ ...tokens, preferences: new Map() }).length)
    expect(fausses).toEqual([])
  })

  it('montre des valeurs différentes d’un Thème à l’autre', () => {
    const fonds = THEMES.map((theme) =>
      valeursAffichees(blocsDuTheme(partieThemes, theme)).get('--bg'),
    )
    expect(new Set(fonds).size).toBe(THEMES.length)
  })

  it('rend un bloc par Thème et par catégorie', () => {
    for (const theme of THEMES) {
      expect(html.match(new RegExp(`data-theme="${theme}"`, 'g'))).toHaveLength(CATEGORIES.length)
    }
  })

  it('redéclare dans chaque bloc les tokens de :root qui citent un autre token', () => {
    const blocs = html.match(/<div data-theme="[^"]+" style="[^"]*"/g) ?? []
    expect(blocs.length).toBeGreaterThan(0)
    for (const bloc of blocs) expect(bloc).toContain('--focus-color:var(--text)')
  })

  it('affiche chaque surcharge de préférence d’accessibilité', () => {
    const partiePreferences = html.slice(html.indexOf('data-section="preferences"'))
    const absentes = [...tokens.preferences].flatMap(([condition, vars]) =>
      [...vars.keys()]
        .filter((nom) => !partiePreferences.includes(`>${nom}</code>`))
        .map((nom) => `${condition} ${nom}`),
    )
    expect(tokens.preferences.size).toBeGreaterThan(0)
    expect(absentes).toEqual([])
  })

  it.each(['fr', 'en'] as const)('nomme chaque préférence de tokens.css en %s', (langue) => {
    const sansLibelle = [...tokens.preferences.keys()].filter(
      (condition) => !textesFondations[langue].preferences.conditions[condition],
    )
    expect(sansLibelle).toEqual([])
  })

  it.each(['fr', 'en'] as const)('affiche les textes de la fixture en %s', (langue) => {
    const rendu = renderToString(<Fondations css={tokensCss} textes={textesFondations[langue]} />)
    const t = textesFondations[langue]
    const libelles = [
      t.titre,
      t.intro,
      t.preferences.titre,
      ...Object.values(t.categories),
      ...Object.values(t.themes),
    ]
    for (const libelle of libelles) expect(decoder(rendu)).toContain(libelle)
  })
})
