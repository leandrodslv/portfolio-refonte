import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { validerChampLocaliseOptionnel } from '../studio/lib/champLocalise'
import {
  FAMILLES_COMPETENCE,
  MESSAGE_AU_MOINS_UN,
  TEINTES,
  validerAuMoinsUn,
} from '../studio/lib/sections'

const types = readFileSync(new URL('./content/types.ts', import.meta.url), 'utf8')
const structure = readFileSync(new URL('../studio/structure.ts', import.meta.url), 'utf8')

const SINGLETONS_SECTIONS = [
  ['hero', 'Hero'],
  ['sectionProjets', 'SectionProjets'],
  ['sectionParcours', 'SectionParcours'],
  ['sectionCompetences', 'SectionCompetences'],
  ['sectionServices', 'SectionServices'],
  ['sectionAPropos', 'SectionAPropos'],
  ['sectionContact', 'SectionContact'],
  ['footer', 'Footer'],
] as const

describe('validerAuMoinsUn', () => {
  it('au moins un élément : passe', () => {
    expect(validerAuMoinsUn([{ _key: 'a' }])).toBe(true)
  })

  it.each([[], undefined, null, 'texte', {}])('sans élément (%j) : refusé', (valeur) => {
    expect(validerAuMoinsUn(valeur)).toBe(MESSAGE_AU_MOINS_UN)
  })
})

describe('en-tête de Section', () => {
  it('mot mis en avant et sous-titre absents : passent', () => {
    expect(validerChampLocaliseOptionnel(undefined)).toBe(true)
  })

  it('mot mis en avant avec FR seul : message nommant EN', () => {
    expect(validerChampLocaliseOptionnel({ fr: 'RÉALISÉS' })).toBe('La version EN est obligatoire.')
  })
})

describe('compétences', () => {
  it('deux familles fermées', () => {
    expect(FAMILLES_COMPETENCE.map(({ value }) => value)).toEqual(['hard', 'soft'])
  })

  it('les teintes sont des noms, jamais des valeurs de couleur', () => {
    expect(TEINTES).toHaveLength(8)
    for (const teinte of TEINTES) {
      expect(teinte).toMatch(/^[a-z]+$/)
    }
  })
})

describe('Section Contact', () => {
  it('porte les deux libellés localisés du repli et de la zone du formulaire', () => {
    const bloc = /export type SectionContact = \{[^}]*\}/.exec(types)?.[0] ?? ''
    expect(bloc).toContain('libelleLienFormulaire?: LocalizedString')
    expect(bloc).toContain('libelleZoneFormulaire?: LocalizedString')
  })
})

describe('singletons de Sections', () => {
  it.each(SINGLETONS_SECTIONS)(
    '%s : dans le bureau du Studio et dans les types générés',
    (type, nomType) => {
      expect(structure).toContain(`type: '${type}'`)
      expect(types).toContain(`export type ${nomType} = {`)
    },
  )

  it('les éléments des Sections sont des tableaux réorganisables, sans champ ordre', () => {
    for (const nom of ['etapes', 'competences', 'services', 'paragraphes']) {
      expect(types).toContain(`  ${nom}?: Array<`)
    }
  })
})
