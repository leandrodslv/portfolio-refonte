import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { validerChampLocalise, validerChampLocaliseOptionnel } from '../../studio/lib/champLocalise'
import { FAMILLES_COMPETENCE, TEINTES } from '../../studio/lib/sections'
import { ACCENTS, GABARITS, validerAltImage } from '../../studio/lib/validationProjet'
import { lireLangue, type Langue } from './ancien'
import {
  construireDocuments,
  decouperDefiConcept,
  normaliserTexte,
  type DocumentImport,
} from './construire'
import { fichiersReferences, versNdjson } from './sortie'
import { TABLE_UI_STRINGS } from './tableUiStrings'

const racinePublic = resolve(import.meta.dirname, '../../ancien-portfolio/public')
const documents = construireDocuments(racinePublic)
const langues: readonly Langue[] = ['fr', 'en']

function document(id: string): DocumentImport {
  const trouve = documents.find((element) => element._id === id)
  if (trouve === undefined) throw new Error(`Document ${id} absent.`)
  return trouve
}

function liste(valeur: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(valeur)) return []
  return valeur.map((element) =>
    typeof element === 'object' && element !== null
      ? Object.fromEntries(Object.entries(element))
      : {},
  )
}

function parcourir(valeur: unknown, visiteur: (objet: Record<string, unknown>) => void): void {
  if (Array.isArray(valeur)) {
    valeur.forEach((element) => parcourir(element, visiteur))
  } else if (typeof valeur === 'object' && valeur !== null) {
    const objet = Object.fromEntries(Object.entries(valeur))
    visiteur(objet)
    Object.values(objet).forEach((element) => parcourir(element, visiteur))
  }
}

function textesMigres(langue: Langue): Set<string> {
  const textes = new Set<string>()
  documents.forEach((element) =>
    parcourir(element, (objet) => {
      const type = objet._type
      const valeur = objet[langue]
      if (typeof type === 'string' && type.startsWith('localized') && typeof valeur === 'string') {
        textes.add(valeur)
      }
    }),
  )
  return textes
}

const NON_TEXTE = [
  /\.colorKey$/,
  /\.image$/,
  /\.figmaLink$/,
  /\.githubLink$/,
  /\.link$/,
  /\.url$/,
  /\.overlaySrc$/,
  /\.type$/,
  /\.color$/,
  /\.format$/,
  /\.fit$/,
  /^projects\[\d+\]\.gallery\[\d+\]$/,
]

const EXCLUS = [
  {
    motif: /^label$/,
    raison: 'nom de langue du sélecteur (FR et EN seulement dans le nouveau Site)',
  },
  { motif: /^marquee\./, raison: 'bandeau défilant, non migré' },
  { motif: /^footer\.legal\./, raison: 'mentions légales, story à venir' },
  { motif: /^ui\.(about|seeMore|source)$/, raison: 'jamais affiché, ou lien factice retiré' },
  { motif: /^projects\[2\]\.youtubeLinks\[1\]\./, raison: 'lien vidéo factice retiré' },
]

function estExclu(chemin: string): boolean {
  return (
    NON_TEXTE.some((motif) => motif.test(chemin)) || EXCLUS.some(({ motif }) => motif.test(chemin))
  )
}

function cheminsDeLangue(langue: Langue): Array<[string, string]> {
  return Object.entries(lireLangue(langue).textes).filter(
    ([chemin, valeur]) => !estExclu(chemin) && valeur.trim() !== '',
  )
}

