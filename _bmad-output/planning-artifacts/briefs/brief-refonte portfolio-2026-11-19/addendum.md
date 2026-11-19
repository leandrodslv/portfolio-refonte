---
title: "Addendum — brief refonte portfolio"
created: 2026-11-19
updated: 2026-11-19
---

# Addendum : matière pour le PRD et l'architecture

Ce document garde les détails utiles aux étapes suivantes, qui n'ont pas leur place dans un brief de deux pages.

## Ressources existantes

| Ressource | Emplacement |
|---|---|
| Code source du site en ligne (identique au `dist` publié) | `ancien-portfolio/` |
| Documentation technique rédigée avec Gemini | `ancien-portfolio/technical_docs/` |
| Tokens de design extraits du code (3 thèmes) | `design-system/tokens.css` |
| Maquette Figma (desktop 1440 px, pages projet, cadre « atomic design », moodboard) | `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio` (cadre accueil : `1:57`, cadre atomic design : `1:908`) |
| Profil LinkedIn (source du positionnement) | `https://www.linkedin.com/in/l%C3%A9andro-da-silva/` |
| CV | `ancien-portfolio/CV_Leandro_Da_Silva.pdf`. Le site en ligne le sert bien (`/CV_Leandro_Da_Silva.pdf`, bouton « Télécharger CV »), mais il n'est pas dans `public/` : il a été déposé à la main sur l'hébergeur et disparaîtrait à une reconstruction. |

## Audit technique de l'existant (19 novembre 2026)

- **Stack** : React 18, Vite 5, Tailwind 3, Framer Motion, `react-helmet-async`. Hébergé chez Hostinger (CDN `hcdn`).
- **Rendu** : `<div id="root"></div>` vide dans le HTML brut, tout est rendu côté client. Bundle JS de 490 Ko (148 Ko compressé), dont les traductions de 11 langues.
- **Contenu** : entièrement écrit en dur dans `src/data/` (aucun CMS). Services externes : Formspree (formulaire).
- **Pages** : une seule, avec ancres (`#work`, `#journey`, `#skills`, `#contact`). Le sitemap liste ces ancres. `react-router-dom` est installé mais inutilisé.
- **Données personnelles** : e-mail et téléphone en clair dans le bundle JS.
- **Liens** : LinkedIn pointe vers `https://linkedin.com` (footer) et `#` (icône).
- **Analytics** : `react-ga4` installé, aucun appel trouvé dans `src`.
- **Métadonnées** : titre, description, Open Graph, Twitter, canonical, JSON-LD `Person` présents. Le JSON-LD contient une `JobPosting` datée du 13/02/2026 à actualiser.
- **Sécurité HTTP** : seul `upgrade-insecure-requests` en CSP, pas d'autres en-têtes de sécurité observés.
- **Images** : mélange JPG/PNG/WebP, noms avec espaces (`logo final.png`), peu de `loading="lazy"`.
- **Accessibilité** : `alt` rares, `<canvas>` avec simple message de repli. Audit RGAA complet non réalisé.
- **Aucune police personnalisée** : polices système (`font-sans`, `font-mono`) dans le code. La maquette Figma en montre une, non identifiée.

## Design à conserver

- **Thème Pop** (principal) : fond `#FFFDF5`, bordures noires de 4 px, ombres dures décalées, autocollant `#CCFF00` incliné de -3°, accent `#FF5959`.
- **Thème Terminal** : fond noir, texte vert, police monospace, lueur verte au survol.
- **Thème Wireframe** : bleu, bordures pointillées, sans ombre.
- **Composants d'interaction à reproduire** : `FlipCard`, `ScratchCard`, modales de projet (standard, graphisme, création), « mode party », curseurs personnalisés.
- **Sections** : Navbar, Hero, Work, Timeline, Skills, Services, About, Contact, Footer.

## Options écartées ou reportées

- **Freelance comme cible de la v1** : reporté, horizon ultérieur.
- **« Client zéro »** (le portfolio comme étude de cas) : refusé par Léandro, le site reste purement personnel.
- **Nouvelle direction artistique** : refusée, DA identique.
- **Vraie page par projet** (à la place de la modale) : écartée au profit de la modale avec URL partageable.
- **Mention d'EDF dans les métadonnées** : écartée.
- **Garder les 11 langues** : écarté, seuls FR et EN sont conservés.
