---
status: draft
stepsCompleted: []
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

{{requirements_coverage_map}}

## Epic List

{{epics_list}}
