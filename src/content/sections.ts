import process from 'node:process'
import type { Locale } from '../lib/localizedPath'
import { creerConnexion, type Connexion } from './client'
import type { EnteteVue } from './accueil'
import { texte, texteOptionnel, type Contexte } from './localiser'
import type {
  EnteteSection,
  SectionAPropos,
  SectionCompetences,
  SectionParcours,
  SectionServices,
} from './types'

export type Teinte = NonNullable<NonNullable<SectionCompetences['competences']>[number]['teinte']>

export interface EtapeVue {
  periode: string
  titre: string
  lieu: string
  description: string
}

export interface CompetenceVue {
  nom: string
  famille: 'hard' | 'soft'
  teinte: Teinte
}

export interface ServiceVue {
  titre: string
  description: string
}

export interface AProposVue {
  entete: EnteteVue
  badge?: string
  paragraphes: string[]
  altPortrait: string
  libelleCv: string
  libelleLocalisation: string
  valeurLocalisation: string
}

export interface SectionsVue {
  parcours: { entete: EnteteVue; etapes: EtapeVue[] }
  competences: { entete: EnteteVue; competences: CompetenceVue[] }
  services: { entete: EnteteVue; services: ServiceVue[] }
  aPropos: AProposVue
}

type DocumentSection = SectionParcours | SectionCompetences | SectionServices | SectionAPropos

const REQUETE =
  '*[_id in ["sectionParcours", "sectionCompetences", "sectionServices", "sectionAPropos"]]'

let lecture: Promise<DocumentSection[]> | undefined

function lireDocuments(connexion: Connexion): Promise<DocumentSection[]> {
  lecture ??= connexion.client.fetch<DocumentSection[]>(REQUETE)
  return lecture
}

export function oublierLectureSections(): void {
  lecture = undefined
}

function trouver<T extends DocumentSection>(documents: DocumentSection[], type: T['_type']): T {
  const trouve = documents.find((document): document is T => document._type === type)
  if (trouve === undefined) {
    throw new Error(`Contenu invalide : document ${type} absent.`)
  }
  return trouve
}

function entete(valeur: EnteteSection | undefined, locale: Locale, dans: Contexte): EnteteVue {
  return {
    titre: texte(valeur?.titre, locale, dans, 'entete.titre'),
    titreMisEnAvant: texteOptionnel(
      valeur?.titreMisEnAvant,
      locale,
      dans,
      'entete.titreMisEnAvant',
    ),
    sousTitre: texteOptionnel(valeur?.sousTitre, locale, dans, 'entete.sousTitre'),
  }
}

function contexte(type: string): Contexte {
  return { type, repere: type }
}

function liste<T>(valeur: T[] | undefined, dans: Contexte, champ: string): T[] {
  if (valeur === undefined || valeur.length === 0) {
    throw new Error(`Contenu invalide : ${dans.type}, champ ${champ} : liste vide.`)
  }
  return valeur
}

export function versSectionsVue(documents: DocumentSection[], locale: Locale): SectionsVue {
  const parcours = trouver<SectionParcours>(documents, 'sectionParcours')
  const competences = trouver<SectionCompetences>(documents, 'sectionCompetences')
  const services = trouver<SectionServices>(documents, 'sectionServices')
  const aPropos = trouver<SectionAPropos>(documents, 'sectionAPropos')
  const dansParcours = contexte('sectionParcours')
  const dansCompetences = contexte('sectionCompetences')
  const dansServices = contexte('sectionServices')
  const dansAPropos = contexte('sectionAPropos')
  return {
    parcours: {
      entete: entete(parcours.entete, locale, dansParcours),
      etapes: liste(parcours.etapes, dansParcours, 'etapes').map((etape, index) => {
        const champ = (nom: string) => `etapes[${index}].${nom}`
        return {
          periode: texte(etape.periode, locale, dansParcours, champ('periode')),
          titre: texte(etape.titre, locale, dansParcours, champ('titre')),
          lieu: texte(etape.lieu, locale, dansParcours, champ('lieu')),
          description: texte(etape.description, locale, dansParcours, champ('description')),
        }
      }),
    },
    competences: {
      entete: entete(competences.entete, locale, dansCompetences),
      competences: liste(competences.competences, dansCompetences, 'competences').map(
        (competence, index) => {
          if (competence.famille === undefined || competence.teinte === undefined) {
            throw new Error(
              `Contenu invalide : sectionCompetences, champ competences[${index}] : famille ou teinte absente.`,
            )
          }
          return {
            nom: texte(competence.nom, locale, dansCompetences, `competences[${index}].nom`),
            famille: competence.famille,
            teinte: competence.teinte,
          }
        },
      ),
    },
    services: {
      entete: entete(services.entete, locale, dansServices),
      services: liste(services.services, dansServices, 'services').map((service, index) => ({
        titre: texte(service.titre, locale, dansServices, `services[${index}].titre`),
        description: texte(
          service.description,
          locale,
          dansServices,
          `services[${index}].description`,
        ),
      })),
    },
    aPropos: {
      entete: entete(aPropos.entete, locale, dansAPropos),
      badge: texteOptionnel(aPropos.badge, locale, dansAPropos, 'badge'),
      paragraphes: liste(aPropos.paragraphes, dansAPropos, 'paragraphes').map((paragraphe, index) =>
        texte(paragraphe, locale, dansAPropos, `paragraphes[${index}]`),
      ),
      altPortrait: texte(aPropos.altPortrait, locale, dansAPropos, 'altPortrait'),
      libelleCv: texte(aPropos.libelleCv, locale, dansAPropos, 'libelleCv'),
      libelleLocalisation: texte(
        aPropos.libelleLocalisation,
        locale,
        dansAPropos,
        'libelleLocalisation',
      ),
      valeurLocalisation: texte(
        aPropos.valeurLocalisation,
        locale,
        dansAPropos,
        'valeurLocalisation',
      ),
    },
  }
}

export async function lireSections(
  locale: Locale,
  connexion: Connexion = creerConnexion(process.env),
): Promise<SectionsVue> {
  return versSectionsVue(await lireDocuments(connexion), locale)
}
