# Proposition de changement de sprint — Épopée 11 « UI kit »

Date : 2026-11-20 · Demandeur : Léandro · Mode : incrémental · Périmètre : mineur

## 1. Résumé du problème

Le plan ne contient aucune épopée « UI kit ». Les composants de base (bouton, lien, carte, badge, champs) seraient créés au fil des stories 3.x et 4.x, sans inventaire ni contrat communs. `design-system/README.md` prévoit pourtant « Inventaire des composants » puis « Composants Astro correspondants » sans story associée.

Constat dans `ancien-portfolio/src/components` (lecture seule) : peu de primitives réutilisables (`ProjectCard`, `FeatureCard`, `CustomLangSelector`) ; boutons, champs et badges sont des classes Tailwind répétées, avec les styles par Thème passés en paramètre. Le kit est donc extrait des motifs répétés, pas copié.

## 2. Analyse d'impact

- **PRD** : aucun changement ; l'épopée complète FR-8, FR-20 et FR-22.
- **Spine** : aucun AD amendé (AD-1 `.astro` par défaut, AD-3 textes dans Sanity, AD-6 tokens). Un amendement viendra de la story 10.3 (rendu `.astro` dans Storybook).
- **Épopée 10** : 10.3 est avancée avant le kit (dépendance de 11.4 et 10.5) ; 10.4 à 10.7 suivent le kit.
- **Épopées 3, 5, 7** : réutilisent le kit ; mentions ajoutées par la story 11.5, pas maintenant.
- **Code** : aucun impact avant la story 11.1.

## 3. Approche recommandée

Ajustement direct : nouvelle épopée 11 (numéro conservé pour ne pas décaler les références `10-x`), livrée après 10.1, 10.2 et 10.3, avant la 3.1. Effort : 5 stories. Risque faible ; le risque principal est un kit trop large (écarté par la story 11.1 qui marque « hors kit » les motifs propres à une page).

Ordre de livraison : 10.1 → 10.2 → 10.3 → 11.1 → 11.2 → 11.3 → 11.4 → 11.5 → 3.1 …

## 4. Modifications détaillées

| # | Fichier | Modification | Statut |
|---|---------|--------------|--------|
| 1 | `epics.md` | Fiche de l'Epic 11 dans la liste, lignes de couverture FR-8, FR-20, FR-22 (compléments) | Approuvée |
| 2 | `epics.md` | Section Epic 11 avec les stories 11.1 à 11.5 et leurs critères | Approuvée |
| 3 | `epics.md` | Epic 10 : 10.1, 10.2, 10.3 avant l'épopée 11 ; 10.4 à 10.7 après le kit | Appliquée sur recommandation |
| 5 | `epics.md` | Liaison au design system (demande de Léandro) : `design-system/components.md` source de vérité (11.1), test token existant dans `tokens.css` (11.2), parité Figma des composants via 4.4 (11.5) | Appliquée |
| 4 | `sprint-status.yaml` | `epic-11` et `11-1` à `11-5` en `backlog`, `epic-11-retrospective: optional` | Appliquée sur recommandation |

## 5. Passation

Périmètre mineur : implémentation directe par le Développeur, une story par session. Première story à lancer : 10.1. Critère de succès : aucune story 3.x ne crée de primitive d'interface en double.
