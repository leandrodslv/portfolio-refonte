# Revue adversariale — ARCHITECTURE-SPINE (refonte portfolio)

Cible : `ARCHITECTURE-SPINE.md` (statut draft, AD-1 à AD-16). Référence : le PRD (FR-1 à FR-23, NFR-1 à NFR-6). Le spine n'a pas été modifié.

Méthode : pour chaque trou, on construit deux unités de niveau inférieur (stories ou épopées bâties indépendamment) qui respectent chacune toutes les AD à la lettre et qui s'assemblent mal. Chaque paire se conclut par une AD à ajouter ou à resserrer. Sévérité : **B** = bloquant (rework certain ou exigence PRD violée), **M** = majeur, **m** = mineur.

## Verdict

**Le spine n'est pas prêt à servir de substrat de build.** Le découpage en couches (AD-1, AD-2, AD-8) est solide. Mais les points où des unités se rencontrent ne sont pas gouvernés : l'état partagé (thème, langue, fenêtre, History), les formes de données partagées (schéma Sanity, view-models, `uiStrings`) et la CSP. Trois paires sont bloquantes sans correction :

1. AD-11 (en-têtes dans `vercel.json`, statique) contredit « hash calculé au build » : la CSP ne peut pas être livrée telle que décrite.
2. Aucune AD ne définit la machine à états fenêtre / History / URL. Deux stories correctes produiront deux comportements de « retour » et de focus.
3. AD-3 (aucun texte en dur, tout via Sanity au build) ne peut pas être respecté par la route `contact.ts`, qui ne lit pas Sanity au runtime (AD-2) et doit pourtant renvoyer des erreurs lisibles, ni par le widget ALTCHA.

Au total : 8 paires bloquantes, 14 majeures, 7 mineures, plus 6 règles inapplicables en l'état.

---

## A. Conflits entre ADs (le spine se contredit)

### A1 [B] — CSP à hash de build contre `vercel.json` statique (AD-11 × AD-6 × AD-1)
- **Unité A** (story « en-têtes ») : écrit `vercel.json` avec une CSP sans `unsafe-inline`, hash du script de thème copié à la main. Respecte AD-11, y compris le test CI « en-tête présent ».
- **Unité B** (story « thème ») : écrit le script inline de `data-theme` et le fait évoluer (un test, une variable). Le hash change à chaque modification.
- **Pourquoi ça casse :** AD-11 dit à la fois « tous les en-têtes sont dans `vercel.json` » (fichier versionné, statique) et « hash calculé au build ». Un fichier statique ne contient pas un hash de build. Résultat : soit la CSP bloque le script de thème en prod (flash du mauvais Thème, FR-9 violé), soit on ajoute `unsafe-inline`. Aucun test ne le voit : AD-11 ne teste que « l'en-tête existe », pas « la page s'exécute sous cette CSP ».
- **Aggravants non traités :** Astro émet lui-même des scripts inline (script d'hydratation des îlots, petits scripts de composants inlinés par Vite) dont les hash changent à chaque build. React et Framer Motion posent des attributs `style` (donc `style-src`). ALTCHA utilise un worker `blob:` et du WASM (`worker-src`, `'wasm-unsafe-eval'`). Le son demande `media-src`. Les polices demandent `font-src`. Le formulaire demande `connect-src` et `form-action`. Le report « liste exacte des directives » dans Deferred cache le vrai problème : le mécanisme, pas la liste.
- **Correctif (resserrer AD-11) :** nommer le mécanisme. Soit un script de post-build qui calcule les hash et réécrit la config d'en-têtes (par exemple la sortie de l'adaptateur Vercel), soit la CSP intégrée d'Astro. Interdire les scripts inline écrits à la main hors d'un seul fichier source connu. Ajouter un test CI **comportemental** : charger les 3 pages de l'échantillon sous la CSP réelle (Playwright) et échouer sur toute violation CSP en console.

