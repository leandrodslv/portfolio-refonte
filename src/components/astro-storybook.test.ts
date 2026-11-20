import { readFileSync } from 'node:fs'
import { afterAll, describe, expect, it } from 'vitest'
import { fermerRendu, rendreAstro } from '../../.storybook/astro-html'

afterAll(fermerRendu)

describe('rendu des composants .astro dans Storybook', () => {
  it('rend RobotsMeta en HTML', async () => {
    expect(await rendreAstro('/src/components/RobotsMeta.astro')).toContain(
      '<meta name="robots" content="noindex">',
    )
  })

  it('échoue en nommant un composant introuvable', async () => {
    await expect(rendreAstro('/src/components/Inexistant.astro')).rejects.toThrow(/Inexistant/)
  })

  it('consigne la décision dans le spine (AD-19)', () => {
    const spine = readFileSync(
      new URL(
        '../../_bmad-output/planning-artifacts/architecture/architecture-refonte portfolio-2026-11-19/ARCHITECTURE-SPINE.md',
        import.meta.url,
      ),
      'utf8',
    )
    expect(spine).toMatch(/### AD-19 — .*Storybook/)
  })
})
