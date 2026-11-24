---
title: 'Story 3.3 : Sections Parcours, Compétences, Services et À propos'
type: 'feature'
created: '2026-11-23'
status: 'done'
baseline_commit: '7970f0d6003a87dbdc503186853c26469b54490a'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/design-system/components.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-3-2-hero-et-section-projets-cartes.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** après la 3.2, la Page d'accueil n'a que des squelettes vides pour Parcours et Compétences, et aucune Section Services ni À propos : Thomas (UJ-2) ne peut pas évaluer le profil sur la page.

**Approach:** quatre Sections rendues en HTML statique depuis Sanity, en FR et EN, dans l'ordre de l'ancien site : Parcours (`#journey`, frise et Cartes), Compétences (`#skills`, puces statiques), Services (`#services`, quatre Cartes de service), À propos (`#about`, portrait, paragraphes, localisation, CV). Compositions des primitives du kit, un `h2` par Section.

## Boundaries & Constraints

**Always:** aucun texte en dur ; tokens seulement ; `h2` par Section avec `aria-labelledby` ; ordre du DOM : Projets, Parcours, Compétences, Services, À propos, puis le squelette Contact (inchangé, 3.4) ; icônes en SVG inline via `lucide-static` (ISC), `aria-hidden`, jamais d'icône seule porteuse de sens ; puces de compétence : forme selon la famille (`hard` rectangle, `soft` pilule), teinte issue de `teinte` par token ; Cartes de service : `--service-1` à `--service-4`, texte `--service-text`.