describe('comparaison du texte de l’ancien site et du contenu migré', () => {
  const sousProjets = liste(document('project-ui-et-ux-design').sousProjets)

  for (const langue of langues) {
    it(`${langue.toUpperCase()} : aucune différence de texte`, () => {
      const migres = textesMigres(langue)
      const absents: string[] = []
      for (const [chemin, valeur] of cheminsDeLangue(langue)) {
        const correspondance = /^projects\[0\]\.subProjects\[(\d)\]\.description$/.exec(chemin)
        if (correspondance !== null) {
          const sous = sousProjets[Number(correspondance[1])]
          const defi = (sous?.defi as Record<string, string> | undefined)?.[langue]
          const concept = (sous?.concept as Record<string, string> | undefined)?.[langue]
          if (`${defi}\n\n${concept}` !== normaliserTexte(valeur)) absents.push(chemin)
        } else if (!migres.has(normaliserTexte(valeur))) {
          absents.push(chemin)
        }
      }
      expect(absents).toEqual([])
    })
  }

  it('seules les deux retouches annoncées modifient un texte', () => {
    const modifies = langues.flatMap((langue) =>
      cheminsDeLangue(langue)
        .filter(([, valeur]) => normaliserTexte(valeur) !== valeur)
        .map(([chemin]) => `${langue}:${chemin}`),
    )
    expect(modifies).toEqual([
      'fr:footer.bio',
      'en:footer.bio',
      'en:projects[0].subProjects[0].description',
      'en:projects[0].subProjects[2].description',
    ])
  })

  it('les exclusions ne couvrent aucun texte du nouveau contenu', () => {
    const sortie = versNdjson(documents)
    expect(sortie).not.toContain('marquee')
    expect(sortie).not.toContain('votre-pseudo')
    expect(sortie).not.toContain('your-repo')
    expect(sortie).not.toContain('VOTRE_LIEN_ICI')
    expect(sortie).not.toContain('Mentions Légales')
  })
})

describe('structure migrée', () => {
  it('quatre Projets triés, avec Gabarit, accent et slug valides', () => {
    const projets = documents.filter((element) => element._type === 'project')
    expect(projets.map((projet) => projet._id)).toEqual([
      'project-ui-et-ux-design',
      'project-belote-kart',
      'project-audiovisuel',
      'project-graphisme',
    ])
    expect(projets.map((projet) => projet.ordre)).toEqual([1, 2, 3, 4])
    for (const projet of projets) {
      expect(GABARITS.map(({ value }) => value)).toContain(String(projet.template))
      expect(ACCENTS.map(String)).toContain(String(projet.accent))
    }
    expect(document('project-graphisme').template).toBe('graphisme')
  })

  it('premier Projet : bouton GitHub factice retiré, Figma conservé, trois Sous-projets', () => {
    const premier = document('project-ui-et-ux-design')
    const liens = liste(premier.liens)
    expect(liens.map((lien) => lien.url)).toEqual([
      'https://www.figma.com/design/aeYPKJxgrVoGMNvELCLGeA/Untitled?node-id=0-1&t=zv0clDQ2E5l1ZEhr-1',
    ])
    expect(liste(premier.sousProjets)).toHaveLength(3)
  })

  it('galeries : 19 images Studapp avec calque, 17 images Graphisme avec leurs champs', () => {
    const studapp = liste(liste(document('project-ui-et-ux-design').sousProjets)[0]?.galerie)
    expect(studapp).toHaveLength(19)
    expect(studapp.every((image) => image.calque !== undefined)).toBe(true)
    const graphisme = liste(document('project-graphisme').galerie)
    expect(graphisme).toHaveLength(17)
    for (const image of graphisme) {
      expect(image.brief).toBeDefined()
      expect(image.explication).toBeDefined()
      expect(image.logiciel).toBeDefined()
    }
    expect(liste(document('project-belote-kart').galerie)).toHaveLength(7)
  })

  it('Sections : Parcours, Compétences, services, À propos', () => {
    expect(liste(document('sectionParcours').etapes)).toHaveLength(4)
    const competences = liste(document('sectionCompetences').competences)
    expect(competences).toHaveLength(8)
    for (const competence of competences) {
      expect(FAMILLES_COMPETENCE.map(({ value }) => value)).toContain(String(competence.famille))
      expect(TEINTES.map(String)).toContain(String(competence.teinte))
    }
    expect(liste(document('sectionServices').services)).toHaveLength(4)
    expect(liste(document('sectionAPropos').paragraphes)).toHaveLength(3)
  })

  it('étiquettes sans pendant gardées dans les deux langues', () => {
    const audiovisuel = liste(document('project-audiovisuel').etiquettes)
    expect(audiovisuel.map((etiquette) => etiquette.en)).toEqual(['Premiere', 'Photo', 'Lumière'])
    const graphisme = liste(document('project-graphisme').etiquettes)
    expect(graphisme.map((etiquette) => etiquette.fr)).toContain('Lightroom')
  })

  it('titre de carte facultatif complété par le titre de l’autre langue', () => {
    const belote = document('project-belote-kart')
    expect(belote.titreCarte).toMatchObject({ fr: 'Programmation', en: 'Programming' })
    expect(document('project-audiovisuel').titreCarte).toBeUndefined()
  })

  it('identifiants uniques et clés présentes sur chaque élément de tableau', () => {
    const identifiants = documents.map((element) => element._id)
    expect(new Set(identifiants).size).toBe(identifiants.length)
    documents.forEach((element) =>
      parcourir(element, (objet) => {
        for (const valeur of Object.values(objet)) {
          if (Array.isArray(valeur)) {
            for (const item of liste(valeur)) expect(item._key).toBeTypeOf('string')
          }
        }
      }),
    )
  })

  it('chaque champ localisé respecte la validation du Studio (sauf siteSettings, EN à rédiger)', () => {
    for (const element of documents.filter((autre) => autre._id !== 'siteSettings')) {
      parcourir(element, (objet) => {
        if (objet._type === 'localizedString' || objet._type === 'localizedText') {
          expect(validerChampLocalise(objet)).toBe(true)
        }
        if (
          objet._type === 'localizedStringOptionnel' ||
          objet._type === 'localizedTextOptionnel'
        ) {
          expect(validerChampLocaliseOptionnel(objet)).toBe(true)
        }
      })
    }
  })

  it('chaque image informative a un texte alternatif FR et EN', () => {
    documents.forEach((element) =>
      parcourir(element, (objet) => {
        if (objet._type === 'imageInformative') expect(validerAltImage(objet)).toBe(true)
      }),
    )
  })

  it('siteSettings : FR seul, EN à rédiger ; uiStrings : seules les clés de l’ancien site', () => {
    expect(document('siteSettings').nomDuSite).toEqual({
      _type: 'localizedString',
      fr: 'Léandro Da Silva',
    })
    const cles = Object.keys(document('uiStrings')).filter((cle) => !cle.startsWith('_'))
    expect(cles.sort()).toEqual(TABLE_UI_STRINGS.map(({ cle }) => cle).sort())
  })

  it('sortie déterministe', () => {
    expect(versNdjson(construireDocuments(racinePublic))).toBe(versNdjson(documents))
  })
})

