---
title: 'Story 11.3 : Primitives de formulaire'
type: 'feature'
created: '2026-11-21'
status: 'done'
baseline_commit: 'db36eae336537a73462c42b5dc6cda4f4636f199'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-11-2-primitives-d-interface-astro.md'
  - '{project-root}/design-system/components.md'
  - '{project-root}/design-system/tokens.css'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** le formulaire de contact (story 7.2) n'a aucune primitive de saisie accessible : l'ancien site n'a ni erreur (il utilise `alert()`), ni état désactivé, ni case à cocher, ni aide reliée au champ.

**Approach:** livrer dans `src/components/ui/` trois primitives `.astro` sans JS client, construites comme celles de la story 11.2 (CSS à portée, tokens seulement) : `Field` (champ texte, e-mail ou zone de texte non redimensionnable), `Checkbox`, `FieldMessage` (aide et erreur). Le rendu au repos et au focus reste celui de l'ancien site ; l'erreur, le désactivé et la case à cocher sont les seuls ajouts. **Décision de Léandro : l'erreur est rouge**, via un token par Thème (`--error-color`, contraste ≥ 4,5:1 sur le fond de chaque Thème), toujours doublée d'un préfixe texte et d'une bordure en pointillés.

## Boundaries & Constraints

**Always:** étiquette visible et associée (`for`/`id`), jamais de placeholder en guise d'étiquette ; aide et erreur reliées par `aria-describedby` ; erreur dans une région `aria-live="polite"` présente dès le rendu (vide, puis remplie), `aria-invalid` sur le champ en erreur ; erreur jamais portée par la couleur seule (préfixe « Erreur : » fourni par prop, bordure en pointillés) ; textes par props ou slots (AD-3) ; aucune valeur de design littérale, tokens ajoutés à `tokens.css` avant usage (AD-6), valeurs de l'ancien site pour le repos et le focus (anneau jaune 4 px, `--nav-bg`, `--border-thick`, `--radius-xl`, `--shadow`) ; focus visible, cible ≥ 24 × 24 px ; `prefers-contrast`, `forced-colors`, `prefers-reduced-motion` ; étiquette, aide et erreur +30 % à 320 px et zoom 200 % sans masquer le champ ni défilement horizontal ; chaque primitive ajoutée à `components.md` (« livré ») ; contraste par Thème (repos, erreur, désactivé) vérifié dans `kit.test.ts`, écart éventuel consigné dans `docs/ajustements-visuels.md`.

**Never:** modifier `ancien-portfolio/` ; construire le formulaire de contact (story 7.2), ALTCHA ou une route serveur ; `alert()` ; `client:*` ou JS client ; Tailwind arbitraire ; committer ou pousser sans demande.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Champ complet | `id`, `label`, `help`, `error`, `type` | `<label for>`, `<input>` avec `aria-describedby` = aide + erreur | `label` ou `id` absent : erreur de type |
| Zone de texte | `multiline`, `rows` | `<textarea>` non redimensionnable | N/A |
| Erreur | `error` non vide | `aria-invalid="true"`, bordure en pointillés, région `aria-live` contenant préfixe + message | région vide sans `error` |
| Désactivé | `disabled` | attribut natif, opacité `--opacity-disabled`, aide conservée | N/A |
| Case à cocher | `id`, `label`, `error` | `<input type="checkbox">` + étiquette cliquable, erreur reliée | N/A |
| Texte long | libellés +30 % | passent à la ligne | N/A |

</frozen-after-approval>

## Code Map

