---
title: "Brief produit — refonte technique du portfolio de Léandro Da Silva"
status: final
created: 2026-11-19
updated: 2026-11-19
---

# Brief produit : refonte technique du portfolio

## Résumé

Le portfolio de Léandro Da Silva a rempli son rôle : il lui a valu un 19,75 à l'école, un stage de six mois et son alternance. Cette refonte ne répare donc rien. C'est un **projet d'apprentissage** dont l'objectif est de reconstruire le site sur des bases techniques solides (rendu statique, CMS headless, sécurité, accessibilité) **sans changer ni le design, ni les textes, ni les projets**.

## Pourquoi, et pourquoi maintenant

- Améliorer la technique et la **cybersécurité** du site.
- Tester un **CMS headless** (Sanity) sur un cas réel.
- S'entraîner sur son propre site avant de proposer ce type de travail à des clients : le freelance est envisagé d'ici un an.
- Intégrer l'**accessibilité (RGAA)**, découverte récente.

Il n'y a pas d'urgence de recherche d'emploi : l'alternance en cours se termine dans environ deux ans.

## Ce qui est figé et ce qui change

| Figé (ne pas toucher) | Peut changer |
|---|---|
| Design, UI, UX (thèmes, composants, interactions) | Stack technique, hébergement |
| Tous les textes visibles en français et en anglais : accroche, projets, CTA | Structure des URL (accès direct à chaque projet) |
| Contenu et choix des projets | SEO, métadonnées, données structurées |
| | Sécurité, accessibilité, performance |

Le positionnement marketing ne peut donc s'exprimer que dans les **métadonnées** (title, description, aperçus de liens, JSON-LD) : aucun texte visible n'est réécrit.

## Pour qui

1. **Recruteurs et écoles** (priorité v1, échéance environ deux ans) : ils veulent voir un profil hybride design + dev, des projets concrets, un contact simple.
2. **Clients freelance** (secondaire, plus tard) : hors cible de la v1, le site ne leur est pas adressé.

## Positionnement

Léandro a déjà formulé sa promesse sur LinkedIn, et le portfolio doit dire la même chose :

> Product Designer UX/UI & IA · Accessibilité RGAA/WCAG · De l'idée au produit

Sa bannière ajoute « Accessible by design » et « Vibecoding ». Le profil est hybride (product designer, product builder, design engineer).

**Écart à combler.** Le site actuel se présente comme « Étudiant… Portfolio Digital Campus Paris » et ne mentionne ni l'accessibilité, ni l'IA, ni l'alternance. Seules les métadonnées permettent de corriger cet écart (voir « Ce qui est figé et ce qui change »).

- `[ASSUMPTION]` Les métadonnées reprennent les mots de LinkedIn, sans citer l'employeur. Seule la formulation exacte reste à valider.

**Conséquence.** « Accessible by design » est une promesse publique : le portfolio lui-même doit être irréprochable en accessibilité, sinon il contredit son profil LinkedIn aux yeux d'un recruteur.

## Solution

Un site **statique pré-rendu** (Astro), alimenté par **Sanity** (contenu : projets, parcours, compétences, paramètres), à l'identique visuellement de l'existant, avec :

- du HTML complet dès le chargement (lisible par les moteurs de recherche et les aperçus de liens) ;
- une adresse propre pour chaque projet ;
- aucune coordonnée personnelle dans le code client ;
- un système de design documenté (tokens, composants).

## Critères de réussite

`[ASSUMPTION]` Seuils à confirmer.

- Lighthouse : ≥ 95 en performance, accessibilité, bonnes pratiques et SEO.
- Accessibilité : audit RGAA sans blocage majeur, avec une déclaration de conformité honnête. L'exigence est plus forte que pour un site ordinaire, vu le positionnement « accessible by design ».
- Sécurité : en-têtes de sécurité en place (note A sur securityheaders.com), e-mail et téléphone absents du code client, formulaire protégé contre le spam.
- Rendu : le HTML brut contient tout le contenu visible.
- Contenu : un projet se modifie dans Sanity sans toucher au code.
- Fidélité : aucune différence visuelle perçue par rapport au site actuel.

## Périmètre de la v1

**Dans la v1** : reconstruction fidèle, contenu migré dans Sanity, URL par projet, SEO, sécurité, accessibilité, système de design.

**Hors v1** : tout ce qui est figé ci-dessus, plus le discours orienté freelance et la présentation du site comme étude de cas.

## Décisions prises

| Sujet | Décision |
|---|---|
| Langues | **FR + EN seulement.** Les 9 autres langues sont retirées (choix assumé). |
| Thèmes | **Les 3 sont conservés** (Pop, Terminal, Wireframe), avec contraste RGAA vérifié pour chacun. |
| Projets | **Fenêtre modale conservée**, avec une URL partageable par projet. |
| Preuve du profil hybride | **Le portfolio lui-même**, sans étude de cas dédiée. Il doit donc être exemplaire techniquement. |
| Employeur | **EDF absent** des métadonnées publiques (LinkedIn uniquement). |
| RGAA et design figé | **Conformité d'abord**, ajustements visuels minimes, chacun validé par Léandro avant application. |

## Questions encore ouvertes

1. **Hébergement** : actuellement Hostinger. À trancher en architecture (recommandation : hébergeur statique, domaine conservé).
2. **Stack** : Astro + Sanity sont la piste de départ, à confirmer en architecture.
3. **Seuils de réussite** : à confirmer (voir « Critères de réussite »).

## Vision

Dans deux ans, un portfolio facile à faire évoluer, accessible et sûr, qui montre le profil design + dev de Léandro et qui a servi de banc d'essai pour ses futurs projets clients.
