import { describe, expect, it } from 'vitest'
import type { Connexion } from './client'
import { lireSections, oublierLectureSections, versSectionsVue } from './sections'

const loc = (fr?: string, en?: string) => ({ _type: 'localizedString' as const, fr, en })
const txt = (fr?: string, en?: string) => ({ _type: 'localizedText' as const, fr, en })
const entete = {
  _type: 'enteteSection' as const,
  titre: loc('Mon', 'My'),
  titreMisEnAvant: undefined,
}

function documents() {
  return [
    {
      _id: 'sectionParcours',
      _type: 'sectionParcours',
      entete,
      etapes: [
        {
          _type: 'etape',
          _key: 'e1',
          periode: loc('2024', '2024'),
          titre: loc('BUT', 'BUT'),
          lieu: loc('IUT', 'IUT'),
          description: txt('Formation', 'Training'),
        },
      ],
    },
    {
      _id: 'sectionCompetences',
      _type: 'sectionCompetences',
      entete,
      competences: [
        {
          _type: 'competence',
          _key: 'c1',
          nom: loc('Figma', 'Figma'),
          famille: 'hard',
          teinte: 'pink',
        },
      ],
    },
    {
      _id: 'sectionServices',
      _type: 'sectionServices',
      entete,
      services: [
        {
          _type: 'service',
          _key: 's1',
          titre: loc('Design', 'Design'),
          description: txt('Fr', 'En'),
        },
      ],
    },
    {
      _id: 'sectionAPropos',
      _type: 'sectionAPropos',
      entete,
      paragraphes: [{ _key: 'p1', ...txt('Bonjour', 'Hello') }],
      altPortrait: loc('Portrait', 'Portrait EN'),
      libelleCv: loc('CV', 'Resume'),
      libelleLocalisation: loc('Lieu', 'Place'),
      valeurLocalisation: loc('Paris', 'Paris'),
    },
  ] as unknown as Parameters<typeof versSectionsVue>[0]
}

describe('couche de contenu des Sections', () => {
  it('renvoie les quatre Sections dans la Langue demandée', () => {
    const vue = versSectionsVue(documents(), 'en')
    expect(vue.parcours.etapes[0]?.description).toBe('Training')
    expect(vue.competences.competences[0]).toEqual({
      nom: 'Figma',
      famille: 'hard',
      teinte: 'pink',
    })
    expect(vue.services.services[0]?.description).toBe('En')
    expect(vue.aPropos).toMatchObject({
      paragraphes: ['Hello'],
      altPortrait: 'Portrait EN',
      libelleCv: 'Resume',
      badge: undefined,
    })
  })

  it('échoue en nommant le champ quand un texte manque en anglais', () => {
    const docs = documents()
    const parcours = docs[0] as unknown as { etapes: { lieu: ReturnType<typeof loc> }[] }
    if (parcours.etapes[0] !== undefined) parcours.etapes[0].lieu = loc('IUT', '')
    expect(() => versSectionsVue(docs, 'fr')).toThrow(/etapes\[0\]\.lieu/)
  })

  it('échoue quand le texte alternatif du portrait manque', () => {
    const docs = documents()
    const apropos = docs[3] as unknown as { altPortrait?: unknown }
    apropos.altPortrait = undefined
    expect(() => versSectionsVue(docs, 'fr')).toThrow(/altPortrait/)
  })

  it('échoue quand une liste est vide ou un document absent', () => {
    const docs = documents()
    ;(docs[1] as unknown as { competences: unknown[] }).competences = []
    expect(() => versSectionsVue(docs, 'fr')).toThrow(/competences.*liste vide/)
    expect(() => versSectionsVue(docs.slice(1), 'fr')).toThrow(/sectionParcours/)
  })

  it('lit les quatre documents en une seule requête', async () => {
    oublierLectureSections()
    let appels = 0
    const connexion = {
      projectId: 'p',
      dataset: 'd',
      client: {
        fetch: () => {
          appels += 1
          return Promise.resolve(documents())
        },
      },
    } as unknown as Connexion
    await lireSections('fr', connexion)
    await lireSections('en', connexion)
    expect(appels).toBe(1)
  })
})
