import type { Locale } from '../lib/localizedPath'

export interface Contexte {
  type: string
  repere: string
}

interface Localise {
  fr?: string
  en?: string
}

interface ImageSource {
  decorative?: boolean
  alt?: Localise
}

const LANGUES = ['fr', 'en'] as const

export class ErreurContenu extends Error {
  constructor(contexte: Contexte, champ: string, detail: string) {
    super(`Contenu invalide : ${contexte.type} « ${contexte.repere} », champ ${champ} : ${detail}.`)
    this.name = 'ErreurContenu'
  }
}

function vide(valeur: string | undefined): boolean {
  return (valeur ?? '').trim() === ''
}

function languesVides(valeur: Localise | undefined): string[] {
  return LANGUES.filter((langue) => vide(valeur?.[langue])).map((langue) => langue.toUpperCase())
}

export function texte(
  valeur: Localise | undefined,
  locale: Locale,
  contexte: Contexte,
  champ: string,
): string {
  const manquantes = languesVides(valeur)
  if (manquantes.length > 0) {
    throw new ErreurContenu(contexte, champ, `valeur ${manquantes.join(' et ')} vide`)
  }
  return valeur?.[locale] ?? ''
}

export function texteOptionnel(
  valeur: Localise | undefined,
  locale: Locale,
  contexte: Contexte,
  champ: string,
): string | undefined {
  const manquantes = languesVides(valeur)
  if (manquantes.length === LANGUES.length) return undefined
  return texte(valeur, locale, contexte, champ)
}

export function alt(image: ImageSource, locale: Locale, contexte: Contexte, champ: string): string {
  if (image.decorative === true) return ''
  return texte(image.alt, locale, contexte, `${champ}.alt`)
}
