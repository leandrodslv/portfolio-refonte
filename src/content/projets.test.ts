import type { SanityClient } from '@sanity/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Connexion } from './client'
import { lireProjets, oublierLecture, versProjetVue } from './projets'
import type { Project } from './types'

const connexion: Connexion = { projectId: 'abc123', dataset: 'dev', client: {} as SanityClient }
const reference = 'image-0a1b2c3d4e5f60718293a4b5c6d7e8f901234567-1600x900-webp'

function projet(surcharge: Partial<Project> = {}): Project {
  return {
    _id: 'p1',
    _type: 'project',
    _createdAt: '',
    _updatedAt: '',
    _rev: '',
    titre: { _type: 'localizedString', fr: 'Belote Kart', en: 'Belote Kart' },
    slug: { _type: 'slug', current: 'belote-kart' },
    template: 'standard',
    categorie: { _type: 'localizedString', fr: 'Jeu', en: 'Game' },
    description: { _type: 'localizedText', fr: 'Un jeu de cartes', en: 'A card game' },
    ...surcharge,
  }
}

describe('versProjetVue', () => {
  it('projet complet : chaînes simples pour la locale, sans _id', () => {
    const vue = versProjetVue(projet(), 'en', connexion)
    expect(vue).toMatchObject({
      slug: 'belote-kart',
      titre: 'Belote Kart',
      categorie: 'Game',
      description: 'A card game',
      etiquettes: [],
    })
    expect(JSON.stringify(vue)).not.toContain('p1')
  })

  it('EN vide : échoue avec type, slug et champ', () => {
    const casse = projet({ description: { _type: 'localizedText', fr: 'a', en: '' } })
    expect(() => versProjetVue(casse, 'fr', connexion)).toThrow(
      'project « belote-kart », champ description : valeur EN vide',
    )
  })

  it('facultatif absent : undefined ; à moitié rempli : échoue', () => {
    expect(versProjetVue(projet(), 'fr', connexion).titreCarte).toBeUndefined()
    const casse = projet({ titreCarte: { _type: 'localizedStringOptionnel', fr: 'a' } })
    expect(() => versProjetVue(casse, 'fr', connexion)).toThrow('champ titreCarte : valeur EN vide')
  })

  it('couverture informative sans alt EN : échoue en nommant couverture.alt', () => {
    const casse = projet({
      couverture: {
        _type: 'imageInformative',
        image: { _type: 'image', asset: { _ref: reference, _type: 'reference' } },
        alt: { _type: 'localizedString', fr: 'Maquette' },
      },
    })
    expect(() => versProjetVue(casse, 'fr', connexion)).toThrow(
      'project « belote-kart », champ couverture.alt : valeur EN vide',
    )
  })

  it('couverture décorative : alt vide, image optimisable', () => {
    const vue = versProjetVue(
      projet({
        couverture: {
          _type: 'imageInformative',
          decorative: true,
          alt: { _type: 'localizedString', fr: 'résiduel', en: 'residual' },
          image: { _type: 'image', asset: { _ref: reference, _type: 'reference' } },
        },
      }),
      'fr',
      connexion,
    )
    expect(vue.couverture).toMatchObject({ alt: '', largeur: 1600, hauteur: 900 })
  })

  it('slug absent : échoue', () => {
    expect(() => versProjetVue(projet({ slug: undefined }), 'fr', connexion)).toThrow('champ slug')
  })
})

describe('lireProjets', () => {
  beforeEach(oublierLecture)

  function connexionAvec(fetch: (requete: string) => Promise<Project[]>): Connexion {
    return { ...connexion, client: { fetch } as unknown as SanityClient }
  }

  it('dataset vide : liste vide, sans erreur', async () => {
    const connexionVide = connexionAvec(vi.fn().mockResolvedValue([]))
    expect(await lireProjets('fr', connexionVide)).toEqual([])
  })

  it('une seule requête pour les deux locales, triée par ordre', async () => {
    const fetch = vi.fn().mockResolvedValue([projet()])
    const connexionUnique = connexionAvec(fetch)
    const [fr] = await lireProjets('fr', connexionUnique)
    const [en] = await lireProjets('en', connexionUnique)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0]?.[0]).toContain('order(ordre asc')
    expect([fr?.titre, en?.titre]).toEqual(['Belote Kart', 'Belote Kart'])
  })
})
