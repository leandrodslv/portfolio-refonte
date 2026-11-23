import { describe, expect, it } from 'vitest'
import type { Connexion } from './client'
import { lireContact, oublierLectureContact, versContactVue } from './contact'

const loc = (fr?: string, en?: string) => ({ _type: 'localizedString' as const, fr, en })
const txt = (fr?: string, en?: string) => ({ _type: 'localizedText' as const, fr, en })

function documents() {
  return [
    {
      _id: 'sectionContact',
      _type: 'sectionContact',
      entete: {
        _type: 'enteteSection',
        titre: loc('Me Contacter', 'Contact Me'),
        sousTitre: loc('Disponible', 'Available'),
      },
      libelleLienFormulaire: loc('Aller au formulaire', 'Go to the form'),
      libelleZoneFormulaire: loc('Formulaire de contact', 'Contact form'),
    },
    {
      _id: 'footer',
      _type: 'footer',
      copyright: loc('© FR', '© EN'),
      indiceKonami: loc('Indice', 'Hint'),
      bio: txt('Bio FR', 'Bio EN'),
      colonneSite: loc('Site Web', 'Website'),
      colonneReseaux: loc('Réseaux', 'Social'),
      colonneContact: loc('Contactez-moi', 'Contact me'),
      disponibilite: loc('Stage', 'Internship'),
      signature: loc('Signé', 'Signed'),
    },
  ] as unknown as Parameters<typeof versContactVue>[0]
}

describe('couche de contenu du Contact et du pied de page', () => {
  it('renvoie le Contact et le pied dans la Langue demandée', () => {
    const vue = versContactVue(documents(), 'en')
    expect(vue.contact).toEqual({
      entete: { titre: 'Contact Me', titreMisEnAvant: undefined, sousTitre: 'Available' },
      libelleLienFormulaire: 'Go to the form',
      libelleZoneFormulaire: 'Contact form',
    })
    expect(vue.pied).toEqual({
      copyright: '© EN',
      bio: 'Bio EN',
      colonneSite: 'Website',
      colonneReseaux: 'Social',
      colonneContact: 'Contact me',
      disponibilite: 'Internship',
      signature: 'Signed',
      indiceKonami: 'Hint',
    })
  })

  it('échoue en nommant le champ quand un texte manque en anglais', () => {
    const docs = documents()
    ;(docs[0] as unknown as { libelleLienFormulaire: unknown }).libelleLienFormulaire = loc(
      'Aller',
      '',
    )
    expect(() => versContactVue(docs, 'fr')).toThrow(/libelleLienFormulaire/)
  })

  it('échoue quand un champ du pied de page manque', () => {
    const docs = documents()
    ;(docs[1] as unknown as { signature?: unknown }).signature = undefined
    expect(() => versContactVue(docs, 'fr')).toThrow(/signature/)
  })

  it('échoue quand un document est absent', () => {
    expect(() => versContactVue(documents().slice(1), 'fr')).toThrow(/sectionContact/)
    expect(() => versContactVue(documents().slice(0, 1), 'fr')).toThrow(/footer/)
  })

  it('lit les deux documents en une seule requête mémoïsée', async () => {
    oublierLectureContact()
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
    await lireContact('fr', connexion)
    await lireContact('en', connexion)
    expect(appels).toBe(1)
  })
})
