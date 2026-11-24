# Portfolio Léandro Da Silva (refonte) — Claude Code Context

Refonte technique du portfolio de Léandro : même site pour le Visiteur, entièrement autre dessous. Statique, lisible par les moteurs de recherche, alimenté par Sanity, sécurisé et accessible (RGAA 4.1 / WCAG 2.2 AA).

**Source de vérité des décisions : `_bmad-output/planning-artifacts/architecture/architecture-refonte portfolio-2026-11-19/ARCHITECTURE-SPINE.md`** (`AD-1` à `AD-18`). En cas de doute, le spine l'emporte sur ce fichier. Les exigences sont dans le PRD (`_bmad-output/planning-artifacts/prds/`).

---

## À ne jamais toucher

- `ancien-portfolio/` : lecture seule, jamais modifié ni supprimé (NFR-6). L'ancien site en ligne chez Hostinger non plus, avant validation et période de repli.
- Les `.env*` contiennent des secrets : ne jamais committer de vraies valeurs. Aucun secret dans le dépôt ni dans le code livré.

## Stack (voir la table versionnée du spine)

Astro 7 (statique) + îlots React 19, Tailwind 4, TypeScript 6.0.3 (pas 7 : incompatible avec `astro check`), Sanity (Studio dans `studio/`, lu au build via `@sanity/client` en lecture seule), Vercel Hobby, ALTCHA + Resend pour le formulaire. **Gratuit ou open source uniquement** (AD-16) : tout service payant exige une nouvelle décision d'architecture.

## Structure

```
src/content/      # seule couche qui parle à Sanity
src/pages/        # routes ; api/ = les deux seules routes serveur
src/components/   # .astro statiques, zéro JS client
src/islands/      # .tsx hydratés (seule couche avec du JS)
src/styles/       # tokens et thèmes
studio/           # projet Sanity indépendant
tests/            # a11y, visuel, en-têtes, e2e
```

## Règles de code

- **TypeScript strict** : pas de `any`, pas d'assertion `as` non justifiée.
- **Statique d'abord** : un composant est `.astro` sauf s'il a besoin d'état ou d'événements du navigateur ; seul ce cas devient un îlot (AD-1). Hydratation `client:visible` ou `client:idle`, jamais `client:load` sans justification écrite.
- **Kit d'abord** : toute story ou correction (`fix/*` compris) qui touche l'interface réutilise une primitive de `src/components/ui/` (liste dans `design-system/components.md`) ou, à défaut, l'ajoute au kit avec son inventaire et ses stories ; jamais de composant d'interface en double (`docs/storybook.md`).
- **Aucun texte en dur** : tout texte visible vient de Sanity, en FR et EN (AD-3). Aucune requête Sanity hors de `src/content/`.
- **Aucune valeur de design en dur** : ni couleur, ni ombre, ni bordure, ni durée littérale hors `src/styles/`. Si le token manque, l'ajouter à `design-system/tokens.css` (AD-6).
- **`localStorage` seulement via `src/islands/prefs.ts`**, clés préfixées `portfolio:` ; aucun cookie.
- **Adresses** construites uniquement par `localizedPath(...)`, jamais à la main.
- **Pas de commentaires**, sauf un WHY non évident.
- **Accessibilité d'abord** : landmarks, titres hiérarchiques, focus visible, texte alternatif, `aria-live` pour les statuts ; aucune `alert()`. Chaque composant se vérifie au clavier.
- **Nommage** : composants `PascalCase`, hooks `useXxx`, slugs `kebab-case`, fichiers sans espace.
- **Gratuit ou open source** : ne jamais ajouter de dépendance ou de service payant sans décision explicite.

## Tests et qualité (voir `docs/TESTING-RULES.md`)

- **Chaque bug corrigé produit un test qui échoue avant le correctif et passe après.**
- Une fonctionnalité n'est pas terminée tant que ses tests ne passent pas ; `npm test`, `npm run lint` et `npm run typecheck` doivent être verts avant tout commit.
- Aucune PR n'est fusionnée dans `main` si la CI échoue (NFR-3). En cas de conflit, la fidélité visuelle l'emporte sur Lighthouse, l'écart est consigné.

## Git

- Branches : `main` (prod), `dev` (Environnement dev), `feat/*`, `fix/*`. Une PR par branche vers `dev`.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`). Une PR `fix:` sans test est rouge.
- Ne jamais committer ni pousser sans demande explicite de Léandro.

## Méthode de travail (BMAD)

Une story = une session Claude Code. Ne jamais anticiper sur la story suivante ; chaque story est validée avant de passer à la suivante. Les épopées et stories sont dans `_bmad-output/planning-artifacts/epics.md`.

## Limites assumées

Le contrôle de pause du bandeau défilant n'existe pas : le bandeau n'est plus affiché sur le site, et `Marquee` n'est pas migré. Tout contenu autonome ajouté plus tard doit offrir une pause (FR-13).
