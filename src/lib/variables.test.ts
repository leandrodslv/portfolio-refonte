import { describe, expect, it } from 'vitest'
import { PALIERS_ACTIFS, REGISTRE, variablesManquantes, verifierVariables } from './variables'

describe('variables', () => {
  it('aucun palier actif : rien n’est exigé', () => {
    expect(PALIERS_ACTIFS).toEqual([])
    expect(() => verifierVariables({})).not.toThrow()
  })

  it('palier activé, tout présent : passe', () => {
    const env = { SANITY_PROJECT_ID: 'a', SANITY_DATASET: 'dev', SANITY_READ_TOKEN: 'b' }
    expect(() => verifierVariables(env, ['sanity'])).not.toThrow()
  })

  it.each([undefined, '', '   '])('variable absente ou vide (%j) : nommée', (valeur) => {
    const env = { SANITY_PROJECT_ID: 'a', SANITY_DATASET: 'dev', SANITY_READ_TOKEN: valeur }
    expect(() => verifierVariables(env, ['sanity'])).toThrow(/SANITY_READ_TOKEN/)
  })

  it('liste toutes les manquantes du palier, pas celles des autres paliers', () => {
    expect(variablesManquantes({}, ['sanity'])).toEqual([
      'SANITY_PROJECT_ID',
      'SANITY_DATASET',
      'SANITY_READ_TOKEN',
    ])
  })

  it('n’écrit aucune valeur dans le message', () => {
    const marqueur = 'MARQUEUR-A-NE-PAS-AFFICHER'
    const env = { RESEND_API_KEY: marqueur, ALTCHA_HMAC_KEY: marqueur }
    expect(() => verifierVariables(env, ['contact'])).toThrow(/ALTCHA_HMAC_KEY_SECRET/)
    try {
      verifierVariables(env, ['contact'])
    } catch (erreur) {
      expect(String(erreur)).not.toContain(marqueur)
    }
  })

  it('le registre n’a pas de doublon', () => {
    const noms = REGISTRE.map(({ nom }) => nom)
    expect(new Set(noms).size).toBe(noms.length)
  })
})
