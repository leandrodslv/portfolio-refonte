export interface CorrespondanceUi {
  cle: string
  chemin: string
  longue?: boolean
}

export const TABLE_UI_STRINGS: readonly CorrespondanceUi[] = [
  { cle: 'navProjets', chemin: 'nav.work' },
  { cle: 'navParcours', chemin: 'nav.journey' },
  { cle: 'navCompetences', chemin: 'nav.skills' },
  { cle: 'navContact', chemin: 'nav.contact' },
  { cle: 'navRecruter', chemin: 'nav.cta' },
  { cle: 'ouvrirMenu', chemin: 'ui.openMenu' },
  { cle: 'fermerMenu', chemin: 'ui.closeMenu' },
  { cle: 'parametres', chemin: 'ui.settings' },
  { cle: 'afficherPlus', chemin: 'showMore' },
  { cle: 'tout', chemin: 'ui.all' },
  { cle: 'organiser', chemin: 'ui.organize' },
  { cle: 'reinitialiser', chemin: 'ui.reset' },
  { cle: 'details', chemin: 'work.viewProject' },
  { cle: 'visiterSite', chemin: 'ui.visit' },
  { cle: 'jouer', chemin: 'ui.play' },
  { cle: 'zoom', chemin: 'ui.zoom' },
  { cle: 'lienLinkedin', chemin: 'ui.linkedin' },
  { cle: 'animationSurprise', chemin: 'ui.secret' },
  { cle: 'galerie', chemin: 'ui.galleryTitle' },
  { cle: 'logiciels', chemin: 'ui.software' },
  { cle: 'brief', chemin: 'ui.brief' },
  { cle: 'explication', chemin: 'ui.explanation' },
  { cle: 'leBrief', chemin: 'ui.theBrief' },
  { cle: 'leConcept', chemin: 'ui.theConcept' },
  { cle: 'liensMedias', chemin: 'ui.links' },
  { cle: 'apercuIndisponible', chemin: 'ui.preview_error' },
  { cle: 'imageManquante', chemin: 'ui.miss_img' },
  { cle: 'competenceTechnique', chemin: 'ui.hard' },
  { cle: 'competenceComportementale', chemin: 'ui.soft' },
  { cle: 'formNom', chemin: 'contact.nameLabel' },
  { cle: 'formNomIndication', chemin: 'contact.namePlaceholder' },
  { cle: 'formEmail', chemin: 'contact.emailLabel' },
  { cle: 'formEmailIndication', chemin: 'contact.emailPlaceholder' },
  { cle: 'formMessage', chemin: 'contact.messageLabel' },
  { cle: 'formMessageIndication', chemin: 'contact.messagePlaceholder' },
  { cle: 'formEnvoyer', chemin: 'contact.submit' },
  { cle: 'formSucces', chemin: 'contact.success' },
  { cle: 'formSuccesTitre', chemin: 'contact.successTitle' },
  { cle: 'formEnvoyerAutre', chemin: 'contact.sendAnother' },
  { cle: 'formAide', chemin: 'contact.formHint', longue: true },
  { cle: 'formErreurEnvoi', chemin: 'contact.errorSubmit' },
  { cle: 'formErreurConnexion', chemin: 'contact.errorConnection' },
]

export interface TexteAjoute {
  cle: string
  fr: string
  en: string
}

export const TEXTES_AJOUTES: readonly TexteAjoute[] = [
  { cle: 'allerAuContenu', fr: 'Aller au contenu', en: 'Skip to content' },
  { cle: 'navigationPrincipale', fr: 'Navigation principale', en: 'Main navigation' },
]
