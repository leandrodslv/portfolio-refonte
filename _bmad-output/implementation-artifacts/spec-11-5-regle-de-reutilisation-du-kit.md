---
title: 'Story 11.5 : Règle de réutilisation du kit'
type: 'chore'
created: '2026-11-23'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
  - '{project-root}/design-system/components.md'
  - '{project-root}/docs/storybook.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** rien n'impose aux stories des épopées 3, 5 et 7 de réutiliser les primitives du kit : un composant d'interface en double pourrait apparaître, et les critères des stories 3.1 à 3.4, 4.2, 4.4, 5.1 et 7.2 ignorent le kit.

**Approach:** écrire la règle de composition dans `docs/storybook.md` et `CLAUDE.md`, vérifier que `design-system/README.md` renvoie vers `design-system/components.md`, puis compléter les critères des stories concernées dans `epics.md` sans changer leurs autres critères.

</frozen-after-approval>

## Implementation Notes

- `docs/storybook.md` : section « Règle de composition » : une story des épopées 3, 5 et 7 réutilise une primitive du kit ou, à défaut, l'ajoute au kit (entrée dans `components.md`, `X.variants.ts`, `X.stories.tsx`) ; jamais de composant d'interface en double.
- `CLAUDE.md` : une règle de code équivalente, en une ligne, renvoyant vers `docs/storybook.md`.
- `design-system/README.md` renvoie déjà vers `components.md` : ne pas le modifier.
- `epics.md` : 4.4 (parité couvre aussi variantes et états des composants de `components.md`) ; 4.2 (sans choix mémorisé, Thème et contrastes suivent `prefers-color-scheme`, `prefers-contrast`, `forced-colors`) ; mention « utilise les primitives du kit (épopée 11) » dans 3.1 à 3.4, 5.1 et 7.2.
- Ne pas toucher aux primitives, aux tokens, à `ancien-portfolio/` ; aucun commit sans demande.
