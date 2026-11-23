const FOCALISABLES = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export interface Superposition {
  panneau: HTMLElement
  declencheur: HTMLElement
  surFermeture: () => void
}

interface OptionsFermeture {
  rendreFocus?: boolean
}

const pile: Superposition[] = []

function focalisables(panneau: HTMLElement): HTMLElement[] {
  return [...panneau.querySelectorAll<HTMLElement>(FOCALISABLES)]
}

function surClavier(evenement: KeyboardEvent): void {
  const haut = pile.at(-1)
  if (haut === undefined) return
  if (evenement.key === 'Escape') {
    evenement.preventDefault()
    fermer(haut.panneau)
    return
  }
  if (evenement.key !== 'Tab') return
  const elements = focalisables(haut.panneau)
  const premier = elements.at(0)
  const dernier = elements.at(-1)
  if (premier === undefined || dernier === undefined) {
    evenement.preventDefault()
    return
  }
  const actif = haut.panneau.ownerDocument.activeElement
  if (evenement.shiftKey && (actif === premier || !haut.panneau.contains(actif))) {
    evenement.preventDefault()
    dernier.focus()
  } else if (!evenement.shiftKey && (actif === dernier || !haut.panneau.contains(actif))) {
    evenement.preventDefault()
    premier.focus()
  }
}

export function ouvrir(superposition: Superposition): void {
  if (pile.some((ouverte) => ouverte.panneau === superposition.panneau)) return
  superposition.panneau.ownerDocument.addEventListener('keydown', surClavier)
  pile.push(superposition)
  focalisables(superposition.panneau).at(0)?.focus()
}

export function fermer(panneau: HTMLElement, options: OptionsFermeture = {}): void {
  const indice = pile.findIndex((ouverte) => ouverte.panneau === panneau)
  if (indice === -1) return
  const fermees = pile.splice(indice)
  for (const superposition of fermees.reverse()) superposition.surFermeture()
  if (!pile.some((ouverte) => ouverte.panneau.ownerDocument === panneau.ownerDocument)) {
    panneau.ownerDocument.removeEventListener('keydown', surClavier)
  }
  if (options.rendreFocus !== false) fermees.at(-1)?.declencheur.focus()
}

export function nombreOuvertes(): number {
  return pile.length
}
