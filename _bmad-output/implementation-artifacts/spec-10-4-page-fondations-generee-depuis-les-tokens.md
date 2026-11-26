---
title: 'Story 10.4 : Page Fondations générée depuis les tokens'
type: 'feature'
created: '2026-11-24'
status: 'review'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/docs/storybook.md'
  - '{project-root}/docs/TESTING-RULES.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Pour repérer un écart de design, Léandro doit ouvrir `design-system/tokens.css` ; Storybook ne montre aucun token (FR-20).

**Approach:** Une page Storybook « Fondations » lit `tokens.css` (import `?raw`, parseur partagé extrait de `kit.test.ts`) et affiche couleurs, ombres, bordures, durées et espacements pour pop, terminal et wireframe, chacun dans un conteneur local `[data-theme]`. Un test échoue pour tout token non classé ou absent d'un Thème.

## Boundaries & Constraints

**Always:** liste de tokens lue du fichier, jamais recopiée ; textes de l'interface dans `src/fixtures/ui-strings.ts` (FR+EN) ; aucune valeur de design en dur (styles via tokens) ; page sous `src/` (glob des stories) ; a11y en mode `error`, écart de contraste consigné dans `docs/ajustements-visuels.md` s'il subsiste ; tests `describe`/`it` en français.

**Never:** modifier `tokens.css` (sauf ajout nécessaire de token d'affichage, justifié) ; ajouter une dépendance ; JS client sur le Site (budget inchangé) ; toucher `ancien-portfolio/` ; committer ou pousser.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Page nominale | `tokens.css` actuel | 5 catégories × 3 Thèmes, valeur résolue affichée | N/A |
| Token ajouté/renommé | nouveau `--x` non classé | test rouge nommant `--x` | message liste les absents |
| Token absent d'un Thème | `--bg` manquant en wireframe | test rouge nommant Thème + token | idem |
| Contraste | paires texte/fond de chaque Thème | AA atteint ou écart consigné | exceptions explicites |

</frozen-after-approval>

## Code Map

- `src/components/ui/kit.test.ts` l.12-67 -- parseur postcss, `resoudre()`, `luminance()`, `contraste()`, PAIRES : à extraire, pas à dupliquer
- `src/design-system.test.ts` l.9 -- regex d'extraction des tokens (modèle)
- `design-system/tokens.css` -- `:root` primitives (l.8-138, 240-337), thèmes `[data-theme]` (l.145/175/205 et 366/394/422)
- `.storybook/preview.ts` -- décorateur `data-theme` global ; la page doit forcer chaque Thème en local
- `src/components/ui/stories-kit.tsx` -- helpers de story (Matrice thèmes × langues)
- `src/fixtures/ui-strings.ts` -- textes des stories
- `docs/storybook.md`, `docs/ajustements-visuels.md` -- doc et registre des écarts (contraste Terminal connu)

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/tokens-lecture.ts` -- extraire parseur, `resoudre`, contraste, PAIRES depuis `kit.test.ts` ; exporter `lireTokens(css)` et `classer(nom)` (couleur, ombre, bordure, durée, espacement) -- source unique
- [x] `src/components/ui/kit.test.ts` -- importer le module partagé -- zéro duplication
- [x] `src/fondations/Fondations.tsx` -- composant Preact : sections par catégorie, un bloc `data-theme` par Thème, pastilles/échantillons stylés par `var(--token)`
- [x] `src/fondations/Fondations.stories.tsx` -- titre `Fondations/Tokens`, import `tokens.css?raw`
- [x] `src/fixtures/ui-strings.ts` -- clés FR/EN des titres et libellés
- [x] `src/fondations/fondations.test.tsx` -- tout token classé ; jeu de tokens sémantiques identique dans les 3 Thèmes ; contrastes AA des PAIRES ou exception listée
- [x] `docs/storybook.md` et `docs/ajustements-visuels.md` -- documenter la page et tout écart de contraste

**Acceptance Criteria:**
- Given `tokens.css`, when j'ouvre Fondations, then les 5 catégories s'affichent pour pop, terminal et wireframe
- Given un token ajouté ou renommé, when `npm test` s'exécute, then un test signale le token absent de la page ou d'un Thème
- Given la page, when `npm run test:stories` s'exécute, then axe passe ou l'écart est consigné
- Given le dépôt, when `npm test`, `npm run lint`, `npm run typecheck` s'exécutent, then tout est vert

## Implementation Notes

## Spec Change Log

- 2026-11-26 : `classer()` compte 8 catégories au lieu de 5. Les 5 de l'intention (couleur, ombre, bordure, durée, espacement) restent ; typographie, dimension et effet s'y ajoutent, car `tokens.css` contient 92 tokens hors de ces 5 familles (`--text-*`, `--size-*`, `--opacity-*`…) qui feraient échouer le garde-fou. Les 235 tokens actuels sont tous classés.
- 2026-11-26 : `fondations.test.tsx` (en `.tsx` pour rendre la page) ne recopie pas la vérification des contrastes : `kit.test.ts` la fait déjà sur les mêmes PAIRES, importées du module partagé. Il vérifie à la place que chaque token est affiché une fois par Thème.

## Review Triage Log

## Design Notes

Catégorisation par préfixe (`--color-`, `--accent-`, `--bg`… → couleur ; `--shadow*` ; `--border*`/`--radius-*` ; `--duration-*`/`--ease-*` ; `--space-*`). Un token sans catégorie fait échouer le test : c'est le garde-fou FR-20. Les `var()` sont résolus par Thème pour afficher la valeur finale.

## Verification

**Commands:**
- `npm test` -- expected: vert
- `npm run lint && npm run typecheck` -- expected: vert
- `npm run test:stories` -- expected: axe sans violation (ou écart consigné)
- `npm run build-storybook` -- expected: build réussi

**Manual checks (if no CLI):**
- `npm run storybook` : page Fondations lisible au clavier, 3 Thèmes côte à côte
