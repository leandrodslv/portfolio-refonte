export interface CleInterface {
  cle: string
  titre: string
  longue?: boolean
}

export interface GroupeInterface {
  groupe: string
  titre: string
  cles: readonly CleInterface[]
}

export const CATALOGUE_UI_STRINGS: readonly GroupeInterface[] = [
  {
    groupe: 'navigation',
    titre: 'Navigation et menu',
    cles: [
      { cle: 'navProjets', titre: 'Lien Projets' },
      { cle: 'navParcours', titre: 'Lien Parcours' },
      { cle: 'navCompetences', titre: 'Lien Compétences' },
      { cle: 'navContact', titre: 'Lien Contact' },
      { cle: 'navRecruter', titre: 'Bouton « Me recruter »' },
      { cle: 'ouvrirMenu', titre: 'Ouvrir le menu' },
      { cle: 'fermerMenu', titre: 'Fermer le menu' },
      { cle: 'allerAuContenu', titre: 'Lien d’évitement (aller au contenu)' },
      { cle: 'navigationPrincipale', titre: 'Nom de la navigation principale' },
      { cle: 'parametres', titre: 'Paramètres' },
      { cle: 'selecteurLangue', titre: 'Sélecteur de Langue' },
      { cle: 'selecteurTheme', titre: 'Sélecteur de Thème' },
      { cle: 'themePop', titre: 'Thème Pop' },
      { cle: 'themeTerminal', titre: 'Thème Terminal' },
      { cle: 'themeWireframe', titre: 'Thème Wireframe' },
    ],
  },
  {
    groupe: 'actions',
    titre: 'Boutons et actions',
    cles: [
      { cle: 'afficherPlus', titre: 'Afficher plus' },
      { cle: 'tout', titre: 'Tout' },
      { cle: 'organiser', titre: 'Organiser' },
      { cle: 'reinitialiser', titre: 'Réinitialiser' },
      { cle: 'details', titre: 'Détails (carte de Projet)' },
      { cle: 'visiterSite', titre: 'Visiter le site' },
      { cle: 'jouer', titre: 'Jouer' },
      { cle: 'zoom', titre: 'Zoom' },
      { cle: 'lienLinkedin', titre: 'Lien vers le profil LinkedIn' },
      { cle: 'animationSurprise', titre: 'Animation surprise' },
    ],
  },
  {
    groupe: 'projet',
    titre: 'Fenêtre et page de Projet',
    cles: [
      { cle: 'galerie', titre: 'Titre de la galerie' },
      { cle: 'logiciels', titre: 'Logiciels' },
      { cle: 'brief', titre: 'Brief' },
      { cle: 'explication', titre: 'Explication technique' },
      { cle: 'leBrief', titre: 'Le brief' },
      { cle: 'leConcept', titre: 'Le concept' },
      { cle: 'liensMedias', titre: 'Liens et médias' },
      { cle: 'apercuIndisponible', titre: 'Aperçu indisponible' },
      { cle: 'imageManquante', titre: 'Image manquante' },
      { cle: 'competenceTechnique', titre: 'Compétence technique (hard)' },
      { cle: 'competenceComportementale', titre: 'Compétence comportementale (soft)' },
    ],
  },
  {
    groupe: 'formulaire',
    titre: 'Formulaire de contact',
    cles: [
      { cle: 'formNom', titre: 'Libellé du nom' },
      { cle: 'formNomIndication', titre: 'Indication du nom' },
      { cle: 'formEmail', titre: 'Libellé de l’e-mail' },
      { cle: 'formEmailIndication', titre: 'Indication de l’e-mail' },
      { cle: 'formMessage', titre: 'Libellé du message' },
      { cle: 'formMessageIndication', titre: 'Indication du message' },
      { cle: 'formEnvoyer', titre: 'Bouton Envoyer' },
      { cle: 'formSucces', titre: 'Statut d’envoi réussi' },
      { cle: 'formSuccesTitre', titre: 'Titre de confirmation' },
      { cle: 'formEnvoyerAutre', titre: 'Envoyer un autre message' },
      { cle: 'formAide', titre: 'Aide au-dessus du formulaire', longue: true },
      { cle: 'formErreurChampRequis', titre: 'Erreur : champ requis' },
      { cle: 'formErreurEmail', titre: 'Erreur : e-mail invalide' },
      { cle: 'formErreurEnvoi', titre: 'Erreur d’envoi' },
      { cle: 'formErreurConnexion', titre: 'Erreur de connexion' },
    ],
  },
  {
    groupe: 'altcha',
    titre: 'Widget ALTCHA',
    cles: [
      { cle: 'altchaEtiquette', titre: 'Étiquette de la case' },
      { cle: 'altchaVerification', titre: 'Vérification en cours' },
      { cle: 'altchaVerifie', titre: 'Vérifié' },
      { cle: 'altchaErreur', titre: 'Erreur de vérification' },
      { cle: 'altchaExpire', titre: 'Vérification expirée' },
    ],
  },
  {
    groupe: 'page404',
    titre: 'Page 404',
    cles: [
      { cle: 'page404Titre', titre: 'Titre' },
      { cle: 'page404Message', titre: 'Message', longue: true },
      { cle: 'page404Retour', titre: 'Lien de retour à l’accueil' },
    ],
  },
]

export const CLES_UI_STRINGS: readonly string[] = CATALOGUE_UI_STRINGS.flatMap(({ cles }) =>
  cles.map(({ cle }) => cle),
)
