---
title: 'Story 2.3 : Modèle des autres Sections'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '11b26ee54b17f11e95be57df79f780b85a141995'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-2-modele-des-projets.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Parcours, Compétences, services, À propos, le Hero, les titres des Sections Projets et Contact et le pied de page n'ont pas de modèle dans le Studio : la Page d'accueil ne peut pas être entièrement pilotée par le Studio (FR-1).

**Approach:** Ajouter dans `studio/` huit singletons (Parcours, Compétences, Services, À propos, Hero, Projets, Contact, pied de page), les Sections avec un en-tête localisé et des éléments réorganisables, puis régénérer `src/content/types.ts`.

## Boundaries & Constraints

**Always:**
- Tout texte est un champ localisé de la story 2.1 ou ses variantes facultatives de la 2.2.
- Un en-tête de Section (`enteteSection`) reprend l'ancien site : titre, mot mis en avant (facultatif), sous-titre (facultatif).
- Ordre d'affichage : les éléments sont des tableaux, réorganisables par glisser-déposer dans le Studio ; aucun champ `ordre` à saisir.
- `sectionParcours` : en-tête, étapes (période, titre, lieu, description).
- `sectionCompetences` : en-tête, compétences (nom, famille `hard` ou `soft`, teinte).
- `sectionServices` : en-tête, services (titre, description).
- `sectionAPropos` : en-tête (badge facultatif), paragraphes (au moins un), libellé du bouton CV, libellé et valeur de la localisation.
- La teinte d'une compétence est un nom (`pink`, `yellow`, `sky`, `green`, `lilac`, `orange`, `red`, `teal`), jamais une valeur de couleur ; le composant de la story 6.2 la relie aux tokens.
- Chaque tableau d'éléments exige au moins un élément.
- `hero` : badge, titre en trois lignes, sous-titre, libellés des deux boutons. `sectionProjets` et `sectionContact` : en-tête seul (les libellés du formulaire restent dans `uiStrings`). `footer` : copyright, indice Konami, bio, trois intitulés de colonnes, disponibilité, signature.
- **Décision (périmètre) :** Hero, en-têtes Projets et Contact et textes courts du pied de page entrent dans la 2.3, car la Page d'accueil doit être entièrement pilotée par le Studio. Les mentions légales (bouton et contenu) en sont exclues : leur texte change avec l'hébergeur et sera traité dans une story ultérieure.
- Singletons : un seul document, sans création multiple ni suppression, comme `siteSettings`.

**Never:**
- Pas de mentions légales ni de texte riche (Portable Text), pas de `src/content/` ni de client Sanity côté Site (2.4), aucune migration de contenu (2.5), aucun composant.
- Pas de token de couleur ajouté à `design-system/tokens.css`.
- Aucun document créé dans un dataset par l'agent, aucune modification de `ancien-portfolio/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| En-tête complet | titre `{ fr, en }`, mot et sous-titre absents | validation passe | N/A |
| Mot mis en avant partiel | `{ fr }` seulement | publication refusée | message nommant EN |
| Section sans élément | tableau vide | publication refusée | message « au moins un élément » |
| Compétence | famille ou teinte hors liste | refusée par la liste fermée | N/A |
| Pied de page | bio sans valeur EN | publication refusée | message nommant EN |
| Réordonner | glisser un élément | nouvel ordre enregistré | N/A |

</frozen-after-approval>

## Code Map

- `studio/schemaTypes/index.ts`, `studio/structure.ts` -- enregistrer les types ; `SINGLETONS` pilote le bureau, les actions et les modèles
- `studio/schemaTypes/siteSettings.ts` -- modèle d'un singleton
- `studio/schemaTypes/localizedStringOptionnel.ts`, `localizedTextOptionnel.ts` -- champs facultatifs de la 2.2
- `src/studio-projet.test.ts`, `src/studio.test.ts` -- modèle des tests
- `src/content/types.ts` -- à régénérer par `cd studio && npm run typegen`
- `ancien-portfolio/src/data/translations/{fr,en}.js` -- lecture seule : formes de `timeline`, `skills`, `services`, `about`, `hero`, `work`, `contact`, `footer` (sans `legal`, ni `marquee`)
- `design-system/tokens.css` -- ne pas modifier

