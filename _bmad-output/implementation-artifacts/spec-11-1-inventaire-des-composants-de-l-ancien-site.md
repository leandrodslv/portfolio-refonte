---
title: 'Story 11.1 : Inventaire des composants de l''ancien site'
type: 'chore'
created: '2026-11-20'
status: 'done'
baseline_commit: 'e90f03c17036d8385e08c79bada999c938699ce9'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-11-context.md'
  - '{project-root}/design-system/tokens.css'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** le kit d'interface (stories 11.2 et 11.3) n'a pas de référence écrite de ce que l'ancien site contient : primitives, variantes, états, échelles, points de rupture. Sans elle, les épopées 3, 5 et 7 recréeraient chacune leurs composants.

**Approach:** produire `design-system/components.md`, source de vérité de l'inventaire, relevée dans `ancien-portfolio/src` (lecture seule) et rapprochée de `tokens.css`, sans rien ajouter à `tokens.css` ; les écarts sont listés pour validation de Léandro. Aucun composant n'est codé.

## Boundaries & Constraints

**Always:** chaque entrée cite son fichier source de l'ancien site ; primitives attendues : bouton, lien, carte, badge, étiquette, titre de Section, conteneur, sélecteur, champ ; pour chacune : variantes, états (repos, survol, focus, actif, désactivé), tokens par Thème, chemin `.astro` prévu (`src/components/ui/`), lien Figma (maquette `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio`, cadre « atomic design » `1:908`) ou « aucun composant Figma identifié » ; échelles typographique et d'espacement nommées avec correspondance `tokens.css` ; points de rupture, règle de passage et effet par primitive ; motifs uniques (Marquee, carte à gratter, curseur, confettis) marqués « hors kit » avec l'épopée cible (5 ou 6) ; liste d'écarts avec `tokens.css` (valeurs absentes, états sans équivalent) sous forme de tableau à valider ; `design-system/README.md` renvoie vers `components.md` à la place de l'étape « Inventaire des composants ». Contenu en français.

**Never:** modifier ou supprimer quoi que ce soit dans `ancien-portfolio/` (NFR-6) ; ajouter ou changer un token dans `tokens.css` (AD-6, validation préalable de Léandro) ; coder une primitive `.astro` (story 11.2) ; intégrer un motif « hors kit » ; committer ou pousser.

</frozen-after-approval>

## Code Map

- `ancien-portfolio/src/styles/theme.js` -- `themeConfig` : classes par Thème (boutons, tag, sticker, cartes, accents, closeBtn).
- `ancien-portfolio/src/components/UI/ProjectComponents.jsx` -- `ProjectCard` : carte, badge catégorie, étiquettes, bouton secondaire.
- `ancien-portfolio/src/components/UI/InteractiveElements.jsx` -- `CustomLangSelector` (sélecteur) ; `Confetti`, `CursorFollower`, `Marquee` (hors kit).
- `ancien-portfolio/src/components/UI/{FlipCard,ScratchCard,ProjectModal,StandardProjectModal,GraphicDesignModal,CreationDetail}.jsx` -- motifs de Fenêtre de projet et de carte (épopée 5) ; à classer, boutons de fermeture à relever.
- `ancien-portfolio/src/components/sections/*.jsx` (Navbar, Hero, Work, Timeline, Skills, Services, About, Contact, Footer) -- liens, titres de Section, conteneurs, champs du formulaire de contact, media queries (`md:` 161 usages, `lg:` 54, `sm:` 8, `xl:` 2).
- `ancien-portfolio/src/App.jsx` -- conteneur global, bascule de Thème.
- `design-system/tokens.css` -- primitives et tokens sémantiques ; breakpoints `--bp-*` documentaires seulement ; référence de rapprochement.
- `design-system/README.md` -- ligne « À faire ensuite 1 » à remplacer par un renvoi.
- `src/components/` -- aucune primitive existante (seuls `RobotsMeta`, `EssaiContenu`) ; ne pas toucher.

## Tasks & Acceptance

