---
title: 'Story 1.2 : Déploiement automatique dev et prod'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '28341fe795b07ced2dad76c40996589c51a33fe5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `dev` et `main` ne se déploient pas : aucun projet Vercel n'est relié au dépôt, et rien n'empêche l'indexation d'un Site de dev par les moteurs de recherche (NFR-2, AD-10).

**Approach:** relier le dépôt à Vercel Hobby (`main` = production, `dev` = Preview sur alias stable) et faire produire au build, selon `VERCEL_ENV`, le `robots.txt` et la balise `<meta name="robots">`, avec une règle `X-Robots-Tag` dans `vercel.json` pour l'hôte de dev.

## Boundaries & Constraints

**Always:** seul `VERCEL_ENV=production` rend le Site indexable ; toute autre valeur, y compris absente (build local ou CI), est `noindex`. Aucun texte ou valeur de design en dur. Gratuit uniquement (AD-16). Seuls `main` et `dev` déploient par Git ; les autres branches ne déploient qu'en Preview de PR.

**Never:** aucun `robots.txt` statique dans `public/`. Ne pas toucher à `ancien-portfolio/` ni au site Hostinger. Ne pas ajouter d'analytics ni de domaine personnalisé (hors story). Ne pas committer de jeton ni d'identifiant Vercel.

**Décision (Léandro) :** la liaison du dépôt à Vercel Hobby est faite par Claude avec les outils Vercel, après confirmation par Léandro du nom du projet et de l'équipe, avant toute création. `docs/deploiement.md` consigne ce qui a été configuré.

## I/O & Edge-Case Matrix

| Scénario | `VERCEL_ENV` | Comportement |
|----------|--------------|--------------|
| Production | `production` | `robots.txt` : `Allow: /`, aucune balise `noindex` |
| Dev et PR | `preview` | `robots.txt` : `Disallow: /`, chaque page porte `<meta name="robots" content="noindex">` |
| Build local ou CI | absente | comme `preview` |
| Valeur inconnue | autre | comme `preview` |

</frozen-after-approval>

## Code Map

