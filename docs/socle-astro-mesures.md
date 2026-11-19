# Socle Astro : mesures et décisions (story 1.1)

## Budget JavaScript (AD-7)

Mesure : JavaScript transféré en brotli au chargement de `/`, sans interaction, avec un îlot React `client:visible` placé dans la fenêtre (cas le plus lourd, l'îlot hydrate). Test : `tests/e2e/budget-js.spec.ts`. La taille est recalculée en brotli qualité 4 (proche de la compression à la volée de Vercel) ; la qualité 11 donnait 58,5 Ko et sous-estimait le transfert. « Ko » vaut 1 024 octets.

| Mesure                                     | Résultat     |
| ------------------------------------------ | ------------ |
| JS brotli q4, 3 fichiers (React 19 + îlot) | 68,0 Ko      |
| Seuil                                      | 70 Ko        |
| Marge restante (React 19 seul)             | environ 2 Ko |

Avec React 19 seul, le seuil est tenu de très peu (marge d'environ 2 Ko) : l'alias `preact/compat` est donc adopté (voir ci-dessous).

## Essai de l'alias `preact/compat` (AD-7)

Essai mené parce que la marge avec React 19 est d'environ 2 Ko. Configuration : alias Vite `react` et `react-dom` vers `preact/compat` dans `astro.config.mjs`, plus `preact` et `preact-render-to-string` (rendu serveur) en dépendances exactes.

| Variante                     | JS brotli q4, 3 fichiers |
| ---------------------------- | ------------------------ |
| React 19                     | 68,0 Ko                  |
| React aliasé `preact/compat` | 8,4 Ko                   |

Avec l'alias, build, typecheck, lint, tests unitaires et les 5 tests navigateur (dont CSP sans violation et hydratation) passent. **Décision (Léandro) : l'alias est adopté.** React reste l'API d'écriture des îlots, Preact les exécute. La marge passe d'environ 2 Ko à environ 61 Ko.

## CSP (AD-11)

Le HTML d'Astro contient des scripts inline (directive d'hydratation `client:visible`, élément `astro-island`) : un `script-src 'self'` servi en en-tête seul bloquerait l'hydratation.

**Décision : `security.csp` d'Astro.** Il génère une balise `<meta http-equiv="content-security-policy">` avec `script-src 'self'` et les empreintes SHA-256 des scripts du build, sans `'unsafe-inline'` ni `'unsafe-eval'`. `vercel.json` ne porte que ce qu'une balise meta ne peut pas exprimer (`frame-ancestors`) et, plus tard, les autres en-têtes (story 1.5). Une CSP en en-tête avec un `script-src` plus strict s'ajouterait à la balise (intersection) et casserait l'hydratation : ne pas en déclarer.

Test : `tests/headers/csp.spec.ts` (aucune violation, îlot hydraté et cliquable). Il tourne sur `tests/support/serve.mjs`, qui sert `dist/` avec les en-têtes de `vercel.json`.
