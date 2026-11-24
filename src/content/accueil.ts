import process from 'node:process'
import type { Locale } from '../lib/localizedPath'
import { creerConnexion, type Connexion } from './client'
import { texte, texteOptionnel, type Contexte } from './localiser'
import type { Hero, SectionProjets } from './types'

export interface HeroVue {
  badge: string
  titre: [string, string, string]
  sousTitre: string
  boutonPrincipal: string
  boutonSecondaire: string
  visuels: { pop: string; terminal: string; wireframe: string }
}

export interface EnteteVue {
  titre: string
  titreMisEnAvant?: string
  sousTitre?: string
}

type DocumentAccueil = Hero | SectionProjets

const REQUETE = '*[_id in ["hero", "sectionProjets"]]'

let lecture: Promise<DocumentAccueil[]> | undefined

function lireDocuments(connexion: Connexion): Promise<DocumentAccueil[]> {
  lecture ??= connexion.client.fetch<DocumentAccueil[]>(REQUETE)
  return lecture
}

export function oublierLectureAccueil(): void {
  lecture = undefined
}

function trouver<T extends DocumentAccueil>(documents: DocumentAccueil[], type: T['_type']): T {
  const trouve = documents.find((document): document is T => document._type === type)
  if (trouve === undefined) {
    throw new Error(`Contenu invalide : document ${type} absent.`)
  }
  return trouve
}

export function versHeroVue(documents: DocumentAccueil[], locale: Locale): HeroVue {
  const hero = trouver<Hero>(documents, 'hero')
  const dans: Contexte = { type: 'hero', repere: 'hero' }
  return {
    badge: texte(hero.badge, locale, dans, 'badge'),
    titre: [
      texte(hero.titreLigne1, locale, dans, 'titreLigne1'),
      texte(hero.titreLigne2, locale, dans, 'titreLigne2'),
      texte(hero.titreLigne3, locale, dans, 'titreLigne3'),
    ],
    sousTitre: texte(hero.sousTitre, locale, dans, 'sousTitre'),
    boutonPrincipal: texte(hero.boutonPrincipal, locale, dans, 'boutonPrincipal'),
    boutonSecondaire: texte(hero.boutonSecondaire, locale, dans, 'boutonSecondaire'),
    visuels: {
      pop: texte(hero.altVisuelPop, locale, dans, 'altVisuelPop'),
      terminal: texte(hero.altVisuelTerminal, locale, dans, 'altVisuelTerminal'),
      wireframe: texte(hero.altVisuelWireframe, locale, dans, 'altVisuelWireframe'),
    },
  }
}

export function versEnteteProjets(documents: DocumentAccueil[], locale: Locale): EnteteVue {
  const section = trouver<SectionProjets>(documents, 'sectionProjets')
  const dans: Contexte = { type: 'sectionProjets', repere: 'sectionProjets' }
  return {
    titre: texte(section.entete?.titre, locale, dans, 'entete.titre'),
    titreMisEnAvant: texteOptionnel(
      section.entete?.titreMisEnAvant,
      locale,
      dans,
      'entete.titreMisEnAvant',
    ),
    sousTitre: texteOptionnel(section.entete?.sousTitre, locale, dans, 'entete.sousTitre'),
  }
}

export async function lireAccueil(
  locale: Locale,
  connexion: Connexion = creerConnexion(process.env),
): Promise<{ hero: HeroVue; projets: EnteteVue }> {
  const documents = await lireDocuments(connexion)
  return { hero: versHeroVue(documents, locale), projets: versEnteteProjets(documents, locale) }
}
