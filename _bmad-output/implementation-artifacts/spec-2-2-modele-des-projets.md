---
title: 'Story 2.2 : Modèle des Projets'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '894081bbe5e6fdcd95d31db5f4a55c47d1088456'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-1-studio-et-schemas-transverses.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les Projets, Sous-projets et galeries de l'ancien site n'ont pas de modèle dans le Studio : Léandro ne peut pas en ajouter sans toucher au code (FR-1, UJ-3).

**Approach:** Ajouter dans `studio/` le type document `project`, ses types objet réutilisables (image à texte alternatif, lien, Sous-projet), la validation du texte alternatif et du `slug`, puis régénérer `src/content/types.ts`.

## Boundaries & Constraints

**Always:**
- Tout texte est `localizedString` ou `localizedText` (story 2.1) ; étiquettes et libellés de liens compris.
- Champs d'un Projet : titre, titre de carte optionnel, catégorie, description courte, description détaillée facultative (texte des Projets sans défi ni concept, pour une migration à l'identique), défi, concept, étiquettes, liens, image de couverture, galerie, Sous-projets, `slug`, Gabarit (`template` : `standard`, `graphisme`, `personnalise`), couleur d'accent, ordre d'affichage (nombre).
- La couleur d'accent est un nom de token (`accent2` à `accent5`), jamais une valeur de couleur.
- Un Sous-projet porte titre, défi, concept, étiquettes, galerie et lien ; la galerie accepte au moins 19 images et une image de calque optionnelle (wireframe) par image.
- Image informative : texte alternatif FR et EN obligatoires ; case « décorative » exempte et masque le texte alternatif.
- `slug` unique, identique en FR et EN, généré depuis le titre FR, au format kebab-case.
- **Décision (verrou du slug) :** la config du Studio déclare deux espaces de travail, `dev` (dataset `dev`) et `production` (dataset `production`). Le slug n'est en lecture seule, une fois le document publié, que dans l'espace `production` ; il reste modifiable dans `dev` jusqu'à la promotion. Le schéma est fabriqué par une fonction qui reçoit ce booléen. Le Studio ne dépend plus de `SANITY_STUDIO_DATASET` (le dataset se choisit dans l'interface) ; la CLI garde `dev` par défaut.
- Logique de validation dans des fichiers purs sous `studio/lib/` (sans import Sanity), testés depuis la racine.