describe('images', () => {
  it('chaque fichier référencé existe dans ancien-portfolio/public', () => {
    const manquants = fichiersReferences(documents).filter((chemin) => !existsSync(chemin))
    expect(manquants).toEqual([])
  })
})

describe('découpe défi et concept', () => {
  it('FR : coupe avant le libellé du concept, libellés conservés', () => {
    expect(decouperDefiConcept('Le défi : A.\n\nLe concept : B.', 'x')).toEqual({
      defi: 'Le défi : A.',
      concept: 'Le concept : B.',
    })
  })

  it('EN avec séquence littérale \\n : vrais sauts de ligne', () => {
    expect(decouperDefiConcept('The challenge: A.\\n\\nThe concept: B.', 'x')).toEqual({
      defi: 'The challenge: A.',
      concept: 'The concept: B.',
    })
  })

  it('libellé du concept absent : échoue en nommant le Sous-projet', () => {
    expect(() => decouperDefiConcept('Seulement un texte', 'sous-projet-1 (FR)')).toThrow(
      'sous-projet-1 (FR)',
    )
  })
})

describe('retouches de texte', () => {
  it('<br /> et \\n littéral deviennent des sauts de ligne', () => {
    expect(normaliserTexte('a<br />b')).toBe('a\nb')
    expect(normaliserTexte('a\\n\\nb')).toBe('a\n\nb')
    expect(normaliserTexte('inchangé')).toBe('inchangé')
  })
})
