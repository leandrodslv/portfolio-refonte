---
title: 'Story 11.2 : Primitives d''interface `.astro`'
type: 'feature'
created: '2026-11-21'
status: 'done'
baseline_commit: '87c89cb54cda5f951efefc8e38e56057c2676b37'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
  - '{project-root}/design-system/components.md'
  - '{project-root}/design-system/tokens.css'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** les épopées 3, 5 et 7 n'ont aucune primitive d'interface à réutiliser ; chacune recréerait boutons, liens, cartes et titres, avec le risque de diverger de l'ancien site.

**Approach:** construire dans `src/components/ui/` les neuf primitives inventoriées en 11.1 (Bouton, Lien, Carte, Badge, Étiquette, Autocollant, Titre de Section, Conteneur, Sélecteur, ce dernier réduit à son déclencheur ; Champ est livré en 11.3), en `.astro` sans JS client, avec du CSS à portée du composant qui ne lit que des tokens. **Décision de Léandro : le rendu doit rester strictement identique à l'ancien site.** Chaque écart de `components.md` est donc résolu en ajoutant à `tokens.css` un token à la **valeur exacte de l'ancien site** ; l'accessibilité s'ajoute sans changer l'apparence au repos (focus visible seulement au clavier, mouvement réduit, contraste forcé).

## Boundaries & Constraints

**Always:** textes par props ou slot, jamais en dur (AD-3) ; aucune couleur, ombre, bordure, durée, taille ni espacement littéral hors `src/styles/` et `design-system/tokens.css` (stylelint) ; tailles en `rem` ; un token manquant est ajouté à `tokens.css` avant usage, valeur exacte de l'ancien site ; focus : `:focus-visible`, contour 3 px en `--text` avec décalage, cible d'au moins 24×24 px, activation Entrée (et Espace pour un bouton) ; lien externe ou de téléchargement annoncé ; contraste 4,5:1 (3:1 grand texte) vérifié par calcul sur les tokens de chaque Thème, tout écart qui découle de la fidélité (textes de 9 à 10 px, opacités 50 à 80 %) consigné dans `docs/ajustements-visuels.md` comme écart accepté en attente de validation (FR-23) ; `prefers-reduced-motion`, `prefers-contrast: more` et `forced-colors: active` pris en charge par des tokens ; texte +30 %, 320 px et zoom 200 % sans débordement ; chaque primitive est ajoutée à `components.md` (chemin, état « livré ») ; points de rupture 40 rem et 48 rem seulement dans `@media`.

**Never:** modifier `ancien-portfolio/` ; Tailwind avec valeurs arbitraires dans les primitives ; `client:*` ou JS client ; livrer Champ, la liste déroulante interactive, la Fenêtre de projet ou une primitive « hors kit » ; aligner une valeur sur un token existant si cela change l'apparence ; committer ou pousser.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bouton variantes | `variant` principal, secondaire, basculeur ; slot | `<button>` (ou `<a>` si `href`), classes de variante, texte du slot | variante inconnue : erreur de type |
| Lien externe | `href` + `external` ou `download` | `rel="noopener noreferrer"`, `target` seulement si externe, nom accessible incluant « nouvelle fenêtre » ou « téléchargement » fourni par prop | prop d'annonce absente : erreur de type |
| Texte long | slot +30 % | passe à la ligne, aucune troncature qui masque l'information | N/A |
| Token absent | `var(--x)` inconnu dans un `.astro` | test échoue | N/A |
| Valeur littérale | couleur, ombre, durée dans un composant | stylelint échoue | N/A |
| Primitive manquante | fichier `ui/` absent de `components.md` | test échoue | N/A |

</frozen-after-approval>

## Code Map

- `design-system/components.md` -- inventaire 11.1 : variantes, états, tokens par Thème, 18 écarts à résoudre en tokens exacts ; à mettre à jour (« livré »).
- `design-system/tokens.css` -- ajouter la section « Kit UI » ; ne rien changer à l'existant.
- `ancien-portfolio/src/styles/theme.js` et `ancien-portfolio/src/components/{UI,sections}/*.jsx` -- valeurs exactes à reproduire (lecture seule).
- `src/components/RobotsMeta.test.ts` -- modèle de test Container ; `.storybook/astro-html.ts` -- rendu sans props (stories en 11.4).
- `src/styles/global.css` -- importe `tokens.css`, `@theme inline` ; les primitives n'utilisent pas Tailwind.
- `package.json`, `eslint.config.js`, `.github/workflows/ci.yml` -- ajouter `stylelint`, `postcss-html`, `jsdom` (devDependencies, MIT) ; script `lint:css` chaîné dans `lint`.
- `docs/ajustements-visuels.md` -- à créer (écarts acceptés, FR-23) ; `docs/storybook.md` -- rappel des limites (props).

## Tasks & Acceptance

**Execution:**
- [x] `design-system/tokens.css` -- section « Kit UI » : tokens manquants des écarts 1 à 18 à valeur exacte de l'ancien site, plus `--focus-*`, mouvement réduit, `prefers-contrast`, `forced-colors` -- zéro littéral dans les composants
- [x] `src/components/ui/{Button,Link,Card,Badge,Tag,Sticker,SectionTitle,Section,Select}.astro` -- primitives avec `<style>` à portée, props typées, slots -- fidélité et accessibilité
- [x] `stylelint.config.mjs`, `package.json` -- règles : pas de hex, `rgb()`/`hsl()`, ni longueur ou durée littérale hors `var()` ; `lint:css` dans `lint` -- AD-6
- [x] `src/components/ui/*.test.ts` -- rendu Container + jsdom + axe (hors contraste), sémantique, matrice I/O -- AC tests
- [x] `src/components/ui/kit.test.ts` -- tokens cités existent, primitives dans `components.md`, contraste calculé par Thème, stylelint échoue sur un littéral -- gardes
- [x] `design-system/components.md`, `docs/ajustements-visuels.md`, `docs/storybook.md` -- état « livré », écarts acceptés, limite des props

