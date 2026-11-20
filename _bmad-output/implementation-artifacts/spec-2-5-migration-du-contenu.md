---
title: 'Story 2.5 : Migration du Contenu à l''identique'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '3c7daf17eb96814fb191420b821759ba68ecb03b'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-2-modele-des-projets.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-3-modele-des-autres-sections.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Le Contenu actuel vit dans le code de `ancien-portfolio/` ; le Studio est vide. Tant qu'il n'y est pas, aucune Page d'accueil ne peut être pilotée par Sanity ni comparée à l'ancienne (FR-2).

**Approach:** Un script lit `ancien-portfolio/` (lecture seule), produit un fichier d'import Sanity (documents et chemins d'images) pour les langues FR et EN, et un test de comparaison, ajouté à la CI, prouve qu'aucun texte n'est modifié. Léandro importe le fichier dans `dev` avec la CLI Sanity.

## Boundaries & Constraints

**Always:**
- `ancien-portfolio/` n'est jamais modifié. Le script n'écrit que dans un dossier de sortie ignoré par git et ne touche aucun réseau ni aucun jeton.
- Seuls `fr` et `en` sont migrés. Sont exclus : les neuf autres langues, `marquee`, `footer.legal` (mentions légales, story à venir), le bouton GitHub factice du premier Projet (`votre-pseudo/votre-repo`, `your-repo` en EN).
- Identifiants déterministes (singletons à id fixe, Projets `project-<slug>`) : l'import se rejoue sans doublon (`--replace`).
- Quatre Projets existent dans l'ancien site (ids 1, 2, 4, 5), pas cinq comme l'écrit la story ; leurs trois Sous-projets (Studapp, Good Pizza, Capitaine Scout) sont migrés dans le premier. La divergence est consignée, rien n'est inventé.
- **Textes :** chaque valeur FR et EN est reprise telle quelle. Seules exceptions, listées et testées : `<br />` du pied de page devient un saut de ligne, et la séquence littérale `\n` (barre oblique et n, défaut de saisie de l'EN pour Studapp et Capitaine Scout) devient un vrai saut de ligne.
- **`fullDescription`** va dans `descriptionDetaillee` pour les quatre Projets, sans découpage : l'EN n'a ni défi ni concept pour Belote Kart. Pour un Sous-projet, « Le défi : … » et « Le concept : … » (EN : « The challenge: … », « The concept: … ») sont coupés avant le second libellé, libellés conservés dans `defi` et `concept`.
- Textes alternatifs : règle de l'ancien site reproduite (couverture : titre du Projet ; galerie : « titre - n » ; galerie de Sous-projet : « titre du Sous-projet - n » ; galerie Graphisme : titre de l'image) ; les calques sont sans alt.
- Le Studio est étendu : `imageInformative` reçoit des champs facultatifs titre, catégorie, logiciel, brief, explication (localisés) et `paysage` (booléen), pour migrer les 17 images de la galerie Graphisme ; `src/content/types.ts` est régénéré. Les titre, catégorie et logiciel, non traduits dans l'ancien site, reçoivent la même chaîne en FR et EN.
- **Étiquettes sans pendant** (Audiovisuel : FR « Lumière » seul ; Graphisme : EN « Lightroom » seul) : gardées dans les deux langues, le texte existant étant repris tel quel pour l'autre langue, sans traduction inventée. Décision de Léandro.
- Correspondances de couleur : `colorKey` `accent3` devient `accent-3`, etc. Gabarit : id 5 `graphisme`, les autres `standard`. Ordre : 1 à 4 selon l'ancien ordre.
- Documents migrés : `siteSettings`, `hero`, `footer` (sans `legal`), les six Sections (en-têtes, Parcours, Compétences, services, À propos), `uiStrings` pour les seules clés qui ont un équivalent dans l'ancien site, les quatre Projets. Teintes de compétences : `bg-pink-300` devient `pink`, etc.
- Le test lit l'ancien site et le fichier produit, compare chaque texte FR et EN, vérifie que chaque chaîne de l'ancien site est soit couverte soit listée comme exclue, et que chaque fichier image référencé existe. Il tourne dans `npm test`, donc dans la CI, sans réseau.

