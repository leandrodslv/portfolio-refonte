import { userEvent, within } from 'storybook/test'

const THEMES = ['pop', 'terminal', 'wireframe'] as const
const LANGUES = ['fr', 'en'] as const
const ATTRIBUTS_ID =
  /(?<![\w-])(id|for|aria-describedby|aria-controls|aria-labelledby|aria-errormessage|aria-owns|aria-details|aria-activedescendant)="([^"]*)"/g
const ANCRES = /href="#([^"]+)"/g

type Rendus = Record<string, { fr: string; en: string }>

function suffixer(html: string, suffixe: string): string {
  return html
    .replace(ATTRIBUTS_ID, (_tout, attribut: string, valeur: string) => {
      const jetons = valeur
        .split(/\s+/)
        .filter(Boolean)
        .map((jeton) => `${jeton}-${suffixe}`)
        .join(' ')
      return `${attribut}="${jetons}"`
    })
    .replace(ANCRES, (_tout, ancre: string) => `href="#${ancre}-${suffixe}"`)
}

export function Matrice({ html }: { html: { fr: string; en: string } }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {THEMES.flatMap((theme) =>
        LANGUES.map((langue) => (
          <article
            key={`${theme}-${langue}`}
            data-theme={theme}
            lang={langue}
            style={{
              padding: 'var(--space-4)',
              background: 'var(--bg)',
              color: 'var(--text)',
            }}
            dangerouslySetInnerHTML={{ __html: suffixer(html[langue], `${theme}-${langue}`) }}
          />
        )),
      )}
    </div>
  )
}

export function histoire(rendus: Rendus, nom: string) {
  const html = rendus[nom]
  if (!html) throw new Error(`Variante absente : ${nom}`)
  return { render: () => <Matrice html={html} /> }
}

type Emulation = { contrast?: 'more'; forcedColors?: 'active' }

async function emuler(
  emulation: Emulation,
  requete: string,
): Promise<(() => Promise<void>) | undefined> {
  let commandes: typeof import('vitest/browser').commands
  try {
    commandes = (await import('vitest/browser')).commands
  } catch {
    return undefined
  }
  await commandes.emulerMedia(emulation)
  if (!window.matchMedia(requete).matches) {
    throw new Error(`Émulation sans effet : ${requete}.`)
  }
  return async () => {
    await commandes.emulerMedia({ contrast: 'no-preference', forcedColors: 'none' })
  }
}

export function casCommuns(rendus: Rendus, base: string, long: string) {
  const simple = histoire(rendus, base)
  const texteLong = histoire(rendus, long)
  return {
    bureau: { ...simple, globals: { viewport: { value: 'bureau', isRotated: false } } },
    tablette: { ...simple, globals: { viewport: { value: 'tablette', isRotated: false } } },
    texteLong: { ...texteLong },
    zoom200: {
      ...texteLong,
      globals: { zoom: '200', viewport: { value: 'zoom200', isRotated: false } },
    },
    contrasteRenforce: {
      ...simple,
      beforeEach: () => emuler({ contrast: 'more' }, '(prefers-contrast: more)'),
    },
    couleursForcees: {
      ...simple,
      // Le navigateur impose ses couleurs système : le calcul de contraste d'axe n'a plus de sens.
      parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
      beforeEach: () => emuler({ forcedColors: 'active' }, '(forced-colors: active)'),
    },
  }
}

export function interaction(rendus: Rendus, base: string, cible: string) {
  const simple = histoire(rendus, base)
  const cibles = (racine: HTMLElement) => {
    const trouvees = within(racine).queryAllByRole(cible)
    if (trouvees.length === 0) throw new Error(`Aucun élément de rôle « ${cible} » dans la story.`)
    return trouvees
  }
  return {
    survol: {
      ...simple,
      play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        for (const element of cibles(canvasElement)) await userEvent.hover(element)
      },
    },
    focus: {
      ...simple,
      play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        for (const element of cibles(canvasElement)) {
          element.focus()
          await userEvent.keyboard('{Shift>}{/Shift}')
        }
      },
    },
  }
}
