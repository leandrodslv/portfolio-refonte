export const LANGUES = ['fr', 'en'] as const
export type Langue = (typeof LANGUES)[number]

export function messageLangueManquante(langue: Langue): string {
  return `La version ${langue.toUpperCase()} est obligatoire.`
}

export function validerChampLocalise(valeur: unknown): true | string {
  const champ: Record<string, unknown> =
    typeof valeur === 'object' && valeur !== null ? Object.fromEntries(Object.entries(valeur)) : {}
  for (const langue of LANGUES) {
    const texte = champ[langue]
    if (typeof texte !== 'string' || texte.trim() === '') {
      return messageLangueManquante(langue)
    }
  }
  return true
}
