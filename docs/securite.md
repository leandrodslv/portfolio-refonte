# Sécurité : en-têtes, secrets, dépendances

## En-têtes (`vercel.json`, AD-11)

Tous les en-têtes sont déclarés dans la règle globale `/(.*)` de `vercel.json`. Les tests `src/vercel.test.ts` (fichier) et `tests/headers/en-tetes.spec.ts` (en-têtes servis) échouent si l'un d'eux manque ou diffère.

| En-tête                     | Valeur                                                                                                                                                                                  | Raison                                                                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | `base-uri`, `object-src 'none'`, `form-action`, `img-src 'self' data:`, `font-src`, `connect-src`, `media-src`, `worker-src 'self' blob:`, `frame-src 'none'`, `frame-ancestors 'none'` | ferme tout ce que la balise meta d'Astro ne couvre pas                                                                                            |
| `Strict-Transport-Security` | `max-age=86400`                                                                                                                                                                         | un jour au plus, sans `preload` ni `includeSubDomains`, pour garder le retour DNS vers l'ancien site possible pendant la période de repli (AD-11) |
| `X-Content-Type-Options`    | `nosniff`                                                                                                                                                                               | pas de détection de type par le navigateur                                                                                                        |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                                                                                                                       | pas de chemin complet envoyé hors du Site                                                                                                         |
| `Permissions-Policy`        | caméra, micro, géolocalisation, paiement et USB désactivés                                                                                                                              | le Site n'en a pas besoin                                                                                                                         |

### Pourquoi la CSP d'en-tête n'a ni `script-src`, ni `style-src`, ni `default-src`

`security.csp` d'Astro écrit dans la page une balise meta avec `script-src 'self'` et les empreintes SHA-256 des scripts inline d'hydratation. Un en-tête et une balise meta se cumulent : un script doit passer les deux. Sans `script-src` dans l'en-tête, `default-src` s'appliquerait aux scripts inline, que seules les empreintes de la meta autorisent : l'hydratation casserait. Les scripts et styles restent donc régis par la meta ; un test interdit ces trois directives dans l'en-tête.

### Ajouter une origine (analytics, ALTCHA, polices)

Étendre la directive concernée de l'en-tête (`connect-src`, `font-src`, `img-src`…), ajuster `src/vercel.test.ts` et vérifier qu'aucune violation n'apparaît (`tests/headers/csp.spec.ts`). Pour un script, l'origine va dans la configuration `security.csp` d'Astro, jamais dans l'en-tête.

## Secrets (gitleaks)

gitleaks tourne dans le job `secrets` de la CI, exigé par `ci-ok`. `.gitleaks.toml` hérite des règles par défaut ; l'allowlist se limite à `_bmad/_config/files-manifest.csv` (empreintes de fichiers du manifeste BMAD, faux positif connu). `src/securite.test.ts` échoue si un chemin, une regex, un mot vide ou un commit s'ajoute. Pour élargir l'allowlist : documenter ici le faux positif, puis modifier le test dans la même PR.

## Dépendances

Dependabot surveille `npm` et `github-actions` chaque lundi (`.github/dependabot.yml`, vérifié par `src/securite.test.ts`). Le job `audit` lance `npm audit --audit-level=high` à chaque PR, exigé par `ci-ok` (contrôlé par `src/ci.test.ts`). Une faille haute introduite par une PR fait échouer la CI ; elle se traite par une mise à jour ou, à défaut, par un `overrides` justifié dans la PR.
