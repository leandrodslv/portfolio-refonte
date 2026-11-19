# Revue qualité du PRD — refonte technique du portfolio de Léandro Da Silva

Calibrage : projet d'apprentissage en solo, reconstruction à l'identique. Le niveau de rigueur attendu est léger, mais le critère de fond reste appliqué. Rien n'est signalé au seul motif qu'une section « manque » : chaque point ci-dessous change ce qu'un lecteur en aval (UX, architecture, stories) ferait.

## Verdict global

Le PRD est solide pour son enjeu. La thèse est nette (« à l'identique pour le visiteur, entièrement autrement dessous », avec un site qui doit prouver « accessible by design »). Les hypothèses sont marquées, les contre-indicateurs existent (SM-C1, SM-C2) et le tri entre ce qui est confirmé et ce qui est supposé est honnête. Le risque principal se situe dans la clarté du « terminé » : les deux exigences qui portent la thèse (fidélité visuelle FR-8 et conformité RGAA FR-22) sont énoncées avec des critères de mesure encore flous. Quelques incohérences de portée (FR-12 contre FR-13, §7.1 qui omet des FR) et une dérive de glossaire sur « Accueil » compliqueront le découpage en stories si on ne les corrige pas.

## Decision-readiness — strong

Les décisions sont écrites comme des décisions et rattachées à leur auteur : « Confirmé par Léandro » (FR-9, FR-10, FR-16, FR-19), « Léandro a refusé cet ajustement » (`prefers-reduced-motion`, FR-13). Les compromis sont nommés avec ce qu'on abandonne. FR-16 dit : « Limite acceptée : cette protection arrête les robots simples, pas ceux qui exécutent JavaScript ». FR-23 règle le conflit entre design figé et RGAA par un mécanisme (changement minimal, montré avant application, consigné). Les Questions ouvertes sont réellement ouvertes, sauf une (voir ci-dessous).

La tension non tranchée est entre le plancher de SM-1 (« en dessous, la v1 n'est pas acceptée », Lighthouse ≥ 95) et la fidélité absolue du design et des animations. SM-C1 dit seulement que le score « ne doit pas justifier de retirer des animations », sans dire ce qui l'emporte si les deux entrent en conflit.

### Findings
- **medium** Précédence non dite entre plancher Lighthouse et fidélité (§8 SM-1 / SM-C1 / FR-8) — SM-1 fixe un plancher bloquant, SM-C1 interdit de dégrader le design pour l'atteindre. Si le curseur personnalisé, le son, le `canvas` et les animations empêchent 95 en performance, rien ne dit quelle exigence cède. *Fix:* ajouter une ligne de règle de préséance (par exemple « la fidélité l'emporte ; l'écart de score est consigné comme FR-23 consigne les écarts RGAA »).
- **low** Décision différée absente des Questions ouvertes (FR-13, §9) — « Si Léandro refuse le contrôle de pause… l'écart est noté dans la déclaration » est une vraie décision en attente, signalée par `[NOTE FOR PM]` dans FR-13 mais pas listée dans §9. À l'inverse, §9 Q5 (lien GitHub factice) répète la note de FR-2. *Fix:* ajouter la décision de pause à §9 et fusionner Q5 avec FR-2.
- **low** Statut de la stack incohérent (§0, §3, §9 Q1) — §0 dit que les choix techniques « ne sont pas décidés ici », mais le glossaire définit le Studio « dans Sanity » et FR-1/FR-3 en dépendent, alors que Q1 présente « Astro et Sanity » comme piste. *Fix:* écrire que Sanity est acté (brief) et que seul le framework reste ouvert.

## Substance over theater — strong

Pas de théâtre notable. La Vision n'est pas interchangeable : elle cite les trois Thèmes, le positionnement LinkedIn et la double raison d'être. Quatre personas au plus, et chacun ancre au moins une exigence (Sophie pour l'URL directe d'un Projet, Inès pour le focus, Léandro pour le Studio). Les SM ont des cibles et des planchers, avec une distinction honnête entre cible issue de Léandro (« le meilleur possible ») et plancher proposé par Claude. Le seul point faible est dans les exigences transversales non numérotées.

### Findings
- **low** Performance et exploitation en adjectifs (§5.3, §5.4) — « Le HTML livré est léger », « nettement inférieur aux 148 Ko actuels », « Une chaîne de contrôle automatique » n'ont ni seuil ni critère d'échec. SM-1 couvre en partie la performance, mais pas le poids JS ni la chaîne CI. *Fix:* fixer un seuil provisoire marqué `[ASSUMPTION]` (par exemple < 70 Ko compressés) et dire ce que la CI bloque.
- **low** UJ-2 ne pilote aucune décision (§2.3) — le responsable d'école n'a pas de nom, pas de cas limite, et rien dans les FR n'en découle que UJ-1 ne couvre déjà. C'est du remplissage, assumé comme `[ASSUMPTION]`. *Fix:* soit le nourrir d'un besoin propre (par exemple repérer le parcours et les compétences sans ouvrir de fenêtre), soit le fusionner avec UJ-1.

## Strategic coherence — strong

Le PRD a une thèse, et les exigences la suivent : fidélité (FR-8), puis ce qui est invisible (rendu, sécurité, accessibilité, CMS). Le type de MVP est clair (apprentissage et preuve, pas de croissance). Les métriques valident la thèse plutôt que l'activité : Lighthouse, RGAA, en-têtes, captures comparées, durée de publication dans le Studio. Les contre-indicateurs SM-C1 et SM-C2 sont bien placés et pertinents (viser la case cochée plutôt que l'expérience réelle au lecteur d'écran). Aucun finding à ce niveau, hormis la précédence déjà relevée ci-dessus.

## Done-ness clarity — adequate

La plupart des FR portent des « Conséquences (testables) » concrètes, ce qui est la bonne forme : FR-4 (`curl` retourne le texte), FR-6 (retour navigateur ferme la fenêtre), FR-19 (aucune ancre dans le plan du site), FR-11 (focus rendu à la carte). Les trous se concentrent sur les deux FR qui portent la thèse, et sur quelques FR sans aucune conséquence testable (FR-7, FR-9, FR-14, FR-18, FR-20).

### Findings
- **high** FR-22 et SM-2 non mesurables en l'état (§5.2, §8) — FR-22 : « Le Site respecte le RGAA dans les Thèmes Pop, Terminal et Wireframe », puis SM-2 : « audit RGAA sans critère bloquant sur l'échantillon ». Ni « critère bloquant » ni « échantillon » ne sont définis (quelles pages, quelles Fenêtres de projet, quels états : menu mobile ouvert, Mode fête, carte à gratter ?). C'est l'exigence la plus exposée du PRD, puisque la promesse publique est « accessible by design ». *Fix:* définir l'échantillon (accueil FR/EN, un Projet de chaque gabarit, chaque Thème, formulaire) et le seuil (« 0 critère non conforme sur l'échantillon, hors dérogations listées dans la déclaration »).
- **high** « Aucun écart » sur captures impossible à tenir tel quel (FR-8, SM-4) — « aucun écart » entre captures avant/après est irréaliste (anti-crénelage, polices, éléments animés ou aléatoires comme la carte à gratter et le bandeau défilant). Autre incohérence : FR-8 parle de « ordinateur et mobile », SM-4 de « 3 largeurs » sans les nommer. *Fix:* fixer un seuil de tolérance par pixel (ou « différence perceptuelle nulle validée à l'œil »), la liste des largeurs, et les éléments animés figés ou masqués pour la comparaison.
- **medium** Contradiction de portée entre FR-12 et FR-13 (§4.6) — FR-12 exige que « chaque animation puisse être arrêtée sans souris », FR-13 limite l'exigence aux contenus qui bougent « seuls pendant plus de 5 secondes » et refuse `prefers-reduced-motion`. Un ingénieur ne saura pas s'il doit pouvoir arrêter le curseur ou la carte à gratter. *Fix:* aligner FR-12 sur FR-13 (« les animations qui se déclenchent sans action du Visiteur ») ou lister les animations concernées.
- **medium** Exigences sans critère de fin vérifiable (FR-14, FR-21, FR-9) — FR-14 : « L'élément `canvas` dispose d'un équivalent textuel » (de quoi ? la carte à gratter ?) ; FR-21 : « Le Formulaire de contact est protégé contre le spam » (aucun test, alors que FR-15 dit « Un envoi automatisé (robot) est rejeté ») ; FR-9 : aucune conséquence testable, ni persistance, ni accessibilité du sélecteur de Thème. *Fix:* un critère par FR (par exemple « un POST sans jeton valide renvoie une erreur et ne crée aucun message »).
- **medium** Périmètre de « tout le Contenu visible de la Section affichée » ambigu (FR-4) — la page est une seule page d'accueil, et le Glossaire définit « Section » comme un bloc. « La Section affichée » peut vouloir dire la page entière, ou seulement la Section visible. Le test `curl` suggère la page entière. *Fix:* dire « tout le Contenu visible de la page d'accueil, et de chaque page de Projet ».
- **low** FR-17 teste le dépôt, pas l'usage (§4.7) — la seule conséquence est que le fichier est versionné. *Fix:* ajouter « le lien du CV renvoie un PDF 200 en prod ».
- **low** Slug des Projets en EN non précisé (FR-6, FR-10) — `/projets/belote-kart` est donné pour FR ; rien ne dit s'il devient `/en/projects/belote-kart` (ou reste `/en/projets/...`), alors que FR-10 exige des adresses par Langue et `hreflang`. *Fix:* écrire le schéma d'adresse EN.

## Scope honesty — adequate

La section Hors objectifs (§6) et les « Hors périmètre » inline (FR-3, FR-6, FR-13, FR-20) font un vrai travail : `prefers-reduced-motion`, workflow multi-relecteurs, remplacement de la fenêtre par une page entière. Les hypothèses sont marquées, avec une densité d'items ouverts (5 questions, 6 `[ASSUMPTION]`, 3 `[NOTE FOR PM]`) raisonnable pour un projet d'apprentissage. Le point faible : le périmètre v1 (§7.1) ne reprend pas tous les FR, et une zone de risque (l'envoi du formulaire) n'est pas nommée.

### Findings
- **medium** §7.1 omet des FR et §5.3–5.5 n'ont pas d'identifiants (§7.1, §5.3–5.5) — la liste « Dans la v1 » ne cite ni FR-5 (navigation), ni FR-7 (404 et redirections), ni FR-11 (cartes et Fenêtres de projet, pourtant le cœur du Site). Les exigences de performance, d'environnements, de CI, de mesure d'audience (§5.3–5.5) n'ont pas d'ID, donc aucune story ni SM ne peut les référencer. *Fix:* compléter §7.1 et numéroter ces exigences (FR-24 à FR-26 ou NFR-1 à NFR-3).
- **medium** Destination du Formulaire de contact non dite (FR-15, FR-21, §9 Q2) — l'audit montre que le formulaire passe aujourd'hui par Formspree. Le PRD ne dit pas si le service est conservé, alors que cela conditionne l'anti-spam (Q2), « aucun secret dans le dépôt » (FR-21) et la protection de l'e-mail (FR-16). *Fix:* ajouter dans FR-15 « le mécanisme d'envoi est choisi en architecture » ou, mieux, l'ajouter aux Questions ouvertes avec Q2.
- **low** Navigateurs et appareils supportés non dits (§6) — aucune ligne sur les navigateurs cibles, ni sur le comportement sans JavaScript pour les interactions (compétences déplaçables, carte à gratter). FR-4 couvre le contenu, pas l'interaction. *Fix:* une ligne de non-objectif (« pas de fonctionnalité interactive sans JavaScript »).

## Downstream usability — adequate

Le glossaire existe et couvre l'essentiel, les identifiants FR-1 à FR-23 sont contigus et uniques, les renvois internes (FR-8 vers FR-23, FR-15 vers FR-21, FR-13 vers FR-23) se résolvent. Le point faible tient à quelques mots qui dérivent et à la traçabilité entre parcours et exigences. Le PRD alimente une chaîne UX puis architecture puis stories : la dérive de « Accueil » compte plus qu'ailleurs.

### Findings
- **medium** « Accueil » désigne deux choses (§3, FR-4, FR-7, FR-10, SM-1) — le glossaire définit Section comme « Accueil (hero), Projets, … », mais FR-4, FR-7, FR-10 et SM-1 emploient « l'accueil » ou « la page d'accueil » pour la page entière. *Fix:* renommer la section Hero (« Accueil (hero) » devient « Hero ») et réserver « Accueil » à la page, ou ajouter « Page d'accueil » au glossaire.
- **medium** UJ-4 non portée par les FR (§2.3, FR-9, FR-10) — UJ-4 : « Elle change de thème et de langue sans souris et comprend où elle se trouve à chaque étape ». FR-9 et FR-10 n'ont aucune conséquence clavier ni annonce du changement de Thème ou de Langue aux lecteurs d'écran. *Fix:* ajouter une conséquence testable à FR-9 et FR-10 (sélecteur atteignable au clavier, état annoncé).
- **low** Protagoniste de UJ-2 sans nom (§2.3) — « Un responsable d'école » n'a pas de nom ni de contexte, contrairement à Sophie et Inès. Les UJ-2 à UJ-4 n'ont pas non plus la structure (Entrée, Apogée, Cas limite) de UJ-1. Acceptable pour ce projet, mais UJ-2 est le seul réellement flottant.

## Shape fit — strong

Le format est approprié : projet perso, reconstruction à l'identique, donc une grille FR par fonctionnalité, des UJ en nombre limité, et un focus RGAA et sécurité. Les références au code existant sont précises (`votre-pseudo/votre-repo`, `react-ga4` inutilisé, 148 Ko, CV déposé à la main) et alignées avec l'audit de l'addendum. La seule sur-formalisation est le couple cible/plancher des SM pour un projet solo, mais il sert vraiment (il rend « le meilleur possible » vérifiable). Aucun finding.

## Mechanical notes

- **Index des hypothèses (§10), aller-retour incomplet.** SM-6 porte une `[ASSUMPTION]` inline (§8) mais n'est pas dans l'index. À l'inverse, l'index liste « FR-13 : le contrôle de pause » alors que FR-13 ne porte qu'un `[NOTE FOR PM]`, pas de balise `[ASSUMPTION]`. UJ-1 est indexé deux fois d'une façon différente (index et balise de titre), sans conflit.
- **Dérive de glossaire.**
  - « Parcours » désigne à la fois la Section (« parcours » de carrière, FR-1) et les « Parcours clés » (§2.3), ce qui a un risque de confusion pour un lecteur qui extrait par terme.
  - « fenêtre » seul, « Fenêtre de projet » et « modale » (brief) alternent.
  - « carte » (carte de Projet), « gabarit » et « tokens » sont utilisés comme termes de domaine sans entrée de glossaire.
  - « site » en minuscule apparaît dans §0 et §1 (« le site devient statique ») alors que le glossaire impose « Site ».
- **Continuité des ID.** FR-1 à FR-23 et SM-1 à SM-6, SM-C1, SM-C2 : aucun trou ni doublon. UJ-1 à UJ-4 : contigus. Les renvois internes se résolvent.
- **Écarts avec le brief.** Cohérents sur les points décidés (FR et EN, trois Thèmes, modale avec URL, employeur absent). Seuils plus ambitieux dans le PRD (Lighthouse cible 100 et A+, contre ≥ 95 et A dans le brief), avec plancher identique : cohérent, à condition de lire « cible » et « plancher » comme distincts.
- **Sections requises.** Présentes pour ce type de projet : vision, utilisateurs, glossaire, FR, exigences transversales, hors objectifs, périmètre, indicateurs, questions ouvertes, index.
