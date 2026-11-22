# Ajustements visuels

Écarts entre la fidélité à l'ancien site et les critères d'accessibilité, **acceptés en attente de validation de Léandro** (FR-23, audit de la story 9.2). Décision de Léandro (2026-11-21) : le design reste identique à l'ancien site.

Chaque ligne cite `thème/paire` ; le test `src/components/ui/kit.test.ts` exige qu'un contraste inférieur à 4,5:1 figure ici.

## Contrastes

| Thème / paire | Constat | Décision |
| ------------- | ------- | -------- |

## Autres écarts conservés par fidélité

Ils ne sont pas mesurés par le test de contraste ; ils sont consignés pour l'audit manuel.

| Élément                                   | Constat                                                                                                    | Décision                                                           |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Badge de catégorie et étiquettes de carte | texte de 10 px et 9 px                                                                                     | Conservé (tokens `--text-2xs`, `--text-3xs`).                      |
| Sous-titres, étiquettes Terminal          | opacité 60 à 80 % (`--opacity-muted`, `--opacity-soft`, `--tag-opacity`) : contraste réduit                | Conservé ; les opacités passent à 1 avec `prefers-contrast: more`. |
| Survol du basculeur                       | fond `--color-yellow-soft` (jaune clair) dans les trois Thèmes, texte vert en Terminal                     | Conservé.                                                          |
| Focus                                     | contour de 3 px visible **seulement au clavier** (`:focus-visible`) : ajout non présent dans l'ancien site | Ajout nécessaire (WCAG 2.4.7), sans effet à la souris.             |

## Formulaires (story 11.3)

Aucun écart de contraste : repos, erreur et page sont à 4,5:1 ou plus sous les trois Thèmes (test `kit.test.ts`). L'état désactivé (`--opacity-disabled`) est exempté du critère de contraste (WCAG 1.4.3). Le rouge d'erreur (`--color-red-700`, `--color-red-300` sous Terminal), la case à cocher et la bordure en pointillés sont de nouveaux éléments : l'ancien site n'avait ni erreur ni case à cocher.
