# Epic 3 Context: Le Visiteur lit la Page d'accueil, en FR et en EN, sur tous ses appareils

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

La Page d'accueil complète est rendue en HTML statique depuis le contenu Sanity, dans le Thème Pop (référence visuelle), en FR et en EN, accessible au clavier. Elle couvre le gabarit et la navigation, le Hero, les Sections, la page 404 et les anciennes ancres. Le Visiteur lit tout sans JavaScript.

## Stories

- Story 3.1: Gabarit de page, navigation et menu mobile
- Story 3.2: Hero et Section Projets (cartes)
- Story 3.3: Sections Parcours, Compétences, Services et À propos
- Story 3.4: Section Contact (structure) et pied de page
- Story 3.5: Français et anglais
- Story 3.6: Page 404 et anciennes ancres
- Story 3.7: Fidélité visuelle du Thème Pop

## Requirements & Constraints

- Le contenu des Sections est lisible dans le HTML sans JavaScript, avec une hiérarchie de titres correcte (un seul h1, Sections en h2).
- Aucun texte en dur : tout texte visible vient de Sanity en FR et EN, via `src/content/` uniquement.
- Aucune valeur de design en dur hors `src/styles/` ; tokens dans `design-system/tokens.css`.
- Accessibilité RGAA 4.1 / WCAG 2.2 AA : landmarks, focus visible, texte alternatif, vérification au clavier de chaque composant.
- Adresses construites uniquement par `localizedPath(...)`.
- Fidélité visuelle à l'ancien site prioritaire sur Lighthouse en cas de conflit.

## Technical Decisions

- Composants `.astro` statiques, zéro JS client ; un îlot React seulement si état ou événements navigateur l'exigent.
- Les view-models typés de `src/content/` fournissent le contenu résolu par langue.
- Chaque bug corrigé produit un test qui échoue avant le correctif.

## Cross-Story Dependencies

- 3.1 fournit le gabarit et la navigation ; 3.2 le Hero et la Section Projets, dont les conventions de Section sont réutilisées par 3.3 et 3.4.
- 3.5 et 3.6 reposent sur les Sections de 3.2 à 3.4 ; 3.7 valide la fidélité de l'ensemble.
