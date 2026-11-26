import type { CSSProperties } from 'preact'
import {
  CATEGORIES,
  classer,
  lireTokens,
  valeurToken,
  type Categorie,
  type Variables,
} from '../styles/tokens-lecture'

export const THEMES = ['pop', 'terminal', 'wireframe'] as const
export type Theme = (typeof THEMES)[number]

export type TextesFondations = {
  titre: string
  intro: string
  apercuTypo: string
  categories: Record<Categorie, string>
  themes: Record<Theme, string>
}

type Props = { css: string; textes: TextesFondations }

const echantillonBase: CSSProperties = {
  flexShrink: 0,
  width: 'var(--size-icon-lg)',
  height: 'var(--size-icon-lg)',
  border: 'var(--border-thin) solid var(--text)',
}

function echantillon(categorie: Categorie, nom: string): CSSProperties | undefined {
  const v = `var(${nom})`
  switch (categorie) {
    case 'couleur':
      return { ...echantillonBase, background: v }
    case 'ombre':
      return {
        ...echantillonBase,
        background: 'var(--card-bg)',
        ...(nom === '--filter-nav-shadow' ? { filter: v } : { boxShadow: v }),
      }
    case 'bordure':
      if (/radius/.test(nom)) return { ...echantillonBase, borderRadius: v }
      if (/style/.test(nom)) return { ...echantillonBase, borderStyle: v }
      if (/^--focus-/.test(nom)) return undefined
      return { ...echantillonBase, borderWidth: v }
    case 'espacement':
      return { flexShrink: 0, width: v, height: 'var(--space-2)', background: 'var(--text)' }
    default:
      return undefined
  }
}

function apercuTypo(nom: string): CSSProperties | undefined {
  const v = `var(${nom})`
  if (/^--font(-sans|-mono)?$/.test(nom)) return { fontFamily: v }
  if (/font-weight/.test(nom)) return { fontWeight: v }
  if (/^--text-/.test(nom)) return { fontSize: v, lineHeight: 'var(--leading-none)' }
  if (/^--tracking-/.test(nom)) return { letterSpacing: v }
  return undefined
}

function Ligne({
  categorie,
  nom,
  theme,
  racine,
  apercu,
}: {
  categorie: Categorie
  nom: string
  theme: Variables
  racine: Variables
  apercu: string
}) {
  const style = echantillon(categorie, nom)
  const typo = categorie === 'typographie' ? apercuTypo(nom) : undefined
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        paddingBlock: 'var(--space-2)',
        borderBottom: 'var(--border-hairline) solid var(--border-color)',
      }}
    >
      {style && <span aria-hidden="true" style={style} />}
      {typo && (
        <span aria-hidden="true" style={{ flexShrink: 0, ...typo }}>
          {apercu}
        </span>
      )}
      <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-weight-bold)' }}>
          {nom}
        </code>
        <br />
        <span style={{ fontSize: 'var(--text-sm)' }}>{valeurToken(nom, theme, racine)}</span>
      </span>
    </li>
  )
}

export function Fondations({ css, textes }: Props) {
  const { racine, themes } = lireTokens(css)
  const noms = [
    ...new Set([...racine.keys(), ...[...themes.values()].flatMap((t) => [...t.keys()])]),
  ]
  const parCategorie = new Map<Categorie, string[]>(
    CATEGORIES.map((c) => [c, noms.filter((n) => classer(n) === c).sort()]),
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-weight-black)' }}>
          {textes.titre}
        </h1>
        <p>{textes.intro}</p>
      </header>
      {CATEGORIES.map((categorie) => (
        <section key={categorie} aria-labelledby={`fondations-${categorie}`}>
          <h2
            id={`fondations-${categorie}`}
            style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-weight-bold)' }}
          >
            {textes.categories[categorie]}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(100%, var(--width-footer-bio)), 1fr))',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)',
            }}
          >
            {THEMES.map((theme) => {
              const vars = themes.get(theme)
              if (!vars) throw new Error(`Thème absent de tokens.css : ${theme}`)
              return (
                <div
                  key={theme}
                  data-theme={theme}
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontFamily: 'var(--font)',
                    border: 'var(--border-thin) var(--border-style) var(--border-color)',
                    borderRadius: 'var(--radius-base)',
                  }}
                >
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                    {textes.themes[theme]}
                  </h3>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {(parCategorie.get(categorie) ?? []).map((nom) => (
                      <Ligne
                        key={nom}
                        categorie={categorie}
                        nom={nom}
                        theme={vars}
                        racine={racine}
                        apercu={textes.apercuTypo}
                      />
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
