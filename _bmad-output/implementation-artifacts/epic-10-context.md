# Epic 10 Context: Storybook, catalogue vivant des composants et des Thèmes

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Léandro et les futures sessions de développement consultent un catalogue unique et fiable : chaque token, composant et îlot y est montré dans chacun de ses états, sous chaque Thème et chaque Langue, avec l'accessibilité vérifiée. Storybook est déjà installé (`.storybook/`, addon a11y en mode `error`, sélecteur de Thème, `build-storybook` en CI, une story `StatusMessage`) ; l'épopée le rend conforme à la production et le généralise.

## Stories

- Story 10.1: Storybook aligné sur la production (Preact)
- Story 10.2: Thèmes, Langues et accessibilité dans la barre d'outils
- Story 10.3: Rendu des composants `.astro` dans Storybook (décision)
- Story 10.4: Page Fondations générée depuis les tokens
- Story 10.5: Une story par état pour chaque composant et îlot
- Story 10.6: Storybook dans la CI et consultable en ligne
- Story 10.7: Documentation et règle de livraison

## Requirements & Constraints

- Une story verte doit garantir un îlot qui fonctionne sur le Site : le catalogue rend les îlots avec la même bibliothèque que la production.
- Aucune valeur de design en dur dans `.storybook/` ; les textes viennent de fixtures typées, jamais de chaînes écrites dans les stories.
- L'addon a11y reste en mode `error` ; une violation fait échouer le test de la story.
- Gratuit ou open source uniquement ; tout service payant exige une décision d'architecture.
- Les stories 10.1 à 10.3 se livrent avant l'épopée 11 (UI kit) ; 10.4 à 10.7 après.

## Technical Decisions

- La production alias `react` et `react-dom` vers `preact/compat` (repli de AD-7 pour tenir le budget JS de 70 Ko brotli) ; Storybook, Vitest et `tsconfig.json` doivent partager cet alias depuis une source unique.
- Les bibliothèques React-only prévues (ALTCHA, animation) voient leur compatibilité Preact consignée dans `docs/storybook.md` avant premier usage.
- Les composants `.astro` ne sont pas rendus par le framework Storybook React/Preact : la décision (10.3) est consignée dans le spine.

## Cross-Story Dependencies

- 10.2 fournit les fixtures typées dont 10.5 dépend ; 10.3 conditionne les stories des composants `.astro` de 10.5.
- 10.6 rend les tests a11y de chaque story requis par `ci-ok`.
