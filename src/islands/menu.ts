import { fermer, ouvrir } from './overlay'

const POINT_DE_RUPTURE = '(min-width: 48rem)'

function brancher(racine: HTMLElement): void {
  const bouton = racine.querySelector<HTMLButtonElement>('[data-menu-bouton]')
  const panneau = racine.querySelector<HTMLElement>('[data-menu-panneau]')
  if (bouton === null || panneau === null) return

  const etiquetteOuvrir = bouton.dataset.etiquetteOuvrir ?? ''
  const etiquetteFermer = bouton.dataset.etiquetteFermer ?? ''

  const bureau = window.matchMedia(POINT_DE_RUPTURE)
  let ouvert = false

  const appliquer = (): void => {
    panneau.hidden = !bureau.matches && !ouvert
  }

  const mettreAJour = (valeur: boolean): void => {
    ouvert = valeur
    appliquer()
    bouton.setAttribute('aria-expanded', String(ouvert))
    bouton.setAttribute('aria-label', ouvert ? etiquetteFermer : etiquetteOuvrir)
  }

  racine.dataset.js = ''
  mettreAJour(false)

  bouton.addEventListener('click', () => {
    if (!ouvert) {
      mettreAJour(true)
      ouvrir({ panneau, declencheur: bouton, surFermeture: () => mettreAJour(false) })
    } else {
      fermer(panneau)
    }
  })

  for (const lien of panneau.querySelectorAll('a')) {
    lien.addEventListener('click', () => fermer(panneau, { rendreFocus: false }))
  }

  bureau.addEventListener('change', (evenement) => {
    if (evenement.matches) fermer(panneau, { rendreFocus: false })
    appliquer()
  })
}

export function initialiserMenus(contexte: ParentNode = document): void {
  for (const racine of contexte.querySelectorAll<HTMLElement>('[data-menu]')) brancher(racine)
}
