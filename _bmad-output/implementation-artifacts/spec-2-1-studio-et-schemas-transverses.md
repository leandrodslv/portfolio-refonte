---
title: 'Story 2.1 : Studio et schémas transverses'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '4ae3fd94019ee00e3b25eacf043e66b7a8f1320b'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Aucun Studio n'existe : Léandro ne peut éditer ni les paramètres du Site ni les textes d'interface, et le Site n'a pas de types de contenu partagés (FR-1, AD-3).

**Approach:** Créer `studio/`, projet Sanity indépendant, avec un champ localisé `{ fr, en }` à validation bloquante, le singleton `siteSettings`, le singleton `uiStrings` dont le catalogue de clés est défini une seule fois, et la génération de types vers `src/content/types.ts`.

## Boundaries & Constraints

**Always:**
- `studio/` a son propre `package.json` (sanity 6.24.0), hors du build, du lint et du typecheck racine (déjà exclu de `tsconfig.json` et ESLint).
- Tout champ de texte est un `localizedString` ou `localizedText` : objet `{ fr, en }`, les deux requis et non vides (espaces seuls refusés), avec un message de validation en français nommant la langue manquante.
- Le catalogue des clés `uiStrings` est une liste unique dans `studio/` qui génère à la fois les champs du schéma et le test de complétude. Il couvre les textes d'interface transverses de l'ancien site (navigation, boutons, libellés `ui`, formulaire de contact et ses erreurs, ALTCHA, page 404, menu). Les titres de sections (Projets, Parcours…) relèvent de la story 2.3.
- `siteSettings` : nom du Site, titre et description par défaut (localisés), URL de LinkedIn.
- Singletons : un seul document par type, ni création multiple ni suppression depuis le Studio.
- Identifiants du projet lus depuis l'environnement (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`) ; aucune valeur réelle committée.
- Gratuit ou open source ; pas de commentaires hors WHY non évident ; TypeScript strict, sans `any`.

