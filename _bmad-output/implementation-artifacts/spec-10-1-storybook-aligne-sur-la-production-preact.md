---
title: 'Storybook aligné sur la production (Preact)'
type: 'chore'
created: '2026-11-20'
status: 'in-review'
baseline_commit: 'dc390b914d954a3d128bdd263bc42f5a28fd7f5a'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-10-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** la production alias `react` vers `preact/compat` (`astro.config.mjs`), mais Storybook, Vitest et `tsconfig.json` restent sur React : une story verte ne garantit pas un îlot qui marche sur le Site (dette de la story 1.1).

**Approach:** extraire l'alias dans une source unique lue par Astro, Vitest et Storybook ; passer Storybook sur `@storybook/preact-vite` et `tsconfig.json` sur `jsxImportSource: preact` ; ajouter les tests qui échouent si l'alias disparaît ; consigner la compatibilité Preact des bibliothèques React-only dans `docs/storybook.md`.

## Boundaries & Constraints

**Always:** TypeScript strict, pas de `any` ; les îlots continuent d'importer depuis `react` (l'alias fait le travail, AD-7) ; dépendances gratuites et open source (AD-16) ; `npm run build-storybook`, `npm test`, `npm run lint`, `npm run typecheck` verts.

**Never:** modifier `ancien-portfolio/` ; ajouter une dépendance payante ; anticiper les stories 10.2 et suivantes (barre d'outils, fixtures, `.astro`) ; changer le comportement des îlots.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Alias présent | `react` importé dans un test | résolu vers `preact/compat` | N/A |
| Alias retiré | source unique vidée | le test d'alias échoue | N/A |
| tsconfig divergent | `paths` différent de la source | le test de cohérence échoue | N/A |

</frozen-after-approval>

## Code Map

- `astro.config.mjs` -- alias inline `react`/`react-dom` à remplacer par l'import de la source unique
- `vitest.config.ts` -- `getViteConfig` ; doit recevoir l'alias de la même source
- `tsconfig.json` -- `jsxImportSource: react` à passer à `preact` ; `paths` pour typer `react` via `preact/compat`
- `.storybook/main.ts`, `.storybook/preview.ts` -- framework `@storybook/react-vite` et types à migrer vers `@storybook/preact-vite` ; `viteFinal` applique l'alias
- `src/islands/Compteur.tsx`, `StatusMessage.tsx`, `StatusMessage.stories.tsx` -- îlots et story existants ; seul l'import de types de la story change
- `package.json` -- ajouter `@storybook/preact-vite` (10.6.x), retirer `@storybook/react-vite` et `@vitejs/plugin-react` si inutilisés
- `docs/storybook.md` -- à créer : alias, compatibilité ALTCHA et bibliothèque d'animation

## Tasks & Acceptance

**Execution:**
- [x] `config/preact-alias.mjs` -- créer la source unique de l'alias -- une seule définition partagée
- [x] `astro.config.mjs`, `vitest.config.ts` -- consommer la source unique
- [x] `.storybook/main.ts`, `.storybook/preview.ts`, `StatusMessage.stories.tsx` -- migrer vers `@storybook/preact-vite` avec l'alias
- [x] `tsconfig.json`, `package.json` -- `jsxImportSource: preact`, `paths`, dépendances
- [x] `src/islands/preact.test.tsx` -- tests : `react` === `preact/compat`, `Compteur` et `StatusMessage` rendus par Preact, `tsconfig` et Storybook alignés sur la source -- échouent si l'alias est retiré
- [x] `docs/storybook.md` -- consigner la compatibilité Preact d'ALTCHA et des animations avant tout usage

**Acceptance Criteria:**
- Given l'alias défini une seule fois, when Storybook, Vitest, Astro et `tsconfig.json` sont configurés, then tous le lisent depuis cette source.
- Given `Compteur` et `StatusMessage`, when ils sont ouverts dans Storybook ou testés, then ils sont rendus par Preact et un test échoue si l'alias est retiré.
- Given une bibliothèque React-only prévue, when elle est évaluée, then sa compatibilité est consignée dans `docs/storybook.md`.

## Implementation Notes

- Source unique `config/preact-alias.mjs` ; `tsconfig.json` ne peut pas l'importer, ses `paths` sont recopiés et gardés par `src/islands/preact.test.tsx`.
- `@storybook/preact-vite` 10.6.8 installé ; `@storybook/react-vite` et `@vitejs/plugin-react` retirés (inutilisés).
- Écart à surveiller : `@storybook/preact` déclare `preact` `^8 || ^10` alors que la production est en 11.2.0 ; le build Storybook et les tests passent.
- Vérifié : alias vidé, 3 tests échouent ; sinon `npm test`, `build-storybook`, `typecheck`, `lint`, `prettier --check` verts.

## Spec Change Log

## Review Triage Log

Revue indépendante par sous-agents non lancée (refus de sous-agents). Auto-revue du diff par l'agent d'implémentation :

| Constat | Verdict | Preuve |
| ------- | ------- | ------ |
| `@storybook/preact` déclare `preact` `^8 \|\| ^10`, production en 11.2.0 | maybe-false | `build-storybook` et `npm ci --dry-run` passent ; à confirmer en ouvrant les stories dans le navigateur |
| `tsconfig.json` recopie l'alias | low | gardé par `preact.test.tsx`, ne peut pas importer un `.mjs` |

## Verification

**Commands:**
- `npm run build-storybook` -- expected: build réussi
- `npm test` -- expected: tous les tests verts, dont `preact.test.tsx`
- `npm run lint && npm run typecheck` -- expected: 0 erreur
