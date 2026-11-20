---
title: 'Story 2.6 : Publication dev puis production'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '9d986138f22fe42a5029eb19a29778f8d7cd276e'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-5-migration-du-contenu.md'
  - '{project-root}/CLAUDE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Publier dans le Studio ne reconstruit pas le Site, la promotion de `dev` vers `production` n'est écrite nulle part, et rien ne sauvegarde `production` (FR-3, AD-17, SM-5).

**Approach:** Livrer dans le dépôt le workflow GitHub planifié qui exporte `production` chaque semaine, ses tests, et la procédure complète (webhooks Sanity vers deploy hooks Vercel, variables de production, promotion par export et import, restauration). Léandro crée lui-même les webhooks, deploy hooks et jetons.

## Boundaries & Constraints

**Always:**
- Workflow `.github/workflows/sauvegarde-production.yml` : déclencheurs `schedule` hebdomadaire et `workflow_dispatch` seulement ; permissions `contents: read` ; actions épinglées par SHA comme dans `ci.yml` ; le jeton vient de `secrets.SANITY_READ_TOKEN`, l'identifiant du projet de `vars.SANITY_PROJECT_ID`, jamais en clair ; échec explicite si le secret est vide ; export de `production` (assets compris) en artefact conservé 90 jours, nom daté.
- Procédure dans `docs/exploitation.md` : (1) deploy hook Vercel par Environnement (`dev` pour la branche `dev`, `main` pour la production) ; (2) un webhook Sanity par dataset (`dev` vers hook dev, `production` vers hook production), sur publication, création et suppression, brouillons exclus ; (3) variables Vercel de l'Environnement Production (`SANITY_PROJECT_ID`, `SANITY_DATASET=production`, un jeton Viewer propre `site-lecture-production`) ; (4) promotion : `sanity dataset export dev` puis `sanity dataset import … production --replace`, avec la limite que `--replace` ne supprime pas ce qui a disparu de `dev` ; (5) vérification de bout en bout (SM-5) ; (6) restauration depuis l'artefact hebdomadaire ; (7) première promotion avant la première mise en production.
- **Décision (isolation des jetons) :** un seul projet Sanity, deux datasets. Un jeton Viewer lit tous les datasets du projet et les rôles par dataset relèvent de l'offre Enterprise : l'isolation « le jeton de `dev` ne lit pas `production` » (AD-10) est inapplicable en gratuit. Écart assumé à AD-10, inscrit dans la documentation avec son risque (le contenu publié est public, seuls d'éventuels brouillons de `production` seraient lisibles) ; un jeton distinct par Environnement est quand même créé, pour la rotation.
- Tests Vitest sans réseau : structure du workflow (planification, SHA, permissions, secrets, rétention) et présence des étapes clés de la procédure.

**Never:**
- Aucun jeton, secret, URL de deploy hook ni valeur réelle dans le dépôt.
- L'agent ne crée ni webhook, ni deploy hook, ni jeton, ni dataset, ne publie rien et n'écrit dans aucun dataset.
- Pas de changement de `src/` du Site, de schéma Studio, ni de déploiement de production.
- Pas de service payant (AD-16) : ni rôle personnalisé, ni deuxième offre.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sauvegarde hebdomadaire | lundi, secret et variable présents | artefact `production-<date>` conservé 90 jours | N/A |
| Lancement manuel | `workflow_dispatch` | même résultat | N/A |
| Secret absent | `SANITY_READ_TOKEN` vide | échec immédiat avec un message qui nomme la variable | le job est rouge, e-mail GitHub |
| Action non épinglée | `uses:` sans SHA | test en échec | N/A |
| Jeton écrit en clair | valeur littérale dans le workflow | test en échec | N/A |
| Promotion | `dev` validé | `production` contient les documents de `dev` | la limite sur les suppressions est documentée |
| Publication dans `dev` | document publié | webhook, deploy hook, Preview reconstruit | procédure de vérification documentée |

</frozen-after-approval>

## Code Map

- `.github/workflows/ci.yml` -- modèle d'épinglage des actions (`checkout`, `setup-node`, `upload-artifact`) et de passage des variables Sanity
- `src/ci.test.ts`, `src/exploitation.test.ts` -- modèle de tests de workflow et de documentation
- `docs/exploitation.md`, `docs/deploiement.md` -- procédure à compléter ; variables et rotation déjà décrites
- `studio/package.json`, `studio/sanity.cli.ts` -- CLI Sanity pinée (6.24.0) utilisée par l'export ; l'authentification passe par `SANITY_AUTH_TOKEN`
- `_bmad-output/planning-artifacts/architecture/.../ARCHITECTURE-SPINE.md` -- AD-10 (écart à consigner) et AD-17 (export hebdomadaire)

## Tasks & Acceptance

**Execution:**
- [x] `.github/workflows/sauvegarde-production.yml` -- planification hebdomadaire, export `production`, artefact 90 jours, garde sur le secret -- AC 3
- [x] `src/sauvegarde.test.ts` -- structure du workflow, absence de secret en clair, étapes de la procédure -- règle de tests
- [x] `docs/exploitation.md` -- procédure en sept points, écart à AD-10, restauration -- AC 1, 2
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- premier lancement manuel de la sauvegarde, création des hooks et webhooks, vérification SM-5 -- suivi

**Acceptance Criteria:**
- Given le workflow GitHub planifié, when la semaine s'écoule, then le dataset `production` est exporté en artefact conservé 90 jours (AD-17).
- Given la procédure de `docs/exploitation.md`, when Léandro l'applique, then un document publié dans `dev` reconstruit le Site de dev par webhook et deploy hook.
- Given un texte de Projet modifié, when il est publié dans `dev`, vérifié puis promu en `production` par export et import, then le Site de production le reflète en moins de cinq minutes sans modification du code (SM-5), et la procédure de promotion est dans le dépôt.
- Given la CI racine, when `npm test`, `npm run lint` et `npm run typecheck` s'exécutent, then ils sont verts sans réseau.

## Implementation Notes

- Implémenté directement, sans sous-agent. Nouveaux : `.github/workflows/sauvegarde-production.yml` (lundi 3 h UTC et lancement manuel, permissions en lecture, SHA épinglés, garde sur variable et secret, artefact `production-<date>` 90 jours), `src/sauvegarde.test.ts` (19 tests, dont la procédure), section « Publication, promotion et sauvegarde » de `docs/exploitation.md`.
- Le drapeau de la CLI est `--project` (pas `--project-id`) ; l'authentification passe par `SANITY_AUTH_TOKEN`, non vérifiable sans réseau : le lancement manuel la confirmera.
- Aucun secret, jeton ni adresse de deploy hook dans le dépôt ; un test refuse une adresse de hook réelle dans la documentation.
- Écart à AD-10 (isolation des jetons) documenté dans `docs/exploitation.md` ; `ARCHITECTURE-SPINE.md` n'est pas modifié.
- 192 tests, lint, format et typecheck verts.
- Non vérifié : création des hooks et webhooks, premier export, promotion et mesure SM-5 (actions de Léandro).

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent ni seconde lentille (même limite acceptée qu'en 2.1 à 2.5).

| Constat | Verdict | Route | Preuve |
|---|---|---|---|
| Authentification de la CLI par `SANITY_AUTH_TOKEN` et export non vérifiés sans réseau | medium | defer | le lancement manuel du workflow les confirme ; consigné |
| Webhooks, deploy hooks, jeton de production et variables Vercel de production non créés | medium | defer | secrets, actions de Léandro ; procédure documentée ; consigné |
| `production` est vide : une première promotion est nécessaire avant la mise en ligne | medium | defer | documentée au point 4 ; consigné |
| Écart à AD-10 : le jeton de `dev` lit `production` | medium | defer | inapplicable en gratuit (rôles par dataset Enterprise) ; décision de Léandro, documentée ; le spine reste à amender par son propriétaire |
| `--replace` ne supprime pas les documents retirés de `dev` | low | defer | limite de la CLI, documentée au point 4 |
| Drapeau `--project-id` inexistant dans la CLI | high | patch | corrigé en `--project` avant tout commit ; vérifié par l'aide de la CLI |
| Secret ou jeton dans le workflow | false | rejeté | lecture par `secrets.` et `vars.` ; test dédié |

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck && npm run format:check` -- expected: verts

**Manual checks (par Léandro, une fois les hooks créés) :**
- Lancer `workflow_dispatch` de la sauvegarde : l'artefact apparaît.
- Publier un changement de texte dans `dev` : le Site de dev se reconstruit seul.
- Promouvoir en `production` et chronométrer jusqu'au Site de production (moins de cinq minutes).
