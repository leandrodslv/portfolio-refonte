
## Deferred from: code review of story 1.1 (2026-11-19)

- **Page d'essai en production sur `/`** : titre, `<h1>`, libellé `Compteur`, `lang="fr"` et `data-theme="pop"` en dur (AD-3), îlot `Compteur` et son `data-hydrate` n'existant que pour les tests (`src/pages/index.astro`, `src/islands/Compteur.tsx`). Provisoire : à remplacer par la vraie Page d'accueil (épopée 3) ; le budget JS devra alors être remesuré sans `Compteur`.
- **Le serveur de test ne reproduit pas Vercel** (`tests/support/serve.mjs`) : le champ `source` de `vercel.json` est ignoré (toutes les règles s'appliquent à tous les chemins), `sirv` tourne en `dev: true`, redirections et `cleanUrls` ignorés. Devient réel dès que la story 1.5 ajoute des en-têtes par route. Règle à régler : appliquer `source` (path-to-regexp) ou tester sur un déploiement preview.
- **Thème non vérifié au rendu** (`src/styles/global.test.ts`) : seules des regex sur le texte de `global.css`. Un token renommé laisserait la CI verte. Ajouter un `toHaveCSS` Playwright (fond du `body`, bordure et ombre du bouton) ou le couvrir par les tests visuels.
- **En-têtes de production et CSP peu testés** (`tests/headers/csp.spec.ts`) : le test prouve seulement que `serve.mjs` relaie `vercel.json`, pas que Vercel sert ces en-têtes ; aucun test négatif (script inline non autorisé bloqué) ni garde-fou qui échoue si `vercel.json` gagne un `script-src`. `default-src`, `object-src`, `base-uri` absents de la balise meta : à traiter avec la story 1.5.

## Deferred from: code review of story 1.1, seconde relecture (2026-11-19)

- **Alias `preact/compat` non consigné dans le spine ni `CLAUDE.md`** : AD-7 ne l'autorise qu'en repli si le seuil est intenable (il était tenu à 68,0 Ko, avec 2 Ko de marge) ; la table des versions n'a ni `preact` 11.2.0, ni `preact-render-to-string` 6.8.3, ni `sirv`, et `CLAUDE.md` dit toujours « îlots React 19 ». À faire : amender AD-7 (décision de Léandro, alias adopté, qualité brotli q4, Ko = 1 024 octets), compléter la table, ajuster la ligne Stack de `CLAUDE.md`.
- **Tests et Storybook sur React, production sur Preact** : l'alias n'existe que dans `astro.config.mjs` ; `vitest.config.ts`, `.storybook/` et `jsxImportSource` de `tsconfig.json` restent sur React. Sans effet tant que `Compteur` est le seul îlot ; à régler avant le premier vrai îlot testé ou documenté en Storybook (partager l'alias, ou tester sous Preact). Risque de compatibilité à anticiper pour les bibliothèques React-only (ALTCHA, animation).
- **Qualité brotli q4 non confirmée** (`tests/e2e/budget-js.spec.ts`) : hypothèse de proximité avec la compression de Vercel. À vérifier sur le Site de dev (story 1.2) en comparant avec le `content-length` réel des fichiers JS.

## Deferred from: story 1.2 (spec-1-2-deploiement-automatique-dev-et-prod), 2026-11-20

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-deploiement-automatique-dev-et-prod.md`
  summary: la règle `has: host` de `vercel.json` (`.*-git-dev-.*\.vercel\.app`) n'est pas confirmée sur un vrai déploiement
  evidence: sévérité moyenne non vérifiée ; si l'expression ne correspond pas, l'en-tête `X-Robots-Tag` manque sur le Site de dev (la balise et `robots.txt` le couvrent encore). À régler au premier déploiement de `dev` : `curl -I` sur l'alias et ajuster l'expression et `src/vercel.test.ts`.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-deploiement-automatique-dev-et-prod.md`
  summary: la protection des déploiements Vercel (`all_except_custom_domains`) couvre aussi la production sur `*.vercel.app`
  evidence: les adresses ne sont pas publiques tant qu'un domaine personnalisé n'existe pas ; à trancher avant la mise en ligne (désactiver ou étendre la protection) et avant les tests de la CI sur des adresses Vercel.

## Deferred from: story 1.3 (spec-1-3-chaine-ci-bloquante-sur-chaque-pull-request), 2026-11-20

- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-chaine-ci-bloquante-sur-chaque-pull-request.md`
  summary: plancher SEO de Lighthouse à 90 au lieu de 95
  evidence: la page d'essai n'a pas de meta description (SEO 91) et le texte doit venir de Sanity ; remettre 0.95 dans `lighthouserc.json` avec la vraie Page d'accueil (épopée 3). Écart consigné dans `docs/ci.md`.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-3-chaine-ci-bloquante-sur-chaque-pull-request.md`
  summary: favicon absent (erreur de console, bonnes pratiques 96)
  evidence: Lighthouse relève `errors-in-console` ; à régler avec le favicon de la vraie Page d'accueil.

## Deferred from: story 2.1 (spec-2-1-studio-et-schemas-transverses), 2026-11-20

- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-studio-et-schemas-transverses.md`
  summary: `npm audit` et typecheck de `studio/` absents de la CI
  evidence: `studio/` a ses propres dépendances ; `npm audit` y signale 2 high (js-yaml et smol-toml, déni de service à l'analyse locale, transitifs de `sanity`, correctif seulement par rétrogradation de sanity). Un job `audit` y échouerait ; à trancher en 2.6 avec le workflow d'export hebdomadaire (seuil, exception documentée) et ajouter `tsc -p studio` à la CI.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-studio-et-schemas-transverses.md`
  summary: aucun test ne détecte une dérive de `src/content/types.ts` pour `siteSettings`
  evidence: `src/studio.test.ts` compare le catalogue `uiStrings` aux types générés, mais pas les champs de `siteSettings` ni la fraîcheur du fichier ; à revoir en 2.2 quand les schémas se multiplient (régénérer en CI et comparer).

## Deferred from: story 2.2 (spec-2-2-modele-des-projets), 2026-11-20

- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-modele-des-projets.md`
  summary: vérifier le verrou du slug dans l'espace `production`
  evidence: il ne s'exerce qu'après publication dans le dataset de production ; à contrôler en 2.6 lors de la première promotion (publier, puis tenter de modifier le slug).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-modele-des-projets.md`
  summary: `src/content/` doit ignorer `alt` quand `decorative` est vrai
  evidence: le Studio masque `alt` pour une image décorative mais ne l'efface pas ; la couche de contenu (2.4) rend `alt=""` dans ce cas.

## Deferred from: story 2.3 (spec-2-3-modele-des-autres-sections), 2026-11-20

- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-modele-des-autres-sections.md`
  summary: story manquante pour les mentions légales (bouton du pied de page et contenu)
  evidence: l'ancien site a un bouton et cinq blocs de mentions ; le contenu change (hébergeur Vercel au lieu de Hostinger) et demande du texte riche. À créer dans l'épopée 2 ou 3, avant la bascule (9.6).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-modele-des-autres-sections.md`
  summary: le bio du pied de page contient un saut de ligne `<br />`
  evidence: `localizedText` est du texte brut ; la story 2.5 doit migrer sans changer le texte rendu (le comparateur de FR-2 l'attrapera).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-modele-des-autres-sections.md`
  summary: relier les teintes de compétences (`pink`, `yellow`, `sky`, `green`, `lilac`, `orange`, `red`, `teal`) aux tokens
  evidence: les tokens actuels ne couvrent pas `orange`, `red` ni `teal` ; à régler dans la story 6.2 en ajoutant les tokens à `design-system/tokens.css`.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-couche-de-contenu.md`
  summary: le build réel contre le dataset `dev` (requête, téléchargement et optimisation d'images) n'est pas vérifié en 2.4.
  evidence: aucun jeton de lecture n'existe ; la CI de la PR le vérifiera une fois le jeton saisi, et la 2.5 apportera de vraies images.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-couche-de-contenu.md`
  summary: Vercel Preview et la CI exigent `SANITY_PROJECT_ID`, `SANITY_DATASET` et `SANITY_READ_TOKEN` ; les PR de Dependabot n'ont pas accès au secret GitHub.
  evidence: palier `sanity` activé ; saisie à faire par Léandro, secret Dependabot à déclarer si une PR de dépendance échoue.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-migration-du-contenu.md`
  summary: rédiger les textes sans équivalent dans l'ancien site : version EN de `siteSettings` et clés `uiStrings` (ALTCHA, page 404, erreurs de formulaire, thèmes, sélecteurs) ; remplacer l'adresse LinkedIn générique.
  evidence: l'ancien site n'a ni titre ni description EN, et le catalogue `uiStrings` compte des clés nouvelles ; le Studio refuse de publier ces documents tant qu'ils sont incomplets.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-migration-du-contenu.md`
  summary: l'indice d'ajustement d'image `fit: 'contain'` du logo de la galerie Graphisme n'est pas migré (aucun champ).
  evidence: un seul élément (« Logo Officiel ») porte `fit`, indice purement visuel ; à traiter par la story qui affiche la galerie (épopée 3).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-migration-du-contenu.md`
  summary: les noms de langue du sélecteur (`label`) n'ont pas de clé `uiStrings`.
  evidence: l'ancien site les stocke par langue (« 🇫🇷 Français ») ; le nouveau sélecteur FR et EN en a besoin, à décider avec le composant (épopée 3).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-5-migration-du-contenu.md`
  summary: l'import dans `dev` et la vérification par le connecteur Sanity restent à faire par Léandro.
  evidence: l'agent n'écrit jamais dans un dataset ; commande documentée dans `docs/exploitation.md`.

- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-publication-dev-puis-production.md`
  summary: créer les deploy hooks Vercel, les deux webhooks Sanity, le jeton `site-lecture-production` et les variables Vercel de production ; lancer la sauvegarde à la main une fois ; chronométrer la publication (SM-5).
  evidence: ces actions manipulent des secrets, réservées à Léandro ; procédure dans `docs/exploitation.md`.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-publication-dev-puis-production.md`
  summary: première promotion de `dev` vers `production` avant la première mise en ligne.
  evidence: le dataset `production` est vide ; la promotion est une action de Léandro.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-6-publication-dev-puis-production.md`
  summary: amender AD-10 dans `ARCHITECTURE-SPINE.md` : l'isolation du jeton de `dev` vis-à-vis de `production` est inapplicable en gratuit.
  evidence: un jeton Viewer lit tous les datasets d'un projet ; les rôles par dataset relèvent d'Enterprise (documentation Sanity). Écart assumé par Léandro ; seul le propriétaire du spine peut le modifier.

- source_spec: `_bmad-output/implementation-artifacts/spec-11-2-primitives-d-interface-astro.md`
  summary: Button ignore `disabled` quand `href` est fourni (lien jamais désactivable).
  evidence: la branche `<a>` ne lit pas `disabled` ; aucun consommateur aujourd'hui, à traiter si un lien désactivé apparaît (aria-disabled et tabindex -1).

- source_spec: `_bmad-output/implementation-artifacts/spec-11-4-etats-variantes-et-controle-des-themes-du-kit.md`
  summary: `npm run test:stories` n'est exécuté ni par `npm test` ni par la CI : contraste rendu, débordement à 320 px et émulations ne sont pas gardés automatiquement.
  evidence: `.github/workflows/ci.yml` ne lance que `build-storybook` ; à câbler en story 10.6, dépendance dure de 11.4.
- source_spec: `_bmad-output/implementation-artifacts/spec-11-4-etats-variantes-et-controle-des-themes-du-kit.md`
  summary: texte vert illisible (environ 1,0:1) sur les cartes de service en Terminal, conservé par fidélité avec l'ancien site.
  evidence: relevé sur le site en ligne le 2026-11-21, consigné dans `docs/ajustements-visuels.md` ; à trancher à l'audit (story 9.2).

- source_spec: `_bmad-output/implementation-artifacts/spec-3-1-gabarit-de-page-navigation-et-menu-mobile.md`
  summary: Ajouter les stories Storybook de la barre de navigation (états ouvert et fermé, FR et EN, trois Thèmes).
  evidence: la story 3.1 les prévoit (règle de composition 11.5) mais le rendu `?variants` et l'import d'images `astro:assets` n'ont pas été vérifiés dans Storybook ; non fait dans cette session.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-2-hero-et-section-projets-cartes.md`
  summary: Ajouter les stories Storybook du Hero et de la Section Projets (Thèmes, Langues, texte long).
  evidence: la règle de composition de la story 11.5 les demande ; non faites dans cette session, comme pour la barre de navigation.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-3-sections-parcours-competences-services-et-a-propos.md`
  summary: stories Storybook des Sections Parcours, Compétences, Services et À propos.
  evidence: hors périmètre de la 3.3, comme pour la 3.1 et la 3.2 ; les Sections sont testées en HTML (jsdom + axe).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-3-sections-parcours-competences-services-et-a-propos.md`
  summary: réafficher le sous-titre « Glissez-déposez pour jouer ! » des Compétences quand les puces seront déplaçables (épopée 6).
  evidence: la consigne est masquée en 3.3 car aucune interaction n'existe encore.
