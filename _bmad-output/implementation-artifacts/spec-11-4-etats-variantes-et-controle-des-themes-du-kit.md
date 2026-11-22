---
title: 'Story 11.4 : États, variantes et contrôle des Thèmes du kit'
type: 'feature'
created: '2026-11-21'
status: 'done'
baseline_commit: '7be60a835fad4a3cf4f9d20974934216cfe3f2af'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-11-3-primitives-de-formulaire.md'
  - '{project-root}/design-system/components.md'
  - '{project-root}/docs/storybook.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** les douze primitives du kit (Button, Link, Card, Badge, Tag, Sticker, SectionTitle, Section, Select, Field, Checkbox, FieldMessage) n'ont aucune story : Léandro ne peut pas voir leurs états sous chaque Thème et chaque Langue, et le plugin `astro-html` ne sait pas passer de props (limite connue d'AD-19).

**Approach:** étendre le plugin pour que `X.astro?variants` rende, à partir d'un fichier frère `X.variants.ts`, chaque variante en FR et en EN (HTML pré-rendu par le Container) ; écrire une story par variante et par état pour chaque primitive ; ajouter les cas « texte long » (+30 %), 320 px, zoom de texte 200 %, `prefers-contrast: more` et `forced-colors: active` ; ajouter un contrôle dans `npm test` qui échoue si une variante ou un état d'une primitive n'a pas sa story. Aucune primitive ni aucun token n'est modifié.

## Boundaries & Constraints

**Always:** textes des stories dans une fixture typée FR/EN (`src/fixtures/`), jamais en chaîne littérale dans une story (AD-3) ; la Langue de la barre d'outils choisit le HTML FR ou EN ; l'addon a11y reste en mode `error` ; aucun défilement horizontal à 320 px ; zoom de texte 200 % par une option de la barre d'outils ; `prefers-contrast` et `forced-colors` émulés par le navigateur de test (CDP Chromium), avec repli documenté en Storybook interactif ; chaque primitive de `components.md` a un fichier `*.variants.ts` et un `*.stories.tsx` ; le contrôle liste les variantes manquantes ; `docs/storybook.md` et AD-19 mis à jour (limite des props levée).

**Never:** modifier une primitive `.astro`, `tokens.css` ou `ancien-portfolio/` ; ajouter une dépendance ; créer des stories pour les îlots ou les hors-kit ; `client:*` ; câbler `test:stories` dans la CI (story 10.6) ; committer ou pousser sans demande.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Variante | `Button.variants.ts` déclare `secondaire` | `Button.astro?variants` rend `{ fr, en }` pour `secondaire` | fichier frère absent : erreur de build explicite |
| Langue | barre d'outils sur EN | la story affiche le HTML EN | N/A |
| Texte long | cas `texteLong` (+30 %) | passe à la ligne, aucune violation axe, aucun défilement | N/A |
| Contraste renforcé | émulation `prefers-contrast: more` | story rendue, opacités à 1, axe passe | émulation indisponible : story ignorée avec message |
| Couverture | variante déclarée sans story | `npm test` échoue en la nommant | N/A |

</frozen-after-approval>

## Code Map

- `.storybook/astro-html.ts` -- plugin : ajouter le suffixe `?variants` (charge `X.variants.ts` par `ssrLoadModule`, rend chaque cas en FR et en EN via `conteneur.renderToString(module.default, { props, slots })`).
- `.storybook/preview.ts` -- ajouter l'option « zoom 200 % » (décorateur sur `font-size` de `html`) ; garder `a11y: error` et le contrôle de défilement.
- `src/components/ui/*.astro`, `primitives.test.ts`, `forms.test.ts` -- sources des variantes et états à couvrir (lecture seule).
- `src/fixtures/ui-strings.ts` -- modèle ; créer `src/fixtures/kit-strings.ts` (textes FR/EN des stories, version « texte long » +30 %).
- `design-system/components.md` -- liste des variantes et états par primitive ; référence du contrôle.
- `docs/storybook.md`, spine AD-19 -- mettre à jour la limite des props.

## Tasks & Acceptance

**Execution:**
- [x] `.storybook/astro-html.ts`, `src/storybook-variants.d.ts` -- suffixe `?variants` + types -- props pour les `.astro`
- [x] `src/fixtures/kit-strings.ts` -- textes FR/EN et texte long -- AD-3
- [x] `src/components/ui/*.variants.ts` (12) -- variantes et états déclarés avec leurs props et slots
- [x] `src/components/ui/*.stories.tsx` (12) et `.storybook/preview.ts` -- une story par variante, par état et par cas (texte long, 320 px, zoom, contraste, couleurs forcées)
- [x] `src/components/ui/stories.test.ts` -- contrôle de couverture dans `npm test`
- [x] `docs/storybook.md`, spine AD-19 -- procédure et limites

**Acceptance Criteria:**
- Given les primitives des stories 11.2 et 11.3, when j'ouvre Storybook, then chacune a une story par variante et par état, et `npm run test:stories` passe (axe en `error`) sous Pop, Terminal et Wireframe, en FR et en EN.
- Given chaque primitive, when j'affiche texte long, 320 px, zoom 200 %, `prefers-contrast: more` et `forced-colors: active`, then une story par cas existe, sans débordement ni élément invisible.
- Given une variante sans story, when `npm test` s'exécute, then il échoue en la nommant.

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck && npm run test:stories` -- expected: verts
- `git diff --stat -- src/components/ui/*.astro design-system/tokens.css ancien-portfolio` -- expected: aucune sortie

## Implementation Notes

Plugin `?variants` (HTML + CSS des composants, FR et EN), fixture `kit-strings.ts`, 13 fichiers `*.variants.ts` et `*.stories.tsx`, matrice 3 Thèmes × 2 Langues, zoom 200 % (viewport de 640 px), contraste renforcé et couleurs forcées par CDP, `stories.test.ts` (couverture dans `npm test`). `global.css` est importé dans Storybook pour retrouver le reset Tailwind du vrai site.

Sur demande de Léandro (2026-11-21), les primitives ont été comparées par Playwright au site en ligne (styles calculés, 3 Thèmes, repos, survol, 390 px) et corrigées là où elles divergeaient : poids des étiquettes par Thème, taille du lien texte (24 px dès 48 rem), pied de page, bouton compact, survol des boutons (rotation et échelle de l'ancien Framer Motion, reproduites en CSS), cartes sans déplacement au survol, cartes de service aux couleurs fixes, badge sans rotation, mot en relief du titre (Sticker), ligne de réglage du Sélecteur. Écart conservé et bloquant : texte vert sur cartes de service en Terminal (1,0:1), consigné dans `docs/ajustements-visuels.md`.

## Review Triage Log

| Finding | Verdict | Route | Evidence / suite |
| --- | --- | --- | --- |
| Émulation `contraste renforcé` / `couleurs forcées` jamais active : `emuler` avalait l'erreur CDP (« Cannot use CDP… »), les deux stories passaient sans émulation (3 relecteurs, reproduit) | high | patch | commande Playwright `emulerMedia` déclarée dans `vitest.stories.config.ts`, vérification par `matchMedia`, remise à zéro avant chaque story, `color-contrast` coupé seulement pour les couleurs forcées |
| `Survol` et `Focus` n'exerçaient qu'une cellule sur six, cible absente = succès silencieux | medium | patch | boucle sur toutes les cibles, erreur explicite si aucune |
| `:active` du bouton écrasé par `:hover` (spécificité) | medium | patch | règles `:active` de même spécificité, placées après |
| Bouton désactivé réagit au survol | medium | patch | `:not(:disabled)` sur les règles de survol et de pression |
| Rotations et échelles de survol sans `prefers-reduced-motion` | medium | patch | media query sur Button et Card service |
| `.ui-select--row:hover` écrasé par `.ui-select:hover` (opacité) | medium | patch | sélecteur `.ui-select.ui-select--row:hover` |
| `scale(1.05)` littéral dans Link | low | patch | `var(--scale-hover)` |
| Tokens `--rotate-tilt-*` morts, `components.md` périmé (tilt, badge, Select row, bouton compact, couleurs de service, survol) | medium | patch | tokens supprimés, `components.md` mis à jour |
| Texte AD-19 périmé (« quarante lignes », « sans props ») | medium | patch | phrase réécrite |
| `suffixer` : `data-id`, ancres `href="#…"`, idrefs ARIA manquants | low | patch | regex à garde `(?<![\w-])`, ancres suffixées |
| `long()` bien au-delà de +30 % | medium | patch | longueur plafonnée à +30 % |
| Types dupliqués, `{} as`, export par défaut non validé, `className` SVG | low | patch | types partagés, `Promise.all`, validation, `getAttribute('class')` |
| Garde `stories.test.ts` fragile (format Prettier, `toContain`) | medium | patch | regex tolérante, usage vérifié dans `histoire/casCommuns/interaction` |
| `SectionTitle` (Sticker) et `Select` (variant) sans test | medium | patch | tests ajoutés |
| `test:stories` hors CI | medium | defer | câblage en story 10.6, noté dans `deferred-work.md` |
| Primitives et tokens modifiés malgré « Never » | low | rejeté | décision de Léandro du 2026-11-21 (« il y a des changes qui ne sont pas bon »), consignée dans les notes |
| `collecterStyles` renverrait du JS | false | rejeté | `&inline` renvoie du CSS brut (vérifié) ; les stories sont stylées |
| `color-contrast` coupé sur Button, Card, Select | low | rejeté | écarts Terminal documentés ; paires gardées par `kit.test.ts` |
| Accent 5 des cartes de service, `aria-pressed`, accents 4 et 5 sans story | low | rejeté | hors périmètre, aucun usage |
| Styles répétés par cellule, `invalidateAll`, chemin de la fixture, `data-*` échappement | low | rejeté | risque improbable |
| Tâche citant `src/storybook-variants.d.ts` | low | rejeté | types dans `src/env.d.ts`, sans effet |
