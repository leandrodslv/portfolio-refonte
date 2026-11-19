---
title: "PRD — refonte technique du portfolio de Léandro Da Silva"
status: final
created: 2026-11-19
updated: 2026-11-19
---

# PRD : refonte technique du portfolio
*Titre de travail.*

## 0. Objet du document

Ce PRD décrit ce que le nouveau portfolio doit faire. Il s'adresse à Léandro (auteur et seul décideur) et aux étapes BMAD suivantes : UX, architecture, découpage en épopées et stories. Il s'appuie sur le brief produit (`_bmad-output/planning-artifacts/briefs/brief-refonte portfolio-2026-11-19/`), dont il ne répète pas les arguments, et sur l'audit du site en ligne et de son code. Sanity est acté (brief). Le framework du Site et l'hébergeur ne sont pas décidés ici : ils relèvent de l'architecture.

Les termes du glossaire (§3) sont utilisés tels quels partout. Chaque hypothèse non confirmée est marquée `[ASSUMPTION]` et reprise dans l'index final (§10).

Léandro a délégué la rédaction de ce PRD. Il est donc relu, pas co-écrit : tout ce qui est marqué `[ASSUMPTION]` attend sa confirmation.

## 1. Vision

Reconstruire le portfolio de Léandro à l'identique pour le Visiteur, et entièrement autrement dessous. Le **Visiteur** voit le même Site : mêmes Projets, mêmes textes, même design, mêmes trois thèmes. Sous la surface, le Site devient statique, lisible par les moteurs de recherche et les aperçus de liens, alimenté par un CMS headless, sécurisé et accessible.

Le projet a une double raison d'être. C'est un terrain d'apprentissage (CMS headless, sécurité, accessibilité) avant une activité de freelance envisagée d'ici un an. Et c'est une preuve : Léandro se présente comme « Product Designer UX/UI & IA, accessible by design », donc son propre site ne peut pas être pris en défaut sur ces points.

## 2. Utilisateurs cibles

### 2.1 Besoins (Jobs To Be Done)

- **Visiteur** (recruteur, école) : en quelques secondes, juger si ce profil mérite un échange, voir des projets concrets, puis contacter Léandro ou récupérer son CV.
- **Léandro** : modifier son contenu sans toucher au code, s'exercer à des pratiques professionnelles, et ne pas être contredit par son propre site sur l'accessibilité.

### 2.2 Non-utilisateurs (v1)

Les clients freelance : le Site ne leur est pas adressé en v1.

### 2.3 Scénarios clés

Les scénarios UJ-1 à UJ-4 sont des hypothèses de travail. UJ-1 repose sur ce que Léandro a raconté. UJ-2 à UJ-4 ont été écrits par Claude, et Léandro les valide par délégation (« je te fais confiance ») : ils restent à corriger au fil du projet.

- **UJ-1. Sophie, recruteuse, vérifie le profil de Léandro avant de l'appeler.** `[ASSUMPTION]`
  - **Contexte :** Sophie recrute un designer. Elle a vu Léandro sur LinkedIn, ou il lui a envoyé le lien.
  - **Entrée :** sur ordinateur, depuis LinkedIn, une offre, un message ou Google (probablement en cherchant son nom).
  - **Déroulé :** elle voit le Hero, fait défiler, ouvre un ou deux projets, lit le défi et le concept, ferme la fenêtre.
  - **Apogée :** elle est convaincue par la qualité des projets.
  - **Résolution :** elle écrit à Léandro via le formulaire ou télécharge son CV.
  - **Cas limite :** le lien partagé arrive sur un Projet précis : l'adresse doit ouvrir directement ce projet.

- **UJ-2. Thomas, responsable d'admission, vérifie le parcours de Léandro depuis un dossier de candidature.** `[ASSUMPTION]` Il arrive sur la Page d'accueil par un lien du dossier, cherche le parcours et les compétences, puis consulte les Projets pour évaluer le niveau. Son besoin propre : repérer le Parcours et les Compétences sans ouvrir de Fenêtre de projet, donc ces Sections doivent être lisibles directement sur la Page d'accueil. **Cas limite :** il ouvre le lien du dossier sur un téléphone, et le Site doit rester entièrement lisible.

- **UJ-3. Léandro ajoute un projet sans toucher au code.** `[ASSUMPTION]` Il ouvre le **Studio**, crée un Projet (titre, description, images, étiquettes, liens), le publie en environnement dev, vérifie, puis le publie en prod. Le Projet apparaît sur le Site, avec sa propre adresse.

