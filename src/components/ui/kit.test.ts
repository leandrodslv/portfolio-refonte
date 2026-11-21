import { readFileSync, readdirSync } from 'node:fs'
import postcss from 'postcss'
import stylelint from 'stylelint'
import { describe, expect, it } from 'vitest'
import configStylelint from '../../../stylelint.config.mjs'

const racine = new URL('../../../', import.meta.url)
const lire = (chemin: string) => readFileSync(new URL(chemin, racine), 'utf8')

const dossier = new URL('./', import.meta.url)
const composants = readdirSync(dossier).filter((f) => f.endsWith('.astro'))
const tokensCss = lire('design-system/tokens.css')
const inventaire = lire('design-system/components.md')
const ajustements = lire('docs/ajustements-visuels.md')

type Variables = Map<string, string>
const racineVars: Variables = new Map()
const themes = new Map<string, Variables>()

for (const noeud of postcss.parse(tokensCss).nodes) {
  if (noeud.type !== 'rule') continue
  const nom = /data-theme="(\w+)"/.exec(noeud.selector)?.[1]
  let cible = racineVars
  if (nom) {
    cible = themes.get(nom) ?? new Map<string, string>()
    themes.set(nom, cible)
  } else if (noeud.selector !== ':root') continue
  noeud.walkDecls(/^--/, (decl) => {
    cible.set(decl.prop, decl.value)
  })
}

function resoudre(valeur: string, theme: Variables, profondeur = 0): string {
  if (profondeur > 10) throw new Error(`Référence circulaire : ${valeur}`)
  const ref = /^var\((--[\w-]+)\)$/.exec(valeur.trim())
  if (!ref) return valeur.trim()
  const suivante = theme.get(ref[1]) ?? racineVars.get(ref[1])
  if (suivante === undefined) throw new Error(`Token absent : ${ref[1]}`)
  return resoudre(suivante, theme, profondeur + 1)
}

function luminance(hex: string): number {
  const canaux = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canaux.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contraste(a: string, b: string): number {
  const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (clair + 0.05) / (sombre + 0.05)
}

const PAIRES = [
  ['texte', '--text', '--bg'],
  ['carte', '--text', '--card-bg'],
  ['bouton-principal', '--button-primary-text', '--button-primary-bg'],
  ['bouton-secondaire', '--button-secondary-text', '--button-secondary-bg'],
  ['autocollant', '--sticker-text', '--sticker-bg'],
  ['etiquette', '--tag-text', '--tag-bg'],
  ['badge-accroche', '--text', '--accent-1'],
  ['selecteur', '--text', '--select-bg'],
] as const

describe('kit UI : tokens', () => {
  it.each(composants)('%s ne cite que des tokens existants', (fichier) => {
    const source = readFileSync(new URL(fichier, dossier), 'utf8')
    const absents = [...source.matchAll(/var\((--[\w-]+)\)/g)]
      .map((m) => m[1])
      .filter((nom) => !new RegExp(`${nom}\\s*:`).test(tokensCss))
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
      const fondRes = resoudre(vars.get(fond) ?? racineVars.get(fond) ?? '', vars)
      const fondFinal = fondRes === 'transparent' ? resoudre(vars.get('--bg') ?? '', vars) : fondRes
      const texteRes = resoudre(vars.get(texte) ?? racineVars.get(texte) ?? '', vars)
      const ratio = contraste(texteRes, fondFinal)
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
