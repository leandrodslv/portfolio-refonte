---
title: 'Story 1.5 : En-têtes de sécurité, secrets et dépendances contrôlés'
type: 'feature'
created: '2026-11-20'
status: 'done'
baseline_commit: '7c7a304263ca71c3549fa21a49aec8d9ad899970'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/docs/socle-astro-mesures.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `vercel.json` ne déclare que `frame-ancestors` : il manque HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` et les directives CSP hors script (AD-11, FR-21) ; rien n'échoue si un en-tête disparaît, et l'allowlist de gitleaks peut s'élargir sans trace.

**Approach:** compléter l'en-tête global de `vercel.json`, le faire vérifier à la fois dans le fichier et tel que servi, et figer par des tests l'allowlist gitleaks, Dependabot et la présence de l'audit et de gitleaks dans `ci-ok`.

## Boundaries & Constraints

**Always:** la CSP d'en-tête n'a ni `script-src`, ni `style-src`, ni `default-src` (l'intersection avec la balise meta d'Astro casserait l'hydratation : sans `script-src`, `default-src` s'appliquerait aux scripts inline que seule la meta autorise par empreintes, voir `docs/socle-astro-mesures.md`) ; elle ajoute `base-uri 'self'`, `object-src 'none'`, `form-action 'self'`, `img-src 'self' data:`, `font-src 'self'`, `connect-src 'self'`, `media-src 'self'`, `worker-src 'self' blob:`, `frame-src 'none'` et garde `frame-ancestors 'none'`. **Décision (Léandro) :** directives explicites plutôt que `default-src`. HSTS : `max-age` d'au plus 86400, sans `preload` ni `includeSubDomains` (AD-11, repli DNS). Aucune origine tierce ajoutée : analytics, ALTCHA, polices viendront avec leur story et leur test. Les tests CSP et Lighthouse existants restent verts.

**Never:** ne pas toucher à `security.csp` d'Astro, ni à la règle `X-Robots-Tag`. Aucun secret ni vraie valeur dans les tests. Ne pas élargir l'allowlist de gitleaks.

## I/O & Edge-Case Matrix

| Scénario | État | Comportement |
|----------|------|--------------|
| Tous les en-têtes | `vercel.json` complet | tests verts, en-têtes servis identiques |
| En-tête retiré | un des six absent de `vercel.json` | test Vitest et test Playwright rouges, nommant l'en-tête |
| HSTS trop long ou `preload` | `max-age` > 86400, `preload` ou `includeSubDomains` | test rouge |
| `script-src`, `style-src` ou `default-src` en en-tête | présent dans la CSP d'en-tête | test rouge |
| Allowlist gitleaks élargie | chemin, regex ou commit ajouté | test rouge ; seul le manifeste BMAD est admis |
| Dependabot ou audit retiré | écosystème npm ou github-actions absent, job `audit` ou `secrets` hors de `ci-ok` | test rouge |

</frozen-after-approval>

## Code Map

- `vercel.json` -- règle `/(.*)` avec `frame-ancestors` seul, puis règle `has: host` pour `X-Robots-Tag` ; compléter la première seulement.
- `src/vercel.test.ts` -- tests Vitest de `vercel.json` ; y ajouter la liste des en-têtes requis et leurs contraintes.
- `tests/headers/csp.spec.ts` -- vérifie `frame-ancestors` servi ; modèle pour le test des en-têtes servis.
- `tests/support/serve.mjs` -- sert `dist` avec les règles sans `has` de `vercel.json`.
- `.gitleaks.toml` -- allowlist limitée au manifeste BMAD ; `.github/dependabot.yml` -- npm et github-actions ; `src/ci.test.ts` -- `needs` de `ci-ok`.
- `docs/` -- ajouter `docs/securite.md` ; `SECURITY.md` renvoie déjà aux en-têtes testés.

## Tasks & Acceptance

**Execution:**
- [x] `vercel.json` -- ajouter CSP en directives explicites sans `script-src`, `style-src` ni `default-src`, HSTS 86400, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive -- AC 1
- [x] `src/vercel.test.ts` -- en-têtes requis présents une fois, contraintes HSTS et CSP -- AC 1 et 2
- [x] `tests/headers/en-tetes.spec.ts` -- les six en-têtes sont servis sur `/` et les valeurs correspondent à `vercel.json` -- AC 2
- [x] `src/securite.test.ts` -- allowlist gitleaks figée, Dependabot (npm, github-actions) -- AC 3
- [x] `src/ci.test.ts` -- `audit` et `secrets` exigés par `ci-ok` -- AC 3
- [x] `docs/securite.md` -- en-têtes et raisons, allowlist gitleaks documentée, comment élargir la CSP avec une nouvelle origine

**Acceptance Criteria:**
- Given `vercel.json`, when je le lis, then il déclare CSP, HSTS (au plus 1 jour, sans `preload` ni `includeSubDomains`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` et `frame-ancestors`.
- Given un en-tête requis retiré, when la CI s'exécute, then le test des en-têtes échoue.
- Given Dependabot et `npm audit` actifs, when une dépendance vulnérable est introduite, then la CI le signale ; gitleaks échoue si un secret est détecté et son allowlist reste limitée aux faux positifs documentés.

## Implementation Notes

- Première version de la CSP avec `default-src 'self'` : l'hydratation cassait (budget et test de fumée CSP rouges). Léandro a validé des directives explicites ; la spec figée a été modifiée en conséquence.
- Vérifié : Vitest 31, Playwright Chromium 13, WebKit et Firefox 6, `lhci autorun` vert, `npm audit --audit-level=high` sans faille haute. Contrôles négatifs : retrait de `X-Content-Type-Options` fait échouer Vitest et Playwright ; un chemin ajouté à l'allowlist gitleaks fait échouer `src/securite.test.ts`.

## Spec Change Log

## Review Triage Log

Relecture faite en direct par Claude, sans sous-agent.

| Constat | Verdict | Preuve / route |
|---------|---------|----------------|
| `default-src` en en-tête bloque les scripts inline hachés par la meta | high | corrigé avec accord de Léandro : directives explicites, test qui interdit `script-src`, `style-src` et `default-src` |
| Vercel ajoute son propre HSTS sur `*.vercel.app` | low | rejeté : documenté dans les Design Notes ; l'en-tête du dépôt fait foi pour le domaine final |
| Permissions-Policy et Referrer-Policy : valeurs choisies sans consigne | low | rejeté : choix courants, modifiables par une PR |

## Design Notes

Vercel ajoute son propre HSTS sur `*.vercel.app` ; l'en-tête du dépôt fait foi pour le domaine final, où la durée courte protège le retour arrière vers Hostinger. `img-src data:` couvre les petites images en ligne ; les polices, médias et workers de l'AD-11 s'ajouteront avec les stories qui les introduisent.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm test` -- expected: tout passe
- `npx playwright test` -- expected: en-têtes, CSP sans violation, a11y, budget passent
- `npx lhci autorun` -- expected: seuils respectés avec la nouvelle CSP
- retirer `X-Content-Type-Options` de `vercel.json` -- expected: Vitest et Playwright échouent
