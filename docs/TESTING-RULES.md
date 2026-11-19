# Règles de test — portfolio (refonte)

> Adapté de `docs/TESTING-RULES.md` du projet GUTTER. Mêmes principes
> (pyramide, régression obligatoire, ratchet de couverture, CI qui bloque),
> appliqués à un site statique Astro. Les outils sont gratuits ou open source
> (AD-16).

## Pyramide

| Niveau              | Outil                                     | Emplacement                                              | Rôle                                                                                                                                               |
| ------------------- | ----------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitaire            | Vitest (+ Testing Library pour les îlots) | `src/**/*.test.{ts,tsx}`                                 | logique pure, `localizedPath`, `prefs.ts`, `overlay.ts`, encodage des coordonnées, validation du formulaire                                        |
| Contrat de service  | Vitest + MSW                              | `src/content/**/*.test.ts`, `src/pages/api/**/*.test.ts` | `src/content/` (build échoue si FR/EN vide ou `alt` manquant), routes `altcha` et `contact` (codes d'erreur stables)                               |
| Composants et pages | Vitest + Astro container                  | `src/**/*.test.ts`                                       | rendu HTML : tout le texte présent sans JS (FR-4), `lang`/`hreflang`, canonical                                                                    |
| E2E navigateur      | Playwright                                | `tests/e2e/`                                             | parcours UJ-1 à UJ-4, Fenêtre de projet (History, focus, Échap), changement de Thème et de Langue, formulaire                                      |
| Accessibilité       | axe via Playwright                        | `tests/a11y/`                                            | l'échantillon d'audit de FR-22 (3 Thèmes, FR et EN, 3 Gabarits, menu mobile, Mode fête, carte à gratter)                                           |
| Visuel              | Playwright (captures)                     | `tests/visual/`, références dans `tests/reference/`      | fidélité à l'ancien site : 3 Thèmes × 375/768/1440 px, animations figées, moins de 0,1 % de pixels différents                                      |
| En-têtes et CSP     | Playwright + requêtes HTTP                | `tests/headers/`                                         | en-têtes requis présents, pages exécutées sans violation de la CSP réelle                                                                          |
| Performance         | Lighthouse CI + budget JS                 | CI                                                       | plancher 95 par catégorie, JS initial sous 70 Ko compressés                                                                                        |
| Gardes du PRD       | scripts de test                           | `tests/guards/`                                          | texte rendu avant/après migration (FR-2), `curl` sans JS (FR-4), CV en 200 (FR-17), liens LinkedIn (FR-18), absence de coordonnées en clair (AD-9) |

## Storybook

`npm run storybook` (port 6006) documente les composants et îlots avec le sélecteur de Thème (pop, terminal, wireframe) et l'addon a11y en mode `error`. Chaque îlot a une story par état ; `npm run build-storybook` fait partie de la CI.

## Couverture (stratégie ratchet)

- Pas de seuil global au départ : on élargit `include` au fil de l'écriture des tests.
- **Le seuil d'un dossier ne redescend jamais** une fois posé.
- Rapports `text` + `html` en local ; la couverture reste informative tant qu'elle n'est pas stabilisée.

## Écrire un test

- `describe` / `it` **en français**, cohérent avec le reste du dépôt.
- Mocker l'externe de deux façons : `vi.mock` + `vi.hoisted` pour isoler un import direct ; **MSW** dès qu'un vrai `fetch()` est en jeu (Sanity, Resend, ALTCHA). MSW survit aux refactors.
- **Aucun accès réseau réel** dans les tests : ni Sanity, ni Resend, ni Vercel.
- Sélecteurs Playwright par **rôle ou label**, jamais par classe CSS.
- Les animations et éléments aléatoires (carte à gratter, curseur, confettis) sont figés pour les captures.

## Tests de régression

> **Chaque bug corrigé produit un test qui échoue avant le correctif et passe après.**

1. Écrire l'assertion qui reproduit le bug ; vérifier qu'elle **échoue** sur le code actuel.
2. Corriger ; le test passe.
3. Commit `fix:` qui inclut le test. Un workflow CI `fix-needs-test` fait échouer toute PR `fix:` sans fichier `*.test.*`.

## Ce que la CI exécute (ordre, voir AD-14)

```
format → lint → typecheck (astro check) → Semgrep → gitleaks →
tests unitaires et contrat → build → build Storybook → budget JS (< 70 Ko) → vérification des en-têtes et de la CSP →
tests e2e → axe (échantillon FR-22) → comparaison visuelle →
Lighthouse CI → gardes du PRD → npm audit → recherche de secrets
```

Un échec sur une étape bloque la fusion dans `main` (check obligatoire unique `ci-ok`, à ajouter aux « status checks » de la protection de branche une fois le workflow en place).

## Hooks locaux

- `pre-commit` : `lint-staged` (format + lint des fichiers modifiés).
- `pre-push` : `typecheck` + tests unitaires.
- `.editorconfig` et `.prettierrc.json` à la racine : UTF-8, LF, indentation 2 espaces, sans point-virgule, guillemets simples, 100 colonnes.

## Hors périmètre

Pas de test de charge : le site est statique et sert un CDN, il n'y a pas de trafic à absorber. Seules les deux routes serveur sont couvertes par des tests de contrat.
