---
title: 'Thèmes, Langues et accessibilité dans la barre d’outils'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '31b7a3e0a8fdd61df8bd6096e9f01b4e879a6400'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-10-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** la barre d'outils de Storybook ne propose que le Thème ; pas de Langue, pas de largeur d'écran, des textes de story écrits en dur, et `a11y.test: 'error'` ne fait rien faute d'exécuteur : aucun test ne peut échouer sur une violation axe.

**Approach:** ajouter les globals Langue (FR/EN, `lang` du document) et largeur (mobile 320 px, bureau) ; fournir des fixtures typées sur `UiStrings` dont les stories tirent leurs textes ; brancher `@storybook/addon-vitest` pour que chaque story soit un test, a11y en échec, dans un script `test:stories` séparé de `npm test`.

## Boundaries & Constraints

**Always:** `data-theme` posé sur `<html>` ; tokens de `design-system/tokens.css` seuls (aucune couleur, ombre, bordure ni durée dans `.storybook/`) ; textes des stories issus des fixtures, jamais de chaîne littérale ; types réutilisés depuis `src/content/types.ts`, pas de redéfinition ; dépendances gratuites et open source ; `npm test`, `lint`, `typecheck`, `build-storybook` verts.

**Never:** modifier `ancien-portfolio/` ; brancher `test:stories` dans la CI (story 10.6) ; rendre des `.astro` (10.3) ; ajouter des stories pour d'autres composants (10.5) ; toucher à Sanity ou appeler le réseau.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Thème | choix pop, terminal ou wireframe | `data-theme` suit sur `<html>` | N/A |
| Langue | choix FR ou EN | `lang` du document suit ; la story affiche le texte de la fixture de cette langue | clé de fixture absente : erreur de typage |
| Largeur | mobile 320 px | aucun défilement horizontal | le test de la story échoue |
| Violation axe | état à contraste insuffisant ou nom manquant | le test de la story échoue | N/A |

</frozen-after-approval>

## Code Map

- `.storybook/preview.ts` -- `withTheme` existant ; y ajouter global `locale`, décorateur `lang`, viewports, `a11y.test: 'error'` conservé
- `.storybook/main.ts` -- ajouter `@storybook/addon-vitest`
- `src/content/types.ts` -- `UiStrings`, `LocalizedString` à réutiliser (fichier généré : ne pas modifier)
- `src/lib/localizedPath.ts` -- type `Locale` à réutiliser
- `src/islands/StatusMessage.stories.tsx` -- textes écrits en dur à remplacer par les fixtures
- `vitest.config.ts` -- unitaire inchangé ; le projet stories vit à part
- `package.json` -- `@storybook/addon-vitest`, `@vitest/browser`, `@vitest/browser-playwright` (dev) ; script `test:stories` ; Chromium Playwright déjà installé

## Tasks & Acceptance

**Execution:**
- [x] `src/fixtures/ui-strings.ts` -- fixtures typées sur `UiStrings` + aide `texte(locale, cle)` -- source unique des textes de stories
- [x] `.storybook/preview.ts` -- globals Langue et largeur, décorateurs `lang` et `data-theme`
- [x] `.storybook/main.ts`, `package.json`, `vitest.stories.config.ts` -- addon-vitest, projet navigateur Chromium, script `test:stories`
- [x] `src/islands/StatusMessage.stories.tsx` -- textes via fixtures, une story par Langue
- [x] `src/islands/storybook-config.test.ts` -- garde : aucune valeur de design dans `.storybook/`, globals présents, fixtures FR et EN non vides
- [x] `docs/storybook.md` -- barre d'outils, fixtures, `npm run test:stories`

**Acceptance Criteria:**
- Given la barre d'outils, when je change Thème ou Langue, then `data-theme` et `lang` suivent sur `<html>`.
- Given la fenêtre mobile 320 px, when une story s'affiche, then `scrollWidth` n'excède pas `clientWidth`.
- Given un état qui viole axe (essai temporaire), when `npm run test:stories` tourne, then il échoue.
- Given `.storybook/`, when on cherche couleurs, ombres, bordures ou durées littérales, then il n'y en a aucune.

## Implementation Notes

- Ajouts : `src/fixtures/ui-strings.ts`, `vitest.stories.config.ts`, script `test:stories`, `src/islands/storybook-config.test.ts`, dépendances `@storybook/addon-vitest`, `@vitest/browser`, `@vitest/browser-playwright`.
- `setProjectAnnotations` inutile : addon-vitest applique `preview.ts` seul (Storybook ≥ 10.3).
- Vérifié par essais temporaires (supprimés) : une `<img>` sans alt fait échouer `test:stories` (`image-alt`) ; un bloc de 900 px fait échouer le contrôle de défilement horizontal à 320 px.
- Avertissement bénin à l'exécution : `@storybook/react-dom-shim` absent de `optimizeDeps` ; sans effet sur les résultats.

## Spec Change Log

## Review Triage Log

Revue indépendante par sous-agents non lancée (refus de sous-agents). Auto-revue :

| Constat | Verdict | Preuve |
| ------- | ------- | ------ |
| La garde « aucune valeur de design » est une regex, contournable | low | filet de sécurité ; `.storybook/` ne contient que de la configuration |
| `test:stories` hors CI | low | décidé : câblage en story 10.6 |

## Design Notes

Choix posés sans question : fixtures sous `src/fixtures/` ; `test:stories` séparé de `npm test` (navigateur, plus lent) ; câblage CI laissé à la 10.6 ; largeurs mobile 320 et bureau 1440 en viewports natifs Storybook.

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck` -- expected: verts
- `npm run build-storybook` -- expected: build réussi
- `npm run test:stories` -- expected: stories vertes ; rouge avec une violation axe injectée

**Manual checks:**
- Ouvrir Storybook : Thème, Langue et largeur changent `data-theme`, `lang` et la fenêtre.
