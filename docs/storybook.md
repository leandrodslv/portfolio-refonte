# Storybook

Storybook rend les îlots avec Preact, comme la production (AD-7 : alias `react` et `react-dom` vers `preact/compat`).

## Alias

L'alias est défini une seule fois dans `config/preact-alias.mjs`. Il est lu par `astro.config.mjs`, `vitest.config.ts` et `.storybook/main.ts`. `tsconfig.json` ne peut pas importer ce fichier : ses `paths` et son `jsxImportSource` sont donc recopiés, et `src/islands/preact.test.tsx` échoue s'ils divergent.

Les îlots continuent d'importer depuis `react`. Le framework Storybook est `@storybook/preact-vite`.

## Compatibilité Preact des bibliothèques React-only

À compléter avant le premier usage d'une bibliothèque dans un îlot.

| Bibliothèque | Usage prévu           | Compatibilité Preact                                                                | Vérification                                         |
| ------------ | --------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| ALTCHA       | formulaire de contact | widget en composant web (`altcha`), sans dépendance à React : compatible            | à confirmer par un test au premier usage             |
| Animation    | îlots animés (AD-7)   | animations de décor en CSS ; toute bibliothèque est chargée dans l'îlot qui l'exige | compatibilité `preact/compat` à vérifier avant usage |
