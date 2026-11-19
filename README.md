# Refonte du portfolio — Léandro Da Silva

Reconstruction technique du portfolio (design, textes et projets inchangés) :
site statique **Astro** alimenté par **Sanity**, avec accessibilité RGAA et sécurité renforcées.

## Environnements

| Branche | Rôle | Déploiement |
|---|---|---|
| `main` | **Prod** : le site en ligne | à définir en architecture |
| `dev` | **Dev** : intégration et tests | à définir en architecture |

Flux de travail : branche de fonctionnalité → pull request vers `dev` → pull request de `dev` vers `main`.

## Documentation

- Brief produit : `_bmad-output/planning-artifacts/briefs/`
- Tokens de design : `design-system/tokens.css`
- Méthode : BMAD (`_bmad/`, `.claude/skills/`)

## Version ancienne du portfolio (à conserver)

- `ancien-portfolio/` : copie locale en lecture seule, **hors Git** (contient e-mail, téléphone, CV). Ne jamais la supprimer ni la modifier.
- Archive hors dépôt : `~/Developer/archives-portfolio/portfolio-ancien-2026-11-19.tar.gz` (empreinte SHA-256 à côté).
- L'ancien site reste en ligne chez Hostinger jusqu'à validation du nouveau, puis pendant une période de repli.
