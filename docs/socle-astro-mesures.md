# Socle Astro : mesures et décisions (story 1.1)

## Budget JavaScript (AD-7)

Mesure : JavaScript transféré en brotli au chargement de `/`, sans interaction, avec un îlot React `client:visible` placé dans la fenêtre (cas le plus lourd, l'îlot hydrate). Test : `tests/e2e/budget-js.spec.ts`.

| Mesure                                    | Résultat        |
| ----------------------------------------- | --------------- |
| JS brotli, 3 fichiers (React 19 + îlot)   | 58,5 Ko         |
| Seuil                                     | 70 Ko           |
| Marge restante pour les stories suivantes | environ 11,5 Ko |

Le seuil est tenable avec React 19 : l'alias `preact/compat` n'est pas nécessaire. La marge est faible : `prefs.ts` (nanostores) et les îlots de la Page d'accueil devront rester dans ces 11,5 Ko, ou hydrater hors du chemin initial (`client:visible`).

## CSP (AD-11)

Le HTML d'Astro contient des scripts inline (directive d'hydratation `client:visible`, élément `astro-island`) : un `script-src 'self'` servi en en-tête seul bloquerait l'hydratation.

**Décision : `security.csp` d'Astro.** Il génère une balise `<meta http-equiv="content-security-policy">` avec `script-src 'self'` et les empreintes SHA-256 des scripts du build, sans `'unsafe-inline'` ni `'unsafe-eval'`. `vercel.json` ne porte que ce qu'une balise meta ne peut pas exprimer (`frame-ancestors`) et, plus tard, les autres en-têtes (story 1.5). Une CSP en en-tête avec un `script-src` plus strict s'ajouterait à la balise (intersection) et casserait l'hydratation : ne pas en déclarer.

Test : `tests/headers/csp.spec.ts` (aucune violation, îlot hydraté et cliquable). Il tourne sur `tests/support/serve.mjs`, qui sert `dist/` avec les en-têtes de `vercel.json`.