**Acceptance Criteria:**
- Given chaque primitive, when elle est rendue sous Pop, Terminal et Wireframe, then ses valeurs égalent celles de l'ancien site (tokens exacts) et le contraste atteint 4,5:1 ou l'écart est consigné.
- Given un bouton, un lien ou le déclencheur du sélecteur, when je navigue au clavier, then le focus est visible, la cible fait au moins 24×24 px et Entrée (Espace pour un bouton) l'active.
- Given `npm test`, `npm run lint` et `npm run typecheck`, when ils s'exécutent, then ils passent, et stylelint échoue sur toute valeur littérale.

## Implementation Notes

Neuf primitives dans `src/components/ui/` (Button, Link, Card, Badge, Tag, Sticker, SectionTitle, Section, Select), section « Kit UI » de `tokens.css` aux valeurs exactes de l'ancien site, stylelint (`lint:css`, chaîné dans `lint`), tests Container + jsdom + axe, gardes de tokens et de contraste, `docs/ajustements-visuels.md`. Dépendances de développement ajoutées : `stylelint`, `postcss-html`, `jsdom`, `@types/jsdom`, `axe-core`, `postcss`. Après revue : 299 tests verts, lint, typecheck et format sans erreur ; `ancien-portfolio/` intact. Deux écarts de contraste Terminal conservés par fidélité, à valider à l'audit (story 9.2).

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck` -- expected: verts
- `git status --short ancien-portfolio` -- expected: aucune sortie

**Manual checks (if no CLI):**
- Comparer visuellement chaque primitive (Storybook en 11.4, ou page d'essai) à l'ancien site dans les trois Thèmes.

## Review Triage Log

| Finding | Verdict | Route | Evidence / suite |
| --- | --- | --- | --- |
| `axe-core` et `postcss` importés mais absents de `package.json` | medium | patch | ajoutés en devDependencies |
| Doublons dans `components.md` (Champ, Sélecteur) | low | patch | corrigés |
| Zone média de Card vide si pas de slot (`:empty` fragile) | medium | patch | rendue seulement si le slot existe, règles `:empty` supprimées |
| `.ui-link__announce` sans ancêtre positionné (text, footer) | medium | patch | `position: relative` sur `.ui-link` |
| Bouton basculeur reçoit la classe de taille par défaut (déplacement au survol) | medium | patch | classe de taille omise pour `toggle` |
| `--tag-opacity: 0.8` Terminal non réinitialisé par `prefers-contrast` | medium | patch | `var(--opacity-soft)` |
| Annonce du Lien non imposée par le type (spec : erreur de type) | medium | patch | `Props` en union discriminée, erreur d'exécution conservée |
| Branches par props non testées (Button, Select, Card, Section, SectionTitle, Badge) | medium | patch | tests ajoutés |
| stylelint vérifié seulement sur chaînes, pas sur les `.astro` réels | low | patch | test sur `src/components/ui/*.astro` |
| `docs/storybook.md` non mis à jour alors que la tâche le promet | low | patch | limite des props des primitives ajoutée |
| Fenêtres JSDOM jamais fermées | low | patch | `window.close()` en `finally` |
| `disabled` ignoré quand `href` est présent | low | defer | aucun consommateur ; noté dans `deferred-work.md` |
| `[data-theme]` redéclarerait des tokens existants | false | rejeté | chaque token n'apparaît qu'une fois par Thème |
| Valeurs de repli sans `data-theme` | false | rejeté | même schéma que les tokens existants, antérieur à la story |
| `--select-bg` identique dans les trois Thèmes | false | rejeté | fidélité : l'ancien sélecteur reste blanc ; écart consigné |
| Tilt écrasé par le transform au survol | false | rejeté | l'inclinaison n'existe que sur la carte de service, sans transform au survol |
| `scale(1.05)`, `z-index`, unités rares non rejetés par stylelint | low | rejeté | correction non triviale, valeurs reprises de l'ancien site |
| Survol/actif d'un bouton désactivé | low | rejeté | rendu de l'ancien site conservé, aucun usage |
| `{...attrs}` peut écraser `rel`/`type` | false | rejeté | choix de l'appelant ; défauts sûrs sinon |
| Contraste : non-texte, survols, ratios documentés non figés, `luminance` hex seul | low | rejeté | hors périmètre de la story, écarts consignés à l'audit |
| Tokens existence : regex non ancrée, tokens par Thème | low | rejeté | risque improbable |
| Reduced motion / forced-colors partiels, `forced-colors` no-op `--border-hairline` | low | rejeté | durées à 0,01 ms, comportement voulu |
| `Select` sans nom accessible, Card `as="li"` hors liste | false | rejeté | nom fourni par le slot ; usage de l'appelant |
| Stories Storybook, test clavier, texte +30 % étendu | low | rejeté | stories prévues en 11.4 |
| TS7016 sur `stylelint.config.mjs` | false | rejeté | `npm run typecheck` : 0 erreur |
| `@types/jsdom ^30` pour `jsdom ^31` | false | rejeté | typecheck vert |