- `src/pages/index.astro` -- seule page ; son `<head>` accueillera la balise robots. Texte en dur de la page d'essai : hors périmètre.
- `src/lib/localizedPath.ts` et `.test.ts` -- modèle de module pur testé par Vitest dans `src/lib/`.
- `astro.config.mjs` -- `site` et `@astrojs/sitemap` ; ne pas y toucher.
- `vercel.json` -- règle `/(.*)` avec `frame-ancestors` ; y ajouter la règle `X-Robots-Tag` avec `has: host`.
- `tests/support/serve.mjs` -- serveur de test qui applique toutes les règles de `vercel.json` ; doit ignorer les règles à `has`.
- `tests/e2e/smoke.spec.ts` -- modèle de test navigateur ; le build des tests n'a pas `VERCEL_ENV` (donc `noindex`).
- `docs/` -- où consigner le déploiement ; `docs/exploitation.md` appartient à la story 1.6.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/environnement.ts` -- fonctions pures `estProduction(env)`, `directiveRobots(env)` et `contenuRobotsTxt(env)` -- une seule source de vérité, testable sans build
- [x] `src/lib/environnement.test.ts` -- tests de la matrice (production, preview, absent, inconnu) -- AC 2 et 3
- [x] `src/pages/robots.txt.ts` -- endpoint statique lisant `process.env.VERCEL_ENV` -- `robots.txt` par environnement
- [x] `src/components/RobotsMeta.astro` -- rend `<meta name="robots" content="noindex">` hors production, zéro JS -- inclus dans le `<head>` de chaque page
- [x] `src/pages/index.astro` -- inclure `RobotsMeta` dans `<head>`
- [x] `vercel.json` -- règle `X-Robots-Tag: noindex` pour l'hôte de dev, par `has: host` en expression régulière sur `-git-dev-` -- AC 2
- [x] `src/vercel.test.ts` -- vérifie la règle `X-Robots-Tag` et que la règle globale reste intacte
- [x] `tests/support/serve.mjs` -- ignorer les règles à `has` -- le serveur de test ne doit pas simuler l'hôte de dev
- [x] `tests/e2e/environnement.spec.ts` -- build sans `VERCEL_ENV` : balise `noindex` présente et `robots.txt` en `Disallow: /`
- [x] Vercel (outils Vercel, après confirmation du nom et de l'équipe) -- créer le projet relié à `leandrodslv/portfolio-refonte`, framework Astro, Node 22, branche de production `main`
- [x] `docs/deploiement.md` -- ce qui a été configuré : liaison du dépôt, branche de production `main`, Node 22, ce que produit `VERCEL_ENV`, alias stable de dev, restauration d'un déploiement

**Acceptance Criteria:**
- Given le projet relié à Vercel Hobby, when je pousse sur `dev`, then l'Environnement dev est déployé sur un alias stable.
- Given un push sur `main`, then la production est déployée sur une adresse `*.vercel.app`.
- Given `VERCEL_ENV=preview`, when le build s'exécute, then `robots.txt` interdit l'indexation et chaque page porte `noindex`.
- Given `VERCEL_ENV=production`, when le build s'exécute, then `robots.txt` autorise l'indexation et aucune balise `noindex` n'est présente.

## Implementation Notes

- Code, tests et doc faits ; build vérifié en `production`, `preview` et sans variable. 14 tests Vitest et 7 tests Playwright passent.
- Liaison Vercel faite avec le CLI après un 403 de l'outil Vercel : projet `portfolio-refonte` (équipe `leandrodslvs-projects`), dépôt relié, framework Astro, Node 22.x, production `main`. Protection des déploiements laissée par défaut (`all_except_custom_domains`) : les adresses `*.vercel.app`, production comprise, exigent une connexion Vercel. Aucun déploiement lancé : `main` ne contient pas encore le socle ; le premier viendra de `dev`. L'alias `-git-dev-` reste à vérifier à ce moment.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent (choix de Léandro pour ce run).

| Constat | Verdict | Preuve / route |
|---------|---------|----------------|
| Ligne de la matrice « production sans balise » couverte seulement par la fonction pure | medium | corrigé : `src/components/RobotsMeta.test.ts` rend le composant avec `AstroContainer` (production, preview, vide) ; `vitest.config.ts` passe par `getViteConfig` |
| `Disallow: /` masque la balise `noindex` aux robots | low | rejeté : les deux sont exigés par la story, le risque d'indexation par URL seule est accepté |
| Règle `has: host` non confirmée sur Vercel | maybe-false (medium) | défer : à vérifier au premier déploiement de `dev` |
| Protection des déploiements par défaut, production comprise | medium | défer : décision de Léandro avant la mise en ligne |
| Pas de `Sitemap:` dans `robots.txt` | false | volontaire, domaine final non choisi (Design Notes) |

## Design Notes

L'expression `-git-dev-` suit le nommage d'alias de branche de Vercel (`<projet>-git-dev-<équipe>.vercel.app`) ; elle est vérifiée sur le premier déploiement de `dev`. Les autres Previews restent couvertes par `robots.txt` et la balise. Pas de ligne `Sitemap:` dans `robots.txt` tant que le domaine final n'est pas choisi.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test` -- expected: tout passe
- `npx playwright test` -- expected: tests de fumée, CSP, budget et environnement passent
- `VERCEL_ENV=production npm run build && grep -c noindex dist/index.html; cat dist/robots.txt` -- expected: 0 occurrence, `Allow: /`

**Manual checks (if no CLI):**
- Après liaison Vercel : pousser sur `dev`, ouvrir l'alias stable, vérifier l'en-tête `x-robots-tag` et la balise ; pousser sur `main`, vérifier l'adresse `*.vercel.app` sans `noindex`.
