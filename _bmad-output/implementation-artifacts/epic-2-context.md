# Epic 2 Context: Léandro édite son contenu sans toucher au code

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Tout le Contenu actuel vit dans Sanity, en FR et en EN, publiable en dev puis en prod. Léandro modifie un texte et le met en production en moins de 5 minutes (SM-5), sans toucher au code. L'épopée livre le Studio et ses schémas, la couche de lecture `src/content/`, la migration à l'identique du Contenu de l'ancien site et la chaîne de publication.

## Stories

- Story 2.1: Studio et schémas transverses
- Story 2.2: Modèle des Projets
- Story 2.3: Modèle des autres Sections
- Story 2.4: Couche de contenu en lecture seule
- Story 2.5: Migration du Contenu à l'identique
- Story 2.6: Publication dev puis production

## Requirements & Constraints

- Le Studio décrit chaque type de Contenu : Projets, Sous-projets, galeries, Parcours, Compétences, services, À propos, paramètres du Site, textes d'interface, en FR et EN.
- Aucun texte visible n'est écrit en dur dans le code ; chaque texte existe en FR et en EN ; les images portent un texte alternatif éditable.
- La migration ne modifie aucun texte en FR et EN ; les 9 autres langues ne sont pas migrées ; le bouton GitHub factice du premier Projet est retiré.
- Deux datasets (`dev`, `production`), un jeton de lecture par Environnement, le jeton de `dev` ne lit pas `production`. Le build ne lit que les documents publiés.
- Gratuit ou open source uniquement : Sanity Free (2 datasets, 2 webhooks).

## Technical Decisions

- Le Studio est un projet Sanity indépendant dans `studio/`, hors du build du Site (Sanity 6.24.0). Le Site n'utilise que `@sanity/client` 8.17.0, sans `@sanity/astro`.
- Seul `src/content/` importe Sanity, en lecture seule ; il renvoie des view-models typés, résolus par langue. Règle ESLint `no-restricted-imports` déjà en place.
- Tout champ de texte est un objet `{ fr, en }`. Le Studio refuse de publier un document dont une valeur FR ou EN est vide.
- Les textes d'interface vivent dans le singleton `uiStrings`, dont le catalogue de clés est défini une seule fois dans `studio/`. Les types sont générés par `sanity typegen` vers `src/content/types.ts`, partagés avec les view-models.
- Images : texte alternatif obligatoire pour toute image informative, case « décorative » explicite. Les assets sont téléchargés et optimisés au build ; aucune URL du CDN Sanity dans le HTML.
- Le `slug` d'un Projet est unique, identique en FR et EN, immuable après publication en production.
- Dates en ISO 8601 ; ids Sanity jamais exposés dans le HTML.
- Le Studio et `studio/` sont exclus de `tsconfig.json` et d'ESLint à la racine.
- Variables d'environnement : `SANITY_DATASET` et jeton de lecture ; aucun secret dans le dépôt.

## Cross-Story Dependencies

- 2.1 fournit la base (projet Studio, helper de champ localisé, `uiStrings`, typegen) réutilisée par 2.2 et 2.3.
- 2.4 consomme les types générés par 2.1 à 2.3 ; 2.5 migre vers ces schémas ; 2.6 s'appuie sur les datasets et les jetons.
- L'épopée 3 lit le contenu uniquement via `src/content/` (2.4) ; les composants du kit (épopée 11) reçoivent leurs textes de Sanity.
