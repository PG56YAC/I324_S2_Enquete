# Qui a cassé la prod ?

Vendredi matin, 10 h 30. Le support reçoit les premiers messages : « Quand j'ajoute une tâche, elle est déjà cochée. » Puis un deuxième, puis dix.

Hier encore, tout fonctionnait. La version `v1.0.0` tournait sans problème depuis une semaine. Entre-temps, cinq développeurs ont poussé du code sur `main`, et ce matin quelqu'un a poussé plusieurs commits d'un coup juste avant de partir en réunion.

Vous êtes de permanence. Votre mission : retrouver le commit qui a tout cassé, réparer la prod sans réécrire l'historique, et rédiger le rapport.

Vous avancez seul, à votre rythme. Après chaque push, le **bot** vous répond par e-mail : il explique ce que vous venez de trouver et vous donne la piste suivante.

Dans tout le parcours, `<pseudo>` est votre nom d'utilisateur GitHub **en minuscules**.

## Avant de commencer

Si votre PC n'est pas encore prêt (Git, Node.js, identité Git, notifications), suivez d'abord [INSTALLATION.md](INSTALLATION.md).

## Mission 1 : constater la panne

1. **Cloner** le dépôt dans VS Code (`Ctrl+Shift+P` › **Git: Clone**), avec l'adresse donnée par l'enseignant, puis ouvrir le dossier.
2. **Installer** les dépendances et **lancer les tests**, dans le terminal :
   ```
   npm install
   npm test
   ```
   Un test échoue. Repérez son nom.
3. **Créer votre branche** `enquete/<pseudo>` à partir de `origin/main` : en bas à gauche, cliquez sur le nom de la branche › **Create new branch from...** › `origin/main`.
4. **Créer votre rapport** `enquete/<pseudo>.txt`, avec une seule ligne pour l'instant :
   ```
   test: le nom du test qui échoue
   ```
5. **Commit** avec le message `docs: ouvre mon rapport d'enquête`, puis **pousser** : bouton **Publish Branch**.

Le bot vous répond quelques secondes plus tard, par e-mail.

## Règles du jeu

- Vous travaillez uniquement sur `enquete/<pseudo>`. Ne touchez pas à `main`.
- Votre rapport ne contient que ce qui est demandé : une information par ligne, au format `clé: valeur`.
- Chaque étape se termine par un commit et un push : sans push, le bot ne voit rien.
- Pas de réponse du bot après une minute ? Regardez l'onglet **Actions** du dépôt, puis demandez à l'enseignant.
