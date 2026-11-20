---
title: 'Story 2.4 : Couche de contenu en lecture seule'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '65ec92f04595b8adbf7da087937c406e4b234917'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-modele-des-autres-sections.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le Site ne lit pas Sanity : aucune page ne peut afficher le Contenu du Studio, et rien n'empêche un texte FR ou EN vide d'arriver en ligne (FR-1, AD-2, AD-3, AD-12).

**Approach:** Créer `src/content/`, seule couche qui importe `@sanity/client` (lecture seule, documents publiés), qui résout chaque champ localisé pour la locale demandée, fait échouer le build sur un texte vide ou un `alt` manquant, et prépare les images pour Astro. Brancher une page d'essai qui liste les Projets.

## Boundaries & Constraints

**Always:**
- Client en lecture seule : perspective `published`, sans CDN, version d'API fixée ; variables `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`. Le jeton n'entre jamais dans le HTML ni dans un message d'erreur.
- Un view-model ne contient que des chaînes simples pour la locale demandée, jamais `{ fr, en }`, jamais d'`_id` Sanity.
- Échec du build, avec le type du document, son `slug` (ou son titre FR à défaut) et le chemin du champ : valeur FR ou EN vide d'un champ obligatoire ; image informative sans `alt` FR ou EN. Une image `decorative` donne `alt=""`, même si un `alt` est resté en donnée.
- Les champs facultatifs (`LocalizedStringOptionnel`, `LocalizedTextOptionnel`) vides donnent `undefined`, jamais une chaîne vide.
- Images : le build télécharge les assets Sanity, Astro les optimise ; le HTML ne contient aucune URL du CDN Sanity.
- `no-restricted-imports` (déjà en place) reste la garde ; un test le prouve.
- **Décision (branchement) :** le palier `sanity` s'active dans `PALIERS_ACTIFS` dès cette story ; la CI et Vercel Preview lisent le vrai dataset `dev`. Léandro crée un jeton de lecture du dataset `dev` et le saisit (GitHub : secret `SANITY_READ_TOKEN`, variables `SANITY_PROJECT_ID` et `SANITY_DATASET` ; Vercel Preview) avant de fusionner. `docs/exploitation.md`, `.env.example` et le workflow CI suivent.
- La logique (résolution, validation) vit dans des fichiers purs sans import Sanity, testés par Vitest avec un faux client.

**Never:**
- Pas de view-model des singletons (Hero, Sections, `uiStrings`, pied de page) : chaque story d'épopée 3 qui les affiche les ajoute.
- Pas de migration (2.5), pas de webhook, de jeton de production ni de promotion (2.6), pas de page `/projets/[slug]` finale ni de composant du kit.
- Aucun document créé ou modifié dans un dataset par l'agent, aucun secret committé, aucun `any`, aucun texte visible en dur dans le Site hors page d'essai.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Projet complet | titre `{ fr, en }`, locale `en` | titre EN en chaîne simple | N/A |
| EN vide | description `{ fr: 'a', en: '' }` | build échoue | message : type, slug, `description`, langue EN |
| Optionnel vide | `titreCarte` absent ou `{ fr: '', en: '' }` | `undefined` | N/A |
| Optionnel à moitié rempli | `titreCarte` `{ fr: 'a' }` | build échoue | message : type, slug, `titreCarte`, langue EN |
| Image sans alt | informative, `alt` absent ou EN manquant | build échoue | message : type, slug, `couverture.alt` |
| Image décorative | `decorative: true`, `alt` résiduel | `alt: ''` | N/A |
| Brouillon | `drafts.<id>` seul | ignoré | N/A |
| Dataset vide | aucun Projet publié | page d'essai sans élément, build vert | N/A |
| Variable absente | `SANITY_READ_TOKEN` vide | build échoue avant toute requête | nomme la variable |
| HTML produit | Projet avec couverture | `<img>` pointe vers `_astro/`, aucun `cdn.sanity.io` | N/A |

</frozen-after-approval>

## Code Map

