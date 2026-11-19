# Politique de sécurité

## Signaler une vulnérabilité

Merci de ne **pas** ouvrir d'issue publique pour une faille non corrigée. Utilise le signalement privé de GitHub : [Security advisories](../../security/advisories/new).

Délai visé : accusé de réception sous 7 jours. Projet à mainteneur unique, sans engagement de calendrier pour le correctif.

## Périmètre

Concerné : le code de ce dépôt (`src/`, `studio/`, `tests/`, configuration de déploiement `vercel.json`).

Hors périmètre : les services tiers dont le Site dépend (Vercel, Sanity, Resend), à signaler à leurs mainteneurs.

## Ce qui est en place

- Analyse des secrets avec blocage à l'envoi (GitHub) et gitleaks en CI.
- Analyse statique du code (Semgrep) et audit des dépendances (`npm audit`, Dependabot) à chaque PR.
- En-têtes de sécurité (CSP, HSTS…) déclarés dans le dépôt et testés en CI.
