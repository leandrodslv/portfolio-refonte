# Revue des versions et des choix technologiques — ARCHITECTURE-SPINE (2026-11-19)

Méthode : `npm view` (versions, peerDependencies, engines) le 2026-11-19, lecture du paquet `altcha-lib@2.9.0` décompressé, pages officielles Astro, Vercel, Sanity, Resend, Tailwind. Le spine n'a pas été modifié.

## Verdict

Les numéros de version de la section Stack sont **tous exacts** (ce sont bien les `latest` npm du jour). Mais le spine n'est pas prêt à figer : **1 bloquant, 4 écarts importants, plusieurs points à reformuler**. Les choix « Astro 7 + adapter Vercel + prerender=false par route » et « ALTCHA serveur » tiennent ; ce sont la chaîne d'outils TypeScript, la CSP, `@theme`, Node et les conditions Vercel Hobby qui posent problème.

## Versions vérifiées (npm, 2026-11-19)

| Paquet | Spine | npm latest | Verdict |
| --- | --- | --- | --- |
| astro | 7.4.13 | 7.4.13 | OK (engines node >=22.23.4, Vite ^8.3.8) |
| @astrojs/react | 7.1.9 | 7.1.9 | OK (peer react 17-19) |
| @astrojs/vercel | 11.0.22 | 11.0.22 | OK (peer astro ^7.0.0) |
| react | 19.3.1 | 19.3.1 | OK (sanity exige ^19.2.2) |
| tailwindcss | 4.3.5 | 4.3.5 | OK ; `@tailwindcss/vite` 4.3.5 accepte vite ^8, compatible Astro 7 |
| typescript | 7.0.2 | 7.0.2 | Version exacte, mais **bloquante** (voir F1) |
| @sanity/astro | 4.1.0 | 4.1.0 | OK en version, **discutable en usage** (F5) |
| sanity | 6.24.0 | 6.24.0 | OK (node >=22.12) |
| altcha | 3.6.0 | 3.6.0 | OK |
| altcha-lib | 2.9.0 | 2.9.0 | OK, API v2 (voir F6) |
| resend | 6.39.0 | 6.39.0 | OK |
| @vercel/analytics | 2.0.1 | 2.0.1 | OK |

Le spine fige des numéros exacts sans préciser le mode (exact vs `^`) ni la présence d'un lockfile : à trancher.

## Constats

### F1 — BLOQUANT : TypeScript 7.0.2 incompatible avec `astro check` (AD-14)
- `@astrojs/check@0.9.12` (latest) déclare `peerDependencies.typescript: ^5.0.0 || ^6.0.0`. Son moteur `@astrojs/language-server` s'appuie sur l'API TypeScript classique.
- `typescript-eslint` (latest) accepte `>=4.8.4 <6.1.0` : pas de TS 7 non plus (le lint typé de AD-14 est touché).
- AD-14 impose `astro check` bloquant en CI ; avec TS 7.0.2 l'installation échoue (ERESOLVE) ou le contrôle ne fonctionne pas.
- Action : épingler TypeScript 6.x (dernière 6) tant que `@astrojs/check` et typescript-eslint ne supportent pas 7, ou vérifier concrètement et documenter. Retirer 7.0.2 de la table Stack.

