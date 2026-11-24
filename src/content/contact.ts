import process from 'node:process'
import type { Locale } from '../lib/localizedPath'
import { creerConnexion, type Connexion } from './client'
import type { EnteteVue } from './accueil'
import { texte, texteOptionnel, type Contexte } from './localiser'
import type { Footer, SectionContact } from './types'

export interface ContactVue {
  entete: EnteteVue
  libelleLienFormulaire: string
  libelleZoneFormulaire: string
}

export interface PiedVue {
  copyright: string
  bio: string
  colonneSite: string
  colonneReseaux: string
  colonneContact: string
  disponibilite: string
  signature: string
  indiceKonami: string
}

type DocumentContact = SectionContact | Footer

const REQUETE = '*[_id in ["sectionContact", "footer"]]'

let lecture: Promise<DocumentContact[]> | undefined

function lireDocuments(connexion: Connexion): Promise<DocumentContact[]> {
  lecture ??= connexion.client.fetch<DocumentContact[]>(REQUETE)
  return lecture
}

export function oublierLectureContact(): void {
  lecture = undefined
}

function trouver<T extends DocumentContact>(documents: DocumentContact[], type: T['_type']): T {
  const trouve = documents.find((document): document is T => document._type === type)
  if (trouve === undefined) {
    throw new Error(`Contenu invalide : document ${type} absent.`)
  }
  return trouve
}

export function versContactVue(
  documents: DocumentContact[],
  locale: Locale,
): { contact: ContactVue; pied: PiedVue } {
  const contact = trouver<SectionContact>(documents, 'sectionContact')
  const pied = trouver<Footer>(documents, 'footer')
  const dansContact: Contexte = { type: 'sectionContact', repere: 'sectionContact' }
  const dansPied: Contexte = { type: 'footer', repere: 'footer' }
  return {
    contact: {
      entete: {
        titre: texte(contact.entete?.titre, locale, dansContact, 'entete.titre'),
        titreMisEnAvant: texteOptionnel(
          contact.entete?.titreMisEnAvant,
          locale,
          dansContact,
          'entete.titreMisEnAvant',
        ),
        sousTitre: texteOptionnel(
          contact.entete?.sousTitre,
          locale,
          dansContact,
          'entete.sousTitre',
        ),
      },
      libelleLienFormulaire: texte(
        contact.libelleLienFormulaire,
        locale,
        dansContact,
        'libelleLienFormulaire',
      ),
      libelleZoneFormulaire: texte(
        contact.libelleZoneFormulaire,
        locale,
        dansContact,
        'libelleZoneFormulaire',
      ),
    },
    pied: {
      copyright: texte(pied.copyright, locale, dansPied, 'copyright'),
      bio: texte(pied.bio, locale, dansPied, 'bio'),
      colonneSite: texte(pied.colonneSite, locale, dansPied, 'colonneSite'),
      colonneReseaux: texte(pied.colonneReseaux, locale, dansPied, 'colonneReseaux'),
      colonneContact: texte(pied.colonneContact, locale, dansPied, 'colonneContact'),
      disponibilite: texte(pied.disponibilite, locale, dansPied, 'disponibilite'),
      signature: texte(pied.signature, locale, dansPied, 'signature'),
      indiceKonami: texte(pied.indiceKonami, locale, dansPied, 'indiceKonami'),
    },
  }
}

export async function lireContact(
  locale: Locale,
  connexion: Connexion = creerConnexion(process.env),
): Promise<{ contact: ContactVue; pied: PiedVue }> {
  return versContactVue(await lireDocuments(connexion), locale)
}
