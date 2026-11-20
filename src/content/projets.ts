import process from 'node:process'
import type { Locale } from '../lib/localizedPath'
import { creerConnexion, type Connexion } from './client'
import { sourceImage, type SourceImage } from './images'
import { alt, texte, texteOptionnel, type Contexte } from './localiser'
import type { Project } from './types'

export interface ImageProjet extends SourceImage {
  alt: string
}

export interface ProjetVue {
  slug: string
  titre: string
  titreCarte?: string
  categorie: string
  description: string
  etiquettes: string[]
  couverture?: ImageProjet
  template: NonNullable<Project['template']>
  accent?: NonNullable<Project['accent']>
}

const REQUETE = '*[_type == "project"] | order(ordre asc, _createdAt asc)'

let lecture: Promise<Project[]> | undefined

function lireProjetsBruts(connexion: Connexion): Promise<Project[]> {
  lecture ??= connexion.client.fetch<Project[]>(REQUETE)
  return lecture
}

export function oublierLecture(): void {
  lecture = undefined
}

export function versProjetVue(projet: Project, locale: Locale, connexion: Connexion): ProjetVue {
  const contexte: Contexte = {
    type: 'project',
    repere: projet.slug?.current ?? projet.titre?.fr ?? 'sans identifiant',
  }
  const slug = projet.slug?.current
  if (slug === undefined || slug === '') {
    throw new Error(
      `Contenu invalide : ${contexte.type} « ${contexte.repere} », champ slug : absent.`,
    )
  }
  if (projet.template === undefined) {
    throw new Error(`Contenu invalide : ${contexte.type} « ${slug} », champ template : absent.`)
  }
  const couverture = projet.couverture
  return {
    slug,
    titre: texte(projet.titre, locale, contexte, 'titre'),
    titreCarte: texteOptionnel(projet.titreCarte, locale, contexte, 'titreCarte'),
    categorie: texte(projet.categorie, locale, contexte, 'categorie'),
    description: texte(projet.description, locale, contexte, 'description'),
    etiquettes: (projet.etiquettes ?? []).map((etiquette, index) =>
      texte(etiquette, locale, contexte, `etiquettes[${index}]`),
    ),
    couverture:
      couverture === undefined
        ? undefined
        : {
            ...sourceImage(
              couverture.image?.asset?._ref,
              connexion.projectId,
              connexion.dataset,
              contexte,
              'couverture.image',
            ),
            alt: alt(couverture, locale, contexte, 'couverture'),
          },
    template: projet.template,
    accent: projet.accent,
  }
}

export async function lireProjets(
  locale: Locale,
  connexion: Connexion = creerConnexion(process.env),
): Promise<ProjetVue[]> {
  const projets = await lireProjetsBruts(connexion)
  return projets.map((projet) => versProjetVue(projet, locale, connexion))
}
