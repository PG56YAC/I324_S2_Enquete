# Installation du poste

À faire une seule fois, sur un PC Windows 11. Si un outil est déjà installé, passez à la suite.

## 1. Les outils

Téléchargez et installez la dernière version, en gardant les options proposées par défaut.

| Outil | Lien |
|---|---|
| Git | https://git-scm.com/downloads/win |
| Node.js, version **LTS** (npm est inclus) | https://nodejs.org/fr/download |
| VS Code | https://code.visualstudio.com/download |

Vous utilisez WebStorm ou un autre IDE JetBrains ? Gardez-le : Git et le terminal y sont intégrés, toutes les étapes restent valables.

Fermez puis rouvrez VS Code, ouvrez un terminal (**Terminal › New Terminal**) et vérifiez :

```
git --version
node --version
npm --version
```

Chaque commande doit afficher un numéro de version.

## 2. Votre identité Git

Le dépôt est public : on n'y met ni votre nom complet ni votre adresse e-mail personnelle.

1. Sur https://github.com/settings/emails, cochez **Keep my email addresses private** et copiez l'adresse qui se termine par `@users.noreply.github.com`.
2. Dans le terminal :

```
git config --global user.name "votre-pseudo-github"
git config --global user.email "l-adresse-copiee@users.noreply.github.com"
```

## 3. Les notifications

Le bot vous répond par e-mail. Pour recevoir ses messages :

1. Acceptez l'invitation au dépôt (e-mail de GitHub ou https://github.com/notifications).
2. Sur https://github.com/settings/notifications, vérifiez que **Email** est coché pour **Participating, @mentions and custom**.
3. Sur la page du dépôt, bouton **Watch** › **Participating and @mentions**.

## En cas de problème

| Symptôme | Solution |
|---|---|
| `npm : impossible de charger le fichier ... npm.ps1` | Windows bloque les scripts PowerShell. Lancez une fois `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, ou choisissez **Command Prompt** ou **Git Bash** comme terminal (flèche à côté du `+` du terminal). |
| `git`, `node` ou `npm` n'est pas reconnu | Fermez complètement VS Code et rouvrez-le, sinon redémarrez le PC. |
| VS Code pousse avec un autre compte GitHub | **Gestionnaire d'identification Windows** › **Informations d'identification Windows** › supprimez les entrées `git:https://github.com`, puis poussez à nouveau. |
| Le push est refusé (`403`) | L'invitation au dépôt n'est pas encore acceptée. |
