# Design system — portfolio

Documente l'**existant** (DA, UI, UX inchangées pour l'instant).

- `tokens.css` : primitives + tokens sémantiques des 3 thèmes (Pop, Terminal, Wireframe).
- Source : `../ancien-portfolio/src/styles/theme.js` et les composants.

## Points à valider avec Léandro
- Police : aucune police personnalisée trouvée (système uniquement). Intentionnel ?
- Les couleurs Tailwind (pink-400, etc.) sont résolues en hex ; vérifier à l'œil.
- Hors tokens : valeurs ponctuelles (#ff00ff, #00ff00, #0000ff…) probablement des easter eggs (mode « party »).

## Composants
L'inventaire des composants (variantes, états, échelles, points de rupture, écarts à valider) est dans [`components.md`](components.md), source de vérité du kit.

## À faire ensuite
1. Export `tokens.json` + variables Figma.
2. Composants Astro correspondants (`src/components/ui/`, voir `components.md`).
