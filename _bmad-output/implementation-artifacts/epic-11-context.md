# Epic 11 Context: UI kit fidèle à l'ancien site

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Léandro et les futures sessions disposent d'un jeu unique de primitives d'interface (bouton, lien, carte, badge, étiquette, titre de Section, conteneur, sélecteur, champs), dérivé de l'ancien site et des tokens de `design-system/tokens.css`. Les épopées 3, 5 et 7 le réutilisent au lieu de recréer leurs composants. À livrer après les stories 10.1 à 10.3 (faites) et avant la story 3.1.

## Stories

- Story 11.1: Inventaire des composants de l'ancien site
- Story 11.2: Primitives d'interface `.astro`
- Story 11.3: Primitives de formulaire
- Story 11.4: États, variantes et contrôle des Thèmes du kit
- Story 11.5: Règle de réutilisation du kit

## Requirements & Constraints

- Fidélité visuelle à l'ancien site (FR-8) : le kit reprend ce qui existe, sans rien inventer.
- `ancien-portfolio/` est en lecture seule (NFR-6), jamais modifié.
- Accessibilité WCAG 2.2 AA (FR-22) : focus visible, cibles d'au moins 24×24 px, contraste 4,5:1 (3:1 grand texte), annonce des liens externes ou téléchargements, aucun `alert()`, erreurs par `aria-live` et non par la seule couleur.
- Robustesse : texte +30 % sans débordement, 320 px, zoom 200 %, `prefers-contrast: more`, `forced-colors: active`.
- Tailles en `rem` ; échelles typographique, d'espacement et points de rupture nommés.
- Motifs propres à un seul endroit (Marquee, carte à gratter, curseur, confettis) : « hors kit », renvoyés aux épopées 5 et 6.
- Toute valeur de design de l'ancien site absente de `tokens.css` est soumise à Léandro avant ajout de token.
- Gratuit ou open source uniquement.

## Technical Decisions

- Source de vérité : `design-system/components.md` (nom, variantes, états, tokens sémantiques, composant Figma, chemin `.astro`) ; `design-system/README.md` y renvoie.
- Primitives dans `src/components/ui/`, `.astro` sans JS client, textes par props ou slot (AD-3), tokens sémantiques seulement, aucune valeur littérale hors `src/styles/` (stylelint) (AD-6).
- Tests Vitest par rendu Astro Container + axe ; un test échoue si un token est absent ou si la primitive manque à `components.md`.
- Stories Storybook par variante et état via le rendu HTML pré-rendu (AD-19, story 10.3).

## Cross-Story Dependencies

- 11.1 alimente 11.2 et 11.3 (inventaire, échelles, points de rupture) ; 11.4 dépend de 11.2, 11.3 et 10.3.
- 11.5 modifie les critères des stories 3.1 à 3.4, 4.2, 4.4, 5.1, 7.2 et le contrôle de 10.6.
