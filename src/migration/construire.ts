import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { slugifier } from '../../studio/lib/validationProjet'
import ancienSite from './ancien.json'
import {
  type AncienneLangue,
  type AncienSite,
  type ElementGraphique,
  type EnteteAncien,
  type ImageGalerie,
  type Langue,
  type ProjetAncien,
  type SousProjetAncien,
} from './ancien'
import { TABLE_UI_STRINGS, TEXTES_AJOUTES } from './tableUiStrings'

export interface DocumentImport {
  _id: string
  _type: string
  [cle: string]: unknown
}

type Valeur = Record<string, unknown>

const TEINTES: Record<string, string> = {
  'bg-pink-300': 'pink',
  'bg-yellow-300': 'yellow',
  'bg-blue-300': 'sky',
  'bg-purple-300': 'lilac',
  'bg-green-300': 'green',
  'bg-orange-300': 'orange',
  'bg-red-300': 'red',
  'bg-teal-300': 'teal',
}

export function normaliserTexte(brut: string): string {
  return brut.replaceAll('<br />', '\n').replaceAll('\\n', '\n')
}

function vide(texte: string): boolean {
  return texte.trim() === ''
}

function pareil<T>(fr: T, en: T, chemin: string): T {
  if (JSON.stringify(fr) !== JSON.stringify(en)) {
    throw new Error(`Migration : ${chemin} diffère entre FR et EN (${String(fr)} / ${String(en)}).`)
  }
  return fr
}

function appairer<T>(fr: readonly T[], en: readonly T[], chemin: string): Array<[T, T]> {
  if (fr.length !== en.length) {
    throw new Error(
      `Migration : ${chemin} compte ${fr.length} élément(s) en FR et ${en.length} en EN.`,
    )
  }
  return fr.map((element, index): [T, T] => {
    const correspondant = en[index]
    if (correspondant === undefined)
      throw new Error(`Migration : ${chemin}[${index}] absent en EN.`)
    return [element, correspondant]
  })
}

function appairerEtiquettes(fr: readonly string[], en: readonly string[]): Array<[string, string]> {
  const total = Math.max(fr.length, en.length)
  return Array.from({ length: total }, (_, index): [string, string] => {
    const texteFr = fr[index] ?? en[index] ?? ''
    return [texteFr, en[index] ?? texteFr]
  })
}

function localise(fr: string, en: string): Valeur {
  return { _type: 'localizedString', fr: normaliserTexte(fr), en: normaliserTexte(en) }
}

function localiseTexte(fr: string, en: string): Valeur {
  return { _type: 'localizedText', fr: normaliserTexte(fr), en: normaliserTexte(en) }
}

function optionnel(fr: string, en: string): Valeur | undefined {
  if (vide(fr) && vide(en)) return undefined
  return { _type: 'localizedStringOptionnel', fr: normaliserTexte(fr), en: normaliserTexte(en) }
}

function optionnelTexte(fr: string, en: string): Valeur | undefined {
  if (vide(fr) && vide(en)) return undefined
  return { _type: 'localizedTextOptionnel', fr: normaliserTexte(fr), en: normaliserTexte(en) }
}

function sans(valeur: Valeur): Valeur {
  return Object.fromEntries(Object.entries(valeur).filter(([, element]) => element !== undefined))
}

function enteteSection(fr: EnteteAncien, en: EnteteAncien): Valeur {
  return sans({
    _type: 'enteteSection',
    titre: localise(fr.titre, en.titre),
    titreMisEnAvant: optionnel(fr.titreMisEnAvant, en.titreMisEnAvant),
    sousTitre: optionnel(fr.sousTitre, en.sousTitre),
  })
}

function fichier(racinePublic: string, chemin: string): Valeur {
  const url = pathToFileURL(join(racinePublic, chemin)).href
  return { _type: 'image', _sanityAsset: `image@${url}` }
}

interface Contexte {
  racinePublic: string
}