**Execution:**
- [x] `design-system/components.md` -- créer : une entrée par primitive (nom, variantes, états, tokens par Thème, source ancienne, chemin `.astro`, Figma) ; sections « Hors kit », « Échelle typographique », « Échelle d'espacement », « Points de rupture », « Écarts à valider par Léandro » -- source de vérité de 11.2 à 11.4
- [x] `design-system/README.md` -- remplacer l'étape « Inventaire des composants » par un renvoi vers `components.md`
- [x] `src/design-system.test.ts` (même convention que `src/ci.test.ts`, repris par `vitest.config.ts`) -- test : `components.md` contient chaque primitive attendue, chaque entrée cite un chemin `ancien-portfolio/src/...` qui existe, et chaque token cité (`--xxx`) existe dans `tokens.css` ou figure dans les écarts ; test : `ancien-portfolio/` sans modification (`git diff --quiet`) -- empêche la dérive de l'inventaire

**Acceptance Criteria:**
- Given `design-system/components.md`, when je le lis, then chaque primitive attendue y figure avec variantes, états, tokens par Thème et fichier source cité.
- Given un motif propre à un seul endroit, when je classe l'inventaire, then il est « hors kit » et renvoyé à l'épopée 5 ou 6.
- Given une valeur de l'ancien site absente de `tokens.css`, when je dresse les écarts, then elle est listée pour validation et `tokens.css` reste inchangé.
- Given les tailles, interlignes, graisses, espacements et media queries relevés, when je lis `components.md`, then les échelles nommées et les points de rupture avec leur règle de passage y sont.
- Given `git status`, when je compare, then `ancien-portfolio/` et `tokens.css` n'ont aucun changement.

## Implementation Notes

Fichiers : `design-system/components.md`, `design-system/README.md`, `src/design-system.test.ts`. Le test « ancien-portfolio intact » (task 3) est retiré après revue : le dossier est ignoré par git, il ne pouvait rien détecter ; `ancien-portfolio/` n'a pas été touché. Vérifications finales : `npm test` 219 verts, lint et typecheck sans erreur.

## Verification

**Commands:**
- `npm test` -- expected: vert, y compris le test de l'inventaire
- `npm run lint` -- expected: sans erreur
- `npm run typecheck` -- expected: sans erreur
- `git status --short ancien-portfolio design-system/tokens.css` -- expected: aucune sortie

**Manual checks (if no CLI):**
- Léandro relit la liste « Écarts à valider » avant tout ajout de token (story 11.2).

## Review Triage Log

| Finding | Verdict | Route | Evidence / suite |
| --- | --- | --- | --- |
| Test « ancien-portfolio intact » vide de sens (dossier ignoré par git, aucun fichier suivi) ; échoue aussi sans `.git` | high | patch | `git check-ignore` confirme `.gitignore:16` ; test supprimé, garantie NFR-6 portée par l'absence de toute écriture dans le dossier |
| Autocollant absent de la liste de primitives du test (3 relecteurs) | medium | patch | ajouté à la liste |
| Table Bouton : tokens par Thème incomplets ; états absents pour Lien/Conteneur/Titre/Badge | medium | patch | table et paragraphe « Par Thème » ajoutés, « sans objet » explicité |
| Figma par primitive absent | medium | patch | ligne « Figma » ajoutée à chaque primitive, `node-id=1-908` |
| Écarts d'accessibilité omis (cibles 24 px, contrastes, mouvement réduit) | medium | patch | écarts 15 à 17 ajoutés |
| Écart 7 mêle 9-10 px et `14vw` | low | patch | scindé en 7 et 7b |
| Incohérences internes (marges Conteneur, titre 3xl/4xl, `px-1.5`, Fermeture) | medium | patch | corrigées, écart 18 ajouté |
| Comptes d'usage non reproductibles | low | patch | mention du relevé daté par `grep -o` |
| Sections composées, pastille, découpage 11.2 / 11.3 manquants | low | patch | ligne « Hors kit » et ligne « Livraison » ajoutées |
| Textes en dur et noms accessibles de la barre (écart 14) incomplets | low | patch | complété |
| Sources du test (garde `indexOf` = -1) | low | patch | garde sur les titres ajoutée |
| Durcissement du test (jetons absents, commentaires CSS, point final, glob, lignes hors kit) | low | rejeté | correction non triviale pour un risque improbable |
| `tokens.css` inchangé non testé | low | rejeté | l'ajout légitime d'un token en 11.2 ferait échouer le test |
| Marquee renvoyé à « non migré » et non à une épopée | false | rejeté | la story exclut Marquee (CLAUDE.md) ; l'inventaire le dit |
