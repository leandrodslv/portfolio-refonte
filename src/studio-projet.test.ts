import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { validerChampLocaliseOptionnel } from '../studio/lib/champLocalise'
import {
  ACCENTS,
  GABARITS,
  MESSAGE_ORDRE,
  MESSAGE_SLUG,
  estDecorative,
  idPublie,
  slugifier,
  validerAltImage,
  validerOrdre,
  validerSlug,
} from '../studio/lib/validationProjet'

const types = readFileSync(new URL('./content/types.ts', import.meta.url), 'utf8')
const config = readFileSync(new URL('../studio/sanity.config.ts', import.meta.url), 'utf8')

describe('validerAltImage', () => {
  it('image informative complète : passe', () => {
    expect(validerAltImage({ decorative: false, alt: { fr: 'Maquette', en: 'Mockup' } })).toBe(true)
  })

  it('alt EN manquant : message nommant EN', () => {
    expect(validerAltImage({ decorative: false, alt: { fr: 'Maquette' } })).toBe(
      'La version EN est obligatoire.',
    )
  })

  it.each([undefined, null, {}, { alt: undefined }])(
    'image informative sans alt (%j) : refusée',
    (image) => {
      expect(validerAltImage(image)).toMatch(/obligatoire/)
    },
  )

  it('image décorative sans alt : passe', () => {
    expect(validerAltImage({ decorative: true })).toBe(true)
    expect(estDecorative({ decorative: true })).toBe(true)
  })

  it.each([undefined, null, {}, { decorative: 'oui' }])(
    'décorative non établie (%j) : image traitée comme informative',
    (image) => {
      expect(estDecorative(image)).toBe(false)
    },
  )
})

describe('slug', () => {
  it('slug valide : accepté', () => {
    expect(validerSlug({ current: 'belote-kart' })).toBe(true)
  })

  it.each([
    { current: 'Belote Kart' },
    { current: '' },
    { current: '-belote' },
    { current: 'belote--kart' },
    {},
    undefined,
    'belote-kart',
  ])('slug invalide (%j) : message de format', (valeur) => {
    expect(validerSlug(valeur)).toBe(MESSAGE_SLUG)
  })

  it('slugifier produit un kebab-case sans accent', () => {
    expect(slugifier('Belote Kart')).toBe('belote-kart')
    expect(slugifier('  Réalisations Graphiques ! ')).toBe('realisations-graphiques')
    expect(validerSlug({ current: slugifier('UI et UX design') })).toBe(true)
  })

  it('idPublie retire le préfixe de brouillon', () => {
    expect(idPublie('drafts.abc')).toBe('abc')
    expect(idPublie('abc')).toBe('abc')
    expect(idPublie(undefined)).toBe('')
  })

  it('le verrou ne s’applique que dans l’espace production', () => {
    expect(config).toContain("verrouSlug: nom === 'production'")
  })
})

describe('ordre d’affichage', () => {
  it.each([0, 1, 12])('entier positif ou nul (%j) : accepté', (valeur) => {
    expect(validerOrdre(valeur)).toBe(true)
  })

  it.each([undefined, null, -1, 1.5, '2', Number.NaN])(
    'absent ou invalide (%j) : un seul message',
    (valeur) => {
      expect(validerOrdre(valeur)).toBe(MESSAGE_ORDRE)
    },
  )
})

describe('Gabarit et accent', () => {
  it('les trois Gabarits sont une liste fermée', () => {
    expect(GABARITS.map(({ value }) => value)).toEqual(['standard', 'graphisme', 'personnalise'])
  })

  it('les accents sont des noms de tokens existants, pas des couleurs', () => {
    const tokens = readFileSync(new URL('../design-system/tokens.css', import.meta.url), 'utf8')
    for (const accent of ACCENTS) {
      expect(tokens).toContain(`--${accent}:`)
    }
  })
})

describe('champ localisé facultatif', () => {
  it('absent ou vide : passe', () => {
    expect(validerChampLocaliseOptionnel(undefined)).toBe(true)
    expect(validerChampLocaliseOptionnel({ fr: '', en: ' ' })).toBe(true)
  })

  it('une seule langue renseignée : refusé', () => {
    expect(validerChampLocaliseOptionnel({ fr: 'Programmation' })).toBe(
      'La version EN est obligatoire.',
    )
  })
})

describe('Projet', () => {
  it('porte un texte détaillé facultatif pour les Projets sans défi ni concept', () => {
    const projet = /export type Project = \{([\s\S]*?)\n\}/.exec(types)?.[1] ?? ''
    expect(projet).toContain('descriptionDetaillee?: LocalizedTextOptionnel')
  })
})

describe('types générés', () => {
  it.each(['Project', 'SousProjet', 'ImageInformative', 'Lien'])('exposent %s', (nom) => {
    expect(types).toContain(`export type ${nom} = {`)
  })
})