function imageInformative(
  contexte: Contexte,
  cle: string,
  chemin: string,
  alt: Valeur,
  calque?: string,
  supplements: Valeur = {},
): Valeur {
  return sans({
    _type: 'imageInformative',
    _key: cle,
    image: fichier(contexte.racinePublic, chemin),
    decorative: false,
    alt,
    calque: calque === undefined ? undefined : fichier(contexte.racinePublic, calque),
    ...supplements,
  })
}

function altNumerote(fr: string, en: string, numero: number): Valeur {
  return localise(`${fr} - ${numero}`, `${en} - ${numero}`)
}

function galerieSousProjet(
  contexte: Contexte,
  cle: string,
  fr: SousProjetAncien,
  en: SousProjetAncien,
): Valeur[] {
  return appairer(fr.galerie, en.galerie, `${cle}.galerie`).map(
    ([imageFr, imageEn]: [ImageGalerie, ImageGalerie], index) => {
      const url = pareil(imageFr.url, imageEn.url, `${cle}.galerie[${index}].url`)
      const calque = pareil(imageFr.calque, imageEn.calque, `${cle}.galerie[${index}].calque`)
      return imageInformative(
        contexte,
        `${cle}-image-${index + 1}`,
        url,
        altNumerote(fr.titre, en.titre, index + 1),
        calque,
      )
    },
  )
}

const LIEN_FACTICE = 'VOTRE_LIEN_ICI'
const LIEN_FACTICE_EN = 'YOUR_VIDEO'

const LIBELLES_DEFI = ['\n\nLe concept :', '\n\nThe concept:']

export function decouperDefiConcept(
  description: string,
  chemin: string,
): { defi: string; concept: string } {
  const texte = normaliserTexte(description)
  for (const separateur of LIBELLES_DEFI) {
    const position = texte.indexOf(separateur)
    if (position >= 0) {
      return {
        defi: texte.slice(0, position),
        concept: texte.slice(position + 2),
      }
    }
  }
  throw new Error(`Migration : ${chemin} ne contient pas le libellé du concept.`)
}

function sousProjet(
  contexte: Contexte,
  cle: string,
  fr: SousProjetAncien,
  en: SousProjetAncien,
  libelleVisite: [string, string],
): Valeur {
  const defiConceptFr = decouperDefiConcept(fr.description, `${cle} (FR)`)
  const defiConceptEn = decouperDefiConcept(en.description, `${cle} (EN)`)
  return {
    _type: 'sousProjet',
    _key: cle,
    titre: localise(fr.titre, en.titre),
    defi: localiseTexte(defiConceptFr.defi, defiConceptEn.defi),
    concept: localiseTexte(defiConceptFr.concept, defiConceptEn.concept),
    etiquettes: appairerEtiquettes(fr.etiquettes, en.etiquettes).map(
      ([etiquetteFr, etiquetteEn], index) => ({
        ...localise(etiquetteFr, etiquetteEn),
        _key: `${cle}-etiquette-${index + 1}`,
      }),
    ),
    galerie: galerieSousProjet(contexte, cle, fr, en),
    lien: {
      _type: 'lien',
      libelle: localise(libelleVisite[0], libelleVisite[1]),
      url: pareil(fr.lien, en.lien, `${cle}.lien`),
    },
  }
}

