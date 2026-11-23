import { describe, expect, it } from 'vitest'
import { lireAccueil, oublierLectureAccueil, versEnteteProjets, versHeroVue } from './accueil'
import type { Connexion } from './client'
import type { Hero, SectionProjets } from './types'

function localise(fr?: string, en?: string) {
  return { _type: 'localizedString' as const, fr, en }
}

const hero = {
  _id: 'hero',
  _type: 'hero',
  badge: localise('Disponible', 'Available'),
  titreLigne1: localise('Product', 'Product'),
  titreLigne2: localise('Designer', 'Designer'),
  titreLigne3: localise('UX/UI', 'UX/UI'),
  sousTitre: { _type: 'localizedText' as const, fr: 'Sous-titre', en: 'Subtitle' },
  boutonPrincipal: localise('Voir', 'See'),
  boutonSecondaire: localise('Contact', 'Contact'),
  altVisuelPop: localise('Collage', 'Collage EN'),
  altVisuelTerminal: localise('Code', 'Code EN'),
  altVisuelWireframe: localise('Maillage', 'Mesh EN'),
} as Hero

const section = {
  _id: 'sectionProjets',
  _type: 'sectionProjets',
  entete: {
    _type: 'enteteSection',
    titre: localise('Mes', 'My'),
    titreMisEnAvant: localise('projets', 'work'),
  },
} as unknown as SectionProjets

describe('couche de contenu de l’accueil', () => {
  it('renvoie le Hero dans la Langue demandée, avec un alt par Thème', () => {
    expect(versHeroVue([hero, section], 'en')).toMatchObject({
      badge: 'Available',
      titre: ['Product', 'Designer', 'UX/UI'],
      visuels: { pop: 'Collage EN', terminal: 'Code EN', wireframe: 'Mesh EN' },
    })
  })

  it('renvoie l’en-tête de la Section Projets, sous-titre facultatif', () => {
    expect(versEnteteProjets([hero, section], 'fr')).toEqual({
      titre: 'Mes',
      titreMisEnAvant: 'projets',
      sousTitre: undefined,
    })
  })

  it('échoue en nommant le champ quand un alt manque en anglais', () => {
    const sansAlt = { ...hero, altVisuelPop: localise('Collage', '') } as Hero
    expect(() => versHeroVue([sansAlt, section], 'fr')).toThrow(/altVisuelPop/)
  })

  it('échoue quand un document est absent', () => {
    expect(() => versHeroVue([section], 'fr')).toThrow(/hero/)
  })

  it('lit les deux documents en une seule requête', async () => {
    oublierLectureAccueil()
    let appels = 0
    const connexion = {
      projectId: 'p',
      dataset: 'd',
      client: {
        fetch: () => {
          appels += 1
          return Promise.resolve([hero, section])
        },
      },
    } as unknown as Connexion
    await lireAccueil('fr', connexion)
    await lireAccueil('en', connexion)
    expect(appels).toBe(1)
  })
})
