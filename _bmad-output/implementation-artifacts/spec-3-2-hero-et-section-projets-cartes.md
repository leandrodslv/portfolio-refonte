---
title: 'Story 3.2 : Hero et Section Projets (cartes)'
type: 'feature'
created: '2026-11-23'
status: 'done'
baseline_commit: '30d7795d28b60d951d664db32d85097829115bb0'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/design-system/components.md'
  - '{project-root}/docs/storybook.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-3-1-gabarit-de-page-navigation-et-menu-mobile.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** la Page d'accueil n'a que des squelettes de Sections : le Visiteur ne voit ni le Hero ni les Cartes de Projets, et le `h1` n'est qu'un titre masqué.

**Approach:** un Hero (badge, titre en trois lignes dont la deuxième en autocollant, sous-titre, deux boutons vers `#work` et `#contact`, visuel propre à chaque Thème) et la Section Projets (en-tête, cinq Cartes du kit) rendus en HTML statique depuis Sanity, en FR et en EN. Utilise les primitives du kit (épopée 11).

## Boundaries & Constraints

**Always:** aucun texte en dur ; adresses par `localizedPath(...)` ; tokens seulement ; images optimisées au build (`astro:assets`), `alt` de la couverture issu du contenu ; le Hero porte l'unique `h1` (le titre masqué du gabarit disparaît) ; visuel du Hero choisi par token CSS selon le Thème, seul le visuel actif est chargé.

**Decisions (2026-11-23, Léandro) :** trois champs de texte alternatif du Hero (un par Thème, FR/EN) ajoutés à Sanity (schéma, types, migration, publication dans `dev`) ; la Carte n'a pas de bouton « Détails » avant l'épopée 5 (aucun contrôle inactif, aucun lien cassé) ; visuels du Hero copiés de l'ancien site dans `src/assets/`.

**Never:** Fenêtre de projet, ouverture au clic, son, animations d'entrée ; autres Sections (3.3, 3.4) ; `client:*` ; toucher à `ancien-portfolio/` ; commit ou push sans demande.

</frozen-after-approval>

## Implementation Notes

- Code : `src/content/accueil.ts` (Hero, en-tête Projets), `Hero.astro`, `ProjetsSection.astro`, `Accueil.astro`, `Gabarit.astro` ; visuels dans `src/assets/hero/`.
- Hero : `Hero.astro` (badge `hook`, h1 en trois lignes dont la deuxième en autocollant, boutons du kit vers `#work` et `#contact`, trois visuels dont un seul est affiché par Thème via `--hero-*-display`, seul le visuel Pop est chargé en `eager`). Le titre masqué du gabarit est supprimé.
- Section Projets : `ProjetsSection.astro` (kit `Section`, `SectionTitle`, `Card`, `Badge`, `Tag`), trois étiquettes au plus par Carte comme l'ancien site, aucun bouton avant l'épopée 5.
- Kit : `SectionTitle` insère une espace avant le mot en relief, pour que le nom accessible du titre soit « Mes projets » et non « Mesprojets ».
- Contenu : trois champs `altVisuelPop`, `altVisuelTerminal`, `altVisuelWireframe` ajoutés au Hero (Studio, types, migration) et publiés dans le dataset `dev` ; `production` non touché.
- Tokens ajoutés : `--hero-pop-display`, `--hero-terminal-display`, `--hero-wireframe-display`, `--size-hero-visual`, `--size-hero-screen`.
- Écarts à l'ancienne page : opacité du sous-titre et des descriptions à 0,8 (`--opacity-soft`) au lieu de 0,7 pour les descriptions ; pas d'animation d'entrée ni de zoom au survol de l'image ; pas de repli visuel `onError` pour une image absente (le build échoue si l'image est absente).
- Non fait : stories Storybook du Hero et de la Section (à déférer comme en 3.1) ; tests e2e et rendu visuel non exécutés en local (pas de variables Sanity).
