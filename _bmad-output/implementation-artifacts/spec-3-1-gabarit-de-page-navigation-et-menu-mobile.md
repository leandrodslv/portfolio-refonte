---
title: 'Story 3.1 : Gabarit de page, navigation et menu mobile'
type: 'feature'
created: '2026-11-23'
status: 'done'
baseline_commit: '59d11f371687e0bd7ed67ff16169be04c3f750a7'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/design-system/components.md'
  - '{project-root}/docs/storybook.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** la Page d'accueil n'est qu'un prototype (`<h1>` et le Compteur de la story 1.1) : aucun gabarit commun, aucun landmark, aucun lien d'évitement, aucune navigation ni menu mobile.

**Approach:** un gabarit `.astro` (lien d'évitement, `header` avec navigation, `main`, `footer` vide), une navigation `.astro` fidèle à l'ancienne barre (logo, quatre liens Projets, Parcours, Compétences, Contact, texte depuis `uiStrings`), et le menu mobile par un module vanilla `src/islands/overlay.ts` qui possède la pile des superpositions (ouverture, Échap, piège du focus, focus rendu au bouton). Réutilise les primitives du kit (épopée 11).

## Boundaries & Constraints

**Always:** aucun texte en dur (libellés par `uiStrings`, FR et EN) ; adresses par `localizedPath(...)` ; tokens seulement, aucune valeur de design littérale hors `src/styles/` ; le HTML contient tous les liens sans JS ; cibles de 24 px minimum, focus visible, Échap ferme le menu ; JS du menu sous le budget de la story 1.1 ; une story Storybook par état et variante de la navigation (règle de composition de la story 11.5).

**Decisions (2026-11-23, Léandro) :** le gabarit rend des squelettes de Sections (`section` avec `id` `work`, `journey`, `skills`, `contact` et titre `uiStrings`) que les stories 3.2 à 3.4 remplacent ; logo copié de l'ancien site dans `src/assets/` (version blanche pour Terminal), texte alternatif depuis `siteSettings.nomDuSite` ; le `<h1>` et le Compteur du prototype sont retirés de la page et le test de budget JS migre vers le menu.

**Never:** réglages Thème, Langue et Son dans la barre (stories 4.2, 3.5, 6.1) ; Sections de contenu (3.2 à 3.4) ; `client:load` ; React pour le menu ; toucher à `ancien-portfolio/`.

</frozen-after-approval>

## Code Map

- `src/pages/index.astro` (prototype à remplacer), `src/pages/en/` (seulement `essai-contenu.astro` : créer `index.astro` EN) ; `src/lib/localizedPath.ts` ; `src/styles/global.css`.
- Kit à réutiliser : `src/components/ui/Link.astro` (variante `navigation`), `Section.astro` (`id`, `labelledby`), `Button.astro` (bouton du menu), tokens de `design-system/tokens.css`.
- Contenu : `src/content/` n'a qu'un chargeur (`projets.ts`) ; `uiStrings` (`navProjets`, `navParcours`, `navCompetences`, `navContact`, `ouvrirMenu`, `fermerMenu`) et `siteSettings` sont dans `src/content/types.ts` mais sans chargeur : en ajouter un, en lecture seule, avec `texte(...)` de `localiser.ts` (aucune requête Sanity hors `src/content/`).
- Ancienne barre : `ancien-portfolio/src/components/sections/Navbar.jsx` (cadre à bordure épaisse, poignées d'angle, cellules de liens, menu déroulant mobile sous `md`).
- À créer : `src/islands/overlay.ts` (n'existe pas), pas d'îlot React.
- Tests : Vitest par Astro Container + axe (`src/components/ui/kit.test.ts`), budget JS (story 1.1), stories `X.stories.tsx` + `X.variants.ts`.

## Implementation Notes

- Ajouts : `src/content/site.ts` (chargeur `siteSettings` et `uiStrings`), `src/components/Navbar.astro`, `Gabarit.astro`, `Accueil.astro`, `src/islands/overlay.ts` (pile des superpositions) et `menu.ts`, pages `index.astro` FR et EN, logos copiés dans `src/assets/`, tokens `--logo-light-display`, `--logo-dark-display`, `--size-logo`, `--z-nav`, `--rotate-menu-close`.
- Nouvelles clés `uiStrings` `allerAuContenu` et `navigationPrincipale` (Studio, types, catalogue, migration) : le dataset Sanity doit être migré avant le build ; `siteSettings.nomDuSite` doit aussi avoir sa valeur EN (« EN à rédiger » dans la migration), sinon le build échoue.
- Sans JS, le menu reste affiché en colonne ; le bouton n'apparaît qu'une fois le module chargé (`data-js`). Le bouton est une croix en CSS (pas de dépendance d'icônes).
- Écarts à l'ancienne barre : barre `sticky` et non `fixed` ; pas de poignées d'angle ; logo 2,5 rem (`--size-logo`).
- Le Compteur (`src/islands/Compteur.tsx`) n'est plus sur la page ; il reste avec son test Preact. Le test de budget JS ne contrôle plus le chunk `compat` (plus d'îlot hydraté).
- Non fait : stories Storybook de la barre (déférées) ; tests e2e écrits mais non exécutés localement (pas de variables Sanity).
