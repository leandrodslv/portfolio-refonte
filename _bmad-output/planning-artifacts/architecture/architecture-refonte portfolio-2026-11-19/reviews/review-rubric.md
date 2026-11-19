# Revue de l'Architecture Spine selon la grille de contrôle

**Document revu :** `ARCHITECTURE-SPINE.md` (statut draft, 2026-11-19)
**Référence :** `prd.md` (final, FR-1 à FR-23, NFR-1 à NFR-6)
**Méthode :** lecture complète des deux documents. Les versions de la pile ont été comparées à l'état actuel de npm (commande `npm view`, 2026-11-19). Les peer dependencies et les `engines` ont été lus. La spine n'a pas été modifiée.

## Verdict

**Solide, mais à corriger avant de passer aux épopées et aux stories.** Le paradigme est cohérent et 16 décisions (AD) sont bien formées (Binds / Prevents / Rule). Les points de divergence principaux sont bien captés : couche unique vers Sanity, schéma d'URL, thèmes par attribut, deux routes serveur, environnements.

Trois défauts empêchent de valider :

1. Une incompatibilité d'outillage vérifiée : TypeScript 7.0.2 face à `@astrojs/check`.
2. Un mécanisme de CSP / en-têtes par environnement non réalisable tel qu'écrit.
3. Des exigences sans propriétaire : NFR-4 est absent, et FR-14, FR-20, FR-23 n'ont que des liens flous.

Plusieurs règles (AD) ne sont pas appliquées par un contrôle nommé. Les dimensions « exploitation » et « fournisseur » sont silencieuses.

Les sévérités sont : Bloquant, Majeur, Mineur.

## Synthèse par critère

| # | Critère | Résultat |
| --- | --- | --- |
| 1 | Fixe les vrais points de divergence, sans en rater | Partiel. Voir F-5, F-6, F-7, F-12 |
| 2 | Chaque Rule est applicable et empêche la divergence annoncée | Partiel. Voir F-3, F-4, F-8 |
| 3 | Rien dans Deferred ne peut faire diverger deux unités | Partiel. Voir F-6, F-9, F-10 |
| 4 | Technologies nommées vérifiées à jour | Versions : oui. Compatibilité : non (F-1) |
| 5 | Couvre chaque FR / NFR du PRD | Non. NFR-4 absent, FR-14, FR-20, FR-23 faibles (F-5) |
| 6 | Aucune dimension silencieuse (déploiement, fournisseur, exploitation) | Partiel. Exploitation presque muette (F-11, F-12) |

## Constats

### F-1 — Bloquant : TypeScript 7.0.2 incompatible avec `astro check`

- **Vérifié :** `@astrojs/check@0.9.12` (dernière version) déclare `typescript: ^5.0.0 || ^6.0.0` en peer dependency. La spine fige TypeScript 7.0.2 et AD-14 exige `astro check` à chaque PR.
- **Conséquence :** soit `astro check` ne fonctionne pas, soit la première story force des contournements divergents (`--legacy-peer-deps`, rétrogradation silencieuse).
- **Correctif :** décider explicitement. Option A : TypeScript 6.x tant que l'outillage Astro ne suit pas. Option B : TypeScript 7 avec un autre vérificateur de types, nommé dans AD-14.
- **À ajouter à la Stack :** `@astrojs/check` et `@astrojs/sitemap`, qui servent des exigences (FR-19) mais ne sont pas nommés.

Les autres versions sont confirmées à jour par npm : Astro 7.4.13, @astrojs/react 7.1.9, @astrojs/vercel 11.0.22, React 19.3.1, Tailwind 4.3.5, @sanity/astro 4.1.0, sanity 6.24.0, altcha 3.6.0, altcha-lib 2.9.0, resend 6.39.0, @vercel/analytics 2.0.1. `@sanity/astro` accepte Astro 7 en peer. Node ≥ 22.23.4 correspond à `engines` d'Astro 7. Il reste à confirmer que Vercel propose ce runtime, puisque Vercel ne fixe que la version majeure.

Trois points de pile sont à préciser :

