import process from 'node:process'
import type { Locale } from '../lib/localizedPath'
import { creerConnexion, type Connexion } from './client'
import { texte, type Contexte } from './localiser'
import type { SiteSettings, UiStrings } from './types'

export interface SiteVue {
  nom: string
  evitement: string
  navigationPrincipale: string
  navigation: {
    projets: string
    parcours: string
    competences: string
    contact: string
  }
  menu: {
    ouvrir: string
    fermer: string
  }
}

type DocumentSite = SiteSettings | UiStrings

const REQUETE = '*[_id in ["siteSettings", "uiStrings"]]'

let lecture: Promise<DocumentSite[]> | undefined

function lireDocuments(connexion: Connexion): Promise<DocumentSite[]> {
  lecture ??= connexion.client.fetch<DocumentSite[]>(REQUETE)
  return lecture
}

export function oublierLectureSite(): void {
  lecture = undefined
}

function trouver<T extends DocumentSite>(documents: DocumentSite[], type: T['_type']): T {
  const trouve = documents.find((document): document is T => document._type === type)
  if (trouve === undefined) {
    throw new Error(`Contenu invalide : document ${type} absent.`)
  }
  return trouve
}

export function versSiteVue(documents: DocumentSite[], locale: Locale): SiteVue {
  const reglages = trouver<SiteSettings>(documents, 'siteSettings')
  const chaines = trouver<UiStrings>(documents, 'uiStrings')
  const dans = (type: string): Contexte => ({ type, repere: type })
  return {
    nom: texte(reglages.nomDuSite, locale, dans('siteSettings'), 'nomDuSite'),
    evitement: texte(chaines.allerAuContenu, locale, dans('uiStrings'), 'allerAuContenu'),
    navigationPrincipale: texte(
      chaines.navigationPrincipale,
      locale,
      dans('uiStrings'),
      'navigationPrincipale',
    ),
    navigation: {
      projets: texte(chaines.navProjets, locale, dans('uiStrings'), 'navProjets'),
      parcours: texte(chaines.navParcours, locale, dans('uiStrings'), 'navParcours'),
      competences: texte(chaines.navCompetences, locale, dans('uiStrings'), 'navCompetences'),
      contact: texte(chaines.navContact, locale, dans('uiStrings'), 'navContact'),
    },
    menu: {
      ouvrir: texte(chaines.ouvrirMenu, locale, dans('uiStrings'), 'ouvrirMenu'),
      fermer: texte(chaines.fermerMenu, locale, dans('uiStrings'), 'fermerMenu'),
    },
  }
}

export async function lireSite(
  locale: Locale,
  connexion: Connexion = creerConnexion(process.env),
): Promise<SiteVue> {
  return versSiteVue(await lireDocuments(connexion), locale)
}
