# Déploiement (Vercel Hobby)

## Environnements (AD-10)

| Branche              | Environnement Vercel | Adresse                                                                 |
| -------------------- | -------------------- | ----------------------------------------------------------------------- |
| `main`               | Production           | `portfolio-refonte.vercel.app`                                          |
| `dev`                | Preview              | alias de branche stable `portfolio-refonte-git-dev-<équipe>.vercel.app` |
| PR de fonctionnalité | Preview              | adresse propre à chaque déploiement                                     |

Les noms ci-dessus sont ceux attendus pour un projet `portfolio-refonte` ; l'alias de dev se vérifie sur le premier déploiement de `dev`.

## Configuration réalisée (20 novembre 2026)

- Projet `portfolio-refonte` dans l'équipe `leandrodslvs-projects` (plan Hobby), créé avec le CLI Vercel, relié à `leandrodslv/portfolio-refonte` (app GitHub de Vercel autorisée sur le dépôt).
- Framework Astro, Node.js 22.x, Production Branch `main` ; commandes de build par défaut.
- Aucune variable à ajouter pour cette story : `VERCEL_ENV` est fournie par Vercel.
- **Protection des déploiements** : laissée à la valeur par défaut de Vercel (`all_except_custom_domains`, authentification Vercel sur les adresses `*.vercel.app`, production comprise). Les adresses ne sont donc pas publiques tant que cette protection reste active. À décider avant la mise en ligne.
- Notifications de build en échec par e-mail, variables et secrets : voir [exploitation.md](exploitation.md).

Pour relier le dépôt à la main : tableau de bord Vercel, **Add New… > Project**, importer le dépôt, nom `portfolio-refonte`, mêmes réglages.

## Indexation selon `VERCEL_ENV`

| `VERCEL_ENV`              | `robots.txt`  | `<meta name="robots">` |
| ------------------------- | ------------- | ---------------------- |
| `production`              | `Allow: /`    | absente                |
| `preview`, absente, autre | `Disallow: /` | `noindex`              |

`vercel.json` ajoute `X-Robots-Tag: noindex` pour les hôtes contenant `-git-dev-` (alias de la branche `dev`). Le Site de dev reste couvert deux fois : en-tête, `robots.txt` et balise.

## Vérifier après le premier déploiement

- `dev` : l'adresse d'alias répond avec l'en-tête `x-robots-tag: noindex`, la balise `noindex` et `robots.txt` en `Disallow: /`. Si l'alias ne contient pas `-git-dev-`, ajuster l'expression `has` de `vercel.json` (et `src/vercel.test.ts`).
- `main` : l'adresse `*.vercel.app` répond sans `noindex` ni `x-robots-tag`, `robots.txt` en `Allow: /`.

## Reprise

Restaurer un déploiement précédent depuis le tableau de bord Vercel (disponibilité sur Hobby à confirmer), ou `git revert` sur `main`.