- **UJ-4. Inès navigue au clavier avec un lecteur d'écran.** `[ASSUMPTION]` Elle parcourt les sections, ouvre un Projet, la Fenêtre de projet prend le focus, elle la ferme avec Échap et retrouve sa place. Elle change de thème et de langue sans souris et comprend où elle se trouve à chaque étape.

## 3. Glossaire

- **Visiteur** — personne qui consulte le Site.
- **Site** — le portfolio public.
- **Page d'accueil** — la page principale du Site, qui contient toutes les Sections.
- **Section** — bloc de la Page d'accueil : Hero, Projets, Parcours, Compétences, Services, À propos, Contact.
- **Hero** — Section d'ouverture de la Page d'accueil (présentation et boutons principaux).
- **Projet** — travail présenté dans la section Projets (cinq aujourd'hui). Peut contenir des **Sous-projets**.
- **Fenêtre de projet** — fenêtre (aussi appelée modale) qui s'ouvre au clic sur la **Carte** d'un Projet. Il en existe trois **Gabarits** (standard, graphisme, personnalisée).
- **Carte** — vignette d'un Projet dans la Section Projets.
- **Gabarit** — modèle de présentation d'une Fenêtre de projet.
- **Token** — valeur de design nommée (couleur, espacement, ombre…), propre à chaque Thème.
- **Scénario** — récit d'usage numéroté UJ-N (voir §2.3).
- **Thème** — apparence complète du Site : Pop, Terminal ou Wireframe.
- **Langue** — français (FR) ou anglais (EN).
- **Contenu** — tous les textes, images et liens du Site.
- **Studio** — interface d'édition du Contenu dans Sanity.
- **Environnement** — dev (tests) ou prod (site public).
- **Métadonnées** — titre, description, aperçu de lien et données structurées d'une page.
- **Formulaire de contact** — formulaire nom, e-mail, message.
- **Mode fête** — effet ludique déclenché par le code Konami.

## 4. Fonctionnalités

### 4.1 Contenu géré dans le Studio

**Description :** tout le Contenu actuel (en dur dans le code) est déplacé dans Sanity. Léandro l'édite dans le Studio sans toucher au code. Réalise UJ-3.

#### FR-1 : Modèle de contenu
Léandro peut décrire dans le Studio chaque type de Contenu existant : Projets, Sous-projets, galeries d'images (dont la galerie de 19 images du Projet graphisme), Parcours, Compétences, services, section À propos, paramètres du Site et textes d'interface, en FR et EN.

**Conséquences (testables) :**
- Aucun texte visible du Site n'est écrit en dur dans le code.
- Chaque texte existe en FR et en EN dans le Studio.
- Les images portent un texte alternatif éditable.

#### FR-2 : Migration à l'identique
Le Contenu actuel (FR et EN) est migré dans le Studio sans modification de texte. Les 9 autres langues ne sont pas migrées.

**Conséquences (testables) :**
- Une comparaison automatisée du texte rendu avant et après migration ne montre aucune différence en FR et en EN.
- Le premier Projet est conservé. Son bouton GitHub factice (`votre-pseudo/votre-repo`) ne mène nulle part et n'est pas migré tel quel. `[ASSUMPTION]` : le bouton est retiré, le Projet reste intact (Léandro : « je veux garder le projet », ce qui ne tranche pas le bouton).

#### FR-3 : Publication et environnements
Léandro peut publier une modification en dev, la vérifier, puis la mettre en prod, sans intervention sur le code. Réalise UJ-3.

**Conséquences (testables) :**
- Une modification publiée dans le Studio apparaît sur le Site de l'Environnement correspondant sans modification du code.
- Le Site de dev n'est pas indexé par les moteurs de recherche.

**Hors périmètre :** workflow de relecture à plusieurs personnes.

### 4.2 Structure, navigation et adresses

**Description :** le Site reste une Page d'accueil à Sections, avec une navigation par ancres et un menu adapté au mobile. Chaque Projet a en plus une adresse propre. Réalise UJ-1, UJ-2.

#### FR-4 : Rendu complet sans JavaScript
Le HTML livré contient tout le Contenu visible de la Page d'accueil et de chaque page de Projet, sans exécution de JavaScript.

**Conséquences (testables) :**
- `curl` sur l'adresse du Site retourne le texte des Sections.
- Les aperçus de liens (LinkedIn, messageries) affichent titre, description et image.

#### FR-5 : Navigation
Le Visiteur peut atteindre chaque Section depuis la barre de navigation, sur ordinateur et sur mobile.

**Conséquences (testables) :**
- Les liens du menu amènent à la bonne Section au clavier comme à la souris.
- Le menu mobile s'ouvre et se ferme au clavier.

#### FR-6 : Adresse partageable par Projet
Chaque Projet a une adresse propre (par exemple `/projets/belote-kart`). Ouvrir cette adresse affiche le Site avec la Fenêtre de projet ouverte.

**Conséquences (testables) :**
- Ouvrir l'adresse d'un Projet affiche sa Fenêtre de projet sans geste supplémentaire.
- Fermer la Fenêtre de projet revient à la Page d'accueil sans recharger la page.
- Le bouton « retour » du navigateur ferme la fenêtre.
- Chaque adresse de Projet a ses propres Métadonnées et figure dans le plan du site.
- Les adresses EN suivent le schéma `/en/projects/belote-kart`. `[ASSUMPTION]` : schéma à confirmer en architecture.

**Hors périmètre :** remplacer la Fenêtre de projet par une page entière (décision du brief).

#### FR-7 : Page d'erreur et redirections
Une adresse inconnue affiche une page 404 dans le style du Site. Les anciennes adresses du Site (Page d'accueil et ancres) continuent de fonctionner.

**Conséquences (testables) :**
- Une adresse inconnue renvoie le code HTTP 404 et une page dans le style du Site.
- Les adresses `/#work`, `/#journey`, `/#skills` et `/#contact` amènent toujours à la bonne Section.

### 4.3 Thèmes et apparence

**Description :** les trois Thèmes (Pop, Terminal, Wireframe) sont reproduits. Réalise UJ-1, UJ-4.

#### FR-8 : Reproduction fidèle
Le Site rendu reprend le design, l'interface et les interactions actuels dans les trois Thèmes, sur ordinateur et mobile.

**Conséquences (testables) :**
- Des captures comparées avant/après, pour chaque Thème et aux largeurs 375, 768 et 1440 px, montrent moins de 0,1 % de pixels différents. `[ASSUMPTION]` : seuil proposé par Claude.
- Les éléments animés ou aléatoires (bandeau défilant, carte à gratter, curseur, confettis) sont figés ou masqués pour la comparaison.
- Les écarts dus aux ajustements d'accessibilité validés (FR-23) sont exclus, et chacun est consigné.
- **Préséance :** en cas de conflit, la fidélité l'emporte sur le score de performance (SM-1). L'écart de score est alors consigné.

#### FR-9 : Changement de Thème
Le Visiteur peut changer de Thème depuis les réglages, et le Site s'en souvient à la visite suivante (mémorisation locale dans le navigateur, sans compte, comme pour le son aujourd'hui). Confirmé par Léandro. Réalise UJ-4.

**Conséquences (testables) :**
- Après rechargement, le Thème choisi est conservé.
- Le sélecteur de Thème s'atteint et s'actionne au clavier, et le Thème actif est annoncé aux lecteurs d'écran.

### 4.4 Langues

#### FR-10 : Français et anglais
Le Visiteur peut afficher le Site en FR ou en EN. La langue par défaut est le FR. Chaque Langue a sa propre adresse (`/` et `/en/`) pour être indexable. Confirmé par Léandro.

**Conséquences (testables) :**
- Chaque page déclare sa Langue (`lang`) et ses équivalents (`hreflang`).
- Le changement de Langue conserve la page ou le Projet affiché.
- Le sélecteur de Langue s'atteint et s'actionne au clavier, et la Langue active est annoncée aux lecteurs d'écran (réalise UJ-4).

### 4.5 Projets et fenêtres de projet

**Description :** la section Projets affiche des cartes. Chaque carte ouvre une Fenêtre de projet. Réalise UJ-1, UJ-2.

#### FR-11 : Cartes et Fenêtres de projet
Le Visiteur peut ouvrir un Projet, lire son contenu (défi, concept, étiquettes, liens, galerie), et le fermer. Les trois gabarits de Fenêtre de projet sont reproduits, ainsi que la carte retournable du Projet Belote Kart, la galerie graphique avec vue détaillée, et les liens externes (Figma, Studapp).

**Conséquences (testables) :**
- Une Fenêtre de projet se ferme avec Échap, avec son bouton de fermeture et, sur mobile, avec le geste prévu actuellement.
- À l'ouverture, le focus passe dans la fenêtre. À la fermeture, il revient à la carte d'origine.

### 4.6 Interactions ludiques

**Description :** elles font partie de l'identité du Site et sont conservées.

#### FR-12 : Interactions conservées
Le Site conserve : les compétences déplaçables avec le bouton « Organiser », la carte à gratter, le Mode fête, le curseur personnalisé et les effets sonores.

**Conséquences (testables) :**
- Le son est coupé par défaut. Il ne se déclenche qu'après activation explicite par le Visiteur.
- Le Mode fête peut être arrêté sans souris.
- Les animations déclenchées par une action du Visiteur (survol, clic, glissement) n'ont pas besoin de contrôle d'arrêt.

#### FR-13 : Contrôle des contenus en mouvement
Le design des animations est conservé tel quel. La seule exigence porte sur les contenus qui bougent seuls pendant plus de 5 secondes, comme le bandeau défilant (il tourne en boucle sans fin, sur 20 secondes). Le Visiteur doit pouvoir les mettre en pause ou les arrêter.

**Conséquences (testables) :**
- Le bandeau défilant peut être mis en pause au clavier comme à la souris.
- Aucun élément ne clignote plus de trois fois par seconde.
- Si Léandro refuse le contrôle de pause (c'est un ajout visible), l'écart est noté dans la déclaration d'accessibilité au lieu d'être corrigé.

**Hors périmètre :** réduire les animations selon la préférence système (`prefers-reduced-motion`). Léandro a refusé cet ajustement : ce n'est pas exigé au niveau AA visé.
`[NOTE FOR PM]` : le contrôle de pause ajoute un élément à l'interface. Il doit être montré à Léandro avant d'être appliqué (FR-23).

#### FR-14 : Alternatives aux interactions
Chaque interaction ludique a une alternative accessible. Les compétences se réorganisent sans glisser-déposer (le bouton « Organiser » existe déjà). La carte à gratter (élément `canvas`) a un équivalent textuel du contenu révélé, disponible sans gratter.

### 4.7 Contact

**Description :** le Formulaire de contact, l'e-mail, le téléphone et le CV. Réalise UJ-1, UJ-2.

#### FR-15 : Formulaire de contact
Le Visiteur peut envoyer un message (nom, e-mail, message) à Léandro.

**Conséquences (testables) :**
- Les messages de réussite et d'erreur s'affichent dans la page (plus de fenêtres `alert()`) et sont annoncés aux lecteurs d'écran.
- Les erreurs de saisie sont indiquées par champ.
- Un envoi automatisé (robot) est rejeté (voir FR-21).
- Le mécanisme d'envoi (service tiers ou autre) est choisi en architecture (§9, question 2).

#### FR-16 : E-mail et téléphone
L'e-mail et le téléphone restent affichés tels quels pour le Visiteur, mais n'apparaissent pas en clair dans le code livré. Confirmé par Léandro : assemblage au chargement de la page, le texte visible ne change pas. Limite acceptée : cette protection arrête les robots simples, pas ceux qui exécutent JavaScript.

#### FR-17 : Téléchargement du CV
Le Visiteur peut télécharger le CV en un clic.

**Conséquences (testables) :**
- Le fichier est versionné avec le code et ne dépend pas d'un dépôt manuel chez l'hébergeur (aujourd'hui, il y est déposé à la main).
- Après chaque mise en prod, le lien du CV renvoie un PDF avec le code HTTP 200.

#### FR-18 : Lien LinkedIn
Les liens vers LinkedIn (pied de page et icône) pointent vers le profil de Léandro (aujourd'hui : la page d'accueil de LinkedIn et `#`).

**Conséquences (testables) :**
- Les deux liens ouvrent `https://www.linkedin.com/in/l%C3%A9andro-da-silva/`.

### 4.8 Référencement et métadonnées

#### FR-19 : Métadonnées alignées sur LinkedIn
Chaque page a un titre, une description, un aperçu de lien (Open Graph, Twitter), un lien canonique et des données structurées. Le positionnement reprend les mots du profil LinkedIn de Léandro : Product Designer UX/UI & IA, accessibilité, de l'idée au produit. L'employeur n'y figure pas.

**Conséquences (testables) :**
- Le texte visible du Site n'est pas modifié par cette exigence.
- Le plan du site (`sitemap.xml`) liste la Page d'accueil de chaque Langue et chaque Projet, et aucune ancre.
- Les données structurées ne contiennent plus l'offre d'emploi datée de février 2026 (supprimée, décision confirmée par Léandro : plus de recherche urgente).
- Une image d'aperçu adaptée existe (aujourd'hui : le logo seul).

### 4.9 Système de design

#### FR-20 : Tokens et composants
Les valeurs de design (couleurs, typographies, espacements, bordures, ombres, durées) existent comme tokens, par Thème, dans le code et dans Figma. Les composants du Site sont documentés (états, variantes). Voir `design-system/tokens.css`.

**Conséquences (testables) :**
- Chaque Token du code existe aussi comme variable Figma de même nom, pour chacun des trois Thèmes.
- Aucune couleur ni ombre n'est écrite en dur dans les composants.

**Hors périmètre :** nouvelle identité visuelle.

## 5. Exigences transversales

### 5.1 Sécurité

#### FR-21 : Protection du Site et du formulaire
**Conséquences (testables) :**
- Les en-têtes de sécurité sont en place sur le Site de prod : politique de contenu (CSP), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, protection contre l'inclusion en cadre.
- Aucun secret n'est présent dans le dépôt ni dans le code livré.
- Le Formulaire de contact est protégé contre le spam : un envoi sans jeton de vérification valide est refusé et ne crée aucun message.
- Les clés d'accès au Studio utilisées par le Site sont en lecture seule.
- Un contrôle automatique des dépendances vulnérables tourne sur le dépôt.
- Le Site de prod ne se sert que de connexions HTTPS.

### 5.2 Accessibilité (RGAA 4.1 / WCAG 2.2 AA)

#### FR-22 : Conformité RGAA
Le Site respecte le RGAA dans les Thèmes Pop, Terminal et Wireframe.

**Conséquences (testables) :**
- Tout le Site se parcourt au clavier, avec un focus visible.
- Les contrastes de texte atteignent 4,5:1 (3:1 pour le grand texte) dans chaque Thème.
- Les images informatives ont un texte alternatif.
- La structure des titres, la langue et les repères de page (landmarks) sont corrects.
- Les Fenêtres de projet piègent le focus, se ferment avec Échap, et déclarent leur rôle.
- **Échantillon d'audit :** la Page d'accueil en FR et en EN, une Fenêtre de projet par Gabarit (3), chaque Thème (3), le Formulaire de contact, le menu mobile ouvert, le Mode fête actif et la carte à gratter.
- L'audit combine un outil automatique et un test manuel au lecteur d'écran, et une déclaration d'accessibilité honnête est publiée.
- **Critère bloquant :** tout critère non conforme de niveau A, ou qui empêche d'accomplir UJ-1 (lire, ouvrir un Projet, contacter) ou UJ-4 (naviguer au clavier).

#### FR-23 : Ajustements visuels
Quand le design fige un échec RGAA (par exemple le petit texte noir sur fond vert vif, les rotations, les textes en majuscules), le changement est minimal et **montré à Léandro avant d'être appliqué**. Chaque ajustement est consigné.

### 5.3 Performance

#### NFR-1 : Poids et optimisation
- Les images sont optimisées (formats modernes, tailles adaptées, chargement différé hors écran).
- Le JavaScript initial pèse moins de 70 Ko compressés (contre 148 Ko aujourd'hui). `[ASSUMPTION]` : seuil proposé par Claude, à affiner en architecture.

### 5.4 Qualité et exploitation

#### NFR-2 : Environnements et déploiement
Deux Environnements (dev et prod), avec déploiement automatique depuis les branches `dev` et `main`.

#### NFR-3 : Contrôle automatique
À chaque pull request, une chaîne automatique lance la construction, les vérifications de code, les tests d'accessibilité et Lighthouse. Une pull request qui échoue à l'une de ces étapes ne peut pas être fusionnée dans `main`.

#### NFR-4 : Compatibilité
Le Site fonctionne sur les deux dernières versions de Chrome, Safari, Firefox et Edge. `[ASSUMPTION]` : liste proposée par Claude.

### 5.5 Données personnelles et mesure d'audience

#### NFR-5 : Mesure d'audience sans cookies
Léandro veut connaître la fréquentation. Le Site utilise un outil de mesure sans cookies, sans bandeau de consentement ni identifiant personnel. Le choix de l'outil est fait en architecture.

**Conséquences (testables) :**
- Aucun cookie n'est déposé par le Site.
- Le Site de dev n'est pas mesuré.

## 6. Hors objectifs

- Refaire le design, les textes ou les projets.
- Cibler les clients freelance, ou raconter la fabrication du Site comme étude de cas.
- Garder les 9 autres langues.
- Créer un compte Visiteur, un blog ou une boutique.
- Mentionner l'employeur dans les Métadonnées.
- Proposer des fonctionnalités interactives sans JavaScript (le contenu reste lisible sans, pas les interactions).

## 7. Périmètre v1

### 7.1 Dans la v1
Toutes les exigences de ce document : FR-1 à FR-23 (contenu, navigation, adresses, Thèmes, Langues, Projets, interactions, contact, référencement, tokens, sécurité, RGAA) et NFR-1 à NFR-5 (performance, Environnements, contrôle automatique, compatibilité, mesure d'audience).

### 7.2 Hors v1
Nouvelles langues, nouveau design, nouvelles sections, version freelance du Site, mesure d'audience avancée.

## 8. Indicateurs de réussite

Léandro demande « le meilleur possible ». Pour que ce soit vérifiable, chaque indicateur a une **cible** (ce qu'on vise) et un **plancher** (en dessous, la v1 n'est pas acceptée). `[ASSUMPTION]` : planchers proposés par Claude.

**Principaux**
- **SM-1** : Lighthouse, cible 100, plancher 95, en performance, accessibilité, bonnes pratiques et SEO, sur la Page d'accueil et sur une page de Projet, en prod. Valide FR-4, FR-22.
- **SM-2** : audit RGAA de l'échantillon défini en FR-22 avec 0 critère bloquant, et déclaration d'accessibilité publiée. Valide FR-22, FR-23.
- **SM-3** : en-têtes de sécurité notés A+ (plancher : A) sur securityheaders.com, et aucune coordonnée en clair dans le code livré. Valide FR-16, FR-21.
- **SM-4** : fidélité visuelle, moins de 0,1 % de pixels différents sur les captures comparées (3 Thèmes, largeurs 375, 768, 1440 px). Valide FR-8.
- **SM-5** : Léandro modifie un texte de Projet dans le Studio et le met en prod en moins de 5 minutes, sans toucher au code. Valide FR-1, FR-3.

**Secondaires**
- **SM-6** : en recherchant « Léandro Da Silva », le Site apparaît dans les premiers résultats après indexation. Valide FR-19. `[ASSUMPTION]` : dépend aussi de facteurs hors du Site.

**Contre-indicateurs (à ne pas optimiser)**
- **SM-C1** : le score Lighthouse ne doit pas justifier de retirer des animations ou de dégrader le design. Contrebalance SM-1.
- **SM-C2** : le nombre de conformités cochées ne doit pas masquer une mauvaise expérience réelle au lecteur d'écran. Contrebalance SM-2.

## 9. Questions ouvertes

1. **Framework et hébergeur** : à trancher en architecture (Astro est la piste de départ ; Sanity est acté).
2. **Envoi du formulaire et anti-spam** : le service d'envoi actuel (un service tiers) est-il conservé ? Quel mécanisme anti-spam, dans le respect de la vie privée ? À trancher en architecture : cela conditionne FR-15, FR-16 et FR-21.
3. **Bouton de pause du bandeau défilant** (FR-13) : Léandro l'accepte-t-il comme ajout visible, ou préfère-t-il documenter l'écart dans la déclaration d'accessibilité ?
4. **Outil de mesure d'audience** (NFR-5) : lequel ? À choisir en architecture.

## 10. Index des hypothèses

- UJ-2 à UJ-4 : parcours écrits par Claude, validés par délégation.
- UJ-1 : recherche Google par nom (non vérifié).
- §5.3 : réduction du JavaScript initial.
- FR-2 : retrait du bouton GitHub factice du premier Projet.
- FR-6 : schéma d'adresse EN (`/en/projects/...`).
- FR-8 / SM-4 : seuil de 0,1 % de pixels différents.
- NFR-1 : JavaScript initial sous 70 Ko compressés.
- NFR-4 : liste des navigateurs pris en charge.
- SM-6 : indexation du Site à la recherche du nom de Léandro.
- §8 : les planchers des indicateurs (les cibles viennent de Léandro : « le meilleur possible »).