## Tasks & Acceptance

**Execution:**
- [ ] `studio/lib/sections.ts` -- listes fermées (familles, teintes) et message « au moins un élément » -- testable à la racine
- [ ] `studio/schemaTypes/enteteSection.ts` -- objet en-tête réutilisable -- AC 1
- [ ] `studio/schemaTypes/sectionParcours.ts`, `sectionCompetences.ts`, `sectionServices.ts`, `sectionAPropos.ts` -- singletons avec tableaux réorganisables -- AC 1
- [ ] `studio/schemaTypes/index.ts`, `studio/structure.ts` -- enregistrement et entrées du bureau -- AC 1
- [ ] `src/content/types.ts` -- régénéré
- [ ] `src/studio-sections.test.ts` -- tests de la matrice et présence des types générés -- règle de tests
- [ ] `docs/exploitation.md` -- une ligne sur les singletons de Sections

**Acceptance Criteria:**
- Given les huit singletons (Parcours, Compétences, Services, À propos, Hero, Projets, Contact, pied de page), when je les ouvre dans le Studio, then chacun a ses champs localisés FR/EN avec validation.
- Given un tableau d'éléments, when je glisse un élément, then l'ordre d'affichage change.
- Given la CI racine, when `npm test`, `npm run lint` et `npm run typecheck` s'exécutent, then ils sont verts sans réseau.

## Implementation Notes

- Implémenté directement, sans sous-agent. Nouveaux : `studio/lib/sections.ts`, `schemaTypes/singleton.ts` (fabrique `creerSingleton`), `enteteSection`, huit singletons (`hero`, `sectionProjets`, `sectionParcours`, `sectionCompetences`, `sectionServices`, `sectionAPropos`, `sectionContact`, `footer`). `SINGLETONS` de `structure.ts` compte dix entrées ; la config en déduit les types sans création ni suppression.
- Contrôle manuel dans le Studio `dev` : les dix singletons apparaissent au bureau ; `sectionParcours` refuse « Ajoutez au moins un élément. » et « La version EN est obligatoire. » (titre) ; le mot mis en avant, facultatif, ne génère pas d'erreur. Brouillon de test supprimé, `dev` revérifié à 0 document par le connecteur Sanity. Le glisser-déposer des éléments n'a pas été exercé : c'est le comportement natif des tableaux Sanity.
- 124 tests, lint, format, typecheck racine et `tsc` du Studio verts.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en 2.1 et 2.2).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| Le bio du pied de page contient `<br />` dans l'ancien site ; `localizedText` est du texte brut | low | defer | la 2.5 devra convertir les sauts de ligne sans changer le texte rendu ; consigné |
| Aucune story pour les mentions légales (bouton, contenu) : texte à réécrire (hébergeur) et texte riche | medium | defer | exclu du périmètre par décision de Léandro ; story à créer avant l'épopée 9 (déclaration d'accessibilité) ; consigné |
| Teintes de compétences : noms à relier aux tokens | low | defer | la story 6.2 les mappe ; consigné |
| Glisser-déposer non exercé dans le Studio | false | rejeté | comportement natif des tableaux Sanity, aucun code spécifique |
| Création ou suppression possibles des nouveaux singletons | false | rejeté | `typesSingleton` dérive de `SINGLETONS` ; aucun bouton de création au bureau |

## Design Notes

L'ancien site écrit le titre en deux parties (« PROJETS » puis « RÉALISÉS » mis en avant) ; l'en-tête garde ces deux champs pour que le rendu reste identique. Les neuf teintes de compétences de l'ancien site dépassent les tokens existants : la liste de noms évite d'ajouter des couleurs ici.

## Verification

**Commands:**
- `npm test` -- expected: tous les tests passent
- `npm run lint && npm run typecheck && npm run format:check` -- expected: aucune erreur
- `cd studio && npx tsc -p . && npm run typegen` -- expected: types générés sans erreur

**Manual checks (if no CLI):**
- Dans le Studio `dev` : ouvrir les quatre singletons, glisser un élément, refuser une Section sans élément (à faire avec Claude in Chrome, puis supprimer les brouillons).
