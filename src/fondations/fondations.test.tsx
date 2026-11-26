import { readFileSync } from 'node:fs'
import { renderToString } from 'preact-render-to-string'
import { describe, expect, it } from 'vitest'
import { textesFondations } from '../fixtures/ui-strings'
import { classer, lireTokens, type Tokens } from '../styles/tokens-lecture'
import { Fondations, THEMES } from './Fondations'

const tokensCss = readFileSync(new URL('../../design-system/tokens.css', import.meta.url), 'utf8')

function tousLesNoms({ racine, themes }: Tokens): string[] {
  return [...new Set([...racine.keys(), ...[...themes.values()].flatMap((t) => [...t.keys()])])]
}

function nonClasses(tokens: Tokens): string[] {
  return tousLesNoms(tokens).filter((nom) => classer(nom) === undefined)
}

function absentsParTheme(tokens: Tokens): string[] {
  const semantiques = new Set([...tokens.themes.values()].flatMap((t) => [...t.keys()]))
  return THEMES.flatMap((theme) => {
    const vars = tokens.themes.get(theme)
    if (!vars) return [`${theme} : Thème absent`]
    return [...semantiques].filter((nom) => !vars.has(nom)).map((nom) => `${theme} : ${nom}`)
  })
}

const cssEssai = `
:root { --color-a: #000000; --inconnu-x: 1; }
[data-theme="pop"] { --bg: var(--color-a); --text: var(--color-a); }
[data-theme="terminal"] { --bg: var(--color-a); --text: var(--color-a); }
[data-theme="wireframe"] { --text: var(--color-a); }
`

describe('Fondations : garde-fous', () => {
  it('classe chaque token de tokens.css dans une catégorie', () => {
    expect(nonClasses(lireTokens(tokensCss)), 'tokens sans catégorie').toEqual([])
  })

  it('déclare les mêmes tokens sémantiques dans les trois Thèmes', () => {
    expect(absentsParTheme(lireTokens(tokensCss)), 'tokens absents d’un Thème').toEqual([])
  })

  it('signale un token non classé par son nom', () => {
    expect(nonClasses(lireTokens(cssEssai))).toEqual(['--inconnu-x'])
  })

  it('signale un token absent d’un Thème avec le Thème et le token', () => {
    expect(absentsParTheme(lireTokens(cssEssai))).toEqual(['wireframe : --bg'])
  })
})

describe('Fondations : page', () => {
  const html = renderToString(<Fondations css={tokensCss} textes={textesFondations.fr} />)

  it('affiche chaque token de tokens.css', () => {
    const absents = tousLesNoms(lireTokens(tokensCss)).filter(
      (nom) => !html.includes(`>${nom}</code>`),
    )
    expect(absents, 'tokens absents de la page').toEqual([])
  })

  it('affiche chaque token une fois par Thème', () => {
    const occurrences = html.match(/>--bg<\/code>/g) ?? []
    expect(occurrences).toHaveLength(THEMES.length)
  })

  it('rend un bloc par Thème et par catégorie', () => {
    for (const theme of THEMES) {
      expect(html.match(new RegExp(`data-theme="${theme}"`, 'g'))).toHaveLength(8)
    }
  })

  it.each(['fr', 'en'] as const)('affiche les textes de la fixture en %s', (langue) => {
    const rendu = renderToString(<Fondations css={tokensCss} textes={textesFondations[langue]} />)
    const textes = textesFondations[langue]
    for (const libelle of [textes.titre, ...Object.values(textes.categories)]) {
      expect(rendu).toContain(libelle)
    }
  })
})
