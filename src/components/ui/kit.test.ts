import { readFileSync, readdirSync } from 'node:fs'
import stylelint from 'stylelint'
import { describe, expect, it } from 'vitest'
import configStylelint from '../../../stylelint.config.mjs'
import { PAIRES, contrastePaire, lireTokens } from '../../styles/tokens-lecture'

const racine = new URL('../../../', import.meta.url)
const lire = (chemin: string) => readFileSync(new URL(chemin, racine), 'utf8')

const dossier = new URL('./', import.meta.url)
const composants = readdirSync(dossier).filter((f) => f.endsWith('.astro'))
const tokensCss = lire('design-system/tokens.css')
const inventaire = lire('design-system/components.md')
const ajustements = lire('docs/ajustements-visuels.md')

const { racine: racineVars, themes } = lireTokens(tokensCss)

describe('kit UI : tokens', () => {
  it.each(composants)('%s ne cite que des tokens existants', (fichier) => {
    const source = readFileSync(new URL(fichier, dossier), 'utf8')
    const declares = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))
    const absents = [...source.matchAll(/var\((--[\w-]+)\)/g)]
      .map((m) => m[1])
      .filter((nom) => !declares.has(nom))
    expect(absents).toEqual([])
  })

  it.each(composants)('%s figure dans design-system/components.md', (fichier) => {
    expect(inventaire).toContain(`src/components/ui/${fichier}`)
  })
})

describe('kit UI : contrastes par Thème', () => {
  const cas = [...themes.keys()].flatMap((theme) => PAIRES.map((p) => [theme, ...p] as const))

  it.each(cas)(
    '%s / %s atteint 4,5:1 ou figure dans docs/ajustements-visuels.md',
    (theme, nom, texte, fond) => {
      const vars = themes.get(theme)
      if (!vars) throw new Error(`Thème absent : ${theme}`)
      const ratio = contrastePaire(texte, fond, vars, racineVars)
      if (ratio >= 4.5) return
      expect(ajustements, `${theme}/${nom} : ${ratio.toFixed(2)}:1`).toContain(`${theme}/${nom}`)
    },
  )
})

describe('kit UI : stylelint', () => {
  const verifier = async (code: string) =>
    (await stylelint.lint({ code, codeFilename: 'essai.css', config: configStylelint })).results[0]
      .warnings

  it.each([
    ['couleur hexadécimale', '.a { color: #fff; }'],
    ['couleur rgba', '.a { color: rgba(0, 0, 0, 0.5); }'],
    ['ombre littérale', '.a { box-shadow: 4px 4px 0 black; }'],
    ['durée littérale', '.a { transition: all 300ms; }'],
    ['taille littérale', '.a { padding: 1rem; }'],
  ])('rejette une %s', async (_nom, code) => {
    expect((await verifier(code)).length).toBeGreaterThan(0)
  })

  it('ne trouve aucune valeur littérale dans les primitives .astro', async () => {
    const resultat = await stylelint.lint({
      files: 'src/components/ui/*.astro',
      config: configStylelint,
    })
    expect(
      resultat.results.flatMap((r) => r.warnings.map((w) => `${r.source} : ${w.text}`)),
    ).toEqual([])
  })

  it('accepte un composant qui n’emploie que des tokens', async () => {
    expect(
      await verifier('.a { color: var(--text); padding: var(--space-4); width: 100%; margin: 0; }'),
    ).toEqual([])
  })
})