function galerieCreations(
  contexte: Contexte,
  fr: readonly ElementGraphique[],
  en: readonly ElementGraphique[],
): Valeur[] {
  return appairer(fr, en, 'graphisme.galerie').map(([creationFr, creationEn], index) => {
    const url = pareil(creationFr.url, creationEn.url, `graphisme.galerie[${index}].url`)
    const titre = pareil(creationFr.titre, creationEn.titre, `graphisme.galerie[${index}].titre`)
    return imageInformative(
      contexte,
      `creation-${index + 1}`,
      url,
      localise(titre, titre),
      undefined,
      sans({
        titre: optionnel(titre, titre),
        categorie: optionnel(
          pareil(
            creationFr.categorie,
            creationEn.categorie,
            `graphisme.galerie[${index}].categorie`,
          ),
          creationEn.categorie,
        ),
        logiciel: optionnel(
          pareil(creationFr.logiciel, creationEn.logiciel, `graphisme.galerie[${index}].logiciel`),
          creationEn.logiciel,
        ),
        brief: optionnelTexte(creationFr.brief, creationEn.brief),
        explication: optionnelTexte(creationFr.explication, creationEn.explication),
        paysage: pareil(
          creationFr.paysage,
          creationEn.paysage,
          `graphisme.galerie[${index}].paysage`,
        ),
      }),
    )
  })
}

function liens(
  fr: ProjetAncien,
  en: ProjetAncien,
  libelleFigma: [string, string],
  libelleJeu: [string, string],
): Valeur[] {
  const resultat: Valeur[] = []
  const figma = pareil(fr.lienFigma, en.lienFigma, `projet ${fr.id}.lienFigma`)
  if (figma !== undefined) {
    resultat.push({
      _type: 'lien',
      _key: 'lien-figma',
      libelle: localise(...libelleFigma),
      url: figma,
    })
  }
  const jeu = fr.id === 2 ? pareil(fr.lienJeu, en.lienJeu, `projet ${fr.id}.lienJeu`) : undefined
  if (jeu !== undefined) {
    resultat.push({ _type: 'lien', _key: 'lien-jeu', libelle: localise(...libelleJeu), url: jeu })
  }
  appairer(
    fr.liensYoutube.filter((lien) => !lien.url.includes(LIEN_FACTICE)),
    en.liensYoutube.filter((lien) => !lien.url.includes(LIEN_FACTICE_EN)),
    `projet ${fr.id}.liensYoutube`,
  ).forEach(([lienFr, lienEn], index) => {
    resultat.push({
      _type: 'lien',
      _key: `lien-video-${index + 1}`,
      libelle: localise(lienFr.libelle, lienEn.libelle),
      url: pareil(lienFr.url, lienEn.url, `projet ${fr.id}.liensYoutube[${index}].url`),
    })
  })
  return resultat
}

function projet(
  contexte: Contexte,
  fr: ProjetAncien,
  en: ProjetAncien,
  ordre: number,
  libellesVisite: [string, string],
): DocumentImport {
  const slug = slugifier(fr.titre)
  const couleur = pareil(fr.couleur, en.couleur, `projet ${fr.id}.colorKey`)
  const couverture = pareil(fr.couverture, en.couverture, `projet ${fr.id}.image`)
  const galerie = appairer(fr.galerie, en.galerie, `projet ${fr.id}.galerie`)
  const titreCarteFr = fr.titreCarte ?? (en.titreCarte === undefined ? undefined : fr.titre)
  const titreCarteEn = en.titreCarte ?? (fr.titreCarte === undefined ? undefined : en.titre)
  const etiquettes = appairerEtiquettes(fr.etiquettes, en.etiquettes)
  const sousProjets = appairer(fr.sousProjets, en.sousProjets, `projet ${fr.id}.sousProjets`)
  const document: DocumentImport = { _id: `project-${slug}`, _type: 'project' }
  return Object.assign(
    document,
    sans({
      titre: localise(fr.titre, en.titre),
      slug: { _type: 'slug', current: slug },
      template: fr.id === 5 ? 'graphisme' : 'standard',
      titreCarte:
        titreCarteFr === undefined || titreCarteEn === undefined
          ? undefined
          : optionnel(titreCarteFr, titreCarteEn),
      categorie: localise(fr.categorie, en.categorie),
      description: localiseTexte(fr.description, en.description),
      descriptionDetaillee: optionnelTexte(fr.descriptionDetaillee, en.descriptionDetaillee),
      etiquettes: etiquettes.map(([etiquetteFr, etiquetteEn], index) => ({
        ...localise(etiquetteFr, etiquetteEn),
        _key: `etiquette-${index + 1}`,
      })),
      liens: liens(fr, en, ['Figma', 'Figma'], ['Jouer à belote-kart', 'Jouer à belote-kart']),
      couverture: imageInformative(
        contexte,
        'couverture',
        couverture,
        localise(fr.titre, en.titre),
      ),
      galerie:
        fr.creations.length > 0
          ? galerieCreations(contexte, fr.creations, en.creations)
          : galerie.map(([imageFr, imageEn], index) =>
              imageInformative(
                contexte,
                `image-${index + 1}`,
                pareil(imageFr, imageEn, `projet ${fr.id}.galerie[${index}]`),
                altNumerote(fr.titre, en.titre, index + 1),
              ),
            ),
      sousProjets: sousProjets.map(([sousFr, sousEn], index) =>
        sousProjet(contexte, `sous-projet-${index + 1}`, sousFr, sousEn, libellesVisite),
      ),
      accent: couleur.replace(/^accent(\d)$/, 'accent-$1'),
      ordre,
    }),
  )
}

