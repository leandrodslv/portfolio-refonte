# Inventaire des composants — source de vérité du kit

Relevé de l'ancien site (`ancien-portfolio/src`, lecture seule) rapproché de `tokens.css`. Il fixe ce que les stories 11.2 et 11.3 construisent : rien n'est inventé, tout écart est listé en fin de document pour validation de Léandro avant tout ajout de token (AD-6).

Conventions : « Thème » = Pop (P), Terminal (T), Wireframe (W). Les tokens cités existent dans `tokens.css`. Les composants Figma : maquette `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio`, cadre « atomic design » (`node-id=1-908`) ; le rattachement composant par composant est à faire en story 4.4.

Livraison : story 11.2 pour toutes les primitives sauf Champ ; story 11.3 pour Champ. Les comptes d'usage ci-dessous sont un relevé du 2026-11-20 par `grep -o` sur `ancien-portfolio/src/components` ; ils servent à classer les valeurs, pas à les contrôler.

Source commune des valeurs par Thème : `ancien-portfolio/src/styles/theme.js` (`themeConfig`), passé en prop `ts` à tous les composants.

## Primitives du kit

### Bouton

Sources : `ancien-portfolio/src/components/sections/Hero.jsx` (CTA), `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (bouton de carte), `ancien-portfolio/src/components/sections/Contact.jsx` (envoi), `ancien-portfolio/src/components/sections/Skills.jsx` (bouton « Organiser »), `ancien-portfolio/src/components/UI/ProjectModal.jsx` (fermeture).
Chemin : `src/components/ui/Button.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

| Variante | Rôle | Tokens communs |
| --- | --- | --- |
| Principal | CTA, envoi | `--button-primary-bg`, `--button-primary-text`, `--border-color`, `--border-thick`, `--shadow` |
| Secondaire | CTA secondaire, bouton de carte | `--button-secondary-bg`, `--button-secondary-text`, `--border-color`, `--border-thick`, `--shadow` |
| Basculeur | « Organiser », son, Thème | `--border-color`, `--border-thin`, `--shadow`, `--text` |

Par Thème : Pop, bordure noire pleine, ombre dure `--shadow-hard-sm`, principal bleu `--color-primary-action` ; Terminal, bordure `--color-term-border`, sans ombre, principal `--color-term-button` (survol `--color-term-button-hover`), secondaire noir à bordure verte (survol `--color-term-surface`) ; Wireframe, bordure `--color-wire-text` pleine (pas pointillée) pour les boutons, sans ombre, principal `--color-wire-line`, secondaire transparent.

La variante Fermeture (bouton de fermeture des fenêtres) est **hors kit** tant que la Fenêtre de projet n'existe pas (épopée 5) ; elle n'est donc pas listée parmi les variantes du kit.