**Never:**
- Aucune écriture dans un dataset par l'agent, aucun jeton manipulé, aucune modification de `ancien-portfolio/`.
- Pas de nouvelle formulation, pas de traduction ajoutée, pas de correction de texte hors des deux exceptions.
- Pas de webhook ni de promotion en production (2.6), pas de composant, pas de lecture des singletons côté Site (épopée 3).
- Les clés `uiStrings` sans équivalent dans l'ancien site (ALTCHA, page 404, erreurs de formulaire, thèmes, sélecteurs) restent vides : textes nouveaux, à rédiger ; consignés.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Texte simple | `hero.title1` FR et EN | identique dans le document `hero` | N/A |
| Bouton factice | Projet 1, `githubLink` | absent du document ; `figmaLink` conservé | N/A |
| Sous-projet | description « Le défi : A\n\nLe concept : B » | `defi` = « Le défi : A », `concept` = « Le concept : B » | échec si le libellé du concept manque |
| Séquence `\n` littérale | EN Studapp | vrai saut de ligne, reste inchangé | N/A |
| Pied de page | `bio` avec `<br />` | saut de ligne, aucun autre changement | N/A |
| Langue exclue | `es`, `marquee`, `footer.legal` | absents de la sortie | le test échoue si présents |
| Galerie Graphisme | 17 éléments avec brief, explication, tag | 17 images avec leurs champs FR et EN (la galerie de 19 images est celle de Studapp) | échec si le compte diffère |
| Image absente | chemin inexistant dans `public/` | N/A | le test échoue en nommant le fichier |
| Rejeu | même fichier importé deux fois | mêmes documents, aucun doublon | N/A |
| Chaîne non couverte | nouvelle chaîne dans l'ancien site | N/A | le test échoue en la nommant |

</frozen-after-approval>

## Code Map

- `ancien-portfolio/src/data/translations/{fr,en}.js`, `galleries.js`, `graphicGallery.js`, `content.js` -- lecture seule ; imports sans extension, à charger par Vite (Vitest), pas par Node nu
- `ancien-portfolio/public/` -- sources des images (`creations`, `belote`, `studapp`, `Yummy Nouilles`, `capitainescout`) ; chemins avec espaces et accents
- `ancien-portfolio/index.html` -- titre, description et URL LinkedIn pour `siteSettings`
- `studio/schemaTypes/imageInformative.ts` -- à étendre (champs facultatifs) ; `studio/lib/` pour la validation
- `studio/schemaTypes/{hero,footer,sectionParcours,sectionCompetences,sectionServices,sectionAPropos,sectionProjets,sectionContact,siteSettings,uiStrings,project,sousProjet,lien}.ts` -- formes cibles
- `studio/lib/catalogueUiStrings.ts` -- clés `uiStrings` ; table de correspondance avec les libellés `ui`, `nav`, `contact` de l'ancien site
- `src/content/types.ts` -- à régénérer (`cd studio && npm run typegen`)
- `src/studio-projet.test.ts`, `src/content/projets.test.ts` -- modèles de test ; jamais `new RegExp` avec une variable (Semgrep)
- `tsconfig.json`, `eslint.config.js` -- `ancien-portfolio` exclu du typecheck ; le nouveau code ne l'importe qu'à l'exécution
- `.gitignore`, `package.json`, `docs/exploitation.md` -- dossier de sortie, script `migrer:contenu`, procédure d'import

## Tasks & Acceptance

**Execution:**
- [x] `studio/schemaTypes/imageInformative.ts`, `src/content/types.ts` -- champs facultatifs de la galerie Graphisme, types régénérés -- AC 1
- [x] `src/migration/` -- fonctions pures : lecture normalisée de l'ancien site, construction des documents, découpe des Sous-projets, exceptions de texte -- AC 1, 2
- [x] `scripts/migrer-contenu` + `package.json` -- produit le fichier d'import dans un dossier ignoré -- AC 1
- [x] `src/migration/*.test.ts` -- matrice, comparaison FR et EN, couverture des chaînes, fichiers images, exclusions -- AC 3
- [x] `docs/exploitation.md`, `.gitignore` -- commande d'import (`sanity dataset import … dev --replace`), clés `uiStrings` à rédiger -- AC 1
- [ ] Vérification dans `dev` après l'import par Léandro : comptes de documents et de galeries lus par le connecteur Sanity -- AC 1 (à faire après l'import)

**Acceptance Criteria:**
- Given `ancien-portfolio/` en lecture seule, when le script s'exécute puis que Léandro importe le fichier dans `dev`, then les quatre Projets, leurs trois Sous-projets, les galeries (dont les 17 images Graphisme et les 19 de Studapp), le Parcours, les Compétences, les services et À propos existent dans le Studio, sans les neuf autres langues ni `Marquee`.
- Given le premier Projet, when il est migré, then son bouton GitHub factice est retiré et le reste est intact.
- Given le texte de l'ancien site et celui du contenu migré, when le test de comparaison s'exécute, then il ne montre aucune différence en FR et en EN, hors les deux exceptions listées, et il tourne dans la CI.

