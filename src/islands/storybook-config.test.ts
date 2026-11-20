import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { uiStringsFixture } from '../fixtures/ui-strings'

const dossier = new URL('../../.storybook/', import.meta.url)
const lire = (nom: string) => readFileSync(new URL(nom, dossier), 'utf8')

describe('configuration Storybook', () => {
  it('ne contient aucune valeur de design en dur', () => {
    const interdit = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(|box-shadow|\bborder\b|\d(ms|s)\b/i
    for (const nom of readdirSync(dossier)) {
      expect(lire(nom), nom).not.toMatch(interdit)
    }
  })

  it('déclare Thème, Langue et deux largeurs dans la barre d’outils', () => {
    const preview = lire('preview.ts')
    expect(preview).toContain('theme:')
    expect(preview).toContain('locale:')
    expect(preview).toMatch(/mobile:[^}]*320px/)
    expect(preview).toMatch(/bureau:/)
    expect(preview).toContain("test: 'error'")
  })

  it('applique data-theme et lang sur le document', () => {
    const preview = lire('preview.ts')
    expect(preview).toContain("setAttribute('data-theme'")
    expect(preview).toContain("setAttribute('lang'")
  })

  it('fournit chaque texte de fixture en FR et en EN', () => {
    for (const valeur of Object.values(uiStringsFixture)) {
      expect(valeur.fr?.trim()).toBeTruthy()
      expect(valeur.en?.trim()).toBeTruthy()
    }
  })
})
