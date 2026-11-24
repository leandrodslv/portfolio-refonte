---
title: 'Story 3.5 : Français et anglais'
type: 'feature'
created: '2026-11-24'
status: 'done'
route: 'dispatch'
baseline_commit: 'a9baa670a24b93576aad3e89d74f4e7207fdb96c'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-3-4-section-contact-structure-et-pied-de-page.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Les routes `/` (FR) et `/en/` (EN) existent, mais aucune page ne déclare ses équivalents `hreflang` et le Visiteur n'a aucun moyen de passer d'une Langue à l'autre (FR-10).

**Approach:** Ajouter un composant `Seo` (canonical, `hreflang` réciproques, `x-default`) au Gabarit et un sélecteur de Langue statique dans la Navbar : deux liens construits par `localizedPath`, sans JavaScript, la Langue active marquée `aria-current`.

## Boundaries & Constraints

**Always:** Aucun texte en dur : le libellé du sélecteur vient de `uiStrings.selecteurLangue` via `SiteVue`. Toute adresse passe par `localizedPath(...)`. `/` reste FR quel que soit le navigateur : aucune détection, aucune mémorisation de la Langue. Le sélecteur fonctionne sans JS et s'atteint au clavier avec focus visible. Aucune valeur de design en dur (tokens).

**Never:** Pas d'îlot, pas de `localStorage`, pas de cookie. Pas de page Projet ni de 404 (3.6). Pas de sélecteur de Thème (4.2). Ne pas toucher `ancien-portfolio/`. Ne pas publier dans Sanity.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Page FR | `/` | `<html lang="fr">`, canonical `/`, hreflang `fr`→`/`, `en`→`/en/`, `x-default`→`/` ; sélecteur : FR `aria-current`, EN lien vers `/en/` | N/A |
| Page EN | `/en/` | `<html lang="en">`, canonical `/en/`, mêmes hreflang ; EN `aria-current`, FR lien vers `/` | N/A |
| Navigateur en anglais | `/` avec `Accept-Language: en` | Reste FR | N/A |
| Chaîne EN manquante | `selecteurLangue` vide en EN | Le build échoue en nommant type, champ et Langue (comportement de `texte()`) | Erreur de build existante |

</frozen-after-approval>

## Code Map

- `src/components/Gabarit.astro` -- porte `<html lang>` ; y insérer `Seo` dans le `<head>`, avec prop optionnelle `slug`.
- `src/components/Navbar.astro` -- y placer le sélecteur (dans le panneau du menu mobile aussi) ; styles par tokens uniquement.
- `src/lib/localizedPath.ts` -- seule source des adresses ; ne pas modifier.
- `src/content/site.ts` -- `SiteVue` : ajouter `selecteurLangue` ; `texte()` exige FR et EN.
- `src/migration/tableUiStrings.ts` -- `TEXTES_AJOUTES` : ajouter `selecteurLangue` (FR « Langue », EN « Language »). `migration.test.ts:249-256` l'accepte sans autre changement.
- `studio/lib/catalogueUiStrings.ts:28` et `src/content/types.ts:180` -- le champ existe déjà, aucun changement de schéma.
- `src/components/Navbar.test.ts`, `Accueil.test.ts`, `src/content/site.test.ts` -- littéraux `SiteVue` à compléter ; modèle de test : `rendre`, `analyser`, `violationsAxe` (`src/components/ui/rendu.ts`).
- `astro.config.mjs` -- `sitemap({ filter })` sans `i18n` : ajouter `i18n` pour les `xhtml:link`.
- `src/components/EssaiContenu.astro` et `src/pages/**/essai-contenu.astro` -- hors sitemap, noindex : ne pas toucher.

## Tasks & Acceptance

**Execution:**
- [x] `src/migration/tableUiStrings.ts`, `src/content/site.ts` -- ajouter `selecteurLangue` à la migration et à `SiteVue` -- source unique du libellé
- [x] `src/components/Seo.astro` -- canonical, hreflang `fr`/`en`/`x-default` en URL absolues (`Astro.site` + `localizedPath`) -- FR-10
- [x] `src/components/Gabarit.astro` -- inclure `Seo` -- chaque page déclare ses équivalents
- [x] `src/components/SelecteurLangue.astro`, `Navbar.astro` -- deux liens `FR`/`EN` dans un `nav` ou groupe nommé par `site.selecteurLangue`, `lang` et `hreflang` sur le lien, `aria-current="true"` sur la Langue active -- clavier et lecteurs d'écran
- [x] `astro.config.mjs` -- `i18n` du sitemap (défaut `fr`) -- alternates réciproques
- [ ] Tests : `Seo.test.ts`, `SelecteurLangue.test.ts` (fr/en, axe), mise à jour de `Navbar.test.ts`, `Accueil.test.ts`, `site.test.ts`, `migration.test.ts` ; e2e `tests/e2e/langue.spec.ts` (navigation Tab + Entrée de `/` vers `/en/`, aucune redirection selon `Accept-Language`)

