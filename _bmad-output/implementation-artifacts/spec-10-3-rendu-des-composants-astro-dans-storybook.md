---
title: 'Rendu des composants .astro dans Storybook'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: 'eab141cc41bb6bc0c15b4dd810e2a57009f0205c'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-10-context.md'
  - '{project-root}/docs/storybook.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `@storybook/preact-vite` ne rend pas les fichiers `.astro` : les composants statiques (AD-1) sont absents du catalogue, et aucune décision d'architecture ne dit comment les y mettre.

**Approach:** décision de Léandro : HTML pré-rendu par l'API Container d'Astro. Un plugin Vite dans `.storybook/` charge `X.astro?html` en rendant le composant dans un serveur Vite autonome configuré par `getViteConfig`, et la story affiche le HTML obtenu. La décision est consignée dans le spine comme nouvel AD, avec les trois options comparées, coût, maintenance et licence.

## Boundaries & Constraints

**Always:** solution gratuite et open source, aucune dépendance ajoutée ; aucun JavaScript client ajouté au Site (budget JS inchangé) ; story visible sous pop, terminal et wireframe ; les textes de story viennent des fixtures ; aucune valeur de design en dur dans `.storybook/` ; le framework Preact reste `@storybook/preact-vite`.

**Never:** adopter le paquet `storybook-astro` ni les captures du HTML construit (options écartées, à motiver dans l'AD) ; passer des props aux composants (hors périmètre, aucun composant réel n'en demande encore) ; modifier le comportement de `RobotsMeta.astro` ; anticiper la 10.5.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Rendu | import `RobotsMeta.astro?html` | chaîne HTML du composant | N/A |
| Composant invisible | `<meta>` sans rendu visuel | la story affiche le HTML produit en texte | N/A |
| Fichier absent | import d'un `.astro` inexistant | build Storybook en erreur explicite | message nommant le fichier |
| Fin de session | arrêt de Storybook ou fin du build | serveur Vite autonome fermé | pas de processus resté ouvert |

</frozen-after-approval>

## Code Map

- `.storybook/main.ts` -- `viteFinal` : ajouter le plugin
- `.storybook/astro-html.ts` -- à créer : plugin Vite ; serveur `createServer` avec `getViteConfig`, `ssrLoadModule('astro/container')`, `renderToString`
- `src/components/RobotsMeta.astro` -- premier composant ; le test existant `RobotsMeta.test.ts` montre l'usage du Container
- `src/components/RobotsMeta.stories.tsx` -- à créer
- `src/env.d.ts` ou déclaration locale -- type du module `*.astro?html` (chaîne)
- `_bmad-output/planning-artifacts/architecture/architecture-refonte portfolio-2026-11-19/ARCHITECTURE-SPINE.md` -- nouvel AD-19 après AD-18, et ligne de la table de correspondance si elle existe
- `docs/storybook.md` -- marche à suivre pour un composant `.astro`

## Tasks & Acceptance

**Execution:**
- [x] `.storybook/astro-html.ts`, `.storybook/main.ts` -- plugin de rendu HTML des `.astro`, fermeture propre du serveur -- décision de Léandro
- [x] `src/components/RobotsMeta.stories.tsx` -- story affichant le HTML rendu, sous les trois Thèmes -- premier composant statique
- [x] `ARCHITECTURE-SPINE.md` -- AD-19 : trois options, choix, coût, maintenance, licence, limites (rendu statique, pas de props) -- exigé par la story
- [x] `src/components/astro-storybook.test.ts` -- tests : le plugin rend `RobotsMeta` en `<meta name="robots" content="noindex">`, fichier absent en erreur nommée, l'AD-19 est présent dans le spine
- [x] `docs/storybook.md` -- ajouter un composant `.astro` à Storybook

**Acceptance Criteria:**
- Given `RobotsMeta.astro`, when j'ouvre sa story, then le HTML rendu s'affiche et le test de story (`npm run test:stories`) passe sous les trois Thèmes.
- Given le Site construit, when `npm run build` et le budget JS tournent, then le JavaScript initial est inchangé.
- Given le spine, when je lis AD-19, then les trois options, la décision, le coût, la maintenance et la licence y figurent.

## Implementation Notes

- Plugin `.storybook/astro-html.ts` (module `\0astro-html:` + `rendreAstro`, `fermerRendu`) ; type `*.astro?html` déclaré dans `src/env.d.ts` ; story `src/components/RobotsMeta.stories.tsx` ; AD-19 ajouté au spine ; section `.astro` dans `docs/storybook.md`.
- Le plugin est aussi pris en compte par `test:stories` (via `viteFinal`) : la story passe.
- Aucune dépendance ajoutée, aucun fichier du Site modifié : budget JS inchangé par construction (`npm run build` local impossible sans les variables Sanity, identique sans cette story ; budget JS vérifié par la CI).

## Spec Change Log

## Review Triage Log

Revue indépendante par sous-agents non lancée (refus de sous-agents). Auto-revue :

| Constat | Verdict | Preuve |
| ------- | ------- | ------ |
| Message `transport was disconnected` à la fermeture du serveur Vite | maybe-false | `fermerRendu` capte l'erreur de fermeture ; aucun échec observé en tests ni en build Storybook |
| Pas de props ni de variante production pour `RobotsMeta` | low | limite assumée dans l'AD-19 |

## Design Notes

Essai fait en investigation : `createServer(getViteConfig(...))` puis `ssrLoadModule('astro/container')` rend `RobotsMeta` en `<meta name="robots" content="noindex">` hors Vitest. Un message `transport was disconnected` est apparu à la fermeture : à traiter (fermer l'environnement avant le serveur) ou à documenter s'il est inoffensif.

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck` -- expected: verts
- `npm run build-storybook && npm run test:stories` -- expected: verts
- `npm run build` -- expected: réussi, budget JS inchangé

**Manual checks:**
- Storybook : la story RobotsMeta s'affiche et suit le Thème choisi.
