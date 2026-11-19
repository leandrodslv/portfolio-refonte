import { describe, expect, it } from 'vitest'
import { localizedPath } from './localizedPath'

describe('localizedPath', () => {
  it('renvoie la Page d’accueil FR à la racine', () => {
    expect(localizedPath('fr')).toBe('/')
  })

  it('renvoie la Page d’accueil EN sous /en/', () => {
    expect(localizedPath('en')).toBe('/en/')
  })

  it('construit l’adresse d’un Projet en FR', () => {
    expect(localizedPath('fr', 'belote-kart')).toBe('/projets/belote-kart')
  })

  it('construit l’adresse d’un Projet en EN', () => {
    expect(localizedPath('en', 'belote-kart')).toBe('/en/projects/belote-kart')
  })
})
