export type Objet = Record<string, unknown>

export class ErreurAncienSite extends Error {
  constructor(chemin: string, attendu: string) {
    super(`Ancien site : ${chemin} devrait être ${attendu}.`)
    this.name = 'ErreurAncienSite'
  }
}

export function objet(valeur: unknown, chemin: string): Objet {
  if (typeof valeur !== 'object' || valeur === null || Array.isArray(valeur)) {
    throw new ErreurAncienSite(chemin, 'un objet')
  }
  return Object.fromEntries(Object.entries(valeur))
}

export function tableau(valeur: unknown, chemin: string): unknown[] {
  if (!Array.isArray(valeur)) throw new ErreurAncienSite(chemin, 'un tableau')
  return [...valeur]
}

export function chaine(valeur: unknown, chemin: string): string {
  if (typeof valeur !== 'string') throw new ErreurAncienSite(chemin, 'une chaîne')
  return valeur
}

export function chaineOptionnelle(valeur: unknown, chemin: string): string | undefined {
  return valeur === undefined ? undefined : chaine(valeur, chemin)
}

export function nombre(valeur: unknown, chemin: string): number {
  if (typeof valeur !== 'number') throw new ErreurAncienSite(chemin, 'un nombre')
  return valeur
}

export function chaines(valeur: unknown, chemin: string): string[] {
  return tableau(valeur, chemin).map((element, index) => chaine(element, `${chemin}[${index}]`))
}
