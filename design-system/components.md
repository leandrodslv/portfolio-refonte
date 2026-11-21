# Inventaire des composants — source de vérité du kit

Relevé de l'ancien site (`ancien-portfolio/src`, lecture seule) rapproché de `tokens.css`. Il fixe ce que les stories 11.2 et 11.3 construisent : rien n'est inventé, tout écart est listé en fin de document pour validation de Léandro avant tout ajout de token (AD-6).

Conventions : « Thème » = Pop (P), Terminal (T), Wireframe (W). Les tokens cités existent dans `tokens.css`. Les composants Figma : maquette `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio`, cadre « atomic design » (`node-id=1-908`) ; le rattachement composant par composant est à faire en story 4.4.

Livraison : story 11.2 pour toutes les primitives sauf Champ ; story 11.3 pour Champ. Les comptes d'usage ci-dessous sont un relevé du 2026-11-20 par `grep -o` sur `ancien-portfolio/src/components` ; ils servent à classer les valeurs, pas à les contrôler.

Source commune des valeurs par Thème : `ancien-portfolio/src/styles/theme.js` (`themeConfig`), passé en prop `ts` à tous les composants.

## Primitives du kit

### Bouton

Sources : `ancien-portfolio/src/components/sections/Hero.jsx` (CTA), `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (bouton de carte), `ancien-portfolio/src/components/sections/Contact.jsx` (envoi), `ancien-portfolio/src/components/sections/Skills.jsx` (bouton « Organiser »), `ancien-portfolio/src/components/UI/ProjectModal.jsx` (fermeture).
Chemin : `src/components/ui/Button.astro` (livré, story 11.2).

Figma : composant créé le 2026-11-21 dans la page « UI kit » : Variante (principal, secondaire, compact secondaire, basculeur) × État (repos, survol, focus, désactivé) ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=29-89`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

| Variante | Rôle | Tokens communs |
| --- | --- | --- |
| Principal | CTA, envoi | `--button-primary-bg`, `--button-primary-text`, `--border-color`, `--border-thick`, `--shadow` |
| Secondaire | CTA secondaire, bouton de carte | `--button-secondary-bg`, `--button-secondary-text`, `--border-color`, `--border-thick`, `--shadow` |
| Basculeur | « Organiser », son, Thème | `--border-color`, `--border-thin`, `--shadow`, `--text` |

Par Thème : Pop, bordure noire pleine, ombre dure `--shadow-hard-sm`, principal bleu `--color-primary-action` ; Terminal, bordure `--color-term-border`, sans ombre, principal `--color-term-button` (survol `--color-term-button-hover`), secondaire noir à bordure verte (survol `--color-term-surface`) ; Wireframe, bordure `--color-wire-text` pleine (pas pointillée) pour les boutons, sans ombre, principal `--color-wire-line`, secondaire transparent.

La variante Fermeture (bouton de fermeture des fenêtres) est **hors kit** tant que la Fenêtre de projet n'existe pas (épopée 5) ; elle n'est donc pas listée parmi les variantes du kit.

États : repos ; survol (l'ombre disparaît ; principal : rotation de -2° et échelle 1,05, secondaire : rotation de +2° et échelle 1,05, reproduites en CSS avec `--rotate-hover` et `--scale-hover` d'après le `whileHover` de Framer Motion, sans effet en mouvement réduit ; Terminal : fond `--color-term-button-hover` ; Wireframe : fond léger) ; pression : échelle `--scale-press` ; focus (**aucun style propre dans l'ancien site** sauf anneau jaune sur les champs, voir écarts) ; actif (décalage de 1 à 2 px, ombre retirée, réduction d'échelle) ; désactivé (opacité réduite, curseur d'attente, seulement sur l'envoi du formulaire).
Variante compacte : pleine largeur, sans marge intérieure horizontale (bouton « Détails » des cartes de projet).

### Lien

Sources : `ancien-portfolio/src/components/sections/Navbar.jsx` (liens de menu), `ancien-portfolio/src/components/sections/Footer.jsx` (liens du pied de page), `ancien-portfolio/src/components/sections/Contact.jsx` (liens e-mail et téléphone). Chemin : `src/components/ui/Link.astro` (livré, story 11.2).

Figma : composant refait le 2026-11-21 d'après le site (page « UI kit ») : formes Texte, Navigation et Pied de page, états Repos, Survol, Focus ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=39-107`.

