# 0002 — Le sélecteur de Langue est un groupe de liens statiques

**Statut** : Actée (story 3.5)

## Contexte

UJ-4 demande de changer de Langue au clavier et de savoir où l'on se trouve. Le sélecteur de Thème de l'épopée 4 sera un îlot, car il garde un état dans le navigateur. Le changement de Langue, lui, est un changement de page : une adresse par Langue.

## Décision

Deux liens `FR` et `EN` dans un `role="group"` nommé par `uiStrings.selecteurLangue`, dans la Navbar et donc dans le menu mobile. Chaque lien porte `lang` et `hreflang` ; la Langue active porte `aria-current="true"`. Aucun JavaScript, aucun `aria-live` : la navigation recharge la page, et l'état courant est annoncé par `aria-current`. Les codes `FR` et `EN` sont des identifiants, pas du texte traduit.

## Conséquences

- Le nom accessible des liens se limite aux codes. Un nom complet (Français, English) demande deux chaînes de plus dans `uiStrings` : reporté dans `deferred-work.md`.
- Le sélecteur fonctionne sans JS.
- Le `slug` d'une future page Projet est transmis de `Gabarit` au sélecteur : il mène à la même page dans l'autre Langue.
