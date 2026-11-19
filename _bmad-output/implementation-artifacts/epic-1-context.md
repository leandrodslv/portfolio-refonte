# Epic 1 Context: Un Site déployable, vérifié automatiquement

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Léandro pousse du code, une chaîne automatique le contrôle et un Site de dev se déploie. L'outillage qualité est déjà dans `dev` (hooks, Vitest, Playwright, Storybook, Semgrep, gitleaks, `ci-ok`, Dependabot, protection de `main` et `dev`). L'épopée ajoute le socle Astro et ce qui manque pour que chaque story suivante soit livrée sous contrôle : budget JS, CSP, Lighthouse, axe, navigateurs, déploiement.

## Stories

- Story 1.1: Socle Astro prouvé (budget JS et CSP) — faite
- Story 1.2: Déploiement automatique dev et prod
- Story 1.3: Chaîne CI bloquante sur chaque pull request
- Story 1.4: Compatibilité navigateurs vérifiée
- Story 1.5: En-têtes de sécurité, secrets et dépendances contrôlés
- Story 1.6: Variables validées et alerte de build

## Requirements & Constraints

- `main` déploie la production, `dev` déploie un Environnement dev sur un alias stable ; les PR de fonctionnalité déploient en Preview.
- Le Site de dev n'est ni indexé ni mesuré (pas d'analytics) ; la production seule est indexable.
- Gratuit ou open source uniquement : Vercel Hobby, Sanity Free, Resend Free ; tout service payant exige une nouvelle décision d'architecture.
- Un build en échec (Vercel ou GitHub Actions) notifie Léandro par e-mail ; les variables d'environnement sont validées au démarrage du build ; aucun secret hors Vercel et GitHub.
- Aucune PR n'est fusionnée dans `main` si la CI échoue ; en cas de conflit, la fidélité visuelle l'emporte sur Lighthouse, l'écart est consigné.
- L'ancien portfolio (`ancien-portfolio/`, site Hostinger) n'est jamais modifié ni supprimé avant validation et période de repli.

## Technical Decisions

- Table des environnements : `main` → Production → dataset Sanity `production` → domaine final ; `dev` → Preview → dataset `dev` → alias stable ; PR de fonctionnalité → Preview → dataset `dev`.
- Le build produit selon `VERCEL_ENV` le `robots.txt` (pas de fichier statique dans `public/`) et `<meta name="robots">` ; `vercel.json` ajoute `X-Robots-Tag: noindex` par une règle conditionnée à l'hôte de dev.
- Tous les en-têtes de sécurité vivent dans `vercel.json`, statique. La CSP vient de `security.csp` d'Astro (meta avec hashes) ; `frame-ancestors` reste dans `vercel.json`. HSTS au plus 1 jour, sans `preload` ni `includeSubDomains`, pendant la période de repli.
- Budget JS : moins de 70 Ko brotli pour la Page d'accueil sans interaction, mesuré en CI (qualité 4) ; les îlots React tournent sur l'alias `preact/compat` (8,4 Ko mesurés).
- Stack : Node 22.x, Astro 7.4.13, `@astrojs/vercel` 11.0.22, Tailwind 4.3.5, TypeScript 6.0.3 ; versions exactes dans la table du spine.
- Reprise d'une mauvaise mise en prod : restauration d'un déploiement précédent depuis le tableau de bord Vercel (disponibilité sur Hobby à confirmer) ou `git revert` sur `main`.

## Cross-Story Dependencies

- 1.3 intègre le budget JS et les tests de 1.1 dans le check agrégé `ci-ok`.
- 1.5 complète `vercel.json` avec tous les en-têtes ; la règle `X-Robots-Tag` de 1.2 et la CSP de 1.1 y cohabitent.
- 1.6 porte les variables d'environnement, dont `VERCEL_ENV` et les jetons Sanity, et l'alerte de build de 1.2.
- Le déploiement de 1.2 dépend d'un projet Vercel relié au dépôt GitHub, action côté compte Vercel de Léandro.
