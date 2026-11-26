---
title: 'Story 10.4 : Page Fondations générée depuis les tokens'
type: 'feature'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
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

### Review Findings

- [x] [Review][Decision] Surcharges `@media` absentes de la page — résolu (Léandro, 2026-11-26) : section « Préférences d'accessibilité » ajoutée, devenue un patch. — `lireTokens` ignore les blocs `forced-colors`, `prefers-contrast: more` et `prefers-reduced-motion` : les valeurs de `--focus-color`, `--border-hairline`, `--opacity-*`, `--focus-width`, `--duration-*` sous ces préférences n'apparaissent nulle part, alors que l'intro annonce « chaque token avec sa valeur résolue ».
- [x] [Review][Patch] Le test « une fois par Thème » ne compte que `--bg` : boucler sur tous les tokens [src/fondations/fondations.test.tsx:62]
- [x] [Review][Patch] Aucun test ne vérifie la valeur résolue affichée par Thème (un bloc pourrait recevoir les valeurs de pop) [src/fondations/fondations.test.tsx]
- [x] [Review][Patch] `--focus-color: var(--text)` est calculé sur `:root` : sa pastille suit le Thème de la barre d'outils, pas celui du bloc [src/fondations/Fondations.tsx]
- [x] [Review][Patch] Nombre de blocs codé en dur (8) au lieu de `CATEGORIES.length` [src/fondations/fondations.test.tsx:72]
- [x] [Review][Patch] Tri alphabétique qui casse les échelles (`--space-12` avant `--space-2`) : garder l'ordre du fichier [src/fondations/Fondations.tsx]
- [x] [Review][Patch] `docs/storybook.md` dit « seule lecture de `tokens.css` » alors que `design-system.test.ts` et `kit.test.ts` la lisent encore par regex ; la PR dit tous les garde-fous prouvés sur CSS d'essai [docs/storybook.md]
- [x] [Review][Patch] La story ignore la langue de la barre d'outils (`lang="en"` avec texte FR) [src/fondations/Fondations.stories.tsx]
- [x] [Review][Patch] Valeur composée non résolue (`--field-ring-shadow`) [src/styles/tokens-lecture.ts]
- [x] [Review][Patch] Échantillon `filter` reconnu par le nom `--filter-nav-shadow` au lieu de la valeur [src/fondations/Fondations.tsx]
- [x] [Review][Patch] Sélecteur `data-theme` non ancré : `[data-theme="pop"] .x` serait fusionné au Thème [src/styles/tokens-lecture.ts]
- [x] [Review][Defer] axe sur `Fondations/Tokens` hors CI [.github/workflows/ci.yml] — deferred: `test:stories` n'est pas dans la CI, câblage prévu en story 10.6 (déjà consigné depuis la 11.4)

Rejetés :
- false — marge `0` rend une barre invisible : `0` est la vraie valeur ; aucun token d'espacement à deux valeurs.
- false — `resoudre` qui lève une erreur fait planter la story : échec bruyant voulu sur un token cassé.
- false — couleurs non hex ou `transparent` donnent NaN : le test de contraste échoue alors avec le ratio dans son message.
- false — `--filter-nav-shadow` n'existe pas : déclaré `tokens.css:312`.
- false — test de contraste supprimé : `kit.test.ts` le fait sur les mêmes `PAIRES`.
- false — `solid` littéral : mot-clé, même usage dans toutes les primitives du kit, accepté par stylelint.
- false — axe jamais exécuté : `test:stories` lancé en local sur `src/fondations`, 3 stories vertes (le manque en CI est reporté).
- rejeté — 8 catégories au lieu de 5 : validé par Léandro le 2026-11-26 ; le corriger reviendrait à modifier la spec.
- low — `--width-footer-bio` réutilisé pour la grille : n'affecte qu'une page Storybook ; la correction exige un nouveau token.
- low — fixture qui importe un type depuis `Fondations`, `postcss` dans `src/styles/` : import de type sans effet à l'exécution, aucun import par le Site.
- low — noms de Thème avec tiret ou guillemets simples : aucun dans `tokens.css` (couvert au passage par l'ancrage du sélecteur).
- low — cas limites du composant non testés (Thème absent, token dans la mauvaise section) : échec bruyant pour le premier, hypothétique pour le second.

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
