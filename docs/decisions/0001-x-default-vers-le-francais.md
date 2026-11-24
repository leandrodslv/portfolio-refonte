# 0001 — `x-default` pointe vers la version française

**Statut** : Actée (story 3.5)

## Contexte

FR-10 exige `lang` et `hreflang` sur chaque page, avec une adresse par Langue (`/` en FR, `/en/` en EN). Ni le PRD ni le spine ne disent quelle adresse porte `x-default`, la valeur de repli pour un visiteur dont la Langue n'est ni FR ni EN. Le site ne détecte jamais la Langue du navigateur : `/` reste en FR.

## Décision

`x-default` pointe vers `/`, comme `hreflang="fr"`. Chaque page déclare canonical, `fr`, `en` et `x-default` en adresses absolues (composant `Seo`), construites par `localizedPath(...)`. Le sitemap reçoit l'option `i18n` pour publier les mêmes alternates.

## Conséquences

- Une troisième Langue demandera de revoir `x-default`.
- La mémorisation de la Langue n'existe pas : elle n'est prévue que pour le Thème.
