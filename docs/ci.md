# CI : contrôles et seuils

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque pull request et sur les push `main` et `dev`. Le check agrégé `ci-ok` échoue si un job requis échoue ; il est obligatoire avec `PR Title` et `fix-needs-test` sur `main` et `dev`. Le test `src/ci.test.ts` échoue si un job est ajouté sans figurer dans `needs` de `ci-ok`.

| Job                                                               | Contrôle                                                                                                               |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `format`, `lint`, `typecheck`, `test`, `build`, `build-storybook` | qualité de base                                                                                                        |
| `e2e`                                                             | Playwright : fumée, en-têtes et CSP, indexation, **axe** (`tests/a11y/`, WCAG 2.0 à 2.2 A et AA sur la Page d'accueil) |
| `budget-js`                                                       | JS initial de la Page d'accueil sous 70 Ko brotli (qualité 4) ; l'échec affiche `JS initial : X Ko, budget 70 Ko`      |
| `lighthouse`                                                      | Lighthouse CI sur un build `VERCEL_ENV=production`, 3 passes ; rapport en artefact `lighthouse-report`                 |
| `audit`, `semgrep`, `secrets`                                     | dépendances, SAST, secrets                                                                                             |

## Seuils Lighthouse

| Catégorie                                    | Plancher            |
| -------------------------------------------- | ------------------- |
| Performance, accessibilité, bonnes pratiques | 95                  |
| SEO                                          | **90** (dérogation) |

## Écart consigné : SEO à 90

La page d'essai n'a pas de `meta description` : le texte doit venir de Sanity (AD-3), donc pas de valeur en dur. Mesure du 20 novembre 2026 : SEO 91. Le plancher passe à 95 dès que la vraie Page d'accueil (épopée 3) porte sa description : remettre `0.95` dans `lighthouserc.json`.

Mesure du même jour : performance 100, accessibilité 100, bonnes pratiques 96 (erreur de console : favicon absent).

## En local

```bash
npm run build && npm run test:e2e   # axe, budget JS, CSP, indexation
VERCEL_ENV=production npm run build && npx lhci autorun   # Lighthouse (Chrome requis, ou CHROME_PATH)
```

## Navigateurs (NFR-4)

`browserslist` vise les deux dernières versions de Chrome, Safari, Firefox et Edge. La matrice Playwright (`chromium` pour tous les tests ; `webkit`, `firefox` et `edge` pour le test de fumée seul) teste les builds fournis par la version de Playwright en place, donc les versions courantes des moteurs, pas l'avant-dernière : cet écart est accepté, un service de navigateurs tiers étant payant (AD-16).

En local, `npm run test:e2e` reste sur Chromium ; `npm run test:navigateurs` lance les trois autres (`npx playwright install webkit firefox`). Edge exige une installation avec droits administrateur sur macOS : sa jambe se constate en CI.