function uiStrings(fr: AncienneLangue, en: AncienneLangue): DocumentImport {
  const document: DocumentImport = { _id: 'uiStrings', _type: 'uiStrings' }
  for (const { cle, chemin, longue } of TABLE_UI_STRINGS) {
    const valeurFr = fr.textes[chemin]
    const valeurEn = en.textes[chemin]
    if (valeurFr === undefined || valeurEn === undefined) {
      throw new Error(`Migration : ${chemin} absent de l'ancien site.`)
    }
    document[cle] = longue ? localiseTexte(valeurFr, valeurEn) : localise(valeurFr, valeurEn)
  }
  for (const { cle, fr: valeurFr, en: valeurEn } of TEXTES_AJOUTES) {
    document[cle] = localise(valeurFr, valeurEn)
  }
  return document
}

export function construireDocuments(
  racinePublic: string,
  ancien: AncienSite = ancienSite,
): DocumentImport[] {
  const contexte: Contexte = { racinePublic }
  const { fr, en } = ancien
  const { nom, titre, description } = ancien.index
  const heroFr = fr.hero
  const heroEn = en.hero
  const texte = (source: Record<string, unknown>, cle: string): string => {
    const valeur = source[cle]
    if (typeof valeur !== 'string') throw new Error(`Migration : hero.${cle} absent.`)
    return valeur
  }
  const parLangue = (cle: string): Valeur => localise(texte(heroFr, cle), texte(heroEn, cle))
  const projets = appairer(fr.projetsListe, en.projetsListe, 'projets').map(
    ([projetFr, projetEn], index) =>
      projet(contexte, projetFr, projetEn, index + 1, [
        fr.textes['ui.visit'] ?? '',
        en.textes['ui.visit'] ?? '',
      ]),
  )
  return [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      nomDuSite: { _type: 'localizedString', fr: nom },
      titreParDefaut: { _type: 'localizedString', fr: titre },
      descriptionParDefaut: { _type: 'localizedText', fr: description },
      urlLinkedin: 'https://linkedin.com',
    },
    uiStrings(fr, en),
    {
      _id: 'hero',
      _type: 'hero',
      badge: parLangue('badge'),
      titreLigne1: parLangue('title1'),
      titreLigne2: parLangue('title2'),
      titreLigne3: parLangue('title3'),
      sousTitre: localiseTexte(texte(heroFr, 'subtitle'), texte(heroEn, 'subtitle')),
      boutonPrincipal: parLangue('ctaPrimary'),
      boutonSecondaire: parLangue('ctaSecondary'),
    },
    {
      _id: 'sectionProjets',
      _type: 'sectionProjets',
      entete: enteteSection(fr.projets, en.projets),
    },
    {
      _id: 'sectionParcours',
      _type: 'sectionParcours',
      entete: enteteSection(fr.parcours, en.parcours),
      etapes: appairer(fr.parcours.etapes, en.parcours.etapes, 'parcours.etapes').map(
        ([etapeFr, etapeEn], index) => ({
          _type: 'etape',
          _key: `etape-${index + 1}`,
          periode: localise(etapeFr.periode, etapeEn.periode),
          titre: localise(etapeFr.titre, etapeEn.titre),
          lieu: localise(etapeFr.lieu, etapeEn.lieu),
          description: localiseTexte(etapeFr.description, etapeEn.description),
        }),
      ),
    },
    {
      _id: 'sectionCompetences',
      _type: 'sectionCompetences',
      entete: enteteSection(fr.competences, en.competences),
      competences: appairer(
        fr.competences.competences,
        en.competences.competences,
        'competences',
      ).map(([competenceFr, competenceEn], index) => {
        const couleur = pareil(
          competenceFr.couleur,
          competenceEn.couleur,
          `competence ${index}.couleur`,
        )
        const teinte = TEINTES[couleur]
        if (teinte === undefined) throw new Error(`Migration : teinte inconnue ${couleur}.`)
        return {
          _type: 'competence',
          _key: `competence-${index + 1}`,
          nom: localise(competenceFr.nom, competenceEn.nom),
          famille: pareil(
            competenceFr.famille,
            competenceEn.famille,
            `competence ${index}.famille`,
          ),
          teinte,
        }
      }),
    },
    {
      _id: 'sectionServices',
      _type: 'sectionServices',
      entete: enteteSection(fr.services, en.services),
      services: appairer(fr.services.services, en.services.services, 'services').map(
        ([serviceFr, serviceEn], index) => ({
          _type: 'service',
          _key: `service-${index + 1}`,
          titre: localise(serviceFr.titre, serviceEn.titre),
          description: localiseTexte(serviceFr.description, serviceEn.description),
        }),
      ),
    },
    {
      _id: 'sectionAPropos',
      _type: 'sectionAPropos',
      entete: enteteSection(fr.aPropos, en.aPropos),
      badge: optionnel(fr.aPropos.badge, en.aPropos.badge),
      paragraphes: appairer(fr.aPropos.paragraphes, en.aPropos.paragraphes, 'aPropos').map(
        ([paragrapheFr, paragrapheEn], index) => ({
          ...localiseTexte(paragrapheFr, paragrapheEn),
          _key: `paragraphe-${index + 1}`,
        }),
      ),
      libelleCv: localise(fr.aPropos.telechargerCv, en.aPropos.telechargerCv),
      libelleLocalisation: localise(fr.aPropos.localisation, en.aPropos.localisation),
      valeurLocalisation: localise(fr.aPropos.valeurLocalisation, en.aPropos.valeurLocalisation),
    },
    {
      _id: 'sectionContact',
      _type: 'sectionContact',
      entete: enteteSection(fr.contact, en.contact),
    },
    {
      _id: 'footer',
      _type: 'footer',
      copyright: localise(fr.piedDePage.copyright, en.piedDePage.copyright),
      indiceKonami: localise(fr.piedDePage.indiceKonami, en.piedDePage.indiceKonami),
      bio: localiseTexte(fr.piedDePage.bio, en.piedDePage.bio),
      colonneSite: localise(fr.piedDePage.colonneSite, en.piedDePage.colonneSite),
      colonneReseaux: localise(fr.piedDePage.colonneReseaux, en.piedDePage.colonneReseaux),
      colonneContact: localise(fr.piedDePage.colonneContact, en.piedDePage.colonneContact),
      disponibilite: localise(fr.piedDePage.disponibilite, en.piedDePage.disponibilite),
      signature: localise(fr.piedDePage.signature, en.piedDePage.signature),
    },
    ...projets,
  ]
}

export type { Langue }
