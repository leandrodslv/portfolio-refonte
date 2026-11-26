# Storybook

Storybook rend les îlots avec Preact, comme la production (AD-7 : alias `react` et `react-dom` vers `preact/compat`).

## Alias

L'alias est défini une seule fois dans `config/preact-alias.mjs`. Il est lu par `astro.config.mjs`, `vitest.config.ts` et `.storybook/main.ts`. `tsconfig.json` ne peut pas importer ce fichier : ses `paths` et son `jsxImportSource` sont donc recopiés, et `src/islands/preact.test.tsx` échoue s'ils divergent.

Les îlots continuent d'importer depuis `react`. Le framework Storybook est `@storybook/preact-vite`.

## Barre d'outils, fixtures et tests

La barre d'outils propose le Thème (`data-theme`), la Langue FR/EN (`lang`) et deux largeurs, mobile 320 px et bureau. Les textes des stories viennent de `src/fixtures/ui-strings.ts`, typées sur `UiStrings` : aucune chaîne littérale dans une story. Pour ajouter un texte, déclarer sa clé dans `CleStory` et ses deux langues.

`npm run test:stories` exécute chaque story dans Chromium (addon-vitest) : il échoue sur une violation axe (`a11y.test: 'error'`) ou sur un défilement horizontal à 320 px. Il est séparé de `npm test` car il lance un navigateur ; son câblage dans la CI relève de la story 10.6.

## Composants `.astro`

Un composant `.astro` sans props s'affiche par HTML pré-rendu (AD-19) : `import html from './Composant.astro?html'`. Le plugin vit dans `.storybook/astro-html.ts`.

## Primitives du kit (`src/components/ui/`)

Chaque primitive a deux fichiers frères :

- `X.variants.ts` : une fonction par variante ou état, qui reçoit les textes (`src/fixtures/kit-strings.ts`, FR/EN, avec `t.long(cle)` pour le texte allongé de 30 %) et renvoie `{ props, slots }` ;
- `X.stories.tsx` : une story par variante (`histoire`), les cas communs (`casCommuns` : bureau, tablette, texte long à 200 %, contraste renforcé, couleurs forcées) et, pour les éléments interactifs, survol et focus (`interaction`).

`import rendus from './X.astro?variants'` rend chaque variante en FR et en EN, avec le CSS du composant. Chaque story affiche une matrice 3 Thèmes × 2 Langues ; les identifiants sont suffixés pour rester uniques. Le zoom de texte à 200 % se règle dans la barre d'outils (viewport de 640 px, soit un écran de 1280 px zoomé). `prefers-contrast: more` et `forced-colors: active` sont émulés par le navigateur de test (CDP Chromium) ; en Storybook interactif, l'émulation n'est pas disponible : utiliser l'émulation de rendu des outils du navigateur.

`src/components/ui/stories.test.ts` (dans `npm test`) échoue si une primitive n'a pas son fichier de variantes ou de stories, ou si une variante déclarée n'a pas sa story. Le câblage de `test:stories` dans la CI relève de la story 10.6.

Écarts de contraste Terminal conservés par fidélité : le contrôle `color-contrast` est désactivé dans les stories Button et Select (voir `docs/ajustements-visuels.md`).

## Page Fondations (`src/fondations/`)

`Fondations/Tokens` affiche chaque token de `design-system/tokens.css` avec sa valeur résolue dans les trois Thèmes, côte à côte : chaque Thème a son propre bloc `data-theme`, quel que soit le Thème choisi dans la barre d'outils. La liste n'est jamais recopiée : la story importe `tokens.css?raw` et la page le lit avec `src/styles/tokens-lecture.ts`.

Ce module est la lecture structurée de `tokens.css`, partagée par la page et par `kit.test.ts` (contrastes) : `lireTokens` (`:root`, blocs `[data-theme="…"]` exacts et surcharges `@media`), `classer`, `resoudre` (y compris les `var()` à l'intérieur d'une valeur), `valeurToken`, `contrastePaire` et `PAIRES`. D'autres tests (`design-system.test.ts`, la vérification des tokens cités dans `kit.test.ts`) lisent encore le fichier par expression régulière. Le module importe `postcss` : il est réservé à Storybook et aux tests, jamais au Site.

`classer` range chaque token dans une des 8 catégories (couleur, ombre, bordure, durée, espacement, typographie, dimension, effet) selon son nom ; la première règle qui correspond l'emporte. `src/fondations/fondations.test.tsx` échoue si :

- un token n'a pas de catégorie : ajouter une règle dans `classer` ou renommer le token selon les préfixes existants ;
- un token sémantique manque dans un Thème : le message nomme le Thème et le token ;
- un token n'est pas affiché exactement une fois par Thème, ou un bloc n'affiche pas la valeur résolue de son propre Thème ;
- une surcharge `@media` n'est pas affichée, ou sa condition n'a pas de libellé FR et EN dans `textesFondations.preferences.conditions`.

Les tokens de `:root` qui citent un autre token (`--focus-color: var(--text)`) sont redéclarés dans chaque bloc : sans cela, le navigateur les calcule sur `<html>`, avec le Thème de la barre d'outils. La section « Préférences d'accessibilité » liste les valeurs des blocs `forced-colors`, `prefers-contrast: more` et `prefers-reduced-motion`. La langue suit la barre d'outils.

Les textes de la page sont dans `textesFondations` (`src/fixtures/ui-strings.ts`, FR et EN). Les tokens gardent l'ordre du fichier, pour que les échelles se lisent dans l'ordre. Les durées, dimensions et effets n'ont pas d'échantillon animé ou visuel : seule leur valeur est affichée.

## Compatibilité Preact des bibliothèques React-only

À compléter avant le premier usage d'une bibliothèque dans un îlot.

| Bibliothèque | Usage prévu           | Compatibilité Preact                                                                | Vérification                                         |
| ------------ | --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| ALTCHA       | formulaire de contact | widget en composant web (`altcha`), sans dépendance à React : compatible            | à confirmer par un test au premier usage             |
| Animation    | îlots animés (AD-7)   | animations de décor en CSS ; toute bibliothèque est chargée dans l'îlot qui l'exige | compatibilité `preact/compat` à vérifier avant usage |