**Decisions (2026-11-23, Léandro) :** `lucide-static` ajouté en dépendance ; À propos livre texte, portrait et CV, **sans carte Google Maps** (pas d'iframe tierce, localisation en texte). Décisions de planification : portrait copié de l'ancien site dans `src/assets/apropos/` (comme le Hero en 3.2), avec un champ `altPortrait` FR/EN ajouté à Sanity (schéma, types, migration, publication dans `dev`) ; CV copié tel quel dans `public/CV_Leandro_Da_Silva.pdf` (même adresse que l'ancien site, un seul fichier pour FR et EN), lien `download` dont le nom accessible annonce le téléchargement.

**Never:** puces déplaçables, bouton « Organiser » et son (épopée 6) ; animations d'entrée, rotations, zoom au survol ; Section Contact et pied de page (3.4) ; nouveaux liens dans le menu ; `client:*` ; toucher à `ancien-portfolio/` (copie en lecture seule seulement) ; toucher au dataset `production` ; commit ou push sans demande.

</frozen-after-approval>

## Code Map

- `src/components/Accueil.astro` -- remplace les squelettes `journey` et `skills` ; garde `contact`.
- `src/components/ProjetsSection.astro` -- modèle de composition (Section, SectionTitle, slots `highlight`/`subtitle`).
- `src/content/accueil.ts`, `src/content/localiser.ts` -- modèle de view-model (`trouver`, `texte`, `texteOptionnel`, lecture mémoïsée) ; ajouter un module `src/content/sections.ts` pour les quatre documents.
- `src/content/types.ts` -- types `SectionParcours`, `SectionCompetences`, `SectionServices`, `SectionAPropos` déjà générés ; régénérer pour `altPortrait`.
- `studio/schemaTypes/sectionAPropos.ts`, `src/migration/construire.ts` (l. 465-490) -- ajouter `altPortrait`.
- `src/components/ui/{Card,Tag,Badge,Sticker,Link,Button}.astro` -- primitives à réutiliser ; `design-system/tokens.css` (`--service-*`, couleurs de teinte).
- `src/components/Accueil.test.ts` -- test des Sections et axe ; étendre.
- `ancien-portfolio/src/components/sections/{Timeline,Skills,Services,About}.jsx`, `ancien-portfolio/image_0.webp`, `ancien-portfolio/CV_Leandro_Da_Silva.pdf` -- sources visuelles, lecture seule.

## Tasks & Acceptance

**Execution:**
- [x] `studio/schemaTypes/sectionAPropos.ts`, `src/migration/construire.ts`, `src/content/types.ts` -- champ `altPortrait` FR/EN, migration, typegen ; publier dans `dev` uniquement.
- [x] `src/content/sections.ts` (+ test) -- view-models des quatre Sections, une seule requête, erreur nommant le champ manquant.
- [x] `src/components/{Parcours,Competences,Services,APropos}Section.astro` -- composition des primitives ; frise en liste ordonnée sémantique, services en liste.
- [x] `src/assets/apropos/portrait.webp`, `public/CV_Leandro_Da_Silva.pdf` -- copies de l'ancien site.
- [x] `design-system/tokens.css` -- tokens manquants (frise, teintes, tailles) ; `package.json` -- `lucide-static`.
- [x] `src/components/Accueil.astro`, `src/components/Accueil.test.ts` -- brancher les Sections ; tests : titres h2, contenu sans JS, FR et EN, axe, aucun bouton ni `client:*` dans les Sections.

**Acceptance Criteria:**
- Given la Page d'accueil sans JavaScript, when je la consulte en FR ou EN, then Parcours, Compétences, Services et À propos sont lisibles dans le HTML, chacun sous un `h2`, sous l'unique `h1` du Hero.
- Given une famille de compétence, when elle est rendue, then la forme de la puce suit `hard`/`soft` et la teinte vient du contenu.
- Given le lien CV, when je le survole ou le focalise, then son nom accessible annonce un téléchargement et il atteint `/CV_Leandro_Da_Silva.pdf`.
- Given un texte absent en EN, when le site se construit, then le build échoue en nommant le champ.

## Implementation Notes

- Code : `src/content/sections.ts` (une requête, quatre view-models), `ParcoursSection`, `CompetencesSection`, `ServicesSection`, `AProposSection`, `Icone.astro` (dans `src/components/`, pas dans le kit : aide interne, SVG `lucide-static` en `?raw`, `aria-hidden`).
- Kit : `Button` gagne la prop `download`. Tokens ajoutés : `--skill-*`, `--skill-text`, `--size-icon-*`, `--size-service-badge`, `--size-skills-zone(-md)`, `--size-timeline-date`, `--opacity-watermark`.
- Contenu : `altPortrait` ajouté (Studio, migration, types par typegen), patché et publié dans `dev` (document `sectionAPropos`) ; `production` non touché.
- Écart à l'ancien site : la consigne « Glissez-déposez pour jouer ! » du sous-titre des Compétences n'est pas affichée, les puces n'étant pas déplaçables avant l'épopée 6 (test dédié). Pas de ligne verticale de frise ni d'inclinaison des Cartes ; pas d'animations.
- Non fait : stories Storybook des quatre Sections (à déférer comme en 3.1 et 3.2) ; build complet et rendu visuel non exécutés en local (pas de variables Sanity) ; Studio hébergé non redéployé.

## Spec Change Log

## Review Triage Log

Relecture faite en ligne par l'agent principal (pas de sous-agents lancés, aucune demande explicite). Aucun finding bloquant.

| Finding | Verdict | Preuve |
| --- | --- | --- |
| `Icone` placée dans le kit déclenchait les tests de couverture du kit | low, corrigé | déplacée dans `src/components/`, tests verts |
| `Button` sans prop `download` (erreur de typage) | low, corrigé | prop ajoutée, `astro check` à 0 erreur |
| Consigne « Glissez-déposez » affichée sans interaction | medium, corrigé | sous-titre des Compétences non rendu, test dédié, entrée dans `deferred-work.md` |

## Verification

**Commands:**
- `npm test`, `npm run lint`, `npm run typecheck` -- expected: verts

**Manual checks (if no CLI):**
- Parcourir les quatre Sections au clavier en FR et EN ; contrôler le rendu des trois Thèmes dans Storybook ou en local.
