import { describe, expect, it } from 'vitest'
import { oublierLectureSite, lireSite, versSiteVue } from './site'
import type { Connexion } from './client'
import type { SiteSettings, UiStrings } from './types'

function localise(fr?: string, en?: string) {
  return { _type: 'localizedString' as const, fr, en }
}

const reglages = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  nomDuSite: localise('Léandro Da Silva', 'Léandro Da Silva'),
} as SiteSettings

const chaines = {
  _id: 'uiStrings',
  _type: 'uiStrings',
  navProjets: localise('Projets', 'Work'),
  navParcours: localise('Parcours', 'Journey'),
  navCompetences: localise('Compétences', 'Skills'),
  navContact: localise('Contact', 'Contact'),
  ouvrirMenu: localise('Ouvrir le menu', 'Open menu'),
  fermerMenu: localise('Fermer le menu', 'Close menu'),
  allerAuContenu: localise('Aller au contenu', 'Skip to content'),
  navigationPrincipale: localise('Navigation principale', 'Main navigation'),
} as UiStrings

describe('couche de contenu du site', () => {
  it('renvoie les textes dans la Langue demandée', () => {
    expect(versSiteVue([reglages, chaines], 'en')).toMatchObject({
      nom: 'Léandro Da Silva',
      evitement: 'Skip to content',
      navigationPrincipale: 'Main navigation',
      navigation: {
        projets: 'Work',
        parcours: 'Journey',
        competences: 'Skills',
        contact: 'Contact',
      },
      menu: { ouvrir: 'Open menu', fermer: 'Close menu' },
    })
  })

  it('échoue en nommant le champ quand une traduction manque', () => {
    const sansAnglais = { ...chaines, navProjets: localise('Projets', '') } as UiStrings
    expect(() => versSiteVue([reglages, sansAnglais], 'fr')).toThrow(/navProjets/)
  })

  it('échoue quand un document est absent', () => {
    expect(() => versSiteVue([reglages], 'fr')).toThrow(/uiStrings/)
  })

  it('lit les deux documents en une seule requête', async () => {
    oublierLectureSite()
    let appels = 0
    const connexion = {
      projectId: 'p',
      dataset: 'd',
      client: {
        fetch: () => {
          appels += 1
          return Promise.resolve([reglages, chaines])
        },
      },
    } as unknown as Connexion
    await lireSite('fr', connexion)
    await lireSite('en', connexion)
    expect(appels).toBe(1)
  })
})