États : repos ; survol (Pop : l'ombre disparaît et le bouton se décale de 3 px ; Terminal : fond `--color-term-button-hover` ; Wireframe : fond léger) ; focus (**aucun style propre dans l'ancien site** sauf anneau jaune sur les champs, voir écarts) ; actif (décalage de 1 à 2 px, ombre retirée, réduction d'échelle) ; désactivé (opacité réduite, curseur d'attente, seulement sur l'envoi du formulaire).
Hors kit : animation `whileHover` de rotation (Framer Motion, interdit dans le JS initial, AD-7).

### Lien

Sources : `ancien-portfolio/src/components/sections/Navbar.jsx` (liens de menu), `ancien-portfolio/src/components/sections/Footer.jsx` (liens du pied de page), `ancien-portfolio/src/components/sections/Contact.jsx` (liens e-mail et téléphone). Chemin : `src/components/ui/Link.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

| Variante | Rôle | Tokens |
| --- | --- | --- |
| Navigation | cellule du menu, majuscules, bordure droite | `--text`, `--border-color`, `--border-thick` |
| Pied de page | ligne avec séparateur et flèche au survol | `--text`, `--border-color` |
| Texte souligné | coordonnées de contact (soulignement épais) | `--text` |

États : repos ; survol (voile `noir 5 %`, barre d'accent de 4 px sous le lien de menu) ; focus et actif absents de l'ancien site ; désactivé sans objet. Un lien qui ouvre une nouvelle fenêtre ou télécharge doit l'annoncer (story 11.2).

### Carte

Sources : `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (`ProjectCard`), `ancien-portfolio/src/components/sections/Services.jsx` (carte de service). Chemin : `src/components/ui/Card.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Variantes : Projet (image, badge de catégorie, titre, description, étiquettes, bouton secondaire) ; Service (fond d'accent `--accent-1` à `--accent-5`, pastille d'icône, légère rotation `--rotate-tilt-sm`/`--rotate-tilt-md`).
Tokens : `--card-bg` (ou accent), `--border-color`, `--border-thick`, `--radius-2xl` (Projet), `--radius-3xl` (Service), `--shadow`, `--card-hover-shadow`.
États : repos ; survol (Pop : remontée de 4 px et ombre `--shadow-hard-xl` ; Terminal : lueur `--shadow-glow-terminal` ; Wireframe : décalage de 4 px en haut à droite, sans ombre) ; focus (porté par le bouton interne) ; actif et désactivé sans objet.
Hors kit : rotation à la souris et retournement de `FlipCard.jsx` (épopée 5), zoom de l'image au survol.

### Badge

Sources : `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (catégorie en haut à droite de la carte), `ancien-portfolio/src/components/sections/Hero.jsx` (pastille d'accroche, `t.hero.badge`). Chemin : `src/components/ui/Badge.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Variantes : Catégorie (étiquette sur image) ; Accroche (fond `--accent-1`, rotation `--rotate-tilt-md`, ombre). Tokens : `--accent-1`, `--border-color`, `--border-thin`, `--radius-lg`, `--shadow` (Terminal et Wireframe : fond du Thème, sans ombre). États : repos seulement (survol, focus, actif, désactivé sans objet : élément non interactif).

### Étiquette

Sources : `ancien-portfolio/src/styles/theme.js` (`tag`), `ancien-portfolio/src/components/UI/ProjectComponents.jsx` (étiquettes de technologies). Chemin : `src/components/ui/Tag.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Variantes par Thème : Pop (fond blanc, bordure noire 2 px, graisse forte) ; Terminal (transparent, bordure fine courante, opacité 80 %) ; Wireframe (blanc, bordure fine pointillée). Tokens : `--text`, `--border-color`, `--border-style`, `--border-thin`, `--radius-md`. États : repos seulement (survol, focus, actif, désactivé sans objet : élément non interactif). Écart : texte de 9 et 10 px, hors échelle.

### Autocollant (sticker)

Sources : `ancien-portfolio/src/styles/theme.js` (`sticker`), `ancien-portfolio/src/components/sections/Hero.jsx`, `ancien-portfolio/src/components/sections/Work.jsx`. Chemin : `src/components/ui/Sticker.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Mot mis en valeur dans un titre. Tokens : `--sticker-bg`, `--sticker-rotate`, `--shadow`, `--radius-xl`/`--radius-2xl`, `--border-thick`. États : survol (Pop : rotation annulée, agrandissement 5 %). Variantes : Pop (lime, ombre dure), Terminal (fond vert profond, lueur), Wireframe (blanc, bordure pointillée, sans rayon).

### Titre de Section

Sources : titres `h2` de `ancien-portfolio/src/components/sections/{Work,Timeline,Skills,Services,About,Contact}.jsx`. Chemin : `src/components/ui/SectionTitle.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Composition : `h2` en majuscules, graisse noire, `--text-4xl` en mobile puis `--text-7xl` dès `md`, serré (`tracking-tight`), suivi d'un autocollant (`titleHighlight`) et d'un sous-titre `--text-xl`, opacité 60 %. Source de texte : champs Sanity, jamais écrits en dur (AD-3). États : sans objet (non interactif). Écart n° 18 : mobile à `--text-3xl` ou `--text-4xl` selon la Section.

### Conteneur

Sources : balises `section` de `ancien-portfolio/src/components/sections/*.jsx` et `ancien-portfolio/src/App.jsx`. Chemin : `src/components/ui/Section.astro` (livré, story 11.2).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Deux niveaux : bandeau pleine largeur (`--border-thick` en haut, fond `--bg` ou `--card-bg` en alternance, marges verticales `--space-12` puis 24 unités dès `md`, marges latérales `--space-6`) et boîte centrée (`max-w-7xl`, 80 rem, parfois 64 rem ou 72 rem) sur grille à 12 colonnes dès `md`. Landmarks : `section` avec `aria-labelledby` vers son titre. États : sans objet (élément non interactif). Marges latérales : `--space-6` (`--space-4` dans Skills et About en mobile).

### Sélecteur

Sources : `ancien-portfolio/src/components/UI/InteractiveElements.jsx` (`CustomLangSelector`), basculeur de Thème et de son de `ancien-portfolio/src/components/sections/Navbar.jsx`. Chemin : `src/components/ui/Select.astro` (livré, story 11.2 ; la liste déroulante interactive est un îlot, épopée 3).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Variantes : bouton déclencheur (bordure épaisse, icône globe, majuscules `--text-sm`, ombre) et liste (fond `--nav-bg`, bordure épaisse, coche de la valeur active). Variante basculeur de Thème ou de son : voir Bouton. États : repos ; survol (opacité) ; ouvert (chevron tourné) ; actif (décalage de 1 px) ; focus absent. L'ancien site ne gère ni le clavier ni les rôles ARIA de la liste : à corriger au kit.

### Champ

Sources : `ancien-portfolio/src/components/sections/Contact.jsx` (nom, e-mail, message). Chemin : `src/components/ui/Field.astro` (livré, story 11.3), avec `src/components/ui/FieldMessage.astro` (aide et erreur) et `src/components/ui/Checkbox.astro` (case à cocher, absente de l'ancien site).

Figma : aucun composant individuel identifié (cadre « atomic design », `https://www.figma.com/design/y9s1jKHK1GxkLbjYf2WqU4/Portfolio?node-id=1-908`).

Variantes : texte, e-mail, zone de texte (non redimensionnable). Tokens : fond `--nav-bg`, `--border-color`, `--border-thick`, `--radius-xl`, `--shadow`, `--text`. États : repos ; focus (anneau jaune de 4 px, seul style de focus de l'ancien site) ; erreur et désactivé absents de l'ancien site (il utilise `alert()`, interdit ici) : ajoutés en 11.3, erreur en `--error-color` (rouge par Thème) avec bordure en pointillés, préfixe texte et région `aria-live` ; désactivé à `--opacity-disabled` (exempté du contraste, WCAG 1.4.3) ; réussite : bloc vert (`green-100`, `green-800`).

### Case à cocher

Chemin : `src/components/ui/Checkbox.astro` (livré, story 11.3). Absente de l'ancien site, ajoutée pour le consentement du formulaire de contact. Figma : aucun composant individuel identifié. Tokens : `--text` (`accent-color`), `--size-target-min`, `--focus-*`, `--field-ring-shadow`, `--error-color`, `--opacity-disabled`. États : repos, coché, focus, erreur (contour en pointillés, préfixe texte, région `aria-live`), désactivé.

### Message de champ

Chemin : `src/components/ui/FieldMessage.astro` (livré, story 11.3). Aide (paragraphe, absent sans contenu) ou erreur (région `aria-live="polite"` toujours rendue, réduite visuellement quand elle est vide). Tokens : `--text`, `--opacity-soft`, `--error-color`, `--text-sm`.

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