### A2 [B] — « Tout le texte sans JS » contre coordonnées assemblées par JS (AD-1 × AD-9)
- **Unité A** (Contact, FR-4) : vérifie par `curl` que le HTML contient tout le texte. Écrit le test « aucun texte manquant sans JS ».
- **Unité B** (Coordonnées, FR-16) : stocke l'e-mail et le téléphone encodés, les assemble dans un îlot `client:visible`.
- **Pourquoi ça casse :** AD-1 impose « le HTML contient tout son texte sans JS », AD-9 impose l'inverse pour deux textes visibles. Le test de A échoue, ou B est « corrigé » en clair, ce qui viole SM-3. Autres effets : avant le défilement, l'e-mail n'existe pas pour Ctrl+F ni pour un lecteur d'écran ; les données structurées (FR-19, schéma `Person`) peuvent réintroduire `email` et `telephone` en clair dans le `<script type="application/ld+json">` ; le CV PDF contient les mêmes coordonnées en clair.
- **Non défini :** le schéma d'encodage (base64, rot13, deux moitiés ?), qui l'écrit dans Sanity (le Studio affiche-t-il l'encodé ?), qui le décode. Deux stories (schéma Sanity, îlot) inventeront deux formats.
- **Correctif :** nouvelle AD « Coordonnées » : exception explicite et exhaustive à AD-1 ; format d'encodage unique et fonction `decodeContact` unique dans un module partagé ; champ Sanity en saisie claire avec encodage fait par `src/content/` (jamais le clair dans le view-model sérialisé vers le HTML) ; interdiction des coordonnées dans JSON-LD, `mailto:` rendus en HTML et Métadonnées ; îlot en `client:idle` au plus tard (jamais `client:visible`) ; réserve explicite sur le PDF du CV.

### A3 [B] — Aucun texte en dur contre route serveur sans Sanity (AD-3 × AD-2 × AD-8 × Conventions)
- **Unité A** (`contact.ts`) : renvoie `{ ok:false, errors:{ email:"Adresse invalide" } }` (Convention : `{[champ]: string}`). Les chaînes sont dans le code serveur : viole AD-3. Alternative : lire `uiStrings` dans Sanity au runtime : viole AD-2 « aucun appel Sanity au runtime ».
- **Unité B** (îlot formulaire) : affiche les chaînes reçues, ou ses propres chaînes issues de `uiStrings` selon la langue de la page. L'API ne connaît pas la langue de la page.
- **Pourquoi ça casse :** la Convention d'erreur et AD-3 sont incompatibles. Idem pour le corps du courriel envoyé à Léandro (texte visible), le widget ALTCHA (chaînes internes de la bibliothèque, en anglais par défaut, y compris leur accessibilité), et le `404.html`.
- **Correctif :** l'API renvoie des **codes** (`errors: { email: "invalid" }`), jamais de texte ; la table code → texte vit dans `uiStrings` (clés `form.error.*`), résolue par l'îlot. Un nom de clé de catalogue figé. Exempter explicitement de AD-3 : le corps du courriel interne (en FR), les logs. Passer les chaînes du widget ALTCHA par son option de traduction alimentée par `uiStrings`.

### A4 [M] — HSTS contre retour arrière DNS (AD-11 × AD-15 × NFR-6)
- **Unité A** (en-têtes) : met `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, pour viser A+ (SM-3).
- **Unité B** (bascule) : remet l'enregistrement DNS d'Hostinger en cas de problème.
- **Pourquoi ça casse :** les navigateurs qui ont vu le HSTS refuseront toute connexion non TLS valide pendant la durée du `max-age`. Si le certificat Hostinger du domaine nu n'est pas en place, le « retour en moins d'une heure » (NFR-6) est faux pour les visiteurs récents. Le `preload` est irréversible en pratique.
- **Correctif :** AD-15 : `max-age` court (≤ 1 jour) jusqu'à la fin de la période de 30 jours, `preload` interdit en v1, et vérification préalable que l'ancien hébergement sert HTTPS valide sur `leandro-dasilva.com` et `www`.

### A5 [M] — Fidélité contre images optimisées, budget et CI sans mécanisme de dérogation (AD-12 × AD-14 × AD-7)
- **Unité A** (images) : Astro ré-encode en AVIF/WebP, `srcset`, `loading=lazy`. Respecte AD-12.
- **Unité B** (visuel) : compare au pixel avec les captures de l'ancien site, seuil 0,1 % (FR-8).
- **Pourquoi ça casse :** le ré-encodage et le redimensionnement suffisent à dépasser 0,1 % sur 5 projets et une galerie de 19 images. AD-14 dit « la fidélité l'emporte sur Lighthouse » mais ne dit ni comment une CI **bloquante** accepte un écart (fichier de dérogation ? label de PR ?), ni la préséance entre fidélité et **budget JS** (AD-7 échoue la PR « au-delà »). Les captures ont des animations « figées » : par quel mécanisme ? Qui l'implémente (une classe `.freeze`, un `?freeze`, `prefers-reduced-motion`, qui est refusé par Léandro) ?
- **Correctif :** nouvelle AD « Dérogations » : un fichier unique `quality-waivers.json` versionné (règle, valeur mesurée, justification, date) lu par la CI ; l'ordre de préséance complet (fidélité > a11y > JS > Lighthouse) ; le mécanisme de figement défini une fois (attribut sur `<html>` posé par les tests, sans que le code produit dépende de la préférence système) ; l'image de comparaison visuelle définie (même encodage que la prod, seuil de tolérance par zone).

### A6 [M] — « Aucune valeur littérale hors `src/styles/` » contre données de couleur dans Sanity (AD-6 × AD-3 × FR-11)
- **Unité A** (schéma Sanity) : ajoute au Projet un champ `accentColor` (hex), car les Cartes et les Gabarits de l'ancien site ont des fonds distincts.
- **Unité B** (composants) : n'accepte que des tokens sémantiques.
- **Pourquoi ça casse :** le champ hex fait entrer une couleur littérale dans le rendu, et ses contrastes ne sont validés dans aucun des 3 Thèmes (FR-22). Le Gabarit « personnalisée » est précisément celui où ce besoin apparaît.
- **Correctif :** AD-6 : les données Sanity ne portent jamais de valeur de style ; elles portent un **nom de variante** appartenant à une liste fermée (`accent: 'a'|'b'|'c'`), mappée à des tokens. Définir le contenu du Gabarit « personnalisée » (blocs autorisés) avant les stories de schéma et de composants.

### A7 [M] — Tout champ `{fr,en}` obligatoire contre champs légitimement vides et workflow dev (AD-3 × AD-12 × UJ-3)
- **Pourquoi ça casse (trois cas) :**
  1. AD-3 échoue le build « si une valeur FR ou EN est vide » ; AD-12 permet un `alt` vide pour image « décorative ». Les deux ADs se contredisent sur ce cas.
  2. Les champs optionnels (bouton GitHub retiré du premier Projet, FR-2 ; lien Figma absent ; sous-projets) ne peuvent pas être vides.
  3. UJ-3 : Léandro publie en dev pour vérifier avant la prod. S'il saisit FR d'abord et publie, le build de **tout** le Site dev échoue jusqu'à la saisie de l'EN. SM-5 (< 5 minutes) est menacé.
- **Correctif :** AD-3 précise « obligatoire » vs « optionnel » par champ (liste dans le schéma), `decorative: true` exempte `alt`, et la rigueur dépend de l'Environnement : en dev, un champ manquant produit un avertissement et un repli visible (jamais silencieux) ; en production, le build échoue. La règle « un même document est complet ou pas publié » peut aussi se tenir par validation Studio.

### A8 [M] — Dataset public, jeton « lecture seule » et brouillons (AD-2 × AD-10 × AD-16)
- Sur le plan gratuit, selon la formule en vigueur, les datasets privés peuvent ne pas être disponibles ; à vérifier avant de figer AD-10. Si les deux datasets sont publics, le jeton en lecture seule n'est utile que pour les brouillons, et tout le contenu de `production` (y compris tout document « non publié » mal modélisé) est lisible par n'importe qui.
- **Non défini :** perspective de lecture (`published` obligatoire en prod ; jamais `drafts`/`previewDrafts`). Une unité qui active `previewDrafts` « pour tester » expose des brouillons en prod. La CI sur PR externe n'a pas accès au secret du jeton.
- **Correctif :** AD-2 : perspective figée à `published`, jeton uniquement pour dev si dataset privé, procédure de CI (secrets GitHub, comportement sur fork).

---

## B. Machine à états fenêtre / History / URL (le plus gros trou)

### B1 [B] — Qui fournit le contenu de la fenêtre quand on l'ouvre depuis la Page d'accueil ? (AD-4 × AD-5 × AD-1)
- **Unité A** (page de Projet) : `/projets/[slug]` = `HomePage` avec une fenêtre ouverte dans le HTML. Pour fermer sans recharger, l'îlot n'a besoin que de masquer la fenêtre.
- **Unité B** (Page d'accueil `/`) : doit pouvoir ouvrir 5 projets. Deux choix valides et incompatibles : (i) tous les contenus des 5 fenêtres × 3 Gabarits sont dans le HTML de `/` (masqués) ; (ii) l'îlot récupère `/projets/[slug]` par `fetch` et en extrait la fenêtre.
- **Pourquoi ça casse :** AD-5 dit « le contenu de la fenêtre est rendu en HTML » sans dire où. Choix (i) : chaque page contient les 5 projets en double → 6 pages × 2 langues quasi identiques (canonical, contenu dupliqué, poids, deux `h1`, ids dupliqués dans les sections), et des contenus masqués à traiter pour l'accessibilité (`inert`, `aria-hidden`). Choix (ii) : le fetch ne marche pas hors ligne, ajoute un chemin JS non testé par AD-1, et chaque mise en page doit rester extractible par sélecteur.
- **Correctif :** nouvelle AD « Contrat de la fenêtre » : choisir (i) ou (ii) ; définir le conteneur, `id` d'ancrage, élément (`<dialog>` ou `role="dialog"` + `aria-modal`) ; la fenêtre fermée n'est pas dans l'arbre d'accessibilité ; sur `/projets/[slug]` : canonical vers soi-même, `h1` du Projet unique, ids de sections stables.

### B2 [B] — Fermeture et « retour » : `pushState` sans spécification de l'historique (AD-5 × FR-6)
- **Unité A** (ouverture par clic) : `pushState` vers `/projets/x`, fermeture = `history.back()`.
- **Unité B** (arrivée directe sur `/projets/x`, UJ-1 cas limite) : il n'y a pas d'entrée précédente. `history.back()` sort du Site ; ou bien la fermeture fait `pushState('/')`, ce qui crée une entrée en trop et un « retour » qui ré-ouvre la fenêtre.
- **Pourquoi ça casse :** FR-6 exige « fermer revient à la Page d'accueil sans recharger » et « retour ferme la fenêtre ». Les deux sont atteignables sur un parcours, pas sur l'autre. Cas non traités : fenêtre ouverte, changement de langue (voir B3) ; sous-projet dans la fenêtre (a-t-il une URL ? une entrée d'historique ?) ; ouverture d'un deuxième projet depuis la fenêtre ; avance/retour répétés ; restauration de défilement ; `popstate` et `bfcache`.
- **Correctif :** nouvelle AD avec une table d'états : `{ origin: 'in-app'|'direct', historyDepth }` ; fermeture depuis l'état *direct* = `replaceState('/')` + rendu de l'accueil ; fermeture *in-app* = `history.back()` ; un seul module `windowRouter` propriétaire de `popstate`. Décider que les sous-projets et la vue détaillée de galerie **ne créent pas** d'entrée d'historique (ou fixer leur adresse).

### B3 [B] — Changement de langue pendant qu'une fenêtre est ouverte (AD-4 × AD-5 × FR-10)
- **Unité A** (sélecteur de Langue, îlot dans la barre) : calcule l'URL cible en substituant `/en/` et `projets` ↔ `projects`.
- **Unité B** (fenêtre) : a poussé `/projets/x` par `pushState` sur la page FR chargée (le DOM reste FR).
- **Pourquoi ça casse :** FR-10 dit « le changement de Langue conserve la page ou le Projet affiché ». Le DOM a l'URL de la page `/projets/x` mais l'état d'arrivée peut être `/`. L'îlot de langue ne sait pas quelle URL est « courante » (location, ou la route d'origine de la page rendue ?). La table de correspondance FR↔EN (`/projets/` ↔ `/en/projects/`) n'a aucun propriétaire : `src/pages/` la connaît, l'îlot (qui n'a pas accès à `src/content/`) non. Le focus et la fenêtre sont-ils conservés ? Faut-il un rechargement complet, ce qui ferme la fenêtre ?
- **Correctif :** AD « i18n de routes » : une fonction pure `localizedPath(route, locale)` dans un module partagé, importée par pages et îlots ; le sélecteur de langue est un lien `<a hreflang>` rendu en HTML (sans îlot) pointant vers l'URL de la **route courante**, mise à jour par `windowRouter` à chaque `pushState` ; changement de langue = navigation complète, fenêtre rouverte par construction (AD-4).

### B4 [M] — Pile de superpositions : trois propriétaires de Échap et du piège de focus (AD-5 × FR-11 × FR-22)
- **Unité A** (`ProjectWindow`) : écoute Échap, pose le piège de focus, restaure le focus à la Carte.
- **Unité B** (galerie graphique, « vue détaillée ») : une lightbox dans la fenêtre, avec son propre Échap et son propre piège.
- **Unité C** (menu mobile, Mode fête, réglages) : idem.
- **Pourquoi ça casse :** AD-5 attribue ces comportements à « un unique îlot ProjectWindow » ; la vue détaillée est un deuxième niveau non prévu. Échap ferme-t-il la lightbox seule, ou les deux ? À quelle Carte revenir ? « Retour du focus à la Carte d'origine » exige que l'îlot connaisse l'élément `.astro` Carte, qui n'est pas un îlot : aucun contrat (attribut `data-*`, événement) n'existe.
- **Correctif :** AD « Superpositions » : un unique gestionnaire de pile (`overlayStack`) qui possède Échap, `inert` du fond, piège de focus, verrouillage du défilement et mémoire de l'élément déclencheur ; contrat Carte : `<a href="/projets/slug" data-project-open="slug">` (le lien fonctionne sans JS, l'îlot l'intercepte).

### B5 [M] — Îlot `client:visible` sur une fenêtre masquée (AD-5 × AD-7)
- `client:visible` n'hydrate qu'à l'entrée dans la fenêtre d'affichage. Une fenêtre fermée n'est jamais « visible » ; le clic sur une Carte avant hydratation provoque une navigation complète vers `/projets/x` (acceptable, mais ce n'est pas le comportement prescrit par FR-6 « sans recharger »). `client:idle` annule le gain budget.
- **Correctif :** AD-7 : préciser que l'îlot `ProjectWindow` est hydraté sur l'interaction (`client:visible` attaché à la Section Projets, pas à la fenêtre) et fixer le comportement de repli avant hydratation (navigation normale).

### B6 [M] — Sans JS, la fenêtre « ouverte dans le HTML » n'a pas de sortie (AD-4 × AD-1 × FR-22)
- Sur `/projets/x`, sans JS, la fenêtre recouvre la page et son bouton de fermeture n'est pas fonctionnel. Fermer doit être un lien vers `/` (ou `/en/`) en HTML. Le focus initial sur arrivée directe (UJ-4 : focus dans la fenêtre) et l'ordre de lecture ne sont pas définis, ni l'annonce du changement de titre de page lors des `pushState` (le `<title>` change-t-il ? `aria-live` ?).
- **Correctif :** inclure dans l'AD « Contrat de la fenêtre » : bouton de fermeture = `<a>` HTML ; mise à jour de `document.title` et de `<link rel=canonical>` à chaque transition ; annonce de focus.

---

## C. État de préférences : thème, langue, localStorage, îlots

### C1 [M] — Aucun mécanisme de partage d'état entre îlots (AD-1 × AD-6 × AD-13 × FR-9 × FR-12)
- **Unité A** (sélecteur de Thème), **Unité B** (curseur personnalisé qui change selon le Thème), **Unité C** (son : `portfolio:muted`, utilisé par la carte à gratter, le Mode fête et la fenêtre), **Unité D** (Mode fête arrêtable sans souris).
- Chaque îlot React a sa racine ; ils ne partagent ni contexte React ni store. Chacun lira donc `localStorage` à sa façon, avec des écoutes `storage` divergentes ; l'état « muet » n'a aucune source de vérité et le Thème est lu soit dans `localStorage` soit dans `document.documentElement.dataset.theme`. Deux écritures concurrentes (deux onglets) divergent.
- **Correctif :** AD « État client » : (1) le Thème a une seule source, l'attribut `data-theme` (le script inline lit `localStorage`, les îlots écrivent via une fonction `setTheme` unique qui met à jour l'attribut puis `localStorage`) ; (2) les autres préférences passent par un store partagé hors React (par exemple nanostores) importé par tous les îlots ; (3) un catalogue unique des clés de stockage (`portfolio:theme`, `portfolio:muted`, plus toute future clé) ; (4) les valeurs invalides de `localStorage` sont ignorées et `try/catch` obligatoire.

### C2 [M] — Langue : stockage, détection et redirection non gouvernés (AD-4 × AD-13 × FR-10)
- **Unité A** (sélecteur) : mémorise le choix dans `portfolio:lang` et redirige à la visite suivante. AD-13 liste seulement deux clés mais ne l'interdit pas ; aucun cookie, donc légal.
- **Unité B** (SEO) : suppose que l'URL est la seule vérité (hreflang, canonical, sitemap). Un robot ne passe pas par `localStorage`, mais un lien partagé `/projets/x` ouvert par un visiteur dont la préférence est EN le redirigerait, ce qui casse UJ-1 (lien partagé ouvre ce projet), `x-default`, et l'ouverture directe.
- **Autre variante :** une troisième story ajoute une redirection `Accept-Language` dans `vercel.json`, créant des boucles et un contenu non indexable (FR-10).
- **Correctif :** AD-4/AD-13 : l'URL est l'unique source de la langue ; aucune redirection automatique par `Accept-Language` ni par `localStorage` ; `x-default` → `/` ; mémoriser la langue est interdit en v1 (ou autorisé sans redirection, à décider).

### C3 [m] — Initialisation hors rendu : thème écrit avant hydratation (AD-6 × AD-13)
- Si le script de thème échoue (stockage indisponible, CSP bloquée, voir A1), le défaut `pop` doit s'appliquer ; le sélecteur doit refléter l'état réel de `<html>` au premier rendu pour éviter une erreur d'hydratation React (texte « actif » différent du HTML serveur). Cas d'erreur non défini.
- **Correctif :** inclure dans l'AD « État client » : le HTML serveur ne rend aucun état dépendant du Thème ou du son ; l'îlot lit l'état après montage, et les composants n'affichent pas de valeur issue de `localStorage` au rendu serveur.

### C4 [m] — Annonce aux lecteurs d'écran du Thème et de la Langue actifs sans propriétaire (FR-9, FR-10, UJ-4 × Conventions « aria-live »)
- Conventions : « `aria-live` pour les statuts ». Qui possède la région live ? Chaque îlot en crée une, ou la région est unique dans la mise en page ? Un changement de langue (navigation) n'a pas de région live.
- **Correctif :** une seule région `aria-live=polite` dans le layout, alimentée par une fonction `announce(key)` qui consomme `uiStrings` ; le changement de langue repose sur la navigation (le `lang` du nouveau document est annoncé par le lecteur).

---

## D. Formes de données et propriété des entités

### D1 [B] — Deux propriétaires du schéma de contenu : studio et view-models (AD-2 × AD-3 × Deferred)
- **Unité A** (story « schéma Sanity », dans `studio/`) : définit `project.template` ∈ `standard | graphisme | personnalisee`, `skills` avec `level`, etc.
- **Unité B** (story « Gabarits », dans `src/`) : types TypeScript écrits à la main pour `ProjectViewModel`, avec `'standard' | 'graphic' | 'custom'`.
- **Pourquoi ça casse :** `studio/` est « indépendant, hors build du Site » : aucune génération de types ne relie les deux. Le désaccord n'apparaît qu'au runtime du build (ou jamais, si le champ est optionnel). Le Deferred renvoie les schémas à « la première story », mais rien ne dit que les stories suivantes en héritent.
- **Correctif :** nouvelle AD « Source de vérité du schéma » : les schémas Sanity sont l'unique propriétaire ; les types (`sanity typegen`) sont générés et versionnés ; `src/content/` valide chaque réponse (zod ou typegen) avant de produire un view-model ; la CI échoue si les types générés sont périmés. Énumérations figées dans une liste unique partagée (template, accent, tags).

### D2 [B] — View-model bilingue ou résolu ? (AD-2 × AD-3 × Conventions « Données »)
- **Unité A** (`src/content/`) : retourne des champs `{ fr, en }` et laisse les pages choisir.
- **Unité B** (îlots) : reçoivent des props sérialisées. Si on leur passe `{ fr, en }`, le HTML de chaque page contient les deux langues dans les attributs `astro-island` (poids, contenu caché dans la mauvaise langue, texte dupliqué dans le DOM pour les lecteurs d'écran) ; si les pages résolvent par langue, ça marche, mais AD-2 ne le dit pas.
- AD-3 exige `{ fr, en }` côté Sanity, AD-2 dit « view-models typés FR/EN » : ambigu.
- **Correctif :** AD-2/AD-3 : `src/content/` expose `getProject(slug, locale)` qui retourne des objets **déjà résolus** en une seule langue (chaînes simples) ; jamais de `{fr,en}` hors de `src/content/` ; les fonctions prennent la locale en paramètre obligatoire.

### D3 [M] — `uiStrings` : catalogue de clés sans propriétaire (AD-3)
- Chaque story ajoute ses textes d'interface au document singleton `uiStrings` (menu, erreurs, labels aria, titres de Thème, légendes de la carte à gratter). Le schéma est dans `studio/`, les clés utilisées dans `src/`. Structure plate ou imbriquée ? Qui échoue le build quand une clé utilisée n'existe pas ? Qui retire les clés mortes ? Deux stories créeront `nav.work` et `navigation.work`.
- **Correctif :** AD : un fichier `ui-keys.ts` (union de littéraux) est la seule définition des clés ; le schéma Sanity est généré depuis ce fichier ; `src/content/` échoue si une clé est absente ou orpheline ; nommage `domaine.élément.variante`.

### D4 [M] — Slugs : unicité, immutabilité et sous-projets (AD-4 × FR-6 × UJ-1)
- **Unité A** (Sanity) : `slug` généré depuis le titre FR, éditable.
- **Unité B** (liens partagés, UJ-1 cas limite) : Léandro renomme un Projet, donc son slug ; tous les liens partagés (LinkedIn, dossiers de candidature) renvoient désormais 404. `vercel.json` est statique, le redirecteur n'existe pas.
- **Non défini :** les Sous-projets (FR-1) ont-ils un slug et une route ? Slug identique en FR et EN : mais un titre EN différent produit-il un slug FR qui ne correspond pas ? Slugs réservés ; collisions avec `en`, `api`.
- **Correctif :** AD-4 : le slug est **immuable** après publication (validation Studio en lecture seule) ; sinon un champ `previousSlugs` génère des redirections au build ; sous-projets sans route propre en v1 ; liste de slugs réservés ; slug généré une fois, non dérivé de la langue.

### D5 [M] — Images : forme de l'objet image dans le view-model et formats d'aperçu (AD-12 × FR-19 × FR-4)
- **Unité A** (`src/content/`) : télécharge les assets vers un dossier non défini et retourne des `ImageMetadata` d'Astro. **Unité B** (pages/SEO) : veut une URL absolue d'image Open Graph.
- Pourquoi ça casse : AD-12 interdit l'URL CDN Sanity dans le HTML (donc dans `og:image`) ; Astro génère `/_astro/xxx.avif`, dont les robots d'aperçu de LinkedIn et des messageries ne lisent pas toujours le format. FR-4 testable « les aperçus affichent titre, description et image » peut échouer.
- **Non défini :** emplacement du cache d'assets (le re-téléchargement à chaque publication allonge chaque build et menace SM-5 et les limites de minutes de build Hobby) ; format de la galerie de 19 images (tableau ordonné, `alt` par image, métadonnées de dimensions pour éviter le décalage de mise en page).
- **Correctif :** AD-12 : forme canonique `ContentImage { src, width, height, alt, decorative, srcset }` ; image sociale en JPEG/PNG de 1200×630 générée explicitement ; cache d'assets défini (`.cache/` conservé entre builds Vercel) ; mesure du temps de build.

### D6 [m] — Identifiants d'ancres et noms de Section (Conventions × FR-7 × FR-5)
- Les Conventions nomment les Sections en anglais (`Work`, `Timeline`), les ancres historiques sont `#work`, `#journey`, `#skills`, `#contact` ; `Services` et `About` n'ont pas d'ancre existante. Une story « barre de navigation » et une story « sections » choisiront `#projets`/`#parcours` ou `#journey`. En EN, l'ancre est-elle traduite ?
- **Correctif :** registre d'ancres figé : `work`, `journey`, `skills`, `services`, `about`, `contact`, identiques en FR et EN, propriétaire unique (constante exportée).

---

## E. Environnements, déploiement et configuration

### E1 [B] — Fichiers statiques communs à dev et prod : `robots.txt` et `X-Robots-Tag` (AD-10 × AD-11 × AD-15)
- **Unité A** (dev) : met `public/robots.txt` en `Disallow: /` et un en-tête `X-Robots-Tag: noindex` dans `vercel.json`.
- **Unité B** (prod) : fusionne `dev` dans `main` (flux AD-10), et `robots.txt` + `vercel.json` partent en prod.
- **Pourquoi ça casse :** `vercel.json` et `public/` sont identiques sur les deux branches si elles sont fusionnées ; AD-10 ne dit pas comment un fichier versionné se comporte différemment selon l'Environnement. Soit la prod se désindexe (SM-6), soit le dev s'indexe (FR-3). Vaut aussi pour `sitemap.xml`, les `canonical` et les URL absolues d'Open Graph (le domaine dev apparaît-il en prod ?).
- **Correctif :** AD-10 : `robots.txt`, `sitemap.xml`, `X-Robots-Tag` et le domaine canonique sont **générés au build** à partir de `VERCEL_ENV`/`SITE_URL`, jamais committés ; un test CI par Environnement les vérifie (dev : noindex ; prod : indexable).

### E2 [M] — Ordre contenu / code entre datasets (AD-10 × AD-3)
- **Unité A** (story schéma) : ajoute un champ obligatoire, déployé dans le Studio unique : Léandro voit le champ en prod immédiatement.
- **Unité B** (promotion contenu dev → production) : export/import Sanity CLI **écrase** le dataset de production (IDs, assets).
- **Pourquoi ça casse :** un build de prod déclenché par webhook, avec du code de `main` ancien et un dataset au nouveau schéma (ou l'inverse), échoue (AD-3) ou rend vide. L'ordre « code d'abord, contenu ensuite » n'est pas imposé, l'import peut aussi supprimer du contenu produit directement en prod (on ne sait pas quel dataset est maître). Le Studio ne cible pas deux jeux de schéma.
- **Correctif :** AD-10 : dev est la seule source d'édition ; production n'est jamais éditée à la main (rôle Studio restreint) ; ordre de promotion écrit (code → contenu) ; import avec sauvegarde (`export` datée) ; compatibilité ascendante des schémas sur un cycle (champ ajouté optionnel d'abord).

### E3 [M] — Webhook par document, et builds en rafale (AD-2 × AD-16 × SM-5)
- Un webhook par publication, un build complet par webhook. Vercel Hobby : un seul build à la fois, minutes limitées. Publier 3 documents d'affilée génère 3 builds en file ; le dernier est le seul qui compte, mais SM-5 mesure de la publication à la prod < 5 min.
- **Correctif :** filtre de webhook limité aux types de contenu rendus ; mise en file ou annulation des builds superposés (`ignoreCommand` ou option de build « auto-cancel ») ; temps de build cible chiffré.

### E4 [M] — Variables par Environnement et formulaire en dev (AD-8 × AD-10 × Configuration)
- Le Site de dev a-t-il un vrai formulaire qui envoie de vrais courriels à Léandro ? Clés Resend, secret HMAC ALTCHA et adresse de destination par Environnement ne sont pas listés. Resend exige un domaine d'expéditeur vérifié (enregistrements DNS chez Hostinger, qui sont aussi l'objet de la bascule AD-15). Une validation « au démarrage du build » (Conventions) ne couvre pas les variables d'exécution des routes serveur.
- **Correctif :** table des variables (nom, portée dev/prod/CI, secret ou non, validation) ; adresse de test en dev ; clés distinctes ; validation également au démarrage de la route.

### E5 [M] — Protection d'aperçu Vercel et Lighthouse en CI (AD-14 × AD-10)
- Les déploiements d'aperçu Vercel ont une protection d'accès par défaut. Lighthouse et axe lancés « sur la PR » contre quelle URL ? Le build local servi par `astro preview` (pas de `vercel.json`, donc pas d'en-têtes, pas de CSP) ou le déploiement d'aperçu (protégé) ? Si la CI audite `astro preview`, la CSP et les en-têtes ne sont jamais exercés avec les pages (cf. A1).
- **Correctif :** AD-14 : cible d'audit précisée ; test des en-têtes et de la CSP sur le déploiement d'aperçu avec un contournement de protection, ou serveur local reproduisant `vercel.json`.

### E6 [m] — Protection de branche (Deferred) contre AD-14 « ne se fusionne pas »
- NFR-3 et AD-14 formulent une garantie que le dépôt privé gratuit ne fournit pas. Le Deferred l'admet mais AD-14 reste écrit comme une garantie.
- **Correctif :** soit rendre le dépôt public, soit réécrire NFR-3 et AD-14 en « convention + vérification locale ». À trancher avant la première PR.

---

## F. Route serveur et formulaire

### F1 [M] — 429 sans état, et aucune protection d'origine (AD-8 × AD-16)
- AD-8 et les Conventions prévoient le code 429, mais AD-16 exclut tout service avec état payant et les fonctions Vercel n'ont pas de mémoire partagée. Aucun limiteur de débit n'est réalisable sans magasin externe. Un jeton ALTCHA peut être rejoué (altcha-lib vérifie la preuve de travail, pas l'unicité) tant que le défi n'est pas expiré. Pas de vérification d'`Origin`, de limite de taille du corps, ni de validation d'e-mail/en-tête (injection d'en-têtes dans le courriel).
- **Correctif :** AD-8 : supprimer 429 ou le restreindre à « défi expiré ou déjà utilisé » avec un défi à courte validité et une graine à usage unique dans le jeton ; vérification de l'`Origin` ; plafonds de taille ; validation stricte côté serveur ; Resend `reply_to` plutôt que `from` libre.

### F2 [m] — « Deux routes » contre « une route de contact » (frontmatter `scope` × AD-8)
- Le `scope` dit « une route serveur de contact », AD-8 et le tableau disent « deux routes ». Un lecteur pressé en crée une seule ou ajoute une troisième (analytics, `og`, `draft preview`).
- **Correctif :** harmoniser ; lister les routes autorisées dans la CI (liste blanche des fichiers `prerender = false`).

---

## G. Budget, performance, dépendances

### G1 [M] — Le budget de 70 Ko : périmètre et propriétaire non définis (AD-7 × AD-1)
- **Unités A à E** (îlots menu, fenêtre, compétences, carte à gratter, curseur/son/fête, formulaire/ALTCHA, analytics) : chacune est « sous le budget » localement ; chacune importe React.
- React 19 + react-dom coûtent à eux seuls environ la moitié du budget compressé ; l'analytics et le widget ALTCHA en prennent une autre part. « JS initial » n'est pas défini : seulement le JS avant interaction ? Les îlots `client:visible` après défilement comptent-ils ? Sur quelle page (accueil FR, page de Projet) ? Aucune AD n'attribue des sous-budgets, donc le dépassement n'apparaît qu'au cumul, sur la dernière PR fusionnée.
- **Correctif :** AD-7 : définition exacte (octets transférés, gzip/brotli, sur `/` et `/projets/x` en conditions de chargement initial, avant tout geste), sous-budget par îlot (tableau), îlots hors React quand c'est possible (un seul runtime React partagé), chargement différé des lib lourdes (ALTCHA seulement à l'interaction avec le formulaire), mesure par un outil nommé.

### G2 [m] — Hobby : usage commercial (AD-16 × Vision du PRD)
- Le PRD vise une activité de freelance dans l'année. Les conditions d'usage de Vercel Hobby limitent à un usage personnel et non commercial ; un portfolio qui sert à trouver des clients peut sortir de ce cadre. AD-16 fige Hobby sans condition de sortie, et l'analytics Hobby est suspendu au-delà du quota.
- **Correctif :** AD-16 : consigner la condition (« à réévaluer avant le premier client »), et le plan de repli (hébergeur statique gratuit équivalent) sans changer le code.

### G3 [m] — Polices et ressources tierces (AD-16 × FR-8 × AD-11)
- L'ancien site utilise-t-il des polices tierces (Google Fonts) ? Auto-hébergées ou tierces ? AD-16 énumère « les seuls services externes » sans polices ; la CSP en dépend, et la fidélité (FR-8) aussi. Les sons (fichiers audio) et le curseur ne sont pas dans AD-12 (seulement les images).
- **Correctif :** AD-12 étendu à tous les assets statiques (polices auto-hébergées, audio, SVG) avec un seul répertoire propriétaire.

---

## H. Règles inapplicables (aucun contrôle, ou impossible à tester)

1. **AD-6 / Conventions « Style » : « aucune valeur littérale hors `src/styles/` »** : aucune règle de lint n'est prescrite (Stylelint + règle sur les couleurs, ESLint sur les classes arbitraires Tailwind `[#fff]`). AD-14 n'inclut pas ce contrôle précis. Ajouter à AD-14.
2. **AD-6 « chaque Token existe aussi en variable Figma de même nom »** : aucune vérification CI (export `tokens.json` renvoyé au Deferred). Définir un test de parité ou déclasser la règle en « processus ».
3. **AD-1 « un composant est `.astro` sauf s'il a besoin d'état ou d'événements »** : un `.astro` peut contenir un `<script>` ; la règle « zéro JS client » de `src/components/` (tableau) est contournable par `<script>` dans un `.astro`. Interdire `<script>` dans `src/components/` (lint) ou autoriser un module unique.
4. **AD-2 « seul `src/content/` importe le client Sanity »** : aucun contrôle automatique. Ajouter une règle ESLint d'import restreint (`no-restricted-imports`) ou `dependency-cruiser`, d'autant que le diagramme dit « Islands -. interdit .-> Content » sans test.
5. **AD-3 « aucun texte en dur »** : indétectable automatiquement (attributs `aria-label`, `title`, `alt` des composants, chaînes dans les îlots). Prescrire une règle (`eslint-plugin-i18n-json` ou « no-literal-string ») et son périmètre d'exception.
6. **AD-14 « en cas de conflit la fidélité l'emporte »** : décision humaine sans mécanisme (voir A5). Et **AD-7 « jamais `client:load` sans justification écrite »** : où est la justification, qui la contrôle ?

---

## I. Synthèse : AD à ajouter ou resserrer

| # | Proposition | Origine |
| --- | --- | --- |
| AD-11 (resserrer) | Mécanisme de hash CSP au build, scripts inline limités, test CSP comportemental, directives requises par îlot | A1 |
| AD-9 (resserrer) | Format et décodeur uniques, exception à AD-1, coordonnées interdites dans JSON-LD, `mailto` en HTML et PDF | A2 |
| AD-3 (resserrer) | API : codes d'erreur, pas de texte ; catalogue `uiStrings` typé ; champs optionnels et `decorative` ; rigueur par Environnement | A3, A7, D3 |
| AD-15 / AD-11 | HSTS court pendant la période de repli, pas de preload | A4 |
| Nouvelle : Dérogations qualité | Fichier de dérogations, préséance complète, mécanisme de figement | A5, H6 |
| AD-6 (resserrer) | Données de style = noms de variantes ; lint des littéraux | A6, H1 |
| AD-2 (resserrer) | Perspective `published`, jeton, résolution par langue en sortie de `src/content/` | A8, D2 |
| Nouvelle : Contrat de la fenêtre | Source du contenu, élément, accessibilité, sans JS | B1, B6 |
| Nouvelle : Routage fenêtre/History | Table d'états, `windowRouter`, entrée directe vs interne | B2, B3, B5 |
| Nouvelle : Pile de superpositions | Gestionnaire unique Échap/focus/inert | B4 |
| Nouvelle : État client | Source unique pour Thème, son, clés de stockage, annonce | C1, C3, C4 |
| AD-4 / AD-13 (resserrer) | URL = seule vérité de la langue, aucune redirection auto, `localizedPath` unique | B3, C2 |
| Nouvelle : Source de vérité du schéma | Typegen, validation, énumérations figées | D1 |
| AD-4 (resserrer) | Slug immuable ou redirections, sous-projets, slugs réservés | D4 |
| AD-12 (resserrer) | Forme `ContentImage`, OG en JPEG/PNG, cache d'assets, tous les assets statiques | D5, G3 |
| AD-10 (resserrer) | Fichiers d'environnement générés au build, ordre de promotion, dataset maître | E1, E2 |
| AD-2 / AD-16 | Filtre de webhook, mise en file des builds | E3 |
| AD-8 (resserrer) | Variables par Environnement, limite de débit réaliste, Origin, rejeu | E4, F1, F2 |
| AD-14 (resserrer) | Cible d'audit en CI, protection de branche tranchée | E5, E6 |
| AD-7 (resserrer) | Définition mesurable du « JS initial », sous-budgets par îlot | G1 |

## J. Ordre de traitement conseillé

1. Fermer d'abord A1, A2, A3, B1, B2, B3, D1, E1 (bloquants) : ils changent la structure des premières stories (schéma, mise en page, en-têtes).
2. Puis les AD d'état partagé (C1, B4, C2) avant toute story d'îlot.
3. Le reste (budget, dérogations, durcissement du formulaire) peut suivre, mais avant la story qui crée le premier îlot.

## K. Limites de cette revue

- Plusieurs affirmations dépendent de comportements d'outils non vérifiés ici (génération de scripts inline par Astro, plan gratuit Sanity et datasets privés, protection d'aperçu Vercel, taille de React compressée, politique d'usage Hobby). Elles sont signalées comme à vérifier ; chacune justifie une AD même si le comportement réel est plus favorable, car le spine ne le garantit pas.
- Aucune lecture de `design-system/tokens.css` ni de `ancien-portfolio/` : les points A6, D6, G3 pourraient se préciser avec le code existant.
