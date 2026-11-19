import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RobotsMeta from './RobotsMeta.astro'

async function rendre(): Promise<string> {
  const conteneur = await AstroContainer.create()
  return conteneur.renderToString(RobotsMeta)
}

describe('RobotsMeta', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('production : aucune balise noindex', async () => {
    vi.stubEnv('VERCEL_ENV', 'production')
    expect(await rendre()).not.toContain('noindex')
  })

  it.each(['preview', ''])('VERCEL_ENV=%j : balise noindex', async (env) => {
    vi.stubEnv('VERCEL_ENV', env)
    expect(await rendre()).toContain('<meta name="robots" content="noindex">')
  })
})
