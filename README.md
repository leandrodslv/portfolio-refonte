# Refonte du portfolio — Léandro Da Silva

Reconstruction technique du portfolio (design, textes et projets inchangés) :
site statique **Astro** alimenté par **Sanity**, avec accessibilité RGAA et sécurité renforcées.

## Stack

Astro 7 (statique) avec îlots React 19 exécutés par l'alias `preact/compat`, Tailwind 4, TypeScript 6.0.3, Sanity (contenu), Vercel Hobby (hébergement), ALTCHA et Resend (formulaire). Gratuit ou open source uniquement. Les versions exactes sont dans la table du spine d'architecture.

## Démarrer

Node 22 (`.nvmrc`).

```bash
npm install
npm run dev          # serveur de développement
npm run build        # build statique
```

| Commande | Rôle |
|---|---|
| `npm run lint` · `npm run typecheck` | ESLint · `astro check` |
| `npm test` | tests Vitest (fonctions, composants) |
| `npm run test:e2e` | tests Playwright (build, hydratation, CSP, budget JS, indexation) |
| `npm run format:check` | vérification Prettier |
| `npm run storybook` | Storybook |

Les hooks Husky et la CI (`ci-ok`) exigent lint, typecheck et tests verts avant toute fusion.

## Environnements

| Branche | Rôle | Déploiement (Vercel, projet `portfolio-refonte`) |
|---|---|---|
| `main` | **Prod** : le site en ligne | Production, adresse `*.vercel.app` |
| `dev` | **Dev** : intégration et tests | Preview, alias de branche stable (`-git-dev-`) |

Flux de travail : branche de fonctionnalité → pull request vers `dev` → pull request de `dev` vers `main`. Seule la production est indexable (`robots.txt` et balise `noindex` selon `VERCEL_ENV`). Les déploiements sont protégés par l'authentification Vercel tant que cette protection n'est pas modifiée. Détails : `docs/deploiement.md`.

## Documentation

- Brief, PRD, architecture (le spine fait foi) et épopées : `_bmad-output/planning-artifacts/`
- Suivi des stories et points reportés : `_bmad-output/implementation-artifacts/`
- Déploiement et indexation : `docs/deploiement.md`
- Budget JS et décision CSP : `docs/socle-astro-mesures.md`
- Règles de test : `docs/TESTING-RULES.md`
- Sécurité : `SECURITY.md`
- Tokens de design : `design-system/tokens.css`
- Méthode : BMAD (`_bmad/`, `.claude/skills/`)

## Version ancienne du portfolio (à conserver)

- `ancien-portfolio/` : copie locale en lecture seule, **hors Git** (contient e-mail, téléphone, CV). Ne jamais la supprimer ni la modifier.
- Archive hors dépôt : `~/Developer/archives-portfolio/portfolio-ancien-2026-11-19.tar.gz` (empreinte SHA-256 à côté).
- L'ancien site reste en ligne chez Hostinger jusqu'à validation du nouveau, puis pendant une période de repli.
