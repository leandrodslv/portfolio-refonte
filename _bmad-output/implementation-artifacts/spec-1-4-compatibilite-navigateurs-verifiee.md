---
title: 'Story 1.4 : Compatibilité navigateurs vérifiée'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '1ddac9c39de59f5a5ff768045a1df15564e7b604'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/ci.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** seul Chromium est testé alors que le Site doit fonctionner sur Chrome, Safari, Firefox et Edge (NFR-4) ; aucun `browserslist` ne l'exprime.

**Approach:** déclarer `browserslist` sur les deux dernières versions des quatre navigateurs et faire passer le test de fumée de la Page d'accueil sur WebKit, Firefox et Edge en CI, dans un job exigé par `ci-ok`.

## Boundaries & Constraints

**Always:** les autres tests (budget JS, CSP, axe, indexation) restent sur Chromium seul ; la matrice ne rejoue que le test de fumée. Les versions testées sont celles que fournit la version de Playwright en place. Actions GitHub épinglées par SHA. Gratuit ou open source.

**Never:** aucun service de navigateurs payant (BrowserStack, etc.). Ne pas réécrire le test de fumée pour le contourner sur un navigateur : une divergence se corrige dans le code ou se consigne. Ne pas modifier les protections de branche.

## I/O & Edge-Case Matrix

| Scénario | État | Comportement |
|----------|------|--------------|
| Navigateurs conformes | fumée verte sur WebKit, Firefox et Edge | job `navigateurs` vert |
| Régression propre à un navigateur | fumée rouge sur un seul | sa jambe de matrice rouge, `ci-ok` échoue |
| Navigateur absent en local | Edge non installé | `npm run test:e2e` reste sur Chromium ; la matrice se lance par `--project` |

</frozen-after-approval>

## Code Map

- `playwright.config.ts` -- un seul projet `chromium` ; y ajouter `webkit`, `firefox` et `edge` (canal `msedge`) limités à `e2e/smoke.spec.ts`.
- `tests/e2e/smoke.spec.ts` -- test de fumée de la Page d'accueil (contenu, styles des tokens, texte sans JS) ; ne pas le modifier.
- `package.json` -- champ `browserslist` à ajouter ; les scripts `test:e2e` sont inchangés.
- `.github/workflows/ci.yml` -- job e2e actuel sur Chromium ; ajouter le job `navigateurs` en matrice et l'exiger dans `ci-ok` (`src/ci.test.ts` le contrôle).
- `docs/ci.md` -- tableau des jobs ; ajouter la matrice et sa limite.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- `browserslist` : deux dernières versions de Chrome, Safari, Firefox et Edge -- NFR-4
- [x] `playwright.config.ts` -- projets `webkit`, `firefox`, `edge` (`channel: 'msedge'`) avec `testMatch` sur la fumée seule ; `chromium` garde tout -- AC 1
- [x] `.github/workflows/ci.yml` -- job `navigateurs` en matrice (webkit, firefox, msedge), installation du navigateur, `playwright test --project=<projet>` ; dans `needs` de `ci-ok` -- AC 2
- [x] `docs/ci.md` -- matrice, versions testées (celles de Playwright) et écart avec « deux dernières versions »

**Acceptance Criteria:**
- Given `browserslist` aligné sur les deux dernières versions de Chrome, Safari, Firefox et Edge, when la CI lance la matrice Playwright (Chromium, WebKit, Firefox, Edge), then le test de fumée de la Page d'accueil passe sur chaque navigateur.
- Given une régression propre à un navigateur, when la CI s'exécute, then la jambe correspondante échoue et `ci-ok` aussi.

## Implementation Notes

- `npx browserslist` liste chrome 157/156, edge 156/155, firefox 160/159, safari 27.2/27.1.
- Fumée verte en local sur WebKit et Firefox (6 tests) ; Chromium : 8 tests ; Vitest 20, lint et typecheck verts. Edge non testé en local (installation avec droits administrateur) : sa jambe se constate sur la PR.
- `test:e2e` passe à `--project=chromium` (sinon le job e2e, qui n'installe que Chromium, lancerait aussi les trois autres projets) ; `test:navigateurs` lance les trois autres.
- Le job `navigateurs` est dans `needs` de `ci-ok` ; `src/ci.test.ts` le contrôle.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent.

| Constat | Verdict | Preuve / route |
|---------|---------|----------------|
| `npm run test:e2e` sans `--project` lancerait webkit, firefox et edge dans le job e2e qui n'installe que Chromium | high | corrigé : `--project=chromium` |
| Jambe Edge non vérifiée en local | maybe-false (medium) | à constater sur la PR ; en cas d'échec, vérifier `playwright install msedge` sur le runner |
| Versions testées = celles de Playwright, pas l'avant-dernière | low | rejeté : limite documentée dans `docs/ci.md` et la spec |

## Design Notes

Playwright n'installe que ses propres builds : ce sont les versions courantes des quatre moteurs, pas les deux dernières. L'avant-dernière version n'est pas testée sans service tiers ; l'écart est consigné dans `docs/ci.md`. Chromium sert aussi pour les autres tests, Edge est testé comme navigateur distinct (canal `msedge`).

## Verification

**Commands:**
- `npx playwright install webkit firefox` puis `npx playwright test --project=webkit --project=firefox` -- expected: fumée verte
- `npm run lint && npm run typecheck && npm test` -- expected: tout passe, dont `src/ci.test.ts`
- `npx browserslist` -- expected: les quatre navigateurs listés

**Manual checks (if no CLI):**
- Edge ne s'installe pas sans droits administrateur sur macOS : la jambe `edge` se constate sur la PR.