### F2 — IMPORTANT : la CSP d'AD-11 ne peut pas fonctionner telle que décrite
- AD-11 : CSP dans `vercel.json`, scripts inline autorisés « par hash calculé au build ». Or `vercel.json` est statique : il ne peut pas recevoir un hash calculé au build.
- Astro (`security.csp`, stable depuis 6.0, défaut `false`) fait l'inverse : il calcule les hashes de ses scripts/styles et émet une **balise `<meta http-equiv="content-security-policy">`** par page (aussi sur les pages statiques). La documentation ne mentionne ni en-tête HTTP ni l'adapter Vercel.
- Conséquences : (a) `frame-ancestors`, `report-uri`/`report-to` et `sandbox` sont ignorés en `<meta>` ; la protection contre le cadrage doit venir de `X-Frame-Options` ou d'un en-tête `Content-Security-Policy` séparé dans `vercel.json`, sans hash. (b) Deux CSP cumulées (meta + en-tête) s'intersectent : la plus stricte gagne, ce qui peut casser le site de façon surprenante. (c) Le test CI « en-tête manquant » ne verra pas la CSP meta.
- Limites documentées d'Astro CSP : scripts/styles externes non pris en charge sans hashes manuels, `<ClientRouter />` non supporté, Shiki non supporté. Non testé ici : les attributs `style=""` inline produits par React (îlots) et par Tailwind n'entrent pas dans `style-src` sans `unsafe-inline` ni hash d'attribut (Astro 7.1+ a un `kind: "attribute"` pour les hashes). Interdire `unsafe-inline` pour les styles est donc un risque réel pour les îlots.
- Le script de Thème (AD-6) est un `<script is:inline>` : la doc CSP ne dit rien de leur hachage ; à prototyper avant de figer.
- Action : réécrire AD-11 : CSP générée par Astro (`security.csp`) pour script/style, en-têtes statiques (HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options/frame-ancestors) dans `vercel.json`. Ajouter un spike « CSP + îlot React + script de thème » avant la première story.

### F3 — IMPORTANT : `@theme` ne suffit pas pour des thèmes par `data-theme` (AD-6)
- AD-6 dit « tokens exposés à Tailwind via `@theme` ». Un `@theme` simple dont la valeur est `var(--x)` est résolu sur `:root` ; les surcharges sous `[data-theme="terminal"]` n'auront alors pas d'effet sur les utilitaires. Il faut `@theme inline` (les utilitaires utilisent `var(--x)` directement), les valeurs variables restant déclarées dans `:root` / `[data-theme=...]`.
- `design-system/tokens.css` utilise bien `[data-theme="pop|terminal|wireframe"]` (lignes 119, 143, 167). Préciser `@theme inline` dans AD-6 et prévoir `--color-*: initial` pour interdire les couleurs Tailwind par défaut (cohérent avec « rien en dur »).

### F4 — IMPORTANT : Node « ≥22.23.4 (LTS) » est inapplicable et daté
- Vercel n'expose que des **versions majeures** (26.x par défaut, 24.x, 22.x) ; les mineures sont gérées par Vercel. Une contrainte `22.23.4` ne se garantit pas sur le build Vercel. Node 20 est déprécié au 1er octobre 2026.
- Node 26 est LTS et le défaut Vercel ; Node 22 est en fin de maintenance en 2027. `astro` impose `>=22.23.4` : un Node 24.x ou 26.x convient.
- Action : choisir un majeur (24 ou 26), le fixer dans `engines` et `.nvmrc`, et décrire la valeur plancher d'Astro séparément.

### F5 — IMPORTANT : `@sanity/astro` et `sanity` dans le Site contredisent « Studio hors build »
- `@sanity/astro@4.1.0` impose en peers : `sanity`, `react`, `react-dom`, `styled-components`, `@sanity/client`, `@sanity/visual-editing-standalone`. Pour un Site qui ne fait que lire au build, c'est lourd, et ça tire le Studio dans le graphe du Site, alors que le tableau dit « Studio : projet indépendant, hors build du Site ». Aucune ligne du spine ne dit ce que `@sanity/astro` apporte (Studio embarqué, visual editing ?).
- Alternative plus simple : `@sanity/client` seul dans `src/content/`, `sanity` seulement dans `studio/` avec son propre `package.json`. Décider explicitement.
- Le plan Free impose des datasets **publics** : un jeton de lecture n'est donc pas nécessaire pour les documents publiés, et le contenu du dataset `dev` est lisible par tous. AD-2 (« jeton en lecture seule ») reste utile si on veut lire les brouillons, mais « contenu non vérifié » dans un dataset public est à assumer.