**Acceptance Criteria:**
- Given `/` et `/en/`, when je lis le HTML sans JS, then `lang`, canonical, hreflang réciproques et `x-default` sont présents.
- Given le sélecteur, when je navigue au clavier, then les deux liens sont atteignables, la Langue active porte `aria-current` et l'autre lien change de page.
- Given le sitemap généré, when je le lis, then les deux pages d'accueil portent leurs alternates.
- Given axe, when il analyse les deux Langues, then aucune violation.

## Implementation Notes

Notes d'implémentation (agent) : `Link.astro` et `Navbar.astro` passent de `:last-child` à `:last-of-type` (le sélecteur devient le dernier enfant du panneau) ; `rendu.ts` fixe `site` du conteneur de test ; `Navbar.test.ts` et `Accueil.test.ts` ciblent `nav a:not([hreflang])`. Test ajouté après audit de la matrice : `selecteurLangue` EN vide dans `site.test.ts`. Non vérifiés ici faute de variables Sanity : `npm run build`, sortie du sitemap, `langue.spec.ts`.

## Review Triage Log

| Trouvaille | Verdict | Preuve / route |
|---|---|---|
| `slug` non transmis de Gabarit à Navbar puis au sélecteur (3 relecteurs) | medium | Réel : hreflang vise l'adresse avec slug, le sélecteur l'accueil. Latent (aucune page Projet). patch |
| Branche `slug` non testée (Seo, SelecteurLangue) | low | patch |
| Navbar sans assertion du sélecteur ; Gabarit sans assertion de Seo | low | patch |
| e2e : Tab jamais pressé ; requête `EN` non bornée ; href exacts non vérifiés | medium | Écart avec le critère « au clavier ». patch |
| Sitemap `i18n` sans aucune vérification | medium | Aucun test ne lit le sitemap. patch (non exécutable ici) |
| `Astro.site` indéfini | false | `site` est défini dans `astro.config.mjs` ; échec bruyant sinon |
| Slug présent dans une seule Langue | false | Slug unique FR/EN (spine AS:73) |
| `selecteurLangue` non publié dans Sanity | medium | Réel, action de Léandro (publication dev puis prod). defer |
| Libellés « FR »/« EN » sans nom complet accessible | low | Choix annoncé et approuvé au checkpoint 1. defer |
| `<title>` identique par Langue, pas de description ni `og:*` | low | Antérieur à la story. defer |
| Tableau `['fr','en']` dupliqué | low | Le correctif ajoute une constante : rejeté |
| Breakpoint `47.99rem` en dur | low | Même valeur que la Navbar existante : rejeté |
| `:last-of-type` dans Link et Navbar | low | Les liens du sélecteur sont dans un `div`, donc non comptés : rejeté |
| `migration.test.ts` « non mis à jour » | false | Passe sans modification ; corriger reviendrait à éditer la spec |
| Test Accept-Language trivial sur site statique | low | C'est le critère de la story : rejeté |
| Test mobile, états `aria-current`/`forced-colors` | low | Rejeté |

## Design Notes

Le sélecteur est un lien et non un bouton : la navigation change de page, donc aucun `aria-live` n'est utile ; `aria-current` et `lang` suffisent à annoncer la Langue. Les codes visibles `FR`/`EN` sont des identifiants, pas du texte traduit. Le dépôt Sanity doit recevoir `selecteurLangue` (publication dev puis prod, story 2.6) avant le prochain build contre ce dataset, sinon `texte()` échoue : à signaler, non fait ici.

## Verification

**Commands:**
- `npm test` -- expected: vert
- `npm run lint && npm run typecheck` -- expected: vert
- `npm run test:e2e -- tests/e2e/langue.spec.ts` -- expected: vert