- `src/content/types.ts` -- types générés (2.1 à 2.3) ; `Project`, `ImageInformative`, `LocalizedString`, etc. À importer, ne pas modifier
- `src/lib/variables.ts` -- `PALIERS_ACTIFS` (`[]` aujourd'hui), registre déjà décrit ; y activer `sanity`
- `src/lib/variables.test.ts` -- le test « aucun palier actif » devra suivre l'activation
- `src/integrations/verifier-variables.ts` -- échec au démarrage du build, déjà branché
- `src/lib/localizedPath.ts` -- seule source des adresses ; la page d'essai l'utilise si elle lie
- `src/pages/index.astro`, `src/pages/robots.txt.ts` -- pages existantes ; la page d'essai est une nouvelle route temporaire
- `eslint.config.js` -- `no-restricted-imports` hors `src/content/**` déjà en place
- `astro.config.mjs` -- `image.remotePatterns` pour `cdn.sanity.io` (téléchargement au build)
- `vercel.json` -- CSP `img-src 'self' data:` : les images doivent rester locales
- `.github/workflows/ci.yml`, `docs/exploitation.md`, `.env.example` -- variables du build
- `studio/schemaTypes/project.ts` -- forme des champs et noms, à lire
- `src/studio-projet.test.ts` -- modèle de test ; ne jamais utiliser `new RegExp` avec une variable (Semgrep)
- `package.json` -- ajouter `@sanity/client` 8.17.0 (décision de l'architecture, gratuit)

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- `@sanity/client` 8.17.0 -- AC 1
- [x] `src/content/localiser.ts` -- résolution `{ fr, en }` vers chaîne, optionnels, `alt`, erreur nommant document et champ -- AC 1, 2
- [x] `src/content/client.ts` -- client lecture seule publié, variables vérifiées -- AC 1
- [x] `src/content/images.ts` -- asset vers source Astro optimisable, jamais d'URL CDN dans le view-model rendu -- AC 4
- [x] `src/content/projets.ts` -- requête GROQ des Projets publiés triés par `ordre`, view-model par locale -- AC 1, 5
- [x] `src/pages/essai-contenu.astro` (+ `en/`) -- liste titre et description de chaque Projet, `noindex`, temporaire -- AC 5
- [x] `astro.config.mjs`, `src/lib/variables.ts`, `.github/workflows/ci.yml`, `docs/exploitation.md` -- activation et documentation (selon décision 1)
- [x] `src/content/*.test.ts`, test e2e du HTML -- matrice, garde ESLint, absence de `cdn.sanity.io` -- règle de tests

**Acceptance Criteria:**
- Given les trois variables et un jeton en lecture seule, when le build s'exécute, then seuls les documents publiés sont lus et `src/content/` expose des chaînes simples pour la locale.
- Given une valeur FR ou EN vide ou un `alt` d'image informative manquant, when le build s'exécute, then il échoue avec le document et le champ.
- Given un import du client Sanity hors `src/content/`, when le lint s'exécute, then `no-restricted-imports` échoue.
- Given des images Sanity, when le build s'exécute, then elles sont téléchargées et optimisées et aucune URL du CDN n'apparaît dans le HTML.
- Given la page d'essai, when je la construis, then elle affiche titre et description de chaque Projet lus depuis Sanity.

## Implementation Notes

- Implémenté directement, sans sous-agent. Nouveaux : `src/content/{localiser,client,images,projets}.ts` (+ tests), `src/components/EssaiContenu.astro`, pages `essai-contenu` FR et EN, `tests/e2e/contenu.spec.ts`, `src/content/garde-imports.test.ts` (API ESLint).
- `@sanity/client` 8.17.0 installé en version exacte. Palier `sanity` actif ; CI : variables passées aux seules étapes qui construisent (build, e2e, navigateurs, budget, Lighthouse), pas à `npm ci`.
- Page d'essai exclue du sitemap (`filter`), `noindex`. `image.remotePatterns` autorise `cdn.sanity.io` : Astro télécharge et sert les images depuis `_astro/`.
- Build local avec jeton invalide : la requête part, échoue en 401 sans afficher le jeton. Build de bout en bout non exécuté : aucun jeton de lecture n'existe encore (à créer par Léandro).
- Le matrice a été précisée sur décision de Léandro : un facultatif à moitié rempli fait échouer le build.
- 152 tests, lint, format et typecheck verts.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en 2.1 à 2.3).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| `client.ts` réécrivait le message des variables manquantes au lieu de réutiliser `verifierVariables` | low | patch | remplacé par `verifierVariables(env, ['sanity'])`, test inchangé |
| Le build de bout en bout (requête réelle, téléchargement d'images) n'est pas exécuté : aucun jeton de lecture n'existe | medium | defer | à vérifier dès que Léandro saisit le jeton (CI de la PR) ; consigné |
| Vercel Preview et la CI échouent tant que les trois variables ne sont pas saisies | medium | defer | décision 1 (option A) ; saisie à faire par Léandro avant la fusion ; consigné |
| PR de Dependabot sans accès au secret GitHub : build en échec | low | defer | secret Dependabot à déclarer si une PR de dépendance échoue ; documenté dans `docs/exploitation.md` |
| Facultatif à moitié rempli (matrice initiale) | medium | intent_gap | résolu par Léandro : le build échoue ; matrice corrigée avant implémentation |
| Brouillons lus par le build | false | rejeté | `perspective: 'published'` testé dans `client.test.ts` ; le client exclut les brouillons |
| Jeton affiché dans une erreur | false | rejeté | essai avec jeton invalide : l'erreur ne contient que « Unauthorized » |

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck && npm run format:check` -- expected: verts
- `npm run build` avec les variables du dataset `dev` -- expected: build vert, page d'essai générée (selon décision 1)
