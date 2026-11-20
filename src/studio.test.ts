import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { validerChampLocalise } from '../studio/lib/champLocalise'
import { CATALOGUE_UI_STRINGS, CLES_UI_STRINGS } from '../studio/lib/catalogueUiStrings'

const sourceSchema = readFileSync(
  new URL('../studio/schemaTypes/uiStrings.ts', import.meta.url),
  'utf8',
)
const types = readFileSync(new URL('./content/types.ts', import.meta.url), 'utf8')

describe('validerChampLocalise', () => {
  it('champ complet : passe', () => {
    expect(validerChampLocalise({ fr: 'Projets', en: 'Work' })).toBe(true)
  })

  it('EN vide : message nommant EN', () => {
    expect(validerChampLocalise({ fr: 'Projets', en: '' })).toBe('La version EN est obligatoire.')
  })

  it.each([undefined, null, {}, { en: 'Work' }, { fr: '  ', en: 'Work' }, { fr: 3, en: 'Work' }])(
    'FR absent, vide ou invalide (%j) : message nommant FR',
    (valeur) => {
      expect(validerChampLocalise(valeur)).toBe('La version FR est obligatoire.')
    },
  )
})

describe('catalogue uiStrings', () => {
  it('ne contient aucune clé en double', () => {
    expect(new Set(CLES_UI_STRINGS).size).toBe(CLES_UI_STRINGS.length)
  })

  it('génère les champs du schéma sans liste écrite à la main', () => {
    expect(sourceSchema).toContain('CATALOGUE_UI_STRINGS')
    expect(CATALOGUE_UI_STRINGS.length).toBeGreaterThan(0)
  })

  it('chaque clé est un champ localisé des types générés', () => {
    const bloc = /export type UiStrings = \{([\s\S]*?)\n\}/.exec(types)?.[1] ?? ''
    const champsLocalises = new Set(
      [...bloc.matchAll(/^\s+(\w+)\?: Localized(?:String|Text)$/gm)].map(
        (correspondance) => correspondance[1],
      ),
    )
    const manquantes = CLES_UI_STRINGS.filter((cle) => !champsLocalises.has(cle))
    expect(manquantes, `clés absentes de src/content/types.ts : ${manquantes.join(', ')}`).toEqual(
      [],
    )
  })
})

describe('types générés', () => {
  it('exposent SiteSettings et UiStrings', () => {
    expect(types).toMatch(/export type SiteSettings = \{/)
    expect(types).toMatch(/export type UiStrings = \{/)
  })
})