| Variante | Rôle | Tokens |
| --- | --- | --- |
| Navigation | cellule du menu, majuscules, bordure droite | `--text`, `--border-color`, `--border-thick` |
| Pied de page | ligne avec séparateur et flèche au survol, texte hérité du corps (16 px, graisse normale) | `--text`, `--border-color` |
| Texte souligné | coordonnées de contact (soulignement épais) | `--text` |

États : repos ; survol (voile `noir 5 %`, barre d'accent de 4 px sous le lien de menu) ; focus et actif absents de l'ancien site ; désactivé sans objet. Un lien qui ouvre une nouvelle fenêtre ou télécharge doit l'annoncer (story 11.2).

### Carte

Sources : `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (`ProjectCard`), `ancien-portfolio/src/components/sections/Services.jsx` (carte de service). Chemin : `src/components/ui/Card.astro` (livré, story 11.2).

Figma : composant présent dans la page « UI kit » (relevé du 2026-11-21) : accents Aucun et 1 à 5, états Repos et Survol ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-143`. Aperçu par Thème (Pop, Terminal, Wireframe) : `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-156`.

Variantes : Projet (image, badge de catégorie, titre, description, étiquettes, bouton secondaire) ; Service (couleurs fixes `--service-1` à `--service-4`, identiques dans les trois Thèmes comme sur l'ancien site ; pastille d'icône ; survol : échelle `--scale-card-hover`). L'inclinaison des classes de l'ancien site n'est jamais visible (l'animation d'entrée la remplace) : elle n'est pas reprise, la prop `tilt` est retirée.
Tokens : `--card-bg` (ou accent), `--border-color`, `--border-thick`, `--radius-2xl` (Projet), `--radius-3xl` (Service), `--shadow`, `--card-hover-shadow`.
États : repos ; survol (Pop : remontée de 4 px et ombre `--shadow-hard-xl` ; Terminal : lueur `--shadow-glow-terminal` ; Wireframe : décalage de 4 px en haut à droite, sans ombre) ; focus (porté par le bouton interne) ; actif et désactivé sans objet.
Hors kit : rotation à la souris et retournement de `FlipCard.jsx` (épopée 5), zoom de l'image au survol.

### Badge

Sources : `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (catégorie en haut à droite de la carte), `ancien-portfolio/src/components/sections/Hero.jsx` (pastille d'accroche, `t.hero.badge`). Chemin : `src/components/ui/Badge.astro` (livré, story 11.2).

Figma : composant présent dans la page « UI kit » (relevé du 2026-11-21) : une variante ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-9`. Aperçu par Thème (Pop, Terminal, Wireframe) : `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-156`.

Variantes : Catégorie (étiquette sur image) ; Accroche (fond `--accent-1`, ombre ; pas de rotation visible sur l'ancien site). Tokens : `--accent-1`, `--border-color`, `--border-thin`, `--radius-lg`, `--shadow` (Terminal et Wireframe : fond du Thème, sans ombre). États : repos seulement (survol, focus, actif, désactivé sans objet : élément non interactif).

### Étiquette

Sources : `ancien-portfolio/src/styles/theme.js` (`tag`), `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (étiquettes de technologies). Chemin : `src/components/ui/Tag.astro` (livré, story 11.2).

Figma : composant présent dans la page « UI kit » (relevé du 2026-11-21) : une variante ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-11`. Aperçu par Thème (Pop, Terminal, Wireframe) : `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=8-156`.

Variantes par Thème : Pop (fond blanc, bordure noire 2 px, graisse forte) ; Terminal (transparent, bordure fine courante, opacité 80 %) ; Wireframe (blanc, bordure fine pointillée). Tokens : `--text`, `--border-color`, `--border-style`, `--border-thin`, `--radius-md`. États : repos seulement (survol, focus, actif, désactivé sans objet : élément non interactif). Écart : texte de 9 et 10 px, hors échelle.

### Autocollant (sticker)

Sources : `ancien-portfolio/src/styles/theme.js` (`sticker`), `ancien-portfolio/src/components/sections/Hero.jsx`, `ancien-portfolio/src/components/sections/Work.jsx`. Chemin : `src/components/ui/Sticker.astro` (livré, story 11.2).

Figma : composant créé le 2026-11-21 dans la page « UI kit » : une variante ; rotation de -3° (Pop) non reportée ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=29-90`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

Mot mis en valeur dans un titre. Tokens : `--sticker-bg`, `--sticker-rotate`, `--shadow`, `--radius-xl`/`--radius-2xl`, `--border-thick`. États : survol (Pop : rotation annulée, agrandissement 5 %). Variantes : Pop (lime, ombre dure), Terminal (fond vert profond, lueur), Wireframe (blanc, bordure pointillée, sans rayon).

### Titre de Section

Sources : titres `h2` de `ancien-portfolio/src/components/sections/{Work,Timeline,Skills,Services,About,Contact}.jsx`. Chemin : `src/components/ui/SectionTitle.astro` (livré, story 11.2).

Figma : composant refait le 2026-11-21 d'après le site (page « UI kit ») : Taille Bureau (72 px) ou Mobile (36 px), Mot en relief Non ou Oui, sous-titre ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=39-128`.

Composition : `h2` en majuscules, graisse noire, `--text-4xl` en mobile puis `--text-7xl` dès `md`, serré (`tracking-tight`), suivi d'un autocollant (`titleHighlight`) et d'un sous-titre `--text-xl`, opacité 60 %. Source de texte : champs Sanity, jamais écrits en dur (AD-3). États : sans objet (non interactif). Écart n° 18 : mobile à `--text-3xl` ou `--text-4xl` selon la Section.

### Conteneur

Sources : balises `section` de `ancien-portfolio/src/components/sections/*.jsx` et `ancien-portfolio/src/App.jsx`. Chemin : `src/components/ui/Section.astro` (livré, story 11.2).

Figma : composant refait le 2026-11-21 d'après le site (page « UI kit ») : Taille Bureau ou Mobile, Fond Page ou Carte, filet haut de 4 px, contenu limité à 80 rem ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=39-141`.

Deux niveaux : bandeau pleine largeur (`--border-thick` en haut, fond `--bg` ou `--card-bg` en alternance, marges verticales `--space-12` puis 24 unités dès `md`, marges latérales `--space-6`) et boîte centrée (`max-w-7xl`, 80 rem, parfois 64 rem ou 72 rem) sur grille à 12 colonnes dès `md`. Landmarks : `section` avec `aria-labelledby` vers son titre. États : sans objet (élément non interactif). Marges latérales : `--space-6` (`--space-4` dans Skills et About en mobile).

### Sélecteur

Sources : `ancien-portfolio/src/components/UI/InteractiveElements.jsx` (`CustomLangSelector`), basculeur de Thème et de son de `ancien-portfolio/src/components/sections/Navbar.jsx`. Chemin : `src/components/ui/Select.astro` (livré, story 11.2 ; la liste déroulante interactive est un îlot, épopée 3). Variantes : `language` (déclencheur, majuscules `--text-sm`) et `row` (ligne de réglage du menu : Thème et son, `--text-base`, sans majuscules, survol `--color-gray-50`).

Figma : composant créé le 2026-11-21 dans la page « UI kit » : Variante (langue, ligne) × État (repos, survol, ouvert, focus) ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=30-85`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

Variantes : bouton déclencheur (bordure épaisse, icône globe, majuscules `--text-sm`, ombre) et liste (fond `--nav-bg`, bordure épaisse, coche de la valeur active). Variante basculeur de Thème ou de son : voir Bouton. États : repos ; survol (opacité) ; ouvert (chevron tourné) ; actif (décalage de 1 px) ; focus absent. L'ancien site ne gère ni le clavier ni les rôles ARIA de la liste : à corriger au kit.

### Champ

Sources : `ancien-portfolio/src/components/sections/Contact.jsx` (nom, e-mail, message). Chemin : `src/components/ui/Field.astro` (livré, story 11.3), avec `src/components/ui/FieldMessage.astro` (aide et erreur) et `src/components/ui/Checkbox.astro` (case à cocher, absente de l'ancien site).

Figma : composant créé le 2026-11-21 dans la page « UI kit » : Type (texte, zone de texte) × État (repos, focus, erreur, désactivé) ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=30-169`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

Variantes : texte, e-mail, zone de texte (non redimensionnable). Tokens : fond `--nav-bg`, `--border-color`, `--border-thick`, `--radius-xl`, `--shadow`, `--text`. États : repos ; focus (anneau jaune de 4 px, seul style de focus de l'ancien site) ; erreur et désactivé absents de l'ancien site (il utilise `alert()`, interdit ici) : ajoutés en 11.3, erreur en `--error-color` (rouge par Thème) avec bordure en pointillés, préfixe texte et région `aria-live` ; désactivé à `--opacity-disabled` (exempté du contraste, WCAG 1.4.3) ; réussite : bloc vert (`green-100`, `green-800`).

### Case à cocher

Chemin : `src/components/ui/Checkbox.astro` (livré, story 11.3). Absente de l'ancien site, ajoutée pour le consentement du formulaire de contact. Figma : aucun composant individuel identifié. Tokens : `--text` (`accent-color`), `--size-target-min`, `--focus-*`, `--field-ring-shadow`, `--error-color`, `--opacity-disabled`. États : repos, coché, focus, erreur (contour en pointillés, préfixe texte, région `aria-live`), désactivé.

Figma : composant créé le 2026-11-21 dans la page « UI kit » : État (repos, cochée, focus, erreur, désactivée) ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=30-108`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

### Message de champ

Chemin : `src/components/ui/FieldMessage.astro` (livré, story 11.3). Aide (paragraphe, absent sans contenu) ou erreur (région `aria-live="polite"` toujours rendue, réduite visuellement quand elle est vide). Tokens : `--text`, `--opacity-soft`, `--error-color`, `--text-sm`.

### Figma : composants de la maquette ajoutés au kit (relevé du 2026-11-21)

La page « UI kit » est rangée en sections Figma : Boutons, Liens et titres, Navigation et curseur, Cartes et étiquettes, Formulaires, Parcours, Compétences, Maquette, puis cinq sections d'icônes (navigation et actions, réglages et mise en page, interactions et effets, domaines de compétence, contact et réseaux).

Ces composants figurent dans le cadre « atomic design » de la page « maquette » ; ils sont recréés dans « UI kit » avec les variables de Thème. Pas encore de primitive `.astro` : à livrer avec la story qui les consomme.

- **Bouton avec flèche** (`node-id=33-283`) : CTA « Voir mes projets → », Bouton principal suivi d'une flèche (trait 3 px) ; états Repos, Survol, Focus, Désactivé. Prévoir une prop d'icône sur `Button.astro`.
- **Bouton de fermeture** (`node-id=33-296`) : carré 62 px, rayon 14, bordure 4 px, croix 28 px ; survol corail ; états Repos, Survol, Focus. Sert à la Fenêtre de projet (épopée 5) ; nom accessible « Fermer » par prop.
- **Logo** (`node-id=33-301`) : « DA SILVA », Inter Bold 128 ; variantes Sombre (blanc sur noir) et Citron (noir sur citron (#ccff00)).
- **Bouton lecture** (`node-id=35-72`) : cercle 82 px, fond crème, bordure 4 px, triangle noir ; survol agrandi (échelle 1,1 de l'ancien site, `FlipCard.jsx`) et citron ; états Repos, Survol, Focus. Nom accessible « Lire la vidéo » par prop.
- **Fenêtre de projet** (`node-id=35-93`) : carte retournable de la maquette, 1167 × 658 px, bordure 4 px, ombre dure 8 px ; variantes Texte vert, Texte rose (Titre de Section « PROJETS RÉALISÉS », contenu) et Média (image ou vidéo avec Bouton lecture). Le vert est la primitive `--color-mint`. Hors kit : livrée avec l'épopée 5.
- **Barre de navigation** (`node-id=41-145`) : Taille Bureau, Mobile fermé, Mobile ouvert ; boîte à outils à bordure de 4 px avec quatre poignées d'angle, logo, quatre Liens de Navigation, réglages (apparence, audio, langue) ; menu déroulant mobile. Source : `ancien-portfolio/src/components/sections/Navbar.jsx`. À livrer en story 3.1.
  Alignée sur la maquette : marque graphique à gauche, liens Projets, Parcours, Compétence et Contacts en 24 px et casse normale ; le menu mobile garde les majuscules du site.
- **Panneau des réglages** (`node-id=84-186`, page « Navigation », section « Réglages ») : panneau ouvert par la roue des réglages, avec Apparence, Audio et Langue, en deux états (repos, langues ouvertes). Composants : Réglage (`84-66`, Pop, Terminal, Wireframe, Muet, Son actif), Pastille ON / OFF (`84-22`), Option de langue (`84-79`) et Liste de langues (`84-80`, cinq langues et « Afficher plus »). Source : `Navbar.jsx` et `InteractiveElements.jsx` (`CustomLangSelector`). Story 3.1.
- **Badge** : texte réel du site, « 👋 Étudiant - Product designer ».
- **Pastille du curseur** (`node-id=41-153`) : cercle de 32 px, bordure 2 px ; jaune en Pop, verte en Terminal, bleue en Wireframe (variable Figma `color/cursor-bg` par Thème). Source : `InteractiveElements.jsx` (`CursorFollower`). Épopée 6 : le token de couleur du curseur reste à ajouter à `tokens.css` avec elle.
- **Illustration d'accueil** (`node-id=64-244`, page « Composants de la maquette ») : dessin vectoriel de blocs géométriques du bandeau d'accueil, 684 × 730 px, dans un conteneur en auto-layout ; jaune, bleu, rose et menthe liés aux variables. Décorative : alt vide ou aria-hidden. Au code, un SVG optimisé, pas un composant `.astro`. Une seule version : les variantes Terminal et Wireframe n'existent pas sur la maquette.
- **Page Accueil** (ajoutée après relecture de la maquette) : Carte de projet (`69-256`, 5 teintes dont Rose, repos et survol : illustration, badge de catégorie, titre avec filet, description, étiquettes, bouton « Détails »), Carte illustrée (`71-177`) et Carte de localisation (`71-185`) de la section « Qui suis-je ? », Carte de contact (`71-197` : titre, courriel, téléphone, trois champs, bouton « Envoyer ») et Bouton avec icône (`71-176`, avant ou après : « Télécharger CV », « Envoyer »). Sources : `Work.jsx`, `About.jsx`, `Contact.jsx`. Stories 3.2 à 3.4.
- **Fenêtre de détail de projet** (`72-485`, page « Composants de la maquette ») : deux volets (aperçu, flèches et pagination ; titre, encadré de description et lien du projet), en 4 teintes. La Pagination de galerie existe en 9, 5 et 2 points. Épopée 5.
- **Marque** (page « Composants de la maquette ») : image du logo de la barre. L'icône Fichier a été ajoutée aux icônes.
- **Galerie de projets** (`node-id=62-618`, page « Galerie de projets ») : composition de la galerie d'affiches d'un projet de graphisme, en quatre teintes. Composants : Flèche de galerie (`62-291`, direction, état, teinte), Point de pagination (`62-300`), Pagination de galerie (`62-341`), Indice de clic (`62-378`), Affiche de galerie (`62-395`, centrale ou latérale) et le Bouton de fermeture existant. Source : `GraphicDesignModal.jsx` et le cadre « projet de graphisme » de la maquette. Épopée 5.
- **Teintes de catégorie** : collection de variables Figma « Catégorie de projet » à quatre modes (Violet : graphisme, Menthe : audiovisuel, Jaune et Bleu : développement), avec un accent et une teinte claire par mode. Au code, un token par catégorie reste à ajouter à `tokens.css` avec l'épopée 5.
- **Couleurs de la maquette passées en variables** : les trois couleurs de l'illustration d'accueil (jaune, bleu, rose), les teintes claires des points de pagination, un gris de repère d'image et trois gris d'interface.
- **Pied de page** (`node-id=48-148`) : Taille Bureau et Mobile, en auto-layout ; quatre étages dans un conteneur à bordures de 4 px : identité (bio, logo) et deux colonnes de Liens de pied de page, contact (adresse, disponibilité, LinkedIn, repère), nom géant sur deux bandes dont une noire, signature et mentions légales. Les bordures suivent la variable de bordure du Thème, alors que l'ancien site les fixait en noir. Source : `ancien-portfolio/src/components/sections/Footer.jsx`. Story 3.3.
- **Modale des mentions légales** (`node-id=49-116`) : Taille Bureau (672 px) et Mobile ; fond de page, bordure 4 px, rayon 12 px, grande ombre ; titre souligné, cinq sections dont le titre est sur fond noir, mise à jour en pointillés, bouton de fermeture rond. Sur le site, elle s'affiche sur un fond noir à 60 % avec flou, se ferme par le bouton, le clic extérieur ou Échap et défile à l'intérieur. Source : `Footer.jsx`. Le texte vient de Sanity ; celui de l'ancien site cite l'hébergeur Hostinger, à mettre à jour avec Vercel. Story 3.3.
- **Parcours** : Étiquette de date (`node-id=43-32`), Point de frise (`43-36`), Carte de parcours (`43-37`) et Frise de parcours (`43-47`) : ligne verticale de 6 px et repères jaune et rose en alternance (la frise ne contient pas les Cartes de parcours, qui se posent à droite des repères) ; la Carte de parcours a une ombre dure de 8 px. Source : `Timeline.jsx`. Stories 3.3 et 3.4.
- **Compétences** : Pastille d'icône (`44-78`), Carte de compétence (`44-127`, accents rose, bleu, jaune, vert, grande icône en filigrane), Puce de compétence (`44-180`, rectangle ou pilule, huit teintes), Zone des compétences (`44-181`, tirets de 4 px) et Barre d'aide (`44-234`, avec le Bouton compact secondaire). Source : `Services.jsx` et `Skills.jsx`. Les puces déplaçables relèvent de l'épopée 6.
- **Icônes** (`node-id=45-115`) : 45 composants « Icône / Nom », ceux que l'ancien site importe de `lucide-react` (flèches, chevrons, menu, réglages, volume, réseaux, domaines de compétence, etc.), en 24 px, trait de 2 px, extrémités arrondies, couleur liée à la variable de texte du Thème. Source : bibliothèque Lucide, licence ISC (gratuite, AD-16). Au code, importer `lucide-static` ou les SVG, jamais des dessins à la main.

## Hors kit

| Motif | Source | Renvoi |
| --- | --- | --- |
| Bandeau défilant | `ancien-portfolio/src/components/UI/InteractiveElements.jsx` (`Marquee`) | non migré (CLAUDE.md) |
| Confettis | idem (`Confetti`) | épopée 6 (Mode fête) |
| Curseur personnalisé | idem (`CursorFollower`) | épopée 6 |
| Carte à gratter | `ancien-portfolio/src/components/UI/ScratchCard.jsx` | épopée 6 |
| Carte retournable | `ancien-portfolio/src/components/UI/FlipCard.jsx` | épopée 5 |
| Fenêtres de projet, galerie, détail | `ancien-portfolio/src/components/UI/{ProjectModal,StandardProjectModal,GraphicDesignModal,CreationDetail}.jsx` | épopée 5 |
| Compétences déplaçables | `ancien-portfolio/src/components/sections/Skills.jsx` | épopée 6 |
| Sections composées (Footer, Timeline, About, grille des Compétences, pastille d'icône des Services) | `ancien-portfolio/src/components/sections/{Footer,Timeline,About,Skills,Services}.jsx` | stories 3.3 et 3.4 : compositions des primitives du kit, pas des primitives |
| Poignées d'angle de la barre | `ancien-portfolio/src/components/sections/Navbar.jsx` | story 3.1 (barre, pas une primitive) |

## Échelle typographique

Tailles `--text-*` existantes, usages relevés (les sources sont l'ensemble de `ancien-portfolio/src/components`) : `--text-sm` 21, `--text-xs` 20, `--text-xl` 16, `--text-3xl` 16, `--text-2xl` 13, `--text-lg` 12, `--text-4xl` 8, `--text-base` 7, `--text-5xl`/`--text-6xl`/`--text-7xl` 7 chacun, `--text-8xl` 1.

| Nom | Valeur | Emploi |
| --- | --- | --- |
| Corps | `--text-base` à `--text-lg` | paragraphes |
| Détail | `--text-xs`, `--text-sm` | étiquettes, boutons de carte, libellés |
| Sous-titre | `--text-xl`, `--text-2xl` | sous-titres de Section |
| Titre de carte | `--text-xl` à `--text-3xl` | cartes Projet et Service |
| Titre de Section | `--text-4xl` mobile, `--text-7xl` dès `md` | `h2` |
| Titre Hero | `--text-2xl` mobile, jusqu'à `--text-8xl` dès `xl` | `h1` |

Graisses : `--font-weight-black` 59 usages, `--font-weight-bold` 45, `--font-weight-medium` 9. Interlignes : `leading-none` (1) 8, `leading-relaxed` (1,625) 9, `leading-tight` (1,25) 4, `leading-snug` 1, `leading-[0.9]`/`[0.8]` (Hero). Espacement des lettres : `tracking-wider` 15, `tracking-tight` 7, `tracking-widest` 6, `tracking-tighter` 6.

## Échelle d'espacement

Existant : `--space-1` (0,25 rem), `-2`, `-3`, `-4`, `-6`, `-8`, `-12`, `-16`. Usages : `gap-2` 28, `gap-4` 20, `px-4` 19, `p-8` 16, `p-4` 13, `p-2` 13, `px-6` 12, `py-4` 11, `gap-3` 11, `gap-8` 10, `py-1` 9, `gap-12` 8, `py-12` 6, `py-3` 6, `py-24` 5, `px-8` 5, `p-5` 4.

| Nom | Correspondance | Emploi |
| --- | --- | --- |
| Très serré | `--space-1`, `--space-2` | icône et texte, étiquettes |
| Serré | `--space-3`, `--space-4` | boutons, boîtes de carte |
| Moyen | `--space-6`, `--space-8` | corps de carte, grilles |
| Large | `--space-12`, `--space-16` | marges de Section en mobile |
| Très large | **absent** (6 rem) | marges de Section dès `md` (`py-24`) |

## Points de rupture

Approche mobile d'abord (Tailwind). Usages : `md:` 161, `lg:` 54, `sm:` 8, `xl:` 2. `--bp-*` sont documentaires, non utilisables dans `@media` (voir `tokens.css`).

| Nom | Largeur | Règle de passage |
| --- | --- | --- |
| Mobile | jusqu'à 767 px | une colonne, menu replié en panneau déroulant, titres réduits, marges verticales de 3 rem |
| Tablette | 768 px (`md`) | **principal point de bascule** : barre complète avec réglages, grilles à 12 colonnes (cartes Projet sur 2 colonnes), marges verticales de 6 rem, titres de Section à `--text-7xl` |
| Bureau | 1024 px (`lg`) et 1280 px (`xl`) | surtout les tailles du Hero et les gouttières ; `sm` (640 px) ajuste le Hero |

Effet par primitive : Bouton (CTA empilés en mobile, en ligne dès `sm`), Lien de navigation (panneau en mobile, cellules dès `md`), Carte (pleine largeur, 6 colonnes sur 12 dès `md`), Titre de Section (`--text-4xl` → `--text-7xl`), Conteneur (marges latérales `--space-4` ou `--space-6`, boîte `max-w-7xl`), Sélecteur (pleine largeur dans le menu mobile, `w-48` en bureau), Champ (pleine largeur, nom et e-mail côte à côte dès `md`).

## Écarts à valider par Léandro

**Mise à jour story 11.2 (décision de Léandro : design strictement identique à l'ancien site).** Chaque écart concernant une primitive livrée a été résolu par un token à la valeur exacte de l'ancien site (section « Kit UI » de `tokens.css`) ; les écarts d'accessibilité qui en résultent sont consignés dans `docs/ajustements-visuels.md`. Le tableau ci-dessous garde le constat d'origine.

| # | Valeur ou état de l'ancien site | Où | Absent de `tokens.css` | Proposition |
| --- | --- | --- | --- | --- |
| 1 | Anneau de focus jaune 4 px sur les champs ; aucun focus ailleurs | `Contact.jsx` | pas de token de focus ; WCAG 2.2 exige un focus visible | token `--focus-ring` par Thème, à décider |
| 2 | État désactivé (opacité 70 %, curseur d'attente) | `Contact.jsx` | aucun token | token d'opacité désactivée |
| 3 | Gris `gray-50/100/200/300/400/500/800`, `slate-200`, `blue-50/300/500`, `green-100/300/600/700/800`, `yellow-200/400`, noir à 5/20/60 % | sélecteur, panneau de réglages, pied de page, succès du formulaire | absents (seuls `--color-wire-hover` = blue-50 existe) | tokens sémantiques (survol, fond atténué, succès) |
| 4 | Bordure noire fixe et fonds blancs fixes dans les panneaux (`border-black`, `bg-white`) | `Footer.jsx`, `Navbar.jsx`, `InteractiveElements.jsx` | ne suivent pas le Thème | utiliser `--border-color` et `--card-bg` ; changement visible en Terminal et Wireframe |
| 5 | Fond de la barre extérieure : Pop `#F5F5F0`, Terminal noir, Wireframe blanc | `Navbar.jsx` | `--color-cream-alt` existe, pas de token sémantique | token `--header-bg` |
| 6 | Bordures 1 px et 3 px (`border-[3px]` mobile du sticker, `border-[2px]`) | `theme.js`, `ProjectComponents.jsx` | `--border-thin` 2 px et `--border-thick` 4 px seulement | ajouter 1 px et 3 px, ou aligner |
| 7 | Textes de 9 px et 10 px | `ProjectComponents.jsx` | hors échelle (`--text-xs` = 12 px) ; sous le seuil de lisibilité | aligner sur `--text-xs` |
| 7b | Texte d'affichage `text-[14vw]`, `text-[13.5vw]`, `leading-[0.8]` | `Footer.jsx` | taille fluide absente | décision séparée : token fluide (`clamp`) ou taille fixe |
| 8 | Espacements 1,25 rem (`p-5`), 6 rem (`py-24`), 0,375 rem (`px-1.5`) | cartes, Sections, étiquettes | absents de `--space-*` | ajouter `--space-5` et `--space-24` ; décider de 0,375 rem |
| 9 | Ombre `0 0 10px rgba(74,222,128,.5)` du sticker Terminal et ombre portée `drop-shadow(4px 4px 0 rgba(0,0,0,.1))` de la barre | `theme.js`, `Navbar.jsx` | `--shadow-soft-sticker` couvre seulement le second cas partiellement | token dédié |
| 10 | Rotation du sticker en mobile identique, `rotate-[-3deg]` ; hover rotation 0 et échelle 1,05 | `theme.js` | `--rotate-sticker` existe, pas le survol | token de survol si gardé |
| 11 | Durées 300 ms et 500 ms ; 700 ms (zoom d'image), 20 s (bandeau) | partout | `--duration-base` et `--duration-slow` ; 700 ms absente | décider du zoom d'image |
| 12 | Aucun style `prefers-contrast: more` ni `forced-colors` | — | à créer pour la story 11.2 | tokens dédiés (consigne de 11.2) |
| 13 | Z-index 1 à 9999 en désordre (`z-[100]`, `z-50`, `z-[60]`) | menu, fenêtres, curseur | pas d'échelle | échelle de couches, à poser en 3.1 (`overlay.ts`) |
| 14 | Textes en dur : « Apparence », « Audio », « Langue », « Sound », « Muet », `title="Settings"`, `aria-label` de repli (« Open menu », « Close menu »), `alt` « Léandro.DS » | `Navbar.jsx` | contre AD-3 ; noms accessibles du basculeur et du sélecteur à fournir par props | clés `uiStrings`, à traiter en 3.1 |
| 15 | Cibles interactives sous 24×24 px (boutons `py-1`, étiquettes cliquables, cellules compactes) | `Skills.jsx`, `Navbar.jsx` | WCAG 2.2 (2.5.8) | taille minimale en token ou classe du kit |
| 16 | Contrastes non audités : textes à opacité 50 à 80 %, `gray-400/500`, textes de 9 à 10 px | `Work.jsx`, `Footer.jsx`, `ProjectComponents.jsx` | aucun contrôle de contraste | audit en 11.2, écart consigné (FR-23) |
| 17 | Aucun traitement de `prefers-reduced-motion` : décalages, rotations, échelles, zoom d'image au survol | toutes les primitives | aucun token ni règle | règle de mouvement réduit en 11.2 |
| 18 | Titre de Section : `--text-3xl` (Timeline, Skills, About) ou `--text-4xl` (Work, Services, Contact) en mobile | `sections/*.jsx` | incohérence | une seule taille mobile à fixer |

Sécurité du dépôt : l'e-mail et le téléphone présents dans `Contact.jsx` et `Footer.jsx` ne sont volontairement pas recopiés ici (FR-16, story 7.3).

Figma : composant créé le 2026-11-21 dans la page « UI kit » : Type (aide, erreur) ; `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=30-60`. Variables ajoutées : `color/error`, `color/button-border`, `color/button-primary-hover-bg`, `color/button-secondary-hover-bg`, `color/select-bg`.

