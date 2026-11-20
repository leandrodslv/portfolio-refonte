import { validerChampLocalise } from './champLocalise'

export const GABARITS = [
  { value: 'standard', title: 'Standard' },
  { value: 'graphisme', title: 'Graphisme' },
  { value: 'personnalise', title: 'Personnalisé' },
] as const

export const ACCENTS = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-5'] as const

const FORMAT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const MESSAGE_SLUG =
  'Le slug ne contient que des minuscules, des chiffres et des tirets (ex. belote-kart).'

export function slugifier(titre: string): string {
  return titre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validerSlug(valeur: unknown): true | string {
  const courant =
    typeof valeur === 'object' && valeur !== null
      ? Object.fromEntries(Object.entries(valeur)).current
      : undefined
  return typeof courant === 'string' && FORMAT_SLUG.test(courant) ? true : MESSAGE_SLUG
}

export function estDecorative(image: unknown): boolean {
  return (
    typeof image === 'object' &&
    image !== null &&
    Object.fromEntries(Object.entries(image)).decorative === true
  )
}

export function validerAltImage(image: unknown): true | string {
  if (estDecorative(image)) return true
  const alt =
    typeof image === 'object' && image !== null
      ? Object.fromEntries(Object.entries(image)).alt
      : undefined
  return validerChampLocalise(alt)
}

export function idPublie(id: unknown): string {
  return typeof id === 'string' ? id.replace(/^drafts\./, '') : ''
}

export const MESSAGE_ORDRE = 'L’ordre est un nombre entier supérieur ou égal à 0.'

export function validerOrdre(valeur: unknown): true | string {
  return typeof valeur === 'number' && Number.isInteger(valeur) && valeur >= 0
    ? true
    : MESSAGE_ORDRE
}
