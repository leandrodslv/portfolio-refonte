import { getSafeTranslation } from '../../ancien-portfolio/src/data/content'
import { chaine, chaineOptionnelle, chaines, nombre, objet, tableau, type Objet } from './lecture'

export type Langue = 'fr' | 'en'

export interface ImageGalerie {
  url: string
  calque?: string
}

export interface ElementGraphique {
  url: string
  titre: string
  categorie: string
  logiciel: string
  brief: string
  explication: string
  paysage: boolean
}

export interface SousProjetAncien {
  titre: string
  description: string
  etiquettes: string[]
  galerie: ImageGalerie[]
  lien: string
}

export interface LienYoutube {
  libelle: string
  url: string
}

export interface ProjetAncien {
  id: number
  titre: string
  titreCarte?: string
  categorie: string
  couleur: string
  description: string
  descriptionDetaillee: string
  etiquettes: string[]
  couverture: string
  lienFigma?: string
  lienJeu?: string
  liensYoutube: LienYoutube[]
  galerie: string[]
  creations: ElementGraphique[]
  sousProjets: SousProjetAncien[]
}

export interface EtapeAncienne {
  periode: string
  titre: string
  lieu: string
  description: string
}

export interface CompetenceAncienne {
  nom: string
  famille: string
  couleur: string
}

export interface ServiceAncien {
  titre: string
  description: string
}

export interface EnteteAncien {
  titre: string
  titreMisEnAvant: string
  sousTitre: string
}

export interface PiedDePageAncien {
  copyright: string
  indiceKonami: string
  bio: string
  colonneSite: string
  colonneReseaux: string
  colonneContact: string
  disponibilite: string
  signature: string
}

export interface AncienneLangue {
  textes: Record<string, string>
  hero: Objet
  projets: EnteteAncien
  parcours: EnteteAncien & { etapes: EtapeAncienne[] }
  competences: EnteteAncien & { competences: CompetenceAncienne[] }
  services: EnteteAncien & { services: ServiceAncien[] }
  aPropos: EnteteAncien & {
    badge: string
    paragraphes: string[]
    telechargerCv: string
    localisation: string
    valeurLocalisation: string
  }
  contact: EnteteAncien
  piedDePage: PiedDePageAncien
  projetsListe: ProjetAncien[]
}

function entete(brut: Objet, chemin: string): EnteteAncien {
  return {
    titre: chaine(brut.title, `${chemin}.title`),
    titreMisEnAvant: chaineOptionnelle(brut.titleHighlight, `${chemin}.titleHighlight`) ?? '',
    sousTitre: chaineOptionnelle(brut.subtitle, `${chemin}.subtitle`) ?? '',
  }
}

function toutesLesChaines(valeur: unknown, chemin: string, sortie: Record<string, string>): void {
  if (typeof valeur === 'string') {
    sortie[chemin] = valeur
  } else if (Array.isArray(valeur)) {
    valeur.forEach((element, index) => toutesLesChaines(element, `${chemin}[${index}]`, sortie))
  } else if (typeof valeur === 'object' && valeur !== null) {
    for (const [cle, element] of Object.entries(valeur)) {
      toutesLesChaines(element, chemin === '' ? cle : `${chemin}.${cle}`, sortie)
    }
  }
}

function image(brut: unknown, chemin: string): ImageGalerie {
  const donnees = objet(brut, chemin)
  return {
    url: chaine(donnees.url, `${chemin}.url`),
    calque: chaineOptionnelle(donnees.overlaySrc, `${chemin}.overlaySrc`),
  }
}

function sousProjet(brut: unknown, chemin: string): SousProjetAncien {
  const donnees = objet(brut, chemin)
  return {
    titre: chaine(donnees.title, `${chemin}.title`),
    description: chaine(donnees.description, `${chemin}.description`),
    etiquettes: chaines(donnees.tags, `${chemin}.tags`),
    galerie: tableau(donnees.gallery, `${chemin}.gallery`).map((element, index) =>
      image(element, `${chemin}.gallery[${index}]`),
    ),
    lien: chaine(donnees.link, `${chemin}.link`),
  }
}

function creation(brut: unknown, chemin: string): ElementGraphique {
  const donnees = objet(brut, chemin)
  return {
    url: chaine(donnees.url, `${chemin}.url`),
    titre: chaine(donnees.title, `${chemin}.title`),
    categorie: chaine(donnees.category, `${chemin}.category`),
    logiciel: chaine(donnees.tag, `${chemin}.tag`),
    brief: chaine(donnees.brief, `${chemin}.brief`),
    explication: chaine(donnees.explanation, `${chemin}.explanation`),
    paysage: donnees.format === 'landscape',
  }
}

function lienYoutube(brut: unknown, chemin: string): LienYoutube {
  const donnees = objet(brut, chemin)
  return {
    libelle: chaine(donnees.label, `${chemin}.label`),
    url: chaine(donnees.url, `${chemin}.url`),
  }
}

