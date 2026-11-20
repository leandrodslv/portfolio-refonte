export const FAMILLES_COMPETENCE = [
  { value: 'hard', title: 'Technique (hard)' },
  { value: 'soft', title: 'Comportementale (soft)' },
] as const

export const TEINTES = ['pink', 'yellow', 'sky', 'green', 'lilac', 'orange', 'red', 'teal'] as const

export const MESSAGE_AU_MOINS_UN = 'Ajoutez au moins un élément.'

export function validerAuMoinsUn(valeur: unknown): true | string {
  return Array.isArray(valeur) && valeur.length > 0 ? true : MESSAGE_AU_MOINS_UN
}
