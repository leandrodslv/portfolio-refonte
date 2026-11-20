---
title: 'Story 1.6 : Variables validées et alerte de build'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '76b6210df90ab2901d4e200532bd86abbdb2db09'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/deploiement.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** rien ne vérifie les variables d'environnement au build : une variable absente produirait plus tard un Site cassé ou une erreur obscure. Aucune alerte n'est documentée si un build Vercel ou une CI échoue, et les secrets n'ont ni liste ni procédure de rotation (AD-17).

**Approach:** un registre typé des variables (Sanity, Resend, ALTCHA) classées par palier, vérifié au démarrage de `astro build` par une intégration Astro ; seules les variables des paliers activés bloquent. Les notifications e-mail se règlent dans Vercel et GitHub : elles sont documentées avec leur vérification dans `docs/exploitation.md`, et un test garde le registre et ce document synchronisés.

## Boundaries & Constraints

**Always:** l'erreur nomme chaque variable manquante ou vide, jamais une valeur (aucune valeur d'`env` dans le message ni les logs). **Décision (Léandro) :** registre complet, exigences par palier ; `PALIERS_ACTIFS` est vide aujourd'hui, donc les builds actuels (CI, Lighthouse, Vercel) restent verts sans nouvelle variable. Chaque story future active son palier (Sanity en 2.4, Resend et ALTCHA en épopée 4). La vérification ne tourne qu'au build (`astro:build:start`), pas en `dev` ni en `check`. `.env.example` ne contient que des noms, sans valeur. TypeScript strict, pas de commentaires hors WHY, pas de texte visible en dur.

**Never:** ne pas ajouter de variable ni de secret réel dans Vercel, GitHub ou le dépôt ; aucun service ni dépendance payant ; ne pas activer de palier ; ne pas toucher à `security.csp`, à `vercel.json` ni à `ancien-portfolio/`. Ne pas inventer de webhook ou d'intégration de messagerie : l'alerte passe par les e-mails natifs de Vercel et GitHub.

## I/O & Edge-Case Matrix

| Scénario | Entrée / État | Comportement | Gestion d'erreur |
|----------|---------------|--------------|------------------|
| Palier activé, tout présent | variables du palier non vides | vérification passe | N/A |
| Variable manquante ou vide | `SANITY_READ_TOKEN` absente ou `''` | build échoue | message : nom de la variable ; liste complète si plusieurs |
| Valeur secrète présente | `RESEND_API_KEY=abc` et une autre manquante | échec | aucune valeur dans le message |
| Aucun palier actif | env vide | passe | N/A |

</frozen-after-approval>

## Code Map

- `astro.config.mjs` -- `integrations: [react(), sitemap()]` ; y ajouter l'intégration de vérification.
- `src/lib/environnement.ts` -- logique pure existante de `VERCEL_ENV` (`estProduction`) ; modèle de style et de test, ne pas la modifier.
- `src/lib/variables.ts` -- à créer : registre (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN`, `RESEND_API_KEY`, `ALTCHA_HMAC_KEY`, `ALTCHA_HMAC_KEY_SECRET`, paliers `sanity` et `contact`), `PALIERS_ACTIFS`, `variablesManquantes(env, paliers)`, `verifierVariables(env)`.
- `src/integrations/verifier-variables.ts` -- à créer : intégration Astro appelant `verifierVariables(process.env)` sur `astro:build:start`.
- `.env.example` -- à créer (le `.gitignore` l'admet) : noms seuls.
- `docs/exploitation.md` -- à créer : secrets, où ils vivent, rotation, notifications e-mail Vercel et GitHub à régler et vérifier.
- `docs/deploiement.md` -- ligne « Notifications de build en échec : story 1.6 » à renvoyer vers `docs/exploitation.md`.
- `src/ci.test.ts`, `src/vercel.test.ts` -- modèles de tests de fichiers.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/variables.ts` -- registre par palier, `variablesManquantes`, `verifierVariables` qui lève une `Error` nommant les variables -- AC 1
- [x] `src/lib/variables.test.ts` -- matrice d'états : manquante, vide, plusieurs, aucune valeur dans le message, aucun palier -- AC 1
- [x] `src/integrations/verifier-variables.ts` et `astro.config.mjs` -- brancher sur `astro:build:start` -- AC 1
- [x] `src/exploitation.test.ts` -- chaque variable du registre figure dans `docs/exploitation.md` et dans `.env.example`, et `.env.example` n'a aucune valeur -- AC 2
- [x] `.env.example`, `docs/exploitation.md`, `docs/deploiement.md` -- noms, procédure de rotation, réglage et vérification des e-mails d'échec (Vercel : Notifications du compte, échecs de déploiement ; GitHub : Notifications, Actions sur échec) -- AC 2

**Acceptance Criteria:**
- Given une variable obligatoire absente, when le build démarre, then il échoue immédiatement avec son nom et aucune valeur secrète n'apparaît dans les logs.
- Given un build Vercel ou une CI en échec, when l'échec est enregistré, then Léandro reçoit un e-mail (réglages natifs, vérifiés à la main) et `docs/exploitation.md` liste les secrets et leur rotation.

## Implementation Notes

- Implémenté directement, sans sous-agent. Vérifié : Vitest 52, lint, typecheck, format, build verts sans variable. Contrôle négatif : `PALIERS_ACTIFS=['sanity']` et `SANITY_PROJECT_ID` absente font échouer `astro build` en nommant la variable, sans la valeur du jeton fourni.
- `docs/exploitation.md` : la date de vérification des e-mails reste à renseigner par Léandro (réglages de compte).

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent.

| Constat | Verdict | Preuve / route |
|---------|---------|----------------|
| Rien ne garantit que l'intégration reste branchée dans `astro.config.mjs` | medium | patch : test ajouté dans `src/exploitation.test.ts` |
| Noms des variables ALTCHA (`ALTCHA_HMAC_KEY`, `ALTCHA_HMAC_KEY_SECRET`) choisis sans consigne | low | rejeté : le registre est modifiable à l'activation du palier en épopée 4 |
| E-mails d'échec Vercel et GitHub non testables en CI | low | rejeté : limite documentée, vérification manuelle dans `docs/exploitation.md` |

## Design Notes

Les e-mails d'échec relèvent de réglages de compte (Vercel, GitHub), hors dépôt : non testables en CI. Le test de synchronisation du registre avec la documentation est le garde-fou testable ; l'envoi réel se vérifie à la main (voir Verification).

## Verification

**Commands:**
- `npm test && npm run lint && npm run typecheck` -- expected: verts
- `npm run build` -- expected: vert sans variable ; avec un palier forcé dans un test, échec nommant la variable

**Manual checks (if no CLI):**
- Vercel : Account Settings > Notifications, échecs de déploiement par e-mail activés ; GitHub : Settings > Notifications > Actions, e-mail sur échec. Provoquer un échec sur une branche jetable et constater l'e-mail.
