import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const dossier = new URL('./', import.meta.url)
const composants = readdirSync(dossier)
  .filter((f) => f.endsWith('.astro'))
  .map((f) => f.replace('.astro', ''))

const CAS_COMMUNS = ['Bureau', 'Tablette', 'TexteLong200', 'ContrasteRenforce', 'CouleursForcees']
const majuscule = (nom: string) => nom.charAt(0).toUpperCase() + nom.slice(1)

describe('kit UI : couverture Storybook', () => {
  it.each(composants)('%s a un fichier de variantes et un fichier de stories', (nom) => {
    expect(existsSync(new URL(`${nom}.variants.ts`, dossier)), `${nom}.variants.ts`).toBe(true)
    expect(existsSync(new URL(`${nom}.stories.tsx`, dossier)), `${nom}.stories.tsx`).toBe(true)
  })

  it.each(composants)('%s a une story par variante déclarée et par cas commun', (nom) => {
    const variantes = readFileSync(new URL(`${nom}.variants.ts`, dossier), 'utf8')
    const stories = readFileSync(new URL(`${nom}.stories.tsx`, dossier), 'utf8')
    const declarees = [...variantes.matchAll(/^\s{2}(\w+):\s*\(/gm)].map((m) => m[1])
    expect(declarees.length, `${nom} : aucune variante déclarée`).toBeGreaterThan(0)
    const exportees = new Set([...stories.matchAll(/export const (\w+)\b/g)].map((m) => m[1]))
    const manquantes = [...declarees.map(majuscule), ...CAS_COMMUNS].filter(
      (story) => !exportees.has(story),
    )
    expect(manquantes, `${nom} : stories manquantes`).toEqual([])
  })

  it('chaque variante déclarée est utilisée par une story', () => {
    for (const nom of composants) {
      const variantes = readFileSync(new URL(`${nom}.variants.ts`, dossier), 'utf8')
      const stories = readFileSync(new URL(`${nom}.stories.tsx`, dossier), 'utf8')
      for (const [, variante] of variantes.matchAll(/^\s{2}(\w+):\s*\(/gm)) {
        expect(
          new RegExp(`(histoire|casCommuns|interaction)\\(rendus,[^)]*'${variante}'`).test(stories),
          `${nom}.${variante} : aucune story ne l'utilise`,
        ).toBe(true)
      }
    }
  })
})
