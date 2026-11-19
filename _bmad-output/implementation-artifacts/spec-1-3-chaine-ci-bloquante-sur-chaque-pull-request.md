---
title: 'Story 1.3 : Chaîne CI bloquante sur chaque pull request'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '817943624fde95d4fa09626a180eb5346a8b2f37'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/TESTING-RULES.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** la CI actuelle ne lance ni axe, ni Lighthouse, ni une mesure du budget JS qui nomme son poids dans l'échec ; `ci-ok` n'est pas protégé contre un job ajouté sans être exigé (NFR-3).

**Approach:** ajouter à `.github/workflows/ci.yml` un job axe (page d'accueil), un job Lighthouse CI et un job « Budget JS » dont l'échec affiche le poids mesuré, puis les exiger tous dans `ci-ok`.

## Boundaries & Constraints

**Always:** `ci-ok` reste le seul check agrégé ; chaque job de `ci.yml` figure dans son `needs`. Lighthouse tourne sur un build `VERCEL_ENV=production` (page indexable). Seuils Lighthouse : 95 en performance, accessibilité et bonnes pratiques ; **SEO 90** tant que la Page d'accueil n'a pas sa meta description (Sanity), écart consigné dans `docs/ci.md` et `deferred-work.md`. axe vérifie WCAG 2.0 à 2.2 A et AA. Actions GitHub épinglées par SHA comme les existantes. Gratuit ou open source.

**Never:** aucun envoi de rapport vers un service externe (pas de `temporary-public-storage`). Ne pas modifier les protections de branche (déjà : `ci-ok`, `PR Title`, `fix-needs-test` sur `main` et `dev`). Ne pas hardcoder de meta description. Ne pas toucher à `fix-needs-test.yml`.

## I/O & Edge-Case Matrix

| Scénario | État | Comportement |
|----------|------|--------------|
| JS dans le budget | total brotli q4 < 70 Ko | job « Budget JS » vert, poids affiché |
| JS au-delà | total ≥ 70 Ko | job rouge, message `JS initial : X Ko, budget 70 Ko` ; `ci-ok` échoue |
| Violation axe | règle WCAG violée sur `/` | test rouge listant règle, impact et nœuds |
| Score Lighthouse sous le seuil | catégorie < seuil | job rouge, catégorie et score dans le journal |
| Job oublié | job de `ci.yml` absent de `needs` de `ci-ok` | test Vitest rouge nommant le job |

</frozen-after-approval>

## Code Map

- `.github/workflows/ci.yml` -- jobs existants (format, lint, typecheck, test, build, e2e, audit, storybook, semgrep, secrets) et `ci-ok` ; y ajouter `budget-js`, `lighthouse` et garder `e2e` pour axe.
- `tests/e2e/budget-js.spec.ts` -- mesure brotli q4 et garde Preact ; le message d'échec doit citer le poids en Ko.
- `tests/support/serve.mjs` -- serveur de test (port `PORT`, 4321) réutilisé par Playwright et Lighthouse.
- `playwright.config.ts` -- `testMatch` limité à `e2e` et `headers` ; ajouter `a11y`.
- `package.json` -- ajouter `@axe-core/playwright` et `@lhci/cli` en `devDependencies` exactes ; surveiller `npm audit --audit-level=high`.
- `docs/TESTING-RULES.md` -- pyramide : axe dans `tests/a11y/`, Lighthouse plancher 95.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- `@axe-core/playwright` et `@lhci/cli` en versions exactes -- outils nommés par TESTING-RULES
- [x] `tests/a11y/accueil.spec.ts` -- axe sur `/` (WCAG 2.0 à 2.2 A et AA), échec avec règle, impact et nœuds -- AC 1
- [x] `playwright.config.ts` -- ajouter `a11y/**/*.spec.ts` à `testMatch`
- [x] `tests/e2e/budget-js.spec.ts` -- étiquette `@budget` et message d'échec `JS initial : X Ko, budget 70 Ko` -- AC 3
- [x] `lighthouserc.json` -- serveur `node tests/support/serve.mjs`, seuils 95/95/95 et SEO 90, rapports en fichiers -- AC 1
- [x] `.github/workflows/ci.yml` -- jobs `budget-js` (`--grep @budget`) et `lighthouse` (build production, Chrome, artefact du rapport) ; `e2e` en `--grep-invert @budget` ; les deux dans `needs` de `ci-ok` -- AC 1 et 2
- [x] `src/ci.test.ts` -- chaque job de `ci.yml` (sauf `ci-ok`) est dans `needs` de `ci-ok` -- ligne « job oublié »
- [x] `docs/ci.md` et `docs/TESTING-RULES.md` -- jobs, seuils, écart SEO et sa sortie ; `deferred-work.md` -- écart SEO

**Acceptance Criteria:**
- Given une PR vers `dev` ou `main`, when la CI s'exécute, then axe, Lighthouse et le budget JS tournent en plus des contrôles existants, et `ci-ok` échoue si l'un échoue.
- Given `ci-ok`, `PR Title` et `fix-needs-test` requis sur `main` et `dev`, when une PR échoue, then GitHub bloque la fusion ; une PR `fix:` sans test modifié échoue.
- Given le JS initial au-delà de 70 Ko, when la CI s'exécute, then la PR échoue avec le poids mesuré dans le message.

## Implementation Notes

- Tout fait en local : 20 tests Vitest, 8 tests Playwright (axe, budget, CSP, indexation), `lhci autorun` vert avec les seuils 95/95/95/90. Contrôles négatifs faits : budget à 5 Ko échoue avec `JS initial : 8.4 Ko, budget 5 Ko` ; SEO à 0.95 échoue ; retirer `lighthouse` de `needs` fait échouer `src/ci.test.ts`.
- `npm audit --audit-level=high` : aucune faille haute après ajout de `@axe-core/playwright` 4.14.0 et `@lhci/cli` 0.16.1 (4 modérées préexistantes).
- `serve.mjs` affiche `ready on port` pour que Lighthouse CI détecte le serveur.
- La CI GitHub (Chrome du runner pour Lighthouse) n'a pas encore tourné : à constater sur la PR.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent.

| Constat | Verdict | Preuve / route |
|---------|---------|----------------|
| Le test axe attendait `data-hydrate` du `Compteur`, page provisoire | low | corrigé : attente `networkidle` |
| Ligne « JS au-delà » de la matrice sans test automatisé | low | rejeté : un test qui échoue ferait échouer la CI ; vérifié à la main avec un budget à 5 Ko |
| Lighthouse sur le Chrome du runner GitHub non vérifié | maybe-false (medium) | à constater sur la PR ; en cas d'échec, régler `chromeFlags` |

## Design Notes

Le budget JS tourne déjà dans le job `e2e` ; l'étiquette `@budget` sépare l'exécution pour donner au poids son propre job lisible sans la doubler. Mesure obtenue sur la page d'essai : performance 100, accessibilité 100, bonnes pratiques 96, SEO 91 (`meta-description` manquante, `errors-in-console` pour le favicon).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test` -- expected: tout passe, dont `src/ci.test.ts`
- `npx playwright test` -- expected: a11y, budget, CSP, environnement passent
- `npx lhci autorun` -- expected: seuils respectés sur le build production
- `npm audit --audit-level=high` -- expected: aucune faille haute
- budget abaissé temporairement à 5 Ko -- expected: échec avec `JS initial : … Ko`

**Manual checks (if no CLI):**
- Sur la PR : jobs `Budget JS` et `Lighthouse` visibles et exigés par `ci-ok`.
