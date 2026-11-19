---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-refonte portfolio-2026-11-19/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-refonte portfolio-2026-11-19/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/briefs/brief-refonte portfolio-2026-11-19/brief.md
  - _bmad-output/planning-artifacts/briefs/brief-refonte portfolio-2026-11-19/addendum.md
  - design-system/tokens.css
  - CLAUDE.md
  - docs/TESTING-RULES.md
---

# refonte portfolio - Epic Breakdown

## Overview

Ce document découpe en épopées et stories les exigences du PRD et les décisions du spine d'architecture de la refonte du portfolio de Léandro Da Silva. Il n'existe pas de document UX séparé : la source visuelle est le site actuel (`ancien-portfolio/`), les tokens (`design-system/tokens.css`) et la maquette Figma.

## Requirements Inventory

### Functional Requirements

FR-1 : Modèle de contenu dans le Studio (Projets, Sous-projets, galeries dont les 19 images du Projet graphisme, Parcours, Compétences, services, À propos, paramètres, textes d'interface), en FR et EN, sans texte en dur, avec texte alternatif éditable.
FR-2 : Migration à l'identique du Contenu FR et EN (comparaison automatisée du texte rendu avant/après sans différence) ; bouton GitHub factice du premier Projet retiré.
FR-3 : Publication d'une modification en dev, vérification, puis mise en prod sans toucher au code ; Site de dev non indexé.
FR-4 : HTML complet sans JavaScript pour la Page d'accueil et chaque page de Projet (`curl` retourne le texte, aperçus de liens corrects).
FR-5 : Navigation vers chaque Section, ordinateur et mobile, au clavier comme à la souris ; menu mobile utilisable au clavier.
FR-6 : Adresse propre par Projet (`/projets/belote-kart`, `/en/projects/belote-kart`) ouvrant la Fenêtre de projet ; fermeture sans rechargement, bouton « retour » ferme la fenêtre ; Métadonnées et plan du site par Projet.
FR-7 : Page 404 au style du Site (code HTTP 404) ; anciennes ancres `/#work`, `/#journey`, `/#skills`, `/#contact` fonctionnelles.
FR-8 : Reproduction fidèle du design, de l'interface et des interactions dans les trois Thèmes, ordinateur et mobile (moins de 0,1 % de pixels différents à 375, 768, 1440 px).
FR-9 : Changement de Thème depuis les réglages, mémorisé localement, utilisable au clavier, Thème actif annoncé aux lecteurs d'écran.
FR-10 : Français et anglais, FR par défaut, adresses `/` et `/en/`, `lang` et `hreflang`, changement de Langue qui conserve la page ou le Projet, sélecteur accessible au clavier.
FR-11 : Cartes et Fenêtres de projet (trois Gabarits), carte retournable de Belote Kart, galerie graphique avec vue détaillée, liens externes ; fermeture par Échap, bouton, geste mobile ; focus à l'ouverture et retour à la Carte.
FR-12 : Interactions ludiques conservées (compétences déplaçables avec « Organiser », carte à gratter, Mode fête, curseur, effets sonores) ; son coupé par défaut ; Mode fête arrêtable sans souris.
FR-13 : Aucun contenu ne bouge seul plus de 5 secondes ; tout contenu de ce type ajouté plus tard se met en pause ; aucun clignotement de plus de 3 par seconde.
FR-14 : Alternatives accessibles aux interactions ludiques (compétences sans glisser-déposer ; équivalent textuel de la carte à gratter).
FR-15 : Formulaire de contact (nom, e-mail, message) avec messages de réussite et d'erreur dans la page, annoncés aux lecteurs d'écran, erreurs par champ, envoi automatisé rejeté.
FR-16 : E-mail et téléphone affichés tels quels mais absents en clair du code livré.
FR-17 : Téléchargement du CV en un clic, fichier versionné avec le code, renvoie 200 après mise en prod.
FR-18 : Liens LinkedIn (pied de page et icône) vers `https://www.linkedin.com/in/l%C3%A9andro-da-silva/`.
FR-19 : Métadonnées par page (titre, description, Open Graph, Twitter, canonical, JSON-LD sans offre d'emploi), `sitemap.xml` sans ancres, image d'aperçu adaptée, positionnement aligné sur LinkedIn.
FR-20 : Tokens par Thème dans le code et dans Figma (mêmes noms), composants documentés, aucune couleur ni ombre en dur.
FR-21 : Sécurité : en-têtes (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, anti-cadrage), aucun secret dans le dépôt, formulaire protégé du spam, clés Studio en lecture seule, contrôle des dépendances, HTTPS seulement.
FR-22 : Conformité RGAA 4.1 / WCAG 2.2 AA dans les trois Thèmes (clavier, focus, contrastes, alternatives, titres, landmarks, pièges de focus), audit sur un échantillon défini, déclaration d'accessibilité publiée, 0 critère bloquant.
FR-23 : Ajustements visuels dus à l'accessibilité minimaux, montrés à Léandro avant application et consignés.

### NonFunctional Requirements

NFR-1 : Images optimisées ; JavaScript initial sous 70 Ko compressés.
NFR-2 : Deux Environnements (dev, prod), déploiement automatique depuis `dev` et `main`.
NFR-3 : Chaîne automatique à chaque PR (build, lint, tests d'accessibilité, Lighthouse) ; une PR en échec ne se fusionne pas dans `main`.
NFR-4 : Deux dernières versions de Chrome, Safari, Firefox, Edge.
NFR-5 : Mesure d'audience sans cookie, sans bandeau, sans identifiant ; Site de dev non mesuré.
NFR-6 : Conservation de l'ancien portfolio : intact 30 jours après bascule, mise en ligne d'abord sur adresse provisoire, bascule DNS réversible, archive hors dépôt avec empreinte, `ancien-portfolio/` jamais modifié, retour en moins d'une heure.

### Additional Requirements

- Aucun starter imposé : initialiser un projet Astro 7 (Node 22.x) avec `@astrojs/react`, `@astrojs/vercel`, `@astrojs/sitemap`, Tailwind 4 et TypeScript 6.0.3 (première story de l'épopée 1).
- Paradigme : statique d'abord, îlots React seulement pour l'interactif (AD-1) ; couches `src/content/`, `src/pages/`, `src/components/`, `src/islands/`, `src/styles/`, `studio/`.
- Sanity lu au build uniquement via `@sanity/client` en lecture seule, documents publiés, deux datasets `dev` et `production`, rebuild par webhook vers un deploy hook Vercel (AD-2, AD-10).
- Types partagés générés (`sanity typegen`), view-models résolus par langue, `uiStrings` singleton, validation de schéma qui empêche de publier un document incomplet (AD-3).
- Routes `/`, `/projets/[slug]`, `/en/`, `/en/projects/[slug]`, slug immuable, 404 par Langue ; helper `localizedPath` (AD-4).
- Fenêtre de projet : HTML d'abord, îlot `ProjectWindow`, module `overlay.ts` (pile, focus, Échap), History API (AD-5).
- Thème par `data-theme`, script externe `public/theme-init.js`, Tailwind `@theme inline`, `prefs.ts` (nanostores) seul propriétaire de `localStorage` (AD-6, AD-7).
- Budget JS défini et mesuré en CI ; repli `preact/compat` si intenable (AD-7).
- Deux routes serveur seulement : `api/altcha.ts` et `api/contact.ts` (ALTCHA, Resend, codes d'erreur stables) (AD-8).
- Coordonnées encodées assemblées par un îlot, avec test CI (AD-9).
- En-têtes dans `vercel.json`, CSP `script-src 'self'`, test navigateur sous CSP, HSTS court pendant le repli (AD-11).
- Images téléchargées et optimisées au build (AD-12) ; `@vercel/analytics` en prod seulement, préférences `portfolio:*` (AD-13).
- CI bloquante : build, `astro check`, lint, axe, Lighthouse, budget JS, en-têtes, comparaison visuelle, gardes FR-2/4/17/18, matrice navigateurs (AD-14).
- Bascule réversible, archive de l'ancien site, SPF/DKIM Resend dans le DNS Hostinger (AD-15).
- Gratuit ou open source uniquement (AD-16) ; exploitation : alerte de build, export hebdomadaire du dataset (AD-17) ; composant unique `Seo.astro` (AD-18).
- Bonnes pratiques de développement (`CLAUDE.md`) et règles de test (`docs/TESTING-RULES.md`, adaptées de GUTTER) : pyramide Vitest/Playwright/axe/Lighthouse, régression obligatoire pour tout correctif, couverture en ratchet, Conventional Commits, hooks `lint-staged` (pre-commit) et typecheck + tests (pre-push), `.editorconfig` et `.prettierrc.json`, CI avec check obligatoire `ci-ok` et workflow `fix-needs-test`. À mettre en place dès l'épopée 1 pour que chaque story soit livrée avec ses tests.
- Bandeau défilant (`Marquee`) et clé de traduction `marquee` non migrés ; 9 langues supplémentaires non migrées.

### UX Design Requirements

Aucun document UX séparé. La conformité visuelle est portée par FR-8, FR-20 et FR-22 ; les tokens existants sont dans `design-system/tokens.css`.

### FR Coverage Map

FR-1 : Épopée 2 — modèle de contenu FR/EN dans le Studio
FR-2 : Épopée 2 — migration à l'identique
FR-3 : Épopée 2 — publication dev puis prod
FR-4 : Épopée 3 — HTML complet sans JavaScript
FR-5 : Épopée 3 — navigation et menu mobile
FR-6 : Épopée 5 — adresse propre par Projet
FR-7 : Épopée 3 — 404 et ancres historiques
FR-8 : Épopées 3 et 4 — fidélité visuelle (Pop en 3, trois Thèmes en 4)
FR-9 : Épopée 4 — changement de Thème
FR-10 : Épopée 3 — français et anglais
FR-11 : Épopée 5 — cartes et Fenêtres de projet
FR-12 : Épopée 6 — interactions ludiques conservées
FR-13 : Épopée 6 — contenus en mouvement
FR-14 : Épopée 6 — alternatives accessibles
FR-15 : Épopée 7 — formulaire de contact
FR-16 : Épopée 7 — e-mail et téléphone non lisibles dans le code
FR-17 : Épopée 7 — téléchargement du CV
FR-18 : Épopée 7 — liens LinkedIn
FR-19 : Épopée 8 — métadonnées et référencement
FR-20 : Épopée 4 — tokens et composants, parité Figma
FR-21 : Épopée 1 — en-têtes, secrets, dépendances, HTTPS (anti-spam du formulaire en épopée 7)
FR-22 : Épopée 9 — audit RGAA et déclaration (critères d'accessibilité portés par chaque story)
FR-23 : Épopée 9 — ajustements visuels consignés
NFR-1 : Épopée 1 — budget JS ; images optimisées en épopée 2
NFR-2 : Épopée 1 — environnements et déploiement
NFR-3 : Épopée 1 — chaîne automatique
NFR-4 : Épopée 1 — matrice navigateurs
NFR-5 : Épopée 8 — mesure d'audience sans cookie
NFR-6 : Épopée 9 — bascule réversible, ancien site intact

## Epic List

### Epic 1 : Un Site déployable, vérifié automatiquement
Léandro pousse du code, la CI le contrôle et un Site de dev se déploie. Contient l'initialisation d'Astro 7 et la preuve du budget JS et de la CSP.
**FRs covered:** FR-21, NFR-1, NFR-2, NFR-3, NFR-4

### Epic 2 : Léandro édite son contenu sans toucher au code
Modèle de contenu FR/EN dans le Studio, migration à l'identique, deux datasets, publication puis rebuild.
**FRs covered:** FR-1, FR-2, FR-3

### Epic 3 : Le Visiteur lit la Page d'accueil, en FR et en EN, sur tous ses appareils
HTML complet sans JS, navigation, Sections, 404 et ancres historiques. Le Thème Pop sert de référence visuelle.
**FRs covered:** FR-4, FR-5, FR-7, FR-10, FR-8 (Pop)

### Epic 4 : Les trois Thèmes, fidèles à l'ancien site
Terminal et Wireframe, sélecteur mémorisé et accessible, tokens en code et parité Figma, comparaison visuelle.
**FRs covered:** FR-8, FR-9, FR-20

### Epic 5 : Le Visiteur ouvre et partage un Projet
Cartes, trois Gabarits de Fenêtre de projet, adresse propre par Projet, bouton « retour », focus, galerie, carte retournable.
**FRs covered:** FR-6, FR-11

### Epic 6 : Les interactions ludiques, avec leurs alternatives accessibles
Compétences déplaçables, carte à gratter, Mode fête, curseur, son coupé par défaut.
**FRs covered:** FR-12, FR-13, FR-14

### Epic 7 : Le Visiteur contacte Léandro ou récupère son CV
Formulaire ALTCHA + Resend, coordonnées assemblées côté navigateur, CV versionné, liens LinkedIn.
**FRs covered:** FR-15, FR-16, FR-17, FR-18

### Epic 8 : Le Site est bien référencé et mesuré
`Seo.astro`, sitemap, JSON-LD, images d'aperçu, mesure sans cookie en production.
**FRs covered:** FR-19, NFR-5

### Epic 9 : Conformité RGAA et mise en ligne réversible
Audit sur l'échantillon, déclaration d'accessibilité, ajustements visuels consignés, archive de l'ancien site, bascule DNS, exploitation.
**FRs covered:** FR-22, FR-23, NFR-6

## Epic 1 : Un Site déployable, vérifié automatiquement

Léandro pousse du code, une chaîne automatique le contrôle et un Site de dev se déploie. L'outillage qualité (hooks, Vitest, Playwright, `ci-ok`) existe déjà sur `feat/qualite-ci` : cette épopée y ajoute le socle Astro et ce qui manque pour que chaque story suivante soit livrée sous contrôle.

### Story 1.1 : Socle Astro prouvé (budget JS et CSP)

En tant que Léandro,
je veux un projet Astro 7 statique avec un îlot React hydraté, dont le poids JS et la CSP sont mesurés,
afin de savoir dès le départ que les contraintes AD-7 et AD-11 sont tenables.

**Acceptance Criteria:**

**Given** le dépôt contient l'outillage qualité et un squelette minimal
**When** j'ajoute `@astrojs/react`, `@astrojs/vercel`, `@astrojs/sitemap`, Tailwind 4 et TypeScript 6.0.3 aux versions du spine
**Then** `npm run build`, `npm run typecheck`, `npm run lint` et `npm test` passent
**And** `design-system/tokens.css` est importé depuis `src/styles/` et exposé à Tailwind via `@theme inline`.

**Given** une page d'essai avec un îlot React en `client:visible`
**When** je mesure le JavaScript transféré (brotli) de la Page d'accueil sans interaction
**Then** le total est inférieur à 70 Ko, analytics exclu
**And** si le seuil est intenable, l'alias `preact/compat` est essayé avant tout relèvement, et le résultat est consigné dans `docs/`.

**Given** la page d'essai servie avec une CSP `script-src 'self'`
**When** un test navigateur la charge
**Then** aucune violation CSP n'est relevée
**And** la décision entre `security.csp` d'Astro et `vercel.json` est consignée (AD-11).

### Story 1.2 : Déploiement automatique dev et prod

En tant que Léandro,
je veux que `dev` et `main` se déploient seuls sur deux Environnements,
afin de vérifier un changement avant qu'il soit public (NFR-2).

**Acceptance Criteria:**

**Given** le projet est relié à Vercel Hobby
**When** je pousse sur `dev`
**Then** l'Environnement dev est déployé sur un alias stable
**And** un push sur `main` déploie la production sur l'adresse `*.vercel.app`.

**Given** `VERCEL_ENV` vaut `preview`
**When** le build s'exécute
**Then** `robots.txt` interdit l'indexation et chaque page porte `<meta name="robots" content="noindex">`
**And** `vercel.json` ajoute `X-Robots-Tag: noindex` pour l'hôte de dev.

**Given** `VERCEL_ENV` vaut `production`
**When** le build s'exécute
**Then** `robots.txt` autorise l'indexation et aucune balise `noindex` n'est présente.

### Story 1.3 : Chaîne CI bloquante sur chaque pull request

En tant que Léandro,
je veux que chaque PR lance build, vérifications, accessibilité et performance,
afin qu'une régression ne soit jamais fusionnée dans `main` (NFR-3).

**Acceptance Criteria:**

**Given** une PR ouverte vers `dev` ou `main`
**When** la CI s'exécute
**Then** elle lance build, `astro check`, lint, tests Vitest, axe sur la page d'accueil, Lighthouse et la mesure du budget JS
**And** le check agrégé `ci-ok` échoue si une étape échoue.

**Given** `ci-ok` est déclaré comme status check obligatoire sur `main`
**When** une PR échoue
**Then** GitHub bloque la fusion
**And** une PR `fix:` sans test modifié échoue au workflow `fix-needs-test`.

**Given** le JavaScript initial dépasse 70 Ko compressés
**When** la CI s'exécute
**Then** la PR échoue avec le poids mesuré dans le message.

### Story 1.4 : Compatibilité navigateurs vérifiée

En tant que Visiteur,
je veux que le Site fonctionne sur mon navigateur,
afin de ne pas être bloqué par un choix technique (NFR-4).

**Acceptance Criteria:**

**Given** `browserslist` aligné sur les deux dernières versions de Chrome, Safari, Firefox et Edge
**When** la CI lance la matrice Playwright (Chromium, WebKit, Firefox, Edge)
**Then** le test de fumée de la Page d'accueil passe sur chaque navigateur
**And** une régression propre à un navigateur fait échouer `ci-ok`.

### Story 1.5 : En-têtes de sécurité, secrets et dépendances contrôlés

En tant que Léandro,
je veux des en-têtes de sécurité déclarés dans le dépôt et vérifiés en CI,
afin de pouvoir démontrer la sécurité du Site (FR-21).

**Acceptance Criteria:**

**Given** `vercel.json`
**When** je le lis
**Then** il déclare CSP, HSTS (au plus 1 jour, sans `preload` ni `includeSubDomains`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` et `frame-ancestors`.

**Given** un en-tête requis est retiré
**When** la CI s'exécute
**Then** le test des en-têtes échoue.

**Given** Dependabot et `npm audit` actifs
**When** une dépendance vulnérable est introduite
**Then** la CI le signale
**And** une analyse de secrets (outil open source) échoue si un secret est détecté dans le dépôt.

### Story 1.6 : Variables validées et alerte de build

En tant que Léandro,
je veux qu'un build mal configuré ou en échec me prévienne,
afin de ne pas laisser un Site cassé sans le savoir (AD-17).

**Acceptance Criteria:**

**Given** une variable d'environnement obligatoire manque
**When** le build démarre
**Then** il échoue immédiatement avec le nom de la variable manquante
**And** aucune valeur secrète n'apparaît dans les logs.

**Given** un build Vercel ou une CI échoue
**When** l'échec est enregistré
**Then** Léandro reçoit une notification par e-mail
**And** la liste des secrets et leur rotation est consignée dans `docs/exploitation.md`.

## Epic 2 : Léandro édite son contenu sans toucher au code

Tout le Contenu actuel vit dans Sanity, en FR et en EN, publiable en dev puis en prod. Léandro modifie un texte et le met en production en moins de 5 minutes (SM-5).

### Story 2.1 : Studio et schémas transverses

En tant que Léandro,
je veux un Studio Sanity avec les paramètres du Site et les textes d'interface,
afin d'éditer ces contenus sans toucher au code (FR-1).

**Acceptance Criteria:**

**Given** le dossier `studio/` indépendant du build du Site
**When** je lance le Studio
**Then** je peux éditer les paramètres du Site et le singleton `uiStrings`
**And** tout champ de texte est un objet `{ fr, en }`.

**Given** un champ FR ou EN vide
**When** j'essaie de publier
**Then** le Studio refuse la publication avec un message clair.

**Given** `sanity typegen`
**When** je le lance
**Then** les types sont générés vers `src/content/types.ts` et partagés avec les view-models.

### Story 2.2 : Modèle des Projets

En tant que Léandro,
je veux décrire mes Projets, Sous-projets et galeries dans le Studio,
afin d'en ajouter sans toucher au code (FR-1, UJ-3).

**Acceptance Criteria:**

**Given** un Projet
**When** je le crée
**Then** je renseigne titre, description, défi, concept, étiquettes, liens, galerie, `slug` et Gabarit (`template`)
**And** les Sous-projets et la galerie de 19 images du Projet graphisme sont modélisables.

**Given** un `slug` déjà publié en production
**When** j'essaie de le modifier
**Then** le schéma le verrouille.

**Given** une image informative
**When** je ne renseigne pas son texte alternatif en FR et EN
**Then** la publication est refusée, sauf si je la marque « décorative ».

### Story 2.3 : Modèle des autres Sections

En tant que Léandro,
je veux éditer Parcours, Compétences, services et À propos,
afin que la Page d'accueil entière soit pilotée par le Studio (FR-1).

**Acceptance Criteria:**

**Given** les types Parcours, Compétences, Services et À propos
**When** je les ouvre dans le Studio
**Then** chacun a ses champs localisés FR/EN avec validation
**And** l'ordre d'affichage est réorganisable.

### Story 2.4 : Couche de contenu en lecture seule

En tant que développeur,
je veux une couche `src/content/` qui lit Sanity au build et renvoie des view-models résolus par langue,
afin que pages et composants ne connaissent jamais Sanity (AD-2, AD-3).

**Acceptance Criteria:**

**Given** `SANITY_DATASET` et un jeton en lecture seule
**When** le build s'exécute
**Then** seuls les documents publiés sont lus
**And** `src/content/` expose des chaînes simples pour la locale demandée.

**Given** une valeur FR ou EN vide, ou un `alt` d'image informative manquant
**When** le build s'exécute
**Then** il échoue avec le document et le champ en cause.

**Given** un import du client Sanity hors `src/content/`
**When** le lint s'exécute
**Then** `no-restricted-imports` échoue.

**Given** des images Sanity
**When** le build s'exécute
**Then** elles sont téléchargées et optimisées, et aucune URL du CDN Sanity n'apparaît dans le HTML (AD-12).

**Given** une page d'essai temporaire (remplacée en épopée 3)
**When** je la construis
**Then** elle affiche le titre et la description de chaque Projet lus depuis Sanity
**And** elle permet de vérifier la publication de bout en bout dès la story 2.6.

### Story 2.5 : Migration du Contenu à l'identique

En tant que Léandro,
je veux que mon Contenu actuel soit migré sans modification,
afin que le Visiteur ne voie aucune différence de texte (FR-2).

**Acceptance Criteria:**

**Given** le Contenu FR et EN de `ancien-portfolio/` (en lecture seule)
**When** le script de migration s'exécute vers le dataset `dev`
**Then** les cinq Projets, la galerie de 19 images, le Parcours, les Compétences, les services et À propos existent dans le Studio
**And** les 9 autres langues ne sont pas migrées, ni `Marquee` ni la clé `marquee`.

**Given** le premier Projet
**When** je le migre
**Then** son bouton GitHub factice (`votre-pseudo/votre-repo`) est retiré et le reste est intact.

**Given** le texte extrait de l'ancien site et celui du contenu migré
**When** le test de comparaison s'exécute
**Then** il ne montre aucune différence en FR et en EN
**And** le test est ajouté à la CI (FR-2).

### Story 2.6 : Publication dev puis production

En tant que Léandro,
je veux publier dans le Studio et voir le Site se reconstruire seul,
afin de mettre en production sans toucher au code (FR-3).

**Acceptance Criteria:**

**Given** les datasets `dev` et `production` et un jeton de lecture par Environnement
**When** je publie un document dans `dev`
**Then** un webhook déclenche le deploy hook de l'Environnement dev
**And** le jeton de `dev` ne peut pas lire `production`.

**Given** un texte de Projet modifié
**When** je le publie, le vérifie en dev puis le promeus en production
**Then** le Site de production le reflète en moins de 5 minutes sans modification du code (SM-5)
**And** la procédure de promotion (export/import Sanity CLI) est documentée dans le dépôt.

**Given** le workflow GitHub planifié
**When** la semaine s'écoule
**Then** le dataset `production` est exporté en artefact conservé (AD-17).

## Epic 3 : Le Visiteur lit la Page d'accueil, en FR et en EN, sur tous ses appareils

La Page d'accueil complète est rendue en HTML statique depuis le contenu Sanity, dans le Thème Pop, en FR et en EN, accessible au clavier.

### Story 3.1 : Gabarit de page, navigation et menu mobile

En tant que Visiteur,
je veux atteindre chaque Section depuis la navigation, sur ordinateur comme sur mobile,
afin de parcourir le Site à ma façon (FR-5).

**Acceptance Criteria:**

**Given** la Page d'accueil
**When** je navigue au clavier
**Then** un lien d'évitement mène au contenu, les landmarks sont présents et le focus est visible
**And** chaque lien du menu amène à la bonne Section.

**Given** un écran mobile
**When** j'ouvre le menu au clavier
**Then** il s'ouvre et se ferme avec Échap
**And** le focus y est piégé puis rendu au bouton d'ouverture, via `src/islands/overlay.ts` qui possède la pile des superpositions.

### Story 3.2 : Hero et Section Projets (cartes)

En tant que Visiteur,
je veux voir le Hero et les Cartes de Projets,
afin de juger en quelques secondes si ce profil mérite un échange (UJ-1).

**Acceptance Criteria:**

**Given** le contenu migré
**When** je charge la Page d'accueil
**Then** le Hero et les Cartes des cinq Projets sont dans le HTML livré
**And** aucun texte n'est écrit en dur dans les composants.

**Given** le périmètre de cette story
**When** je clique une Carte
**Then** son ouverture n'est pas encore active (livrée en épopée 5), sans lien cassé.

### Story 3.3 : Sections Parcours, Compétences, Services et À propos

En tant que Thomas, responsable d'admission,
je veux lire le Parcours et les Compétences directement sur la page,
afin d'évaluer le profil sans ouvrir de Fenêtre de projet (UJ-2).

**Acceptance Criteria:**

**Given** la Page d'accueil
**When** je la consulte sans JavaScript
**Then** Parcours, Compétences, Services et À propos sont lisibles dans le HTML
**And** la hiérarchie des titres est correcte.

### Story 3.4 : Section Contact (structure) et pied de page

En tant que Visiteur,
je veux voir la Section Contact et le pied de page,
afin de savoir comment joindre Léandro.

**Acceptance Criteria:**

**Given** la Page d'accueil
**When** j'atteins la Section Contact
**Then** elle présente le texte, la zone destinée au formulaire (livré en épopée 7) et le pied de page
**And** les coordonnées ne sont pas écrites en clair (voir 7.3), un lien vers le formulaire sert de repli sans JS.

### Story 3.5 : Français et anglais

En tant que Visiteur,
je veux basculer entre FR et EN,
afin de lire le Site dans ma Langue (FR-10).

**Acceptance Criteria:**

**Given** les routes `/` et `/en/`
**When** je les charge
**Then** chaque page déclare `lang` et `hreflang`
**And** `/` reste en FR quel que soit le navigateur.

**Given** le sélecteur de Langue
**When** je l'utilise au clavier
**Then** la Langue active est annoncée aux lecteurs d'écran
**And** toute adresse est construite par `localizedPath(...)`.

### Story 3.6 : Page 404 et anciennes ancres

En tant que Visiteur,
je veux une 404 soignée et des anciens liens qui fonctionnent,
afin de ne jamais être perdu (FR-7).

**Acceptance Criteria:**

**Given** une adresse inconnue
**When** je la demande
**Then** le serveur renvoie 404 avec une page au style du Site
**And** il existe une 404 par Langue.

**Given** `/#work`, `/#journey`, `/#skills` et `/#contact`
**When** je les ouvre
**Then** chacun amène à la bonne Section.

**Given** `curl` sur la Page d'accueil
**When** un test CI l'exécute
**Then** le texte des Sections est présent sans JavaScript (FR-4).

### Story 3.7 : Fidélité visuelle du Thème Pop

En tant que Léandro,
je veux que la Page d'accueil Pop soit comparée à l'ancien site,
afin que le Site reste identique pour le Visiteur (FR-8).

**Acceptance Criteria:**

**Given** `ancien-portfolio/` servi en lecture seule
**When** j'exécute le script de capture
**Then** les captures de référence du Thème Pop aux largeurs 375, 768 et 1440 px, animations et éléments aléatoires figés, sont écrites dans `tests/reference/`
**And** `ancien-portfolio/` n'est ni modifié ni supprimé.

**Given** les captures de référence dans `tests/reference/`
**When** la CI compare le Thème Pop aux largeurs 375, 768 et 1440 px
**Then** moins de 0,1 % des pixels diffèrent, animations et éléments aléatoires figés
**And** tout écart accepté est consigné dans `docs/ajustements-visuels.md`.

**Given** le texte visible de l'ancien site en FR et en EN
**When** la CI le compare au texte rendu de la Page d'accueil construite
**Then** aucune différence n'est relevée (FR-2, partie « texte rendu »)
**And** le test reste dans la CI.

## Epic 4 : Les trois Thèmes, fidèles à l'ancien site

Le Visiteur passe de Pop à Terminal ou Wireframe, sans flash ni perte de contraste, et son choix est conservé.

### Story 4.1 : Thèmes Terminal et Wireframe

En tant que Visiteur,
je veux retrouver les thèmes Terminal et Wireframe,
afin de choisir l'apparence qui me convient (FR-8).

**Acceptance Criteria:**

**Given** `data-theme` vaut `terminal` ou `wireframe` sur `<html>`
**When** la page s'affiche
**Then** tous les composants prennent les valeurs des tokens du Thème
**And** aucune couleur, ombre, bordure ni durée littérale n'existe hors `src/styles/` (stylelint).

**Given** chacun des trois Thèmes
**When** je mesure les contrastes de texte
**Then** ils atteignent 4,5:1 (3:1 pour le grand texte), ou l'écart est soumis à Léandro (FR-23).

### Story 4.2 : Sélecteur de Thème mémorisé

En tant que Visiteur,
je veux changer de Thème et le retrouver à ma prochaine visite,
afin de ne pas le re-choisir (FR-9).

**Acceptance Criteria:**

**Given** `public/theme-init.js` externe et bloquant
**When** je recharge la page
**Then** le Thème choisi est posé avant le premier rendu, sans flash
**And** il est lu et écrit uniquement via `src/islands/prefs.ts` (clé `portfolio:theme`), sans cookie.

**Given** le sélecteur de Thème
**When** je l'utilise au clavier
**Then** il s'actionne et le Thème actif est annoncé aux lecteurs d'écran.

### Story 4.3 : Fidélité visuelle des trois Thèmes

En tant que Léandro,
je veux la comparaison visuelle sur les trois Thèmes,
afin qu'aucune régression ne passe (FR-8, SM-4).

**Acceptance Criteria:**

**Given** le script de capture de la story 3.7
**When** je l'exécute pour les Thèmes Terminal et Wireframe
**Then** leurs captures de référence sont ajoutées à `tests/reference/` sans toucher à `ancien-portfolio/`.

**Given** les captures de référence des trois Thèmes
**When** la CI compare 3 Thèmes × 375/768/1440 px
**Then** moins de 0,1 % de pixels diffèrent
**And** l'échec bloque `ci-ok`.

### Story 4.4 : Parité des tokens avec Figma

En tant que Léandro,
je veux que chaque token du code existe dans Figma,
afin que design et code restent alignés (FR-20).

**Acceptance Criteria:**

**Given** `design-system/tokens.css` pour les trois Thèmes
**When** je compare avec les variables Figma
**Then** chaque token existe sous le même nom dans chaque Thème
**And** un test ou script signale tout écart.

**Given** les composants du Site
**When** je consulte Storybook
**Then** leurs états et variantes sont documentés.

## Epic 5 : Le Visiteur ouvre et partage un Projet

Chaque Projet a une adresse propre et s'ouvre dans une Fenêtre de projet accessible, sans rechargement depuis la Page d'accueil.

### Story 5.1 : Page de Projet (Gabarit standard)

En tant que Sophie, recruteuse,
je veux ouvrir directement l'adresse d'un Projet,
afin de voir sa Fenêtre de projet sans geste supplémentaire (FR-6, UJ-1).

**Acceptance Criteria:**

**Given** `/projets/belote-kart` et `/en/projects/belote-kart`
**When** je les ouvre
**Then** la Page d'accueil complète s'affiche avec la Fenêtre de projet ouverte dans le HTML
**And** le Gabarit standard montre défi, concept, étiquettes, liens et galerie.

**Given** un `slug` inconnu
**When** je l'ouvre
**Then** la 404 s'affiche.

### Story 5.2 : Ouvrir et fermer une Fenêtre de projet

En tant que Visiteur,
je veux ouvrir un Projet depuis sa Carte et le fermer sans recharger,
afin de rester dans ma lecture (FR-6, FR-11, UJ-4).

**Acceptance Criteria:**

**Given** la Page d'accueil
**When** je clique une Carte
**Then** la fenêtre s'ouvre via l'API History, `/projets/[slug]` devient l'adresse et le focus passe dans la fenêtre
**And** l'îlot `ProjectWindow` est hydraté en `client:visible` ou `client:idle`.

**Given** une fenêtre ouverte
**When** je presse Échap, le bouton de fermeture, le geste mobile ou « retour »
**Then** elle se ferme sans rechargement et le focus revient à la Carte d'origine
**And** le focus reste piégé tant qu'elle est ouverte, et son rôle est déclaré.

**Given** une arrivée directe sur une page de Projet
**When** je ferme la fenêtre
**Then** je suis ramené à `/` ou `/en/` par navigation.

### Story 5.3 : Gabarit graphisme et vue détaillée

En tant que Visiteur,
je veux parcourir la galerie graphique et agrandir une image,
afin d'apprécier les travaux (FR-11).

**Acceptance Criteria:**

**Given** le Projet graphisme
**When** je l'ouvre
**Then** la galerie affiche ses 19 images avec leur texte alternatif
**And** chacune ouvre une vue détaillée, gérée par la pile de `overlay.ts`.

**Given** la vue détaillée ouverte
**When** je presse Échap
**Then** seule la vue détaillée se ferme et le focus revient à l'image.

### Story 5.4 : Gabarit personnalisé : Belote Kart

En tant que Visiteur,
je veux retourner la carte de Belote Kart et suivre les liens externes,
afin de découvrir ce Projet comme avant (FR-11).

**Acceptance Criteria:**

**Given** le Projet Belote Kart
**When** je retourne la carte à la souris ou au clavier
**Then** le verso s'affiche et le contenu reste lisible aux lecteurs d'écran
**And** les liens externes (Figma, Studapp) s'ouvrent correctement.

### Story 5.5 : Titre, canonical et Langue conservés

En tant que Visiteur,
je veux que l'onglet et le lecteur d'écran suivent le Projet ouvert,
afin de savoir où je suis (AD-18, FR-10).

**Acceptance Criteria:**

**Given** l'ouverture ou la fermeture d'une fenêtre par `pushState`
**When** l'état change
**Then** `document.title` et la balise canonique (posée par la mise en page de base si `Seo.astro` n'existe pas encore) sont mis à jour
**And** le changement est annoncé aux lecteurs d'écran.

**Given** un Projet ouvert
**When** je change de Langue
**Then** le même Projet reste ouvert avec le préfixe de l'autre Langue.

## Epic 6 : Les interactions ludiques, avec leurs alternatives accessibles

Les interactions qui font l'identité du Site sont conservées, avec une alternative accessible pour chacune et aucun mouvement autonome.

### Story 6.1 : Son coupé par défaut et curseur personnalisé

En tant que Visiteur,
je veux un son coupé par défaut et un curseur personnalisé,
afin de profiter de l'ambiance sans mauvaise surprise (FR-12).

**Acceptance Criteria:**

**Given** une première visite
**When** la page se charge
**Then** aucun son ne se déclenche
**And** le son ne s'active qu'après une action explicite, conservée dans `portfolio:muted` via `prefs.ts`.

**Given** le curseur personnalisé
**When** j'utilise le clavier
**Then** le focus visible n'est pas masqué.

### Story 6.2 : Compétences déplaçables et « Organiser »

En tant qu'Inès, utilisatrice au clavier,
je veux réorganiser les Compétences sans glisser-déposer,
afin d'accéder à la même interaction (FR-12, FR-14).

**Acceptance Criteria:**

**Given** les Compétences
**When** je les déplace à la souris
**Then** elles se réorganisent comme sur l'ancien site.

**Given** le bouton « Organiser »
**When** je l'actionne au clavier
**Then** les Compétences se rangent sans glisser-déposer
**And** le résultat est annoncé aux lecteurs d'écran.

### Story 6.3 : Carte à gratter avec équivalent textuel

En tant que Visiteur utilisant un lecteur d'écran,
je veux lire le contenu de la carte à gratter sans la gratter,
afin de ne rien manquer (FR-12, FR-14).

**Acceptance Criteria:**

**Given** la carte à gratter (`canvas`)
**When** je la gratte à la souris ou au doigt
**Then** le contenu se révèle comme avant.

**Given** un lecteur d'écran
**When** j'atteins la carte
**Then** son contenu est disponible en texte sans gratter.

### Story 6.4 : Mode fête et garde-fous de mouvement

En tant que Visiteur,
je veux déclencher et arrêter le Mode fête sans souris,
afin que l'effet ne me piège pas (FR-12, FR-13).

**Acceptance Criteria:**

**Given** le code Konami
**When** je le saisis
**Then** le Mode fête démarre
**And** je l'arrête au clavier.

**Given** le Site entier
**When** un test automatique le mesure
**Then** aucun contenu ne bouge seul plus de 5 secondes et aucun élément ne clignote plus de 3 fois par seconde.

## Epic 7 : Le Visiteur contacte Léandro ou récupère son CV

Le formulaire fonctionne, protégé du spam, les coordonnées restent invisibles dans le code, et le CV se télécharge en un clic.

### Story 7.1 : Routes ALTCHA et contact

En tant que développeur,
je veux deux routes serveur qui valident un jeton ALTCHA puis envoient via Resend,
afin que seul un envoi légitime crée un message (FR-15, FR-21, AD-8).

**Acceptance Criteria:**

**Given** `api/altcha.ts`
**When** je l'appelle
**Then** il émet un défi à expiration courte.

**Given** `api/contact.ts` et une requête sans jeton valide
**When** elle arrive
**Then** elle est refusée avec le code stable `captcha` et aucun message n'est créé.

**Given** des champs invalides
**When** la requête arrive
**Then** la réponse est `{ ok: false, errors: { champ: CODE } }` en HTTP 400 ou 422
**And** ces deux routes sont les seules `prerender = false`, avec leurs clés uniquement dans les variables Vercel.

### Story 7.2 : Formulaire de contact accessible

En tant que Sophie,
je veux envoyer un message à Léandro,
afin de le contacter après avoir vu ses projets (FR-15, UJ-1).

**Acceptance Criteria:**

**Given** nom, e-mail et message valides
**When** j'envoie
**Then** un message de réussite s'affiche dans la page, annoncé par `aria-live`
**And** aucune `alert()` n'est utilisée.

**Given** des champs invalides
**When** j'envoie
**Then** chaque erreur est indiquée par champ, traduite depuis `uiStrings` en FR et en EN
**And** le widget ALTCHA est utilisable au clavier avec ses chaînes issues de `uiStrings`.

### Story 7.3 : Coordonnées non lisibles dans le code

En tant que Léandro,
je veux que mon e-mail et mon téléphone n'apparaissent pas en clair dans le code,
afin de limiter la collecte par les robots simples (FR-16, AD-9).

**Acceptance Criteria:**

**Given** la Page d'accueil chargée avec JavaScript
**When** je la consulte
**Then** l'e-mail et le téléphone s'affichent tels quels, assemblés par un îlot.

**Given** la Page d'accueil sans JavaScript
**When** je la consulte
**Then** un lien vers le formulaire remplace les coordonnées.

**Given** le HTML et les bundles livrés
**When** le test CI les parcourt
**Then** aucune des deux coordonnées n'apparaît en clair.

### Story 7.4 : CV et liens LinkedIn

En tant que Visiteur,
je veux télécharger le CV et ouvrir le profil LinkedIn,
afin de poursuivre mon évaluation (FR-17, FR-18).

**Acceptance Criteria:**

**Given** le CV dans `public/`, versionné avec le code
**When** je clique le lien
**Then** le PDF se télécharge en un clic
**And** un test CI vérifie qu'il renvoie 200 après la mise en prod.

**Given** le pied de page et l'icône LinkedIn
**When** je les ouvre
**Then** les deux pointent vers `https://www.linkedin.com/in/l%C3%A9andro-da-silva/`
**And** un test CI le garantit.

## Epic 8 : Le Site est bien référencé et mesuré

Chaque page produit ses métadonnées par un composant unique, le plan du site est juste, et la fréquentation est mesurée sans cookie.

### Story 8.1 : Composant `Seo.astro`

En tant que Visiteur partageant un lien,
je veux un aperçu correct (titre, description, image),
afin que le lien soit lisible dans LinkedIn ou une messagerie (FR-19).

**Acceptance Criteria:**

**Given** n'importe quelle page
**When** elle est construite
**Then** `Seo.astro` produit titre, description, canonical, `hreflang`, Open Graph et Twitter depuis Sanity
**And** le JSON-LD `Person` ne contient plus l'offre d'emploi et le positionnement reprend le profil LinkedIn sans citer l'employeur.

### Story 8.2 : Plan du site

En tant que moteur de recherche,
je veux un `sitemap.xml` exact,
afin d'indexer toutes les pages utiles (FR-19).

**Acceptance Criteria:**

**Given** le build de production
**When** je lis `sitemap.xml`
**Then** il liste la Page d'accueil de chaque Langue et chaque Projet
**And** il ne contient aucune ancre.

### Story 8.3 : Images d'aperçu

En tant que Visiteur,
je veux une image d'aperçu adaptée à chaque page,
afin que les liens partagés soient attrayants (FR-19, AD-18).

**Acceptance Criteria:**

**Given** chaque Projet et la Page d'accueil
**When** le build s'exécute
**Then** une image d'aperçu aux dimensions adaptées est générée depuis l'image principale
**And** les balises Open Graph la référencent.

### Story 8.4 : Mesure d'audience sans cookie

En tant que Léandro,
je veux connaître la fréquentation sans cookie ni bandeau,
afin de respecter la vie privée des Visiteurs (NFR-5, AD-13).

**Acceptance Criteria:**

**Given** `VERCEL_ENV=production`
**When** une page se charge
**Then** `@vercel/analytics` est chargé et aucun cookie n'est déposé.

**Given** l'Environnement dev
**When** une page se charge
**Then** aucun script de mesure n'est chargé.

## Epic 9 : Conformité RGAA et mise en ligne réversible

Le Site est audité, sa déclaration d'accessibilité publiée, et la bascule vers le domaine final se fait sans jamais perdre l'ancien site.

### Story 9.1 : Audit automatique de l'échantillon complet

En tant que Léandro,
je veux que l'échantillon FR-22 soit testé automatiquement,
afin de détecter toute régression d'accessibilité (FR-22).

**Acceptance Criteria:**

**Given** l'échantillon : Page d'accueil FR et EN, une Fenêtre de projet par Gabarit, chaque Thème, formulaire, menu mobile ouvert, Mode fête, carte à gratter
**When** axe s'exécute en CI
**Then** aucune violation bloquante n'est relevée.

### Story 9.2 : Audit manuel et ajustements validés

En tant qu'Inès,
je veux que le Site soit éprouvé au clavier et au lecteur d'écran,
afin de pouvoir accomplir UJ-1 et UJ-4 (FR-22, FR-23).

**Acceptance Criteria:**

**Given** l'échantillon d'audit
**When** je le parcours au clavier et au lecteur d'écran
**Then** les résultats sont consignés avec 0 critère bloquant.

**Given** un échec RGAA figé par le design
**When** une correction est proposée
**Then** elle est montrée à Léandro avant application
**And** elle est consignée dans `docs/ajustements-visuels.md`.

### Story 9.3 : Déclaration d'accessibilité

En tant que Visiteur,
je veux une déclaration d'accessibilité honnête,
afin de connaître l'état réel du Site (FR-22, SM-2).

**Acceptance Criteria:**

**Given** les résultats d'audit
**When** la déclaration est publiée en FR et EN
**Then** elle indique le niveau de conformité réel et les limites connues
**And** un lien y mène depuis le pied de page.

### Story 9.4 : Seuils de qualité en production provisoire

En tant que Léandro,
je veux vérifier les indicateurs SM-1 et SM-3 sur l'adresse provisoire,
afin de valider avant la bascule.

**Acceptance Criteria:**

**Given** l'adresse `*.vercel.app` en production
**When** je lance Lighthouse sur la Page d'accueil et une page de Projet
**Then** chaque catégorie atteint au moins 95, et tout écart dû à la fidélité (FR-8) est consigné
**And** securityheaders.com note au moins A.

### Story 9.5 : Archive de l'ancien site et domaine d'envoi

En tant que Léandro,
je veux une archive vérifiable de l'ancien site et un domaine d'envoi prêt,
afin de pouvoir revenir en arrière à tout moment (NFR-6, AD-15).

**Acceptance Criteria:**

**Given** l'ancien site en ligne et `ancien-portfolio/`
**When** je crée l'archive hors du dépôt
**Then** elle contient code, fichiers publiés et CV, avec une empreinte SHA-256
**And** `ancien-portfolio/` n'est ni modifié ni supprimé.

**Given** la zone DNS Hostinger
**When** j'y ajoute SPF et DKIM de Resend
**Then** les enregistrements existants restent intacts et le domaine d'envoi est vérifié.

### Story 9.6 : Bascule réversible et période de repli

En tant que Léandro,
je veux basculer `leandro-dasilva.com` vers le nouveau Site et pouvoir revenir en moins d'une heure,
afin de livrer sans risque (NFR-6).

**Acceptance Criteria:**

**Given** le TTL DNS abaissé au préalable et la validation de Léandro en production
**When** je change l'enregistrement DNS
**Then** le nouveau Site répond sur le domaine final en HTTPS.

**Given** un problème après bascule
**When** je remets l'ancien enregistrement DNS
**Then** l'ancien site répond en moins d'une heure, sans reconstruction.

**Given** l'ancien site chez Hostinger
**When** la période de repli court
**Then** il reste intact pendant 30 jours
**And** HSTS n'est allongé qu'après cette période.