### F6 — Vérifié : ALTCHA côté serveur, avec une réserve de formulation (AD-8)
- `altcha-lib@2.9.0` est la v2 (nouveau mécanisme de preuve de travail). API par défaut : `createChallenge({ algorithm, cost, counter, deriveKey, hmacSignatureSecret, hmacKeySignatureSecret })` et `verifySolution({ challenge, solution, deriveKey, hmacSignatureSecret, hmacKeySignatureSecret })` ; `deriveKey` s'importe de `altcha-lib/algorithms/pbkdf2`. Node 20+. L'ancienne API v1 est sous `altcha-lib/v1`.
- Le spine parle d'une « clé HMAC » unique : en v2 il y en a **deux** (`hmacSignatureSecret` et `hmacKeySignatureSecret`). À corriger dans AD-8 / Conventions.
- Il n'y a pas de plugin Astro ; l'intégration en route Astro est « custom » (guide Advanced Usage). À pairer : widget `altcha@3.6.0` (client) avec le format de challenge v2 ; une paire de versions v1/v2 incohérente casse la vérification. Prévoir un test d'intégration widget + route.
- Peers d'altcha-lib (express, hono, etc.) : tous optionnels, aucun n'est requis pour Astro.
- Protection contre le rejeu : le paquet propose un `store` (CappedMap) ; une route serverless sans état ne mémorise rien entre invocations. Un jeton valide peut être rejoué tant qu'il n'a pas expiré ; à noter comme limite acceptée ou à traiter (expiration courte).

### F7 — Vérifié : Astro 7 + @astrojs/vercel + `prerender = false` par route (AD-8)
- La doc Astro (on-demand rendering) : `export const prerender = false` en tête d'une page ou d'un endpoint, le reste restant statique par défaut ; un adapter est requis. `@astrojs/vercel@11.0.22` a pour peer `astro ^7.0.0`. Le choix est cohérent. La page de l'adapter ne mentionne ni Astro 7 ni la syntaxe `prerender` ; la combinaison précise Astro 7 + adapter n'est confirmée que par les numéros de peers, pas par un exemple. Un `astro build` réel dans le premier spike la confirmera.
- À noter pour AD-8 : Astro 7 compile en Rust sans « corriger » le HTML (erreurs sur balises non fermées) et réduit les espaces comme JSX ; attendu à l'import des composants issus de l'ancien site.

### F8 — IMPORTANT : Vercel Hobby et usage commercial (AD-16)
- Les Conditions de Vercel (§4) disent : « You shall only use the Services under a Hobby plan for your personal or non-commercial use ». Le terme « commercial » n'est pas défini sur la page lue (la politique d'utilisation acceptable, non lue, pourrait le faire).
- Un portfolio de freelance/candidature qui sert à prospecter est dans une zone grise. À instruire par une réponse écrite de Vercel ou à prévoir un plan de repli (autre hébergeur statique gratuit). AD-16 présente Hobby comme acquis ; il faut le qualifier en risque connu.
- Limites Hobby confirmées (page Hobby, mise à jour 2026-11-12) : 100 déploiements/jour, durée de fonction max 300 s, 1 M d'invocations, 100 Go de transfert, 4 CPU-h, 5 000 transformations d'image, 2 vCPU de build. Les deploy hooks : 5 par projet, 60 déclenchements/heure/projet (compatible avec le webhook Sanity, mais deux déploiements consécutifs sur le même hook annulent le précédent).
- Le plan Hobby n'offre que « Vercel Authentication » en protection : par défaut, les déploiements de prévisualisation (donc le Site de dev sur la branche `dev`) peuvent être protégés ; le spine suppose un Site de dev public avec `noindex`. À préciser : protéger ou non.

