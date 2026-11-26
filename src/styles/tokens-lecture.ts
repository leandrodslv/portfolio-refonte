import postcss from 'postcss'

export type Variables = Map<string, string>

export interface Tokens {
  racine: Variables
  themes: Map<string, Variables>
}

export const CATEGORIES = [
  'couleur',
  'ombre',
  'bordure',
  'duree',
  'espacement',
  'typographie',
  'dimension',
  'effet',
] as const

export type Categorie = (typeof CATEGORIES)[number]

const REGLES: readonly (readonly [Categorie, RegExp])[] = [
  ['ombre', /shadow/],
  ['duree', /^--(duration|ease)-/],
  ['couleur', /^--(color|accent|skill|service)-|^--(bg|text)$|-(bg|text|color)$|^--button-border$/],
  ['bordure', /^--(border|radius)-|-border-(style|width)|-radius|^--focus-(width|offset)$/],
  ['espacement', /^--space-|-(padding|margin)-/],
  ['typographie', /^--(font|text|leading|tracking)(-|$)|-font-weight$/],
  ['dimension', /^--(size|width|bp|z)-/],
  ['effet', /^--(opacity|rotate|scale)-|-(transform|rotate|opacity|display)$/],
]

export function classer(nom: string): Categorie | undefined {
  return REGLES.find(([, motif]) => motif.test(nom))?.[0]
}

export function lireTokens(css: string): Tokens {
  const racine: Variables = new Map()
  const themes = new Map<string, Variables>()
  for (const noeud of postcss.parse(css).nodes) {
    if (noeud.type !== 'rule') continue
    const nom = /data-theme="(\w+)"/.exec(noeud.selector)?.[1]
    let cible = racine
    if (nom) {
      cible = themes.get(nom) ?? new Map<string, string>()
      themes.set(nom, cible)
    } else if (noeud.selector !== ':root') continue
    noeud.walkDecls(/^--/, (decl) => {
      cible.set(decl.prop, decl.value)
    })
  }
  return { racine, themes }
}

export function resoudre(
  valeur: string,
  theme: Variables,
  racine: Variables,
  profondeur = 0,
): string {
  if (profondeur > 10) throw new Error(`Référence circulaire : ${valeur}`)
  const ref = /^var\((--[\w-]+)\)$/.exec(valeur.trim())
  if (!ref) return valeur.trim()
  const suivante = theme.get(ref[1]) ?? racine.get(ref[1])
  if (suivante === undefined) throw new Error(`Token absent : ${ref[1]}`)
  return resoudre(suivante, theme, racine, profondeur + 1)
}

export function valeurToken(nom: string, theme: Variables, racine: Variables): string {
  return resoudre(theme.get(nom) ?? racine.get(nom) ?? '', theme, racine)
}

function luminance(hex: string): number {
  const canaux = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const [r, g, b] = canaux.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contraste(a: string, b: string): number {
  const [clair, sombre] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (clair + 0.05) / (sombre + 0.05)
}

export function contrastePaire(
  texte: string,
  fond: string,
  theme: Variables,
  racine: Variables,
): number {
  const fondRes = valeurToken(fond, theme, racine)
  const fondFinal = fondRes === 'transparent' ? valeurToken('--bg', theme, racine) : fondRes
  return contraste(valeurToken(texte, theme, racine), fondFinal)
}

export const PAIRES = [
  ['texte', '--text', '--bg'],
  ['carte', '--text', '--card-bg'],
  ['bouton-principal', '--button-primary-text', '--button-primary-bg'],
  ['bouton-principal-survol', '--button-primary-text', '--button-primary-hover-bg'],
  ['bouton-secondaire', '--button-secondary-text', '--button-secondary-bg'],
  ['autocollant', '--sticker-text', '--sticker-bg'],
  ['etiquette', '--tag-text', '--tag-bg'],
  ['badge-accroche', '--text', '--accent-1'],
  ['selecteur', '--text', '--select-bg'],
  ['carte-service-1', '--service-text', '--service-1'],
  ['carte-service-2', '--service-text', '--service-2'],
  ['carte-service-3', '--service-text', '--service-3'],
  ['carte-service-4', '--service-text', '--service-4'],
  ['champ', '--text', '--nav-bg'],
  ['erreur-champ', '--error-color', '--nav-bg'],
  ['erreur-page', '--error-color', '--bg'],
] as const