- `design-system/components.md` -- entrée Champ (variantes, anneau jaune) ; ajouter Case à cocher et Message de champ, état « livré ».
- `design-system/tokens.css` -- ajouter `--error-color`, `--focus-ring-*` (anneau jaune 4 px, valeur de l'ancien site), `--field-*` par Thème ; ne rien changer à l'existant.
- `ancien-portfolio/src/components/sections/Contact.jsx` -- valeurs de référence (lecture seule).
- `src/components/ui/{Select,Button}.astro`, `rendu.ts`, `primitives.test.ts`, `kit.test.ts` -- modèles de structure, de rendu et de gardes.
- `docs/ajustements-visuels.md` -- écarts de contraste ; `docs/storybook.md` -- stories en 11.4.

## Tasks & Acceptance

**Execution:**
- [x] `design-system/tokens.css` -- tokens d'erreur, d'anneau de focus jaune et de champ, par Thème -- zéro littéral dans les composants
- [x] `src/components/ui/{Field,Checkbox,FieldMessage}.astro` -- primitives avec `<style>` à portée, props typées -- accessibilité et fidélité
- [x] `src/components/ui/forms.test.ts` -- rendu Container + axe, liaisons `aria-describedby`, région `aria-live`, matrice I/O -- AC tests
- [x] `src/components/ui/kit.test.ts` -- tokens cités, primitives dans `components.md`, contraste repos/erreur/désactivé par Thème -- gardes
- [x] `design-system/components.md`, `docs/ajustements-visuels.md` -- état « livré », écarts

**Acceptance Criteria:**
- Given les primitives champ, zone de texte, case à cocher et message, when elles sont rendues, then chaque champ a une étiquette visible associée, l'aide et l'erreur reliées par `aria-describedby`, et aucun placeholder ne remplace l'étiquette.
- Given un champ en erreur, when l'erreur s'affiche, then elle passe par une région `aria-live`, sans `alert()`, et se distingue sans la couleur (préfixe, pointillés).
- Given chaque champ sous Pop, Terminal et Wireframe, en repos, focus, erreur et désactivé, then contraste ≥ 4,5:1 ou écart consigné, et focus visible.
- Given `npm test`, `npm run lint` et `npm run typecheck`, then ils passent.

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck` -- expected: verts
- `git status --short ancien-portfolio` -- expected: aucune sortie

## Implementation Notes

Trois primitives dans `src/components/ui/` (Field, Checkbox, FieldMessage), tokens `--error-color` (par Thème), `--color-red-700`, `--color-red-300`, `--color-yellow-ring`, `--field-ring-shadow`, tests `forms.test.ts` et paires de contraste (champ, erreur) dans `kit.test.ts`. `errorPrefix` est une prop obligatoire ; `requiredMark` (texte fourni par l'appelant) signale un champ obligatoire. Après revue : 338 tests verts, lint, typecheck et format sans erreur ; `ancien-portfolio/` intact.

## Review Triage Log

| Finding | Verdict | Route | Evidence / suite |
| --- | --- | --- | --- |
| Préfixe « Erreur : » affiché sans erreur quand `errorPrefix` est fourni (3 relecteurs, reproduit) | high | patch | contenu décidé sur le slot rendu, préfixe seulement si `error` ; tests Field et Checkbox |
| Région d'erreur vide masquée par `display: none` (sortie de l'arbre d'accessibilité) | medium | patch | réduite visuellement (token `--size-visually-hidden`), parent positionné |
| Contour d'erreur de la case à cocher remplace le contour de focus | medium | patch | règle `[aria-invalid]:focus-visible` |
| `...attrs` écrase `aria-describedby`, `aria-invalid`, `type` | medium | patch | `attrs` étalés avant les valeurs calculées ; prop `autocomplete` ; test |
| Champ obligatoire sans marque perceptible | medium | patch | prop `requiredMark` (texte de l'appelant), test |
| `errorPrefix` facultatif contredit « toujours doublée d'un préfixe » | medium | patch | prop obligatoire |
| Entrées `components.md` pour Case à cocher et Message de champ | medium | patch | entrées ajoutées |
| Checkbox checked/disabled/required/aide, aide d'un champ désactivé non assertés | medium | patch | tests ajoutés |
| `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` absents des composants | false | rejeté | durées et opacités passent par des tokens réinitialisés dans `tokens.css` ; contour et style de bordure survivent en `forced-colors` |
| Contraste de l'anneau jaune et de la bordure (1.4.11), aide à opacité réduite | low | rejeté | l'anneau double un contour `--focus-color` ; hors périmètre, aucun écart de texte |
| Couleur du placeholder | low | rejeté | prop facultative, jamais une étiquette ; rendu de l'ancien site conservé |
| `rows` invalide, `id` ou `label` vides à l'exécution | low | rejeté | erreur de type à la compilation, risque improbable |
| Paire de contraste « désactivé » absente | low | rejeté | exempté (WCAG 1.4.3), documenté |
| Gardes `kit.test.ts` (tokens, `components.md`) jugés absents | false | rejeté | `it.each(composants)` couvre les nouveaux `.astro` |
| Préfixe absent d'une erreur injectée côté client | low | rejeté | à la charge de l'îlot du formulaire (story 7.2), noté dans la spec 7.2 |
| 320 px et zoom 200 % non testés | low | rejeté | pas de rendu navigateur ici ; stories en 11.4 |