- `@sanity/astro` tire `sanity`, `styled-components` et `react-is` dans le Site. Cela contredit en partie « Studio indépendant, hors build du Site ». Préciser si le Site utilise `@sanity/client` seul (plus léger, et AD-2 l'exige de toute façon).
- La spine écrit `Vercel Hobby` / `Sanity Free` sans date de vérification des quotas. Elle cite seulement le seuil de 50 000 événements pour l'audience. Les limites des plans (Sanity : nombre de datasets, requêtes ; Resend : envois par jour et par mois ; Vercel : builds) ne sont pas citées avec leur source.
- Vercel Hobby est limité à un usage personnel et non commercial. Le PRD prévoit une activité freelance d'ici un an. AD-16 devrait dire ce qui se passe à ce moment (nouvelle décision, ou migration). Les conditions actuelles de Vercel sont à confirmer.

### F-2 — Majeur : la CSP sans `unsafe-inline` n'est pas réalisable avec le mécanisme décrit (AD-11, AD-6, Deferred)

- AD-11 : tous les en-têtes sont dans `vercel.json` (fichier statique du dépôt). Mais les hash de scripts inline sont « calculés au build ». Un fichier versionné ne peut pas contenir un hash produit à chaque build. Il faut soit générer `vercel.json` au build, soit poser la CSP en `<meta>` (mais `frame-ancestors` n'y fonctionne pas), soit utiliser le support CSP d'Astro. La spine ne tranche pas.
- Astro émet lui-même des scripts inline pour l'hydratation des îlots, et les composants React posent des `style=""` inline (compétences déplaçables, curseur). `style-src` n'est mentionné nulle part.
- Les directives CSP sont renvoyées à Deferred, alors que le mécanisme de génération en est le point de divergence. Deux unités feront deux choix.
- **Correctif :** fixer le mécanisme (génération des en-têtes au build, ou fonctionnalité CSP d'Astro, ou middleware), la stratégie `style-src` et la liste des origines autorisées (analytics). Laisser en Deferred uniquement les valeurs finales.
- La cible SM-3 (A+ sur securityheaders.com) n'est pas liée à un test. AD-11 dit « un en-tête requis manque » sans lister les en-têtes requis ni la valeur minimale.

### F-3 — Majeur : `X-Robots-Tag: noindex` sur dev conflit avec `vercel.json` unique (AD-10)

- AD-10 : le Site de dev envoie `X-Robots-Tag: noindex` et un `robots.txt` restrictif. AD-11 : tous les en-têtes sont dans un seul `vercel.json`, qui ne sait pas distinguer dev et prod.
- Il faut un mécanisme dépendant de l'environnement (génération au build selon `VERCEL_ENV`, middleware, ou deux configurations). Non décrit.
- De même, `robots.txt` est dans `public/` (statique) dans la structure, et ne peut pas être différent par environnement sans génération au build.
- La correspondance entre les branches / Environnements et les scopes de variables Vercel (Production / Preview) n'est pas écrite : quelle branche lit quel dataset, et quel jeton (un jeton dev ne devrait pas lire production). Les PR de feature génèrent des déploiements Preview : sur quel dataset ?
- Par défaut, Vercel protège les déploiements Preview par authentification. Le Site de dev ne serait alors pas consultable sans compte. À décider pour que « vérifier en dev » (FR-3, UJ-3) soit possible.
- **Correctif :** ajouter une table Environnement → branche → dataset → variables → domaine → en-têtes → analytics.

### F-4 — Majeur : contradictions internes entre règles

- **AD-9 contre AD-1 et FR-4.** E-mail et téléphone sont assemblés par un îlot, donc absents du HTML sans JS. AD-1 promet que « le HTML de chaque page contient tout son texte sans JS ». Il faut déclarer l'exception (et le repli sans JS) plutôt que laisser deux unités l'interpréter chacune à sa façon. Le format d'encodage n'est pas fixé, ni le test qui prouve « aucune coordonnée en clair » (SM-3). Un test CI sur le HTML et les bundles produits est à ajouter à AD-14.
- **AD-8, AD-3 et AD-2 sur les messages d'erreur de l'API.** La convention d'erreur renvoie `errors: { champ: string }`, donc du texte visible. AD-3 interdit un texte en dur et exige un texte bilingue venant de Sanity. AD-2 interdit tout appel Sanity au runtime. La route serveur ne peut donc pas produire ces textes. **Correctif :** l'API renvoie des codes stables et l'îlot les traduit avec `uiStrings` fournis en props.
- **AD-3 contre le déploiement continu.** Le build échoue si une valeur FR ou EN est vide. Une publication partielle en production bloque aussi la publication des autres modifications, sans signal à Léandro (voir F-11). Il faut compléter par la validation dans le schéma du Studio, qui empêche de publier un document incomplet, et préciser le comportement en dev.
- **Diagramme des couches.** La flèche `Components → Content` et `Pages → Content` contredit « pages et composants ne reçoivent que des view-models ». Préciser quelle couche importe `src/content/` (seulement les pages, ou aussi les types).

### F-5 — Majeur : couverture du PRD incomplète

- **NFR-4 (compatibilité navigateurs)** : cité dans `binds` en en-tête mais ni gouverné par une AD, ni présent dans la table Capability → Architecture. Il manque la cible de build (browserslist), la matrice de test (Playwright : Chrome, Safari/WebKit, Firefox, Edge) et sa place en CI.
- **FR-14 (alternatives aux interactions)** : en Deferred (« détail des îlots »). Aucune règle pour l'équivalent textuel de la carte à gratter ni pour l'alternative au glisser-déposer. FR-22 les met dans l'échantillon d'audit.
- **FR-20 (tokens Figma)** : AD-6 affirme « chaque Token existe aussi en variable Figma de même nom », mais l'outillage est en Deferred et rien n'impose la convention de nommage. Aucun contrôle de parité n'est prévu. Il faut au minimum la règle de nommage (préfixe, casse) et le sens de la source de vérité.
- **FR-23 (ajustements visuels montrés à Léandro avant application)** : c'est un processus et l'AD-14 le laisse dans « Conventions ». Le registre des écarts (où il vit) n'est pas défini, alors que FR-8 et AD-14 en dépendent pour exclure les écarts de la comparaison visuelle.
- **FR-19** : la table renvoie à AD-4 et AD-3. Rien ne fixe la génération de `sitemap.xml`, du lien canonique, des données structurées JSON-LD ni de l'image d'aperçu (produite comment, par page de Projet ?). Un auteur par thème de fichier divergera.
- **FR-2** : la comparaison automatisée du texte avant et après migration n'est pas dans la liste de contrôles d'AD-14. Idem FR-4 (sans JS, `curl`), FR-17 (CV renvoyé en 200 après mise en prod) et FR-18 (liens LinkedIn). Ces critères testables du PRD n'ont pas de garde en CI.
- **FR-6** : la mise à jour de `<title>`, de l'URL canonique et de l'annonce de lecteur d'écran lors d'un `pushState` (ouverture sans rechargement) n'est pas fixée. Le comportement du changement de langue depuis une Fenêtre de projet ouverte (FR-10, « conserve le Projet affiché ») n'est pas non plus précisé.
- **NFR-6** : AD-15 omet l'archive complète hors dépôt avec empreinte de contrôle, exigée par le PRD, et le délai de retour de moins d'une heure.
- **FR-3 / SM-5** : rien ne dit quelle perspective Sanity est lue au build (publié seulement ou brouillons). Si un contributeur lit les brouillons, un texte non publié sort en production.

### F-6 — Majeur : budget JavaScript (AD-7) mal défini et de faisabilité non démontrée

- « JS initial < 70 Ko compressés » ne précise pas : quelle page, quelle mesure (transfert gzip ou brotli), avant ou après hydratation des îlots `client:visible`, et si le script d'analytics compte. Deux unités mesureront différemment.
- La charge de React 19 (react-dom) à elle seule représente une grande part de ce budget dès le premier îlot hydraté. Aucune estimation ni preuve de faisabilité n'est donnée. À mesurer sur un prototype avant de figer ce seuil comme règle bloquante en CI.
- Le seuil du PRD est une hypothèse (NFR-1) « à affiner en architecture » : la spine le promeut en règle sans l'affiner.
- L'inventaire des îlots (menu, fenêtre, compétences, carte à gratter, curseur / son / fête, sélecteur de thème, sélecteur de langue, contact) dépasse « quatre à cinq ». La communication entre îlots (thème, son coupé, mode fête, langue) n'a pas de mécanisme commun (stockage partagé, événements du navigateur, bibliothèque d'état). C'est un vrai point de divergence laissé en Deferred.
- Avant l'hydratation, une Fenêtre de projet ouverte dans le HTML ne peut ni se fermer ni piéger le focus. Le repli sans JS (lien vers la Page d'accueil) n'est pas prévu.

### F-7 — Majeur : formulaire de contact (AD-8), points non fixés

- Le code HTTP 429 est prévu mais aucun mécanisme de limitation de débit n'existe (pas de stockage sur Vercel Hobby par défaut). Le rejeu d'un défi ALTCHA résolu n'est pas traité (durée de validité, usage unique : il faut un stockage ou une expiration courte). Les bornes de validation (longueurs, format) ne sont pas fixées.
- Domaine d'envoi Resend : vérification SPF / DKIM / DMARC sur le DNS (chez Hostinger). Elle n'apparaît pas dans AD-15, alors que le DNS est exactement la ressource manipulée à la bascule. Adresse d'expédition et de destination, et comportement quand Resend échoue (message perdu ? réponse à l'utilisateur ?) ne sont pas décrits.
- Quotas gratuits de Resend (envois par jour et par mois) : risque cité par AD-16 en principe, mais sans conséquence décrite.
- Les deux routes sont seules en `prerender = false`, mais `404.html` et l'adaptateur doivent coexister avec le mode statique d'Astro. La spine ne dit pas le mode de sortie (`static` avec exceptions). Une 404 en anglais pour `/en/…` n'est pas prévue.

### F-8 — Mineur : règles non appliquées par un contrôle nommé

Plusieurs règles interdisent quelque chose sans qu'AD-14 ne nomme l'outil qui l'applique :

- AD-2 / AD-3 : imports Sanity hors de `src/content/`, texte en dur → règle `no-restricted-imports` ou dépendance-cruiser, et un contrôle de texte en dur.
- AD-6 / FR-20 : « aucune valeur de couleur, d'ombre ou de bordure littérale hors `src/styles/` » → règle stylelint ou équivalent.
- AD-7 : « jamais `client:load` sans justification écrite » → pas de contrôle ; une règle de lint sur la directive suffirait.
- AD-14 : seuils Lighthouse non indiqués (SM-1 : plancher 95), pas de seuil de pixels (0,1 %), pas de lieu de stockage des captures de référence de l'ancien site, ni de procédure pour les produire.

### F-9 — Mineur : points de Deferred qui ne devraient pas l'être

- **Visibilité du dépôt GitHub** : peut rendre NFR-3 inapplicable (pas de protection de branche gratuite sur dépôt privé). C'est une décision de déploiement qui conditionne une exigence en « bind » ; elle doit être tranchée dans la spine ou posée comme condition bloquante explicite.
- **Pause du bandeau** : AD-7 l'enregistre comme `[ASSUMPTION]` mais le comportement par défaut (pause fournie ou non) est ce qui fait diverger l'implémentation ; il faut dire quel est le défaut en attendant la réponse de Léandro.
- **Schémas Sanity** : acceptable en Deferred car les contraintes sont posées en AD-2, AD-3 et AD-12. Mais le mécanisme de localisation `{ fr, en }` (champs d'objets, pas de plugin de traduction de document) est une décision de modèle fixée en AD-3, donc cohérente.
- Reste correct en Deferred : déclaration d'accessibilité, audit manuel, détail d'implémentation des îlots (sous réserve de F-6).

### F-10 — Mineur : AD-12 (images)

Télécharger et optimiser toutes les images Sanity à chaque build (rebuild complet à chaque publication, AD-2) allonge les temps de build et risque de dépasser les limites de Vercel Hobby ; SM-5 exige moins de 5 minutes de la publication à la mise en ligne. Aucune stratégie de cache de build n'est mentionnée. À mesurer, ou à mentionner comme risque avec une limite de sortie.

### F-11 — Majeur : exploitation presque silencieuse

La spine décrit la livraison mais pas la vie du Site :

- **Alerte sur échec de build** : une publication Sanity qui fait échouer le build (AD-3) laisse l'ancienne version en ligne sans prévenir Léandro. Prévoir une notification (e-mail ou statut GitHub) et une procédure.
- **Observation** : aucun suivi des erreurs de la route de contact, ni de disponibilité du CDN. Même minimal (journaux Vercel, alerte d'échec Resend), il faut le dire.
- **Sauvegarde du contenu** : l'export Sanity est cité seulement pour la promotion dev → production. Aucune sauvegarde périodique du dataset de production, alors que le contenu est la seule source de vérité du Site (le code n'a plus de texte). Le plan gratuit de Sanity peut ne pas inclure de sauvegardes (à confirmer).
- **Retour arrière du nouveau Site** : le retour de déploiement (rollback Vercel) n'est pas décrit. AD-15 couvre seulement le retour à l'ancien Site par le DNS.
- **Rotation des secrets** (jetons Sanity, clé Resend, secret HMAC ALTCHA) et accès au Studio (qui peut se connecter, origines CORS autorisées) : non traités.
- **Mise à jour des dépendances** : Dependabot est cité, mais aucune règle pour les versions majeures (par exemple le cas F-1).

### F-12 — Mineur : stratégie fournisseur et déploiement (AD-15, AD-16)

- **HSTS et retour arrière.** AD-11 (HSTS) et AD-15 (retour DNS) interagissent : une durée HSTS longue (ou `preload`) sur le domaine empêche un retour vers un ancien hébergement sans HTTPS valide. Fixer une durée progressive et vérifier le certificat de l'ancien site.
- **DNS.** La zone DNS est « chez Hostinger » : confirmer qu'elle sera gérée là (enregistrements A / CNAME vers Vercel, domaine `www` et apex, certificat TLS émis par Vercel) et décrire l'état de départ à restaurer pour le retour. Le TTL abaissé est cité sans valeur ni durée.
- **`ancien-portfolio/` dans le dépôt** : il peut être déployé, lu par le lint ou le Lighthouse. Préciser son exclusion (`.vercelignore`, ignorés du lint / des tests).
- **Dépendance à un seul fournisseur** (Vercel héberge, construit, mesure l'audience, protège les déploiements) : acceptable pour un portfolio, mais la stratégie de sortie (le Site est du statique + deux routes, portable) mérite une ligne dans AD-16.
- **CV dans `public/`** : le cycle de mise à jour du CV (git, pas le Studio) est cohérent avec FR-17 mais devrait préciser le nom de fichier stable (lien externe, LinkedIn).

## Points forts à conserver

- Une seule couche d'accès à Sanity, jeton en lecture seule, view-models typés (AD-2).
- Schéma d'URL et règle de page de Projet = Page d'accueil complète (AD-4), qui satisfait FR-4 et FR-6 en même temps.
- Thèmes par attribut avec script avant le premier rendu, sans valeur de design en dur (AD-6).
- Surface serveur minimale et explicite : deux routes seulement (AD-8).
- Fidélité visuelle prioritaire sur Lighthouse, alignée sur le PRD (AD-14).
- Contrainte « gratuit ou open source » avec les seuils de quota cités (AD-16).
- Versions de la pile toutes à jour sur npm (hors l'incompatibilité F-1).

## Ordre de correction recommandé

1. F-1 (TypeScript / `astro check`) : bloque la première PR.
2. F-2 et F-3 (mécanisme CSP et en-têtes par environnement, table des environnements) : avant toute story de déploiement.
3. F-5 (NFR-4 et critères testables sans garde) et F-4 (contradictions AD-9 / AD-1, AD-8 / AD-2) : avant le découpage en épopées.
4. F-6 (définition et mesure du budget JS, mécanisme d'état partagé entre îlots), F-7 (contact), F-11 (exploitation).
5. F-8 à F-10 et F-12 : à intégrer lors de la révision.