**Never:**
- Pas de schéma Parcours, Compétences, Services ni À propos (2.3), pas de `src/content/` ni de client Sanity côté Site (2.4), aucune migration ni donnée de l'ancien site (2.5), aucun webhook (2.6).
- Aucun document créé dans un dataset, aucun appel réseau par l'agent.
- Aucune modification de `ancien-portfolio/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Image informative complète | alt `{ fr, en }`, décorative faux | validation passe | N/A |
| Alt EN manquant | alt `{ fr }`, décorative faux | publication refusée | message nommant EN |
| Image décorative | décorative vrai, sans alt | validation passe | N/A |
| Slug valide | `belote-kart` | accepté | N/A |
| Slug invalide | `Belote Kart`, vide | refusé | message de format |
| Slug verrouillé | espace `production`, document déjà publié | champ en lecture seule | N/A |
| Slug libre en dev | espace `dev`, document publié | champ modifiable | N/A |
| Gabarit inconnu | valeur hors des trois | refusé par la liste fermée | N/A |

</frozen-after-approval>

## Code Map

- `studio/schemaTypes/index.ts` -- liste des types ; y enregistrer les nouveaux
- `studio/schemaTypes/localizedString.ts`, `localizedText.ts` -- champs localisés à réutiliser
- `studio/lib/champLocalise.ts` -- modèle de validation pure et de messages en français
- `studio/sanity.config.ts`, `studio/structure.ts` -- config (un seul espace aujourd'hui, à passer à deux) et bureau ; liste des Projets à ajouter sous les singletons
- `src/studio.test.ts` -- tests existants ; modèle pour les nouveaux
- `src/content/types.ts` -- généré, à régénérer par `cd studio && npm run typegen`
- `ancien-portfolio/src/data/translations/fr.js`, `galleries.js`, `graphicGallery.js` -- lecture seule : forme réelle des Projets (couverture, `colorKey`, liens Figma, GitHub, YouTube, Sous-projets, galeries avec calques)
- `design-system/tokens.css` -- noms des accents ; ne pas modifier

## Tasks & Acceptance

**Execution:**
- [ ] `studio/lib/validationProjet.ts` -- fonctions pures : alt requis sauf décorative, format du slug, liste des Gabarits -- testable à la racine
- [ ] `studio/schemaTypes/imageInformative.ts` -- objet image + alt localisé + case décorative, alt masqué si décorative -- AC 3
- [ ] `studio/schemaTypes/lien.ts`, `sousProjet.ts` -- objets réutilisables -- AC 1
- [ ] `studio/schemaTypes/project.ts` -- document Projet complet, `slug`, Gabarit, accent, ordre -- AC 1, 2
- [ ] `studio/schemaTypes/index.ts`, `studio/structure.ts` -- enregistrement et liste des Projets triée par ordre -- AC 1
- [ ] `studio/sanity.config.ts` -- appliquer la décision sur le verrou du slug -- AC 2
- [ ] `src/content/types.ts` -- régénéré -- cohérence des types
- [ ] `src/studio-projet.test.ts` -- tests de la matrice et présence des types `Project` générés -- règle de tests
- [ ] `docs/exploitation.md`, `.env.example` -- verrou du slug limité à `production`, retrait de `SANITY_STUDIO_DATASET` du Studio

**Acceptance Criteria:**
- Given le Studio, when je crée un Projet, then je renseigne titre, description, défi, concept, étiquettes, liens, galerie, `slug` et Gabarit, et Sous-projets et galerie de 19 images sont modélisables.
- Given un `slug` déjà publié dans l'espace `production`, when j'essaie de le modifier, then le schéma le verrouille.
- Given une image informative sans texte alternatif FR et EN, when je publie, then c'est refusé, sauf si elle est marquée « décorative ».
- Given la CI racine, when `npm test`, `npm run lint` et `npm run typecheck` s'exécutent, then ils sont verts sans réseau.

## Implementation Notes

- Implémenté directement, sans sous-agent. Nouveaux : `studio/lib/validationProjet.ts`, `components/SlugVerrouille.tsx`, types `imageInformative`, `lien`, `sousProjet`, `project` (fabrique `creerProject(verrouSlug)`), variantes `localizedStringOptionnel` et `localizedTextOptionnel` (un champ facultatif ne peut pas réutiliser les types 2.1, dont la validation exige FR et EN). La config devient `[espace('dev'), espace('production')]` avec `basePath` `/dev` et `/production`.
- Écart assumé : les accents sont `accent-1` à `accent-5`, les vrais noms des tokens de `design-system/tokens.css` (la spec disait `accent2` à `accent5`).
- Ajout validé par Léandro en fin de relecture : `descriptionDetaillee` (`localizedTextOptionnel`), porteur du `fullDescription` d'Audiovisuel et Graphisme ; Belote Kart, qui fusionne défi et concept, reste à découper en 2.5.
- `defi` et `concept` sont facultatifs sur un Projet (l'ancien site n'en a pas pour Audiovisuel et Graphisme) mais obligatoires sur un Sous-projet.
- Scripts `typegen` et `schema:extract` : `--workspace dev --force` (deux espaces, `schema.json` intermédiaire écrasé).
- Contrôle manuel dans le Studio `dev` (Claude in Chrome) : liste Projets, formulaire, génération du slug (`Réalisations Graphiques` donne `realisations-graphiques`), erreurs de validation de la couverture sans alt. Défaut vu et corrigé : trois erreurs redondantes sur l'ordre vides. Brouillon de test supprimé. Le verrou en `production` n'est pas exercé (il faudrait publier dans le dataset de production).
- 104 tests, lint, format, typecheck racine et `tsc` du Studio verts.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en 2.1).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| Ordre vide : trois erreurs redondantes (Required, entier, ≥ 0) | low | patch | vu dans le Studio ; remplacé par `validerOrdre` (un seul message), testé |
| `new RegExp` avec variable dans mon test (déjà bloqué par Semgrep en 2.1) | medium | patch | remplacé par `toContain` avant tout commit |
| Aucun champ pour le texte détaillé des Projets sans défi/concept (Audiovisuel, Graphisme : `fullDescription` seule) ; Belote Kart fusionne défi et concept | medium | intent_gap | résolu par Léandro : champ facultatif `descriptionDetaillee` ajouté ; la 2.5 y migre le `fullDescription` des Projets sans défi ni concept |
| Verrou du slug en `production` non exercé | low | defer | demande une publication dans le dataset de production ; à vérifier en 2.6 à la première promotion |
| Alt conservé en donnée quand l'image devient décorative | low | defer | `src/content/` (2.4) doit ignorer `alt` si `decorative` est vrai ; consigné |
| `projectId` : narrowing sans cast `as` | false | rejeté | `tsc` passe sans assertion |

## Design Notes

L'ancien site fusionne défi et concept dans un seul texte (« Le défi : … Le concept : … ») ; le modèle les sépare comme l'exige la story. La story 2.5 devra les extraire sans changer le texte rendu : à garder en tête, hors périmètre ici.

## Verification

**Commands:**
- `npm test` -- expected: tous les tests passent
- `npm run lint && npm run typecheck && npm run format:check` -- expected: aucune erreur
- `cd studio && npm run typegen && npx tsc -p .` -- expected: types générés, Studio compilé sans erreur

**Manual checks (if no CLI):**
- Dans le Studio relié à `dev` : créer un Projet, ne pas renseigner l'alt EN d'une image informative, vérifier que Publish est désactivé, puis supprimer le brouillon (à faire par Léandro ou avec Claude in Chrome).
