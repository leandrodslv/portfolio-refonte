# Règles d'utilisation du fichier Figma par les agents

Ces règles s'appliquent à tout agent qui lit le fichier Figma du kit d'interface (MCP Figma) pour produire du code. Elles reprennent le contenu de la Spec « Règles du design system pour les agents IA » du fichier. En cas de doute, `CLAUDE.md` et `design-system/components.md` l'emportent.

Fichier : `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio`

## Flux obligatoire

1. Lire le nœud avec `get_design_context`. Si la réponse est trop grosse, lire d'abord `get_metadata`, puis relire seulement les nœuds utiles.
2. Prendre une capture avec `get_screenshot` du nœud et de la variante implémentés.
3. Lire les jetons avec `get_variable_defs` : utiliser les variables du fichier, jamais les valeurs.
4. Implémenter en `.astro` dans `src/components/ui/` en réutilisant la primitive existante (table ci-dessous) ; ne jamais recréer un composant.
5. Vérifier au clavier, en trois Thèmes, à 320 px et à 200 % de zoom.

## Règles

- Aucune valeur de design en dur (couleur, ombre, bordure, durée, taille) : tout vient de `design-system/tokens.css` (AD-6). Une valeur manquante se propose avant d'être ajoutée.
- Aucun texte en dur : tout texte visible vient de Sanity, en français et en anglais (AD-3). Les textes des composants Figma sont des exemples.
- Accessibilité d'abord (RGAA 4.1, WCAG 2.2 AA) : focus visible, cibles d'au moins 24 px, contraste de 4,5:1, aucune information portée par la seule couleur. Les notes d'accessibilité sont dans la description de chaque composant.
- Un composant est `.astro` sauf s'il a besoin d'état ou d'événements du navigateur (AD-1).
- Les Thèmes sont portés par les modes de la collection de variables « Thème » ; ne pas dupliquer un composant par Thème.
- La teinte d'une galerie de projets est portée par les modes de la collection « Catégorie de projet » (Violet, Menthe, Jaune, Bleu).
- Icônes : Lucide (licence ISC) ; ne jamais dessiner une icône à la main.
- Gratuit ou open source uniquement (AD-16).

## Correspondance Figma et code

| Composant Figma | Fichier | Props |
| --- | --- | --- |
| Bouton, Bouton avec icône | `src/components/ui/Button.astro` | `variant` : primary, secondary, toggle ; compact ; icône avant ou après |
| Lien | `src/components/ui/Link.astro` | `variant` : text, navigation, footer |
| Carte de projet | `src/components/ui/Card.astro` | variant : project (service : pas de composant Figma) ; accent |
| Badge | `src/components/ui/Badge.astro` | |
| Étiquette | `src/components/ui/Tag.astro` | |
| Autocollant | `src/components/ui/Sticker.astro` | |
| Titre de Section | `src/components/ui/SectionTitle.astro` | mot en relief |
| Conteneur | `src/components/ui/Section.astro` | fond : page, carte |
| Sélecteur | `src/components/ui/Select.astro` | `variant` : language, row |
| Champ | `src/components/ui/Field.astro` | type : texte, zone de texte |
| Case à cocher | `src/components/ui/Checkbox.astro` | |
| Message de champ | `src/components/ui/FieldMessage.astro` | aide, erreur |

Les autres composants du fichier (Barre de navigation, Pied de page, Modale des mentions légales, Frise de parcours, Cartes et Puces de compétence, Fenêtre de projet, Pastille du curseur) sont des compositions ou des motifs livrés par les stories 3.1, 3.3 et 3.4 et par les épopées 5 et 6.

## Composants et compositions

Le fichier sépare les **composants** (briques réutilisables : Boutons, Liens et titres, Curseur et réglages, Cartes et étiquettes, Formulaires, Parcours et compétences, Identité et illustration, Éléments de galerie, Icônes) des **compositions** (écrans et sections assemblés avec des instances : Navigation et pied de page, Sections de page, Fenêtres de projet, Galerie de projets), séparés par des pages « ——— Composants ——— » et « ——— Compositions ——— ». Une composition est une référence de mise en page : lire d'abord `get_metadata`, puis les composants qu'elle contient ; ne jamais la dupliquer ni la détacher.

## Nommage

- Propriétés de variantes en français : Variante, État (Repos, Survol, Focus, Désactivé), Taille (Bureau, Mobile), Accent, Teinte.
- Propriétés de texte (Libellé, Titre, Description, Valeur, Message) seulement quand le texte est le même dans toutes les variantes ; sinon chaque variante garde son propre texte (Lien, Bouton, Sélecteur, Champ, Message de champ, Carte de compétence, Puce).
- Styles : `Texte/<graisse> <taille>/<interligne>` et `Ombre/dure <décalage>`.

## À ne pas faire

- Détacher une instance pour changer son apparence : ajouter une variante ou une propriété.
- Utiliser une couleur de la maquette absente des variables.
- Toucher à `ancien-portfolio/` (lecture seule, NFR-6).
