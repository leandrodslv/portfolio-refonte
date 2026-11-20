import type { createClient } from '@sanity/client'
import { describe, expect, it, vi } from 'vitest'
import { creerConnexion } from './client'

const env = {
  SANITY_PROJECT_ID: 'abc123',
  SANITY_DATASET: 'dev',
  SANITY_READ_TOKEN: 'jeton-secret',
}

describe('creerConnexion', () => {
  it('lit les documents publiés, sans CDN, avec le jeton de lecture', () => {
    const fabrique = vi.fn()
    const connexion = creerConnexion(env, fabrique as unknown as typeof createClient)
    expect(fabrique).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'abc123',
        dataset: 'dev',
        token: 'jeton-secret',
        perspective: 'published',
        useCdn: false,
      }),
    )
    expect(connexion).toMatchObject({ projectId: 'abc123', dataset: 'dev' })
  })

  it('variable vide : échoue avant toute requête, sans afficher de valeur', () => {
    const fabrique = vi.fn()
    expect(() =>
      creerConnexion(
        { ...env, SANITY_READ_TOKEN: ' ' },
        fabrique as unknown as typeof createClient,
      ),
    ).toThrow('SANITY_READ_TOKEN')
    expect(fabrique).not.toHaveBeenCalled()
  })
})