**Never:**
- Pas de schéma Projet, Parcours, Compétences, Services ni À propos (2.2 et 2.3), pas de couche `src/content/` ni de client Sanity côté Site (2.4), pas de migration (2.5), pas de webhook ni de dataset à créer (2.6).
- Aucun appel réseau, aucune création de projet Sanity, aucun déploiement du Studio par l'agent.
- Aucune modification de `ancien-portfolio/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Champ complet | `{ fr: 'Projets', en: 'Work' }` | validation passe | N/A |
| EN vide | `{ fr: 'Projets', en: '' }` | publication refusée | message « La version EN est obligatoire » |
| FR absent ou espaces | `{ en: 'Work' }` / `{ fr: '  ', en: 'Work' }` | publication refusée | message « La version FR est obligatoire » |
| Catalogue | clé ajoutée au catalogue | champ présent dans `uiStrings` sans autre écriture | test échoue si schéma et catalogue divergent |
| Typegen | `sanity schema extract` puis `typegen generate` | `src/content/types.ts` contient `SiteSettings` et `UiStrings` | échec visible si schéma invalide |

</frozen-after-approval>

## Code Map

- `studio/` -- n'existe pas : à créer (`package.json`, `sanity.config.ts`, `sanity.cli.ts`, `tsconfig.json`)
- `src/lib/variables.ts` -- registre des variables Sanity du Site ; ne pas modifier (palier `sanity` activé en 2.4)
- `.env.example` -- noms seulement ; y ajouter les deux variables `SANITY_STUDIO_*`
- `tsconfig.json`, `eslint.config.js` -- `studio` déjà exclu ; `.prettierignore` à vérifier
- `src/ci.test.ts`, `src/lib/*.test.ts` -- modèle des tests Vitest (`src/**/*.test.ts` seul inclus)
- `ancien-portfolio/src/data/translations/{fr,en}.js` -- lecture seule : source des libellés `ui`, `nav`, `contact`, 404 pour fixer les clés du catalogue
- `docs/TESTING-RULES.md` -- couverture des schémas : tests unitaires sous `src/`

## Tasks & Acceptance

**Execution:**
- [x] `studio/package.json`, `studio/tsconfig.json`, `studio/sanity.config.ts`, `studio/sanity.cli.ts` -- projet Studio indépendant, scripts `dev`, `build`, `typegen`, identifiants lus de l'environnement -- AC 1
- [x] `studio/lib/champLocalise.ts` -- fonction pure de validation `{ fr, en }` et messages, sans import Sanity -- testable depuis la racine
- [x] `studio/schemaTypes/localizedString.ts`, `localizedText.ts` -- types objet réutilisables branchant la validation -- AC 1, 2
- [x] `studio/lib/catalogueUiStrings.ts` -- liste unique des clés d'interface avec groupes -- AD-3
- [x] `studio/schemaTypes/uiStrings.ts`, `siteSettings.ts`, `index.ts` -- singletons, champs générés depuis le catalogue -- AC 1
- [x] `studio/structure.ts` -- bureau du Studio : deux singletons ouvrent directement le document, sans création multiple -- AC 1
- [x] `src/content/types.ts` -- généré par `sanity schema extract` + `sanity typegen generate`, committé -- AC 3
- [x] `src/studio.test.ts` -- tests de la validation (matrice), de la complétude du catalogue et de la présence des types générés -- règle de tests
- [x] `.env.example`, `README.md` ou `docs/exploitation.md` -- documenter les variables et le lancement du Studio

**Acceptance Criteria:**
- Given `studio/` installé et un projet Sanity configuré, when Léandro lance le Studio, then il édite `siteSettings` et `uiStrings` et chaque champ de texte est `{ fr, en }`.
- Given un champ FR ou EN vide, when il publie, then le Studio refuse avec un message clair.
- Given la commande typegen, when elle s'exécute, then `src/content/types.ts` est généré et `npm run typecheck` reste vert.
- Given la CI racine, when `npm test`, `npm run lint` et `npm run typecheck` s'exécutent, then ils sont verts sans réseau.

## Implementation Notes

- Implémenté directement, sans sous-agent. `studio/` créé (config, structure des singletons, schémas, validation pure `lib/champLocalise.ts`, catalogue `lib/catalogueUiStrings.ts`).
- Les scripts `typegen` et `schema:extract` fixent `SANITY_STUDIO_PROJECT_ID` à `horsligne` si absent : l'extraction du schéma ne demande ni réseau ni projet.
- `studio/schema.json` (intermédiaire) est ignoré par git ; `src/content/types.ts` est committé.
- `npm run typecheck` échoue déjà sans mes changements (`@storybook/react-vite` introuvable dans `src/islands/StatusMessage.stories.tsx`) : écart d'environnement, hors périmètre.
- Les 65 tests passent, lint et format verts, `tsc` du Studio vert. Lancement réel du Studio non vérifié (pas de projet Sanity).

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en épopée 1).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| `studio/` hors Dependabot alors que FR-21 exige la surveillance des dépendances | medium | patch | `.github/dependabot.yml` ne couvrait que `/` ; entrée `/studio` ajoutée |
| `npm audit` de `studio/` : 2 high transitifs (js-yaml, smol-toml) | low | defer | DoS à l'analyse locale, hors Site publié ; correctif = rétrograder sanity ; consigné |
| `tsc` du Studio et `npm audit` absents de la CI | medium | defer | décision de seuil liée au workflow 2.6 ; consigné |
| Dérive de `types.ts` non détectée pour `siteSettings` | low | defer | ne vaut que lorsque les schémas se multiplient ; consigné |
| `typecheck` racine rouge (`@storybook/react-vite`) | low | defer | échoue aussi sans mes changements (vérifié par stash) ; environnement, hors périmètre |
| `sanity.config.ts` lève sans `SANITY_STUDIO_PROJECT_ID` | false | rejeté | voulu : message explicite ; typegen fournit une valeur hors ligne |
| Validation `custom` ne s'exécute pas sur objet absent | false | rejeté | Sanity exécute les validations custom même sur `undefined` ; ligne `{ en }` couverte par test |

## Design Notes

Le catalogue unique évite la double écriture : `catalogueUiStrings.ts` exporte `[{ groupe: 'navigation', cles: ['travaux', …] }]`, `uiStrings.ts` en dérive ses `fields`, et le test compare les deux. La validation vit dans un fichier sans dépendance Sanity pour être exécutée par Vitest à la racine.

## Verification

**Commands:**
- `npm test` -- expected: tous les tests passent, dont `src/studio.test.ts`
- `npm run lint && npm run typecheck && npm run format:check` -- expected: aucune erreur
- `cd studio && npm run typegen` -- expected: `src/content/types.ts` généré sans erreur

**Manual checks (if no CLI):**
- Avec un projet Sanity et les variables `SANITY_STUDIO_*`, `cd studio && npm run dev` : les deux singletons s'ouvrent, publier avec EN vide est refusé (à faire par Léandro).
