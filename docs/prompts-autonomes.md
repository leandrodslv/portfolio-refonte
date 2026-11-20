# Prompts autonomes pour la refonte

Prompts à copier-coller pour faire avancer le projet sans intervention. Ils respectent `CLAUDE.md` : une story par session, pas de commit hors demande (le prompt l'autorise sur une branche `feat/*` seulement), jamais de `main`.

Source des stories : `_bmad-output/planning-artifacts/epics.md`. Suivi : `_bmad-output/implementation-artifacts/sprint-status.yaml`.

## 1. `/goal` : une story, de bout en bout

À lancer dans une **nouvelle session**. Remplace `1.1` par le numéro de la story.

```
/bmad-build Implémente la story 1.1 de _bmad-output/planning-artifacts/epics.md,
et seulement elle. Objectif : tous ses critères d'acceptation sont satisfaits,
vérifiés par des tests.

Règles (CLAUDE.md fait foi) :
- Lis d'abord CLAUDE.md, docs/TESTING-RULES.md et ARCHITECTURE-SPINE.md (AD concernés).
- Crée la branche feat/<story-kebab> depuis dev. Ne touche jamais main.
- Tests d'abord pour chaque critère ; npm test, npm run lint et npm run typecheck
  verts avant tout commit. Aucun any, aucune valeur de design en dur, aucun texte en dur.
- Ne modifie jamais ancien-portfolio/ ni aucun .env* ; aucun secret dans le dépôt.
- Gratuit ou open source uniquement : aucune dépendance ou service payant.
- N'anticipe pas la story suivante.

Autorisation : tu peux committer (Conventional Commits) sur cette branche feat/*.
Ne pousse pas et n'ouvre pas de PR sans que je le demande.

À la fin :
1. Mets à jour la story dans _bmad-output/implementation-artifacts/sprint-status.yaml
   (review si tout est vert).
2. Résume : critères validés, tests ajoutés, décisions prises, écarts consignés.

Arrête-toi et pose-moi la question si : il faut un compte, un jeton ou une clé que
tu n'as pas ; un critère contredit le spine ; un seuil (70 Ko, 0,1 %) est intenable ;
ou une dépendance payante serait nécessaire.
```

## 2. `/loop` : surveiller la CI d'une PR

À lancer après l'ouverture de la PR vers `dev`. Sans intervalle, la boucle se règle seule.

```
/loop Surveille la CI de la PR courante (gh pr checks). Si une étape échoue :
lis les logs, corrige la cause sur la branche feat/* avec un test qui échouait
avant le correctif, relance npm test, npm run lint et npm run typecheck, committe
en fix:. Si tout est vert, dis-le et arrête la boucle. Arrête aussi après 3
tentatives sur la même erreur et explique le blocage. Ne fusionne jamais la PR,
ne touche jamais main.
```

## 3. `/goal` : une épopée, story par story

Pour les épopées sans intervention humaine : 3, 5, 6, 7 (7.1 à 7.4) et 8. Une épopée à la fois, un arrêt entre chaque story.

```
/goal Traite l'épopée 3 de epics.md, story par story, dans l'ordre. Pour chaque
story : applique le prompt de story du point 1, passe-la en review dans
sprint-status.yaml, puis ARRÊTE-TOI et affiche le résumé. N'enchaîne pas sans mon
« continue ». Si le contexte devient lourd, dis-le et propose de reprendre dans une
session neuve.
```

## Ce qui ne peut pas être 100 % autonome

| Story              | Pourquoi une intervention est nécessaire                                                   |
| ------------------ | ------------------------------------------------------------------------------------------ |
| 1.2                | Relier Vercel et GitHub, créer l'alias de dev                                              |
| 1.6                | Réglages de notification dans Vercel et GitHub                                             |
| 2.1 et 2.6         | Créer le projet Sanity, les deux datasets, les jetons et les webhooks                      |
| 2.5                | Story la plus lourde (5 Projets, 19 images) : à scinder en deux sessions                   |
| 4.4                | Les variables Figma se valident dans le compte de Léandro                                  |
| 7.1 et 7.2         | Les clés Resend et ALTCHA se créent chez Léandro ; les tests tournent avec des simulations |
| 9.2, 9.4, 9.5, 9.6 | Audit au lecteur d'écran, validation des ajustements visuels, DNS Hostinger                |

## Ordre conseillé

1. Story 1.1 (prompt 1) : elle dit si les 70 Ko de JS et la CSP sont tenables, donc si tout le reste tient.
2. Stories 1.3, 1.4 et 1.5 (prompt 1), avec la CI en prompt 2.
3. Stories 1.2 et 1.6 avec Léandro, puis le reste de l'épopée 2 selon le tableau.
4. Épopées 3, 5, 6, 7 et 8 : prompt 3, une épopée à la fois.
5. Épopée 9 avec Léandro.
