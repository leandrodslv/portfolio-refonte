# Storybook

Storybook rend les îlots avec Preact, comme la production (AD-7 : alias `react` et `react-dom` vers `preact/compat`).

## Alias

L'alias est défini une seule fois dans `config/preact-alias.mjs`. Il est lu par `astro.config.mjs`, `vitest.config.ts` et `.storybook/main.ts`. `tsconfig.json` ne peut pas importer ce fichier : ses `paths` et son `jsxImportSource` sont donc recopiés, et `src/islands/preact.test.tsx` échoue s'ils divergent.

Les îlots continuent d'importer depuis `react`. Le framework Storybook est `@storybook/preact-vite`.

## Barre d'outils, fixtures et tests

La barre d'outils propose le Thème (`data-theme`), la Langue FR/EN (`lang`) et deux largeurs, mobile 320 px et bureau. Les textes des stories viennent de `src/fixtures/ui-strings.ts`, typées sur `UiStrings` : aucune chaîne littérale dans une story. Pour ajouter un texte, déclarer sa clé dans `CleStory` et ses deux langues.

`npm run test:stories` exécute chaque story dans Chromium (addon-vitest) : il échoue sur une violation axe (`a11y.test: 'error'`) ou sur un défilement horizontal à 320 px. Il est séparé de `npm test` car il lance un navigateur ; son câblage dans la CI relève de la story 10.6.

## Compatibilité Preact des bibliothèques React-only

À compléter avant le premier usage d'une bibliothèque dans un îlot.

| Bibliothèque | Usage prévu           | Compatibilité Preact                                                                | Vérification                                         |
| ------------ | --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| ALTCHA       | formulaire de contact | widget en composant web (`altcha`), sans dépendance à React : compatible            | à confirmer par un test au premier usage             |
| Animation    | îlots animés (AD-7)   | animations de décor en CSS ; toute bibliothèque est chargée dans l'îlot qui l'exige | compatibilité `preact/compat` à vérifier avant usage |