### F9 — Vérifié, formulation à corriger : `@vercel/analytics` (AD-13, AD-16)
- Hobby : 50 000 événements/mois inclus, partagés entre tous les projets de l'équipe ; au-delà, **délai de grâce de 3 jours puis collecte suspendue**, reprise après 7 jours ; fenêtre de rapport 1 mois ; pas d'événements personnalisés. Le spine dit « suspendue au-delà de 50 000 événements/mois » : juste, il faut ajouter le délai de grâce et la fenêtre d'un mois.
- `@vercel/analytics@2.0.1` : les peers (next, vue, svelte, react…) sont tous des options. Pour Astro, l'intégration est le composant `@vercel/analytics/astro` ; le spine ne le dit pas.
- « Sans cookie » (AD-13) : conforme à la documentation Vercel pour Web Analytics, mais la vérification de conformité CNIL (exemption, mesure d'audience) reste à faire côté contenu légal ; non vérifié ici.

### F10 — Vérifié : Resend Free (AD-8, AD-16)
- Resend Free : 3 000 e-mails/mois, **100 e-mails/jour**, 3 domaines. Largement suffisant pour un formulaire de contact ; le plafond quotidien de 100 est le vrai garde-fou face à du spam. Prévoir le comportement en cas de dépassement (réponse 429/500 mappée dans le JSON d'erreurs) et l'envoi depuis un domaine vérifié (DNS SPF/DKIM chez Hostinger, à lister dans AD-15).

### F11 — Vérifié, un détail serré : Sanity Free et deux datasets (AD-10)
- Plan Free (page tarifs) : **2 datasets, publics seulement**, 1 M requêtes CDN API/mois, 250 000 requêtes API/mois, 100 Go de bande passante, jusqu'à 20 sièges, **2 webhooks**. Aucune restriction d'usage commercial n'est indiquée sur la page lue.
- Le plan couvre exactement `dev` + `production` ; mais les 2 webhooks sont consommés par les deux deploy hooks, sans marge. Tout dataset ou webhook supplémentaire (staging, preview éditorial) exige un plan payant : à noter dans AD-10/AD-16.
- « Export/import Sanity CLI » pour la promotion : le mécanisme existe (`sanity dataset export/import`), mais écrase ou fusionne selon les options ; une promotion dev → production fait aussi migrer les `_id` : à documenter dans le runbook.

### F12 — Détails complémentaires
- `@astrojs/react@7.1.9` a un peer `oxc-transform-react >=0.145.0 <0.157.0` : à installer et à épingler, source possible de conflit au prochain bump.
- Astro 7 repose sur Vite 8 / Rolldown : tout plugin Vite tiers (visualisation du bundle, budget JS) doit être compatible ; vérifier l'outil de mesure du budget de 70 Ko (AD-7).
- La mesure « 70 Ko compressés » est à définir (gzip ou brotli, JS initial de quelle page).
- Le téléchargement des images Sanity au build (AD-12) s'appuie sur les transformations d'image Astro (sharp) à l'exécution du build, pas sur Vercel Image Optimization : pas de quota Hobby consommé, mais le build s'allonge ; vérifier le temps de build face à la limite et au cache.

## Ce qui n'a pas pu être confirmé
- Comportement réel de l'attribut `is:inline` et des styles en ligne React sous `security.csp` (la doc ne dit rien) : à prototyper.
- Définition de « commercial » dans l'Acceptable Use Policy Vercel (non lue).
- Exemple officiel Astro 7 + `@astrojs/vercel` avec `prerender = false` (non trouvé sur la page de l'adapter).
- Notes de version détaillées Astro 7 sur les breaking changes des intégrations (la page de lancement est partielle).

## Priorités pour l'auteur
1. F1 : retirer TypeScript 7.0.2 (ou prouver `astro check`).
2. F2 : réécrire AD-11 autour de `security.csp` d'Astro + en-têtes statiques, et prototyper.
3. F3 : `@theme inline`.
4. F4 : Node majeur Vercel.
5. F5/F8 : trancher `@sanity/astro` vs `@sanity/client` ; qualifier le risque Hobby non commercial.
