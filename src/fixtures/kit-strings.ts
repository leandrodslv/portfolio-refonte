import type { LocalizedString } from '../content/types'
import type { Locale } from '../lib/localizedPath'

function l(fr: string, en: string): LocalizedString {
  return { _type: 'localizedString', fr, en }
}

export const kitStrings = {
  action: l('Voir le projet', 'View the project'),
  lien: l('Découvrir mon parcours', 'Discover my journey'),
  annonceExterne: l('(ouvre une nouvelle fenêtre)', '(opens in a new window)'),
  annonceTelechargement: l('(téléchargement)', '(download)'),
  titre: l('Mes projets', 'My projects'),
  surbrillance: l('récents', 'recent'),
  sousTitre: l('Une sélection de réalisations', 'A selection of work'),
  accroche: l('Nouveau', 'New'),
  categorie: l('Site web', 'Website'),
  etiquette: l('Accessibilité', 'Accessibility'),
  autocollant: l('Disponible', 'Available'),
  selecteur: l('Français', 'English'),
  carteTitre: l('Refonte de portfolio', 'Portfolio redesign'),
  carteTexte: l(
    'Un site statique, accessible et lisible.',
    'A static, accessible and readable site.',
  ),
  etiquetteChamp: l('Nom', 'Name'),
  aide: l('Prénom et nom', 'First and last name'),
  erreur: l('Ce champ est obligatoire.', 'This field is required.'),
  prefixeErreur: l('Erreur :', 'Error:'),
  marqueObligatoire: l('(obligatoire)', '(required)'),
  caseLabel: l('J’accepte d’être recontacté', 'I agree to be contacted'),
}

export type CleKit = keyof typeof kitStrings

const COMPLEMENT = l('plus de détails pour le test ', 'more details for the test ')

export type Textes = ((cle: CleKit) => string) & { long: (cle: CleKit) => string }

export default function textes(locale: Locale): Textes {
  const court = (cle: CleKit): string => {
    const valeur = kitStrings[cle][locale]
    if (!valeur) throw new Error(`Fixture ${cle} vide pour ${locale}.`)
    return valeur
  }
  const long = (cle: CleKit): string => {
    const base = court(cle)
    const cible = Math.ceil(base.length * 1.3)
    const complement = (COMPLEMENT[locale] ?? '').repeat(Math.ceil(cible / 10) + 1)
    return `${base} ${complement.trim()}`.slice(0, Math.max(cible, base.length + 2)).trimEnd()
  }
  return Object.assign(court, { long })
}