function projet(brut: unknown, chemin: string): ProjetAncien {
  const donnees = objet(brut, chemin)
  const galerie = donnees.gallery === undefined ? [] : tableau(donnees.gallery, `${chemin}.gallery`)
  const estCreation = galerie.some((element) => typeof element === 'object')
  return {
    id: nombre(donnees.id, `${chemin}.id`),
    titre: chaine(donnees.title, `${chemin}.title`),
    titreCarte: chaineOptionnelle(donnees.cardTitle, `${chemin}.cardTitle`),
    categorie: chaine(donnees.category, `${chemin}.category`),
    couleur: chaine(donnees.colorKey, `${chemin}.colorKey`),
    description: chaine(donnees.description, `${chemin}.description`),
    descriptionDetaillee: chaine(donnees.fullDescription, `${chemin}.fullDescription`),
    etiquettes: chaines(donnees.tags, `${chemin}.tags`),
    couverture: chaine(donnees.image, `${chemin}.image`),
    lienFigma: chaineOptionnelle(donnees.figmaLink, `${chemin}.figmaLink`),
    lienJeu: chaineOptionnelle(donnees.githubLink, `${chemin}.githubLink`),
    liensYoutube: tableau(donnees.youtubeLinks ?? [], `${chemin}.youtubeLinks`).map(
      (element, index) => lienYoutube(element, `${chemin}.youtubeLinks[${index}]`),
    ),
    galerie: estCreation ? [] : chaines(galerie, `${chemin}.gallery`),
    creations: estCreation
      ? galerie.map((element, index) => creation(element, `${chemin}.gallery[${index}]`))
      : [],
    sousProjets: tableau(donnees.subProjects ?? [], `${chemin}.subProjects`).map((element, index) =>
      sousProjet(element, `${chemin}.subProjects[${index}]`),
    ),
  }
}

export function lireLangue(langue: Langue): AncienneLangue {
  const brut = objet(getSafeTranslation(langue), langue)
  const timeline = objet(brut.timeline, `${langue}.timeline`)
  const skills = objet(brut.skills, `${langue}.skills`)
  const services = objet(brut.services, `${langue}.services`)
  const about = objet(brut.about, `${langue}.about`)
  const footer = objet(brut.footer, `${langue}.footer`)
  const enTetes = objet(footer.headers, `${langue}.footer.headers`)
  const textes: Record<string, string> = {}
  toutesLesChaines(brut, '', textes)
  return {
    textes,
    hero: objet(brut.hero, `${langue}.hero`),
    projets: entete(objet(brut.work, `${langue}.work`), `${langue}.work`),
    parcours: {
      ...entete(timeline, `${langue}.timeline`),
      etapes: tableau(timeline.steps, `${langue}.timeline.steps`).map((element, index) => {
        const etape = objet(element, `${langue}.timeline.steps[${index}]`)
        return {
          periode: chaine(etape.year, `${langue}.timeline.steps[${index}].year`),
          titre: chaine(etape.title, `${langue}.timeline.steps[${index}].title`),
          lieu: chaine(etape.place, `${langue}.timeline.steps[${index}].place`),
          description: chaine(etape.desc, `${langue}.timeline.steps[${index}].desc`),
        }
      }),
    },
    competences: {
      ...entete(skills, `${langue}.skills`),
      competences: tableau(skills.items, `${langue}.skills.items`).map((element, index) => {
        const competence = objet(element, `${langue}.skills.items[${index}]`)
        return {
          nom: chaine(competence.name, `${langue}.skills.items[${index}].name`),
          famille: chaine(competence.type, `${langue}.skills.items[${index}].type`),
          couleur: chaine(competence.color, `${langue}.skills.items[${index}].color`),
        }
      }),
    },
    services: {
      ...entete(services, `${langue}.services`),
      services: tableau(services.items, `${langue}.services.items`).map((element, index) => {
        const service = objet(element, `${langue}.services.items[${index}]`)
        return {
          titre: chaine(service.title, `${langue}.services.items[${index}].title`),
          description: chaine(service.desc, `${langue}.services.items[${index}].desc`),
        }
      }),
    },
    aPropos: {
      ...entete(about, `${langue}.about`),
      badge: chaineOptionnelle(about.badge, `${langue}.about.badge`) ?? '',
      paragraphes: [about.p1, about.p2, about.p3].map((element, index) =>
        chaine(element, `${langue}.about.p${index + 1}`),
      ),
      telechargerCv: chaine(about.downloadCV, `${langue}.about.downloadCV`),
      localisation: chaine(about.location, `${langue}.about.location`),
      valeurLocalisation: chaine(about.locationValue, `${langue}.about.locationValue`),
    },
    contact: entete(objet(brut.contact, `${langue}.contact`), `${langue}.contact`),
    piedDePage: {
      copyright: chaine(footer.copyright, `${langue}.footer.copyright`),
      indiceKonami: chaine(footer.konamiHint, `${langue}.footer.konamiHint`),
      bio: chaine(footer.bio, `${langue}.footer.bio`),
      colonneSite: chaine(enTetes.website, `${langue}.footer.headers.website`),
      colonneReseaux: chaine(enTetes.social, `${langue}.footer.headers.social`),
      colonneContact: chaine(enTetes.contact, `${langue}.footer.headers.contact`),
      disponibilite: chaine(footer.availability, `${langue}.footer.availability`),
      signature: chaine(footer.designedBy, `${langue}.footer.designedBy`),
    },
    projetsListe: tableau(brut.projects, `${langue}.projects`).map((element, index) =>
      projet(element, `${langue}.projects[${index}]`),
    ),
  }
}