## Implementation Notes

- Implémenté directement, sans sous-agent. Nouveaux : `src/migration/{lecture,ancien,construire,tableUiStrings,sortie}.ts`, `src/migration/migration.test.ts` (20 tests), `scripts/migrer-contenu.mjs`, script `migrer:contenu`, dossier ignoré `migration-sortie/`. Schéma : `imageInformative` étendu (titre, catégorie, logiciel, brief, explication, paysage), types régénérés.
- Sortie : 14 documents, 86 références d'images (4 couvertures, 7 Belote Kart, 38 Studapp, 6 Good Pizza, 14 Capitaine Scout, 17 Graphisme). Le script charge l'ancien site par Vite (ses imports n'ont pas d'extension).
- Écarts assumés, tous signalés à Léandro : quatre Projets et non cinq ; galerie Graphisme de 17 images et non 19 (Studapp en compte 19) ; deux étiquettes sans pendant gardées dans les deux langues ; lien vidéo factice d'Audiovisuel (`VOTRE_LIEN_ICI_2`) retiré en plus du bouton GitHub ; titre de carte EN de Belote Kart repris du titre (`Programming`), car le FR a un titre de carte et pas l'EN ; `siteSettings` migré en FR seulement (l'ancien site n'a pas de titre ni de description EN), avec l'adresse LinkedIn générique de l'ancien site.
- `uiStrings` : 42 clés migrées ; les clés sans équivalent restent à rédiger. `ui.about`, `ui.seeMore`, `ui.source` et `label` (jamais affichés ou remplacés) sont exclus, avec leur raison dans le test.
- Correctif après la CI de la PR : `ancien-portfolio/` est ignoré par git, la CI ne l'a pas. Le texte de l'ancien site est extrait dans `src/migration/ancien.json` (committé) par `npm run extraire:ancien` ; le test de comparaison et le script lisent ce fichier. Contrôle local `ancien.json est à jour` et existence des images ne tournent que si `ancien-portfolio/` est présent (2 tests ignorés en CI).
- Non vérifié : l'import réel dans `dev` (action de Léandro) et son effet dans le Studio.
- 172 tests, lint, format et typecheck verts, `tsc` du Studio vert.

## Spec Change Log

- Constat de l'implémentation : la galerie Graphisme compte 17 images, pas 19 (Studapp en compte 19). Ligne de matrice et compte corrigés avec l'accord de Léandro avant tout code. Étiquettes sans pendant : décision de Léandro ajoutée au bloc de contraintes.

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en 2.1 à 2.4).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| Étiquettes FR et EN de longueurs différentes (Audiovisuel, Graphisme) : le modèle associe une paire | medium | intent_gap | résolu par Léandro : gardées dans les deux langues, texte repris tel quel |
| Galerie Graphisme à 17 images, la spec disait 19 | medium | intent_gap | résolu par Léandro : 17 + 19 ; matrice corrigée |
| Lien vidéo factice d'Audiovisuel non mentionné par la spec | low | patch | retiré comme le bouton GitHub factice ; filtré dans `liens`, testé |
| `fit: 'contain'` du logo non migré | low | defer | indice visuel sur un seul élément ; consigné |
| Noms de langue du sélecteur sans clé `uiStrings` | low | defer | décision avec le composant ; consigné |
| Import réel dans `dev` non exécuté | medium | defer | action de Léandro, commande documentée ; consigné |
| `siteSettings` sans EN et LinkedIn générique | medium | defer | l'ancien site n'a pas ces textes ; Studio refuse la publication tant que non rédigés ; consigné |
| Chemins d'image avec espaces et accents | false | rejeté | `pathToFileURL`, comme l'importateur Sanity lui-même ; chaque fichier testé existant |
| Secret ou jeton dans le script | false | rejeté | aucun réseau, aucune variable d'environnement lue |

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck && npm run format:check` -- expected: verts
- `npm run migrer:contenu` -- expected: fichier d'import produit sans erreur ni réseau

**Manual checks (if no CLI):**
- Léandro lance `cd studio && npx sanity dataset import <fichier> dev --replace`, puis la lecture par le connecteur Sanity confirme les comptes.
