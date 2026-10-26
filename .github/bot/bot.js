// Bot « Qui a cassé la prod ? » (I324) : répond à l'élève qui pousse sur enquete/<pseudo>.
// Chaque réponse explique ce qui vient d'être fait, puis donne la mission suivante.
// Node.js + git uniquement. Les réponses attendues sont stockées sous forme d'empreintes (SHA-256).
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const RACINE = process.cwd(); // checkout de main, avec node_modules
const git = (...a) => { try { return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const existe = (ref) => !!ref && git('rev-parse', '--verify', '--quiet', ref + '^{commit}') !== null;
const ancetre = (a, b) => { try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true; } catch { return false; } };

const normaliser = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[`'"«»]/g, '').replace(/\s+/g, ' ').trim();
const empreinte = (t) => crypto.createHash('sha256').update(normaliser(t)).digest('hex');
const H = {
    test: 'f211023f527b934abceb7f1a63c1e921b87f476308f24dbe6a345352ad769c56',
    commits: '4523540f1504cd17100c4835e85b7eefd49911580f8efff0599a8f283be6b9e3',
    coupable: '2478884c0ad732b5fa94ac9d2f3c7835f545273356816bf6ed37ee15e21f4b59',
    'auteur-origine': '85ea612b1aeeb9964daf7b0a3c9af184bc9efd9598a08956ded94291b798d897',
    date: '7c4060bc63013af77e926b9724be6b65abd9c3d3d9b8f627fe93ecabbc6d81d7',
    sujetCoupable: '3d021bc6e54e11188b307ad4ff22f7b690d604d5c99f8511c1ebea74fc7c617d',
    sujetSuspect: '3447a6ce2ac6cbe6520fdd6fc7d992aed04fd21c1b85e5720586d91e73b88399',
};
// Une réponse est juste si elle, ou l'un de ses morceaux (copié depuis la sortie de Jest), correspond
const juste = (cle, v) => (v ? [v, ...String(v).split(/[›>●✕✓|]/)].find((x) => empreinte(x) === H[cle]) || null : null);
const ok = (secret) => ({ ok: true, secret });

// Les explications données après chaque mission sont chiffrées : seule la bonne réponse permet de les lire
const BILANS = [
    "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"
];
function dechiffrer(i, secret) {
    const b = Buffer.from(BILANS[i], 'base64');
    const cle = crypto.createHash('sha256').update('I324:' + normaliser(secret)).digest();
    const d = crypto.createDecipheriv('aes-256-gcm', cle, b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8'));
}

// Retrouve un commit de main par l'empreinte de son sujet
function commitPar(h) {
    for (const l of (git('log', 'origin/main', '--format=%H %s') || '').split('\n')) {
        const i = l.indexOf(' ');
        if (empreinte(l.slice(i + 1)) === h) return { hash: l.slice(0, i), sujet: l.slice(i + 1) };
    }
    return { hash: null, sujet: null };
}

function tester(ref) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tests-'));
    execFileSync('tar', ['-x', '-C', tmp], { input: execFileSync('git', ['archive', ref, 'src', 'spec'], { maxBuffer: 50e6 }) });
    for (const f of ['package.json', 'jest.setup.js']) fs.copyFileSync(path.join(RACINE, f), path.join(tmp, f));
    fs.symlinkSync(path.join(RACINE, 'node_modules'), path.join(tmp, 'node_modules'), 'dir');
    try {
        execFileSync(path.join(RACINE, 'node_modules', '.bin', 'jest'), ['--ci'], { cwd: tmp, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return true;
    } catch {
        return false;
    }
}

function reponses(ref, pseudo) {
    const t = git('show', `${ref}:enquete/${pseudo}.txt`);
    if (t === null) return null;
    const r = {};
    for (const l of t.split(/\r?\n/)) {
        const m = /^\s*([a-z-]+)\s*:\s*(.*)$/i.exec(l);
        if (m) r[m[1].toLowerCase()] = m[2].trim();
    }
    return r;
}

// ---------------------------------------------------------------------------------------------
// Les missions : consigne (au début), verifier (à chaque push), bilan (quand c'est réussi)
// ---------------------------------------------------------------------------------------------
const MISSIONS = [
    {
        titre: 'Constater la panne',
        consigne: () => ['Suivez la mission 1 du README.'],
        verifier: (c) => {
            if (!c.depuisMain) return { ok: false, aide: 'Votre branche ne part pas de `main` : supprimez-la et recréez-la depuis `origin/main`.' };
            if (c.r === null) return { ok: false, aide: `Le fichier \`enquete/${c.pseudo}.txt\` est introuvable sur votre branche (dossier \`enquete\`, pseudo en minuscules).` };
            if (!c.r.test) return { ok: false, aide: 'La ligne `test:` est vide.' };
            return juste('test', c.r.test) ? ok(juste('test', c.r.test)) : { ok: false, aide: 'Ce n\'est pas le nom du test qui échoue. Dans la sortie de `npm test`, cherchez la ligne marquée d\'une croix ou d\'un ●, et copiez le texte qui suit.' };
        },
        bilan: 0,
    },
    {
        titre: 'Lire l\'historique',
        consigne: () => [
            'La version `v1.0.0` fonctionnait. C\'est un **tag** : une étiquette posée sur un commit précis, comme vous l\'avez fait la semaine passée.',
            '',
            'Pour lire l\'historique :',
            '```',
            'git log --oneline',
            '```',
            'Une ligne par commit : le début du hash, puis le message. Le plus récent est en haut. On peut aussi demander uniquement une partie de l\'histoire :',
            '```',
            'git log --oneline v1.0.0..main',
            '```',
            '`A..B` veut dire « ce qui est dans B mais pas encore dans A », ici tout ce qui a été ajouté sur `main` depuis la version qui marchait.',
            '',
            'Ajoutez la ligne `commits:` dans votre fichier, avec le nombre de commits faits sur `main` depuis `v1.0.0`. Commit et push.',
            '',
            'Dans VS Code, la vue **Source Control › Graph** montre le même historique ; dans WebStorm, c\'est l\'onglet **Git › Log**. Mais la commande est plus rapide pour compter.',
        ],
        verifier: (c) => juste('commits', c.r.commits) ? ok(juste('commits', c.r.commits))
            : { ok: false, aide: c.r.commits ? 'Ce n\'est pas le bon nombre. Vérifiez que vous comptez sur `main` et pas sur votre branche (vos propres commits ne comptent pas).' : 'La ligne `commits:` est vide.' },
        bilan: 1,
    },
    {
        titre: 'Trouver le coupable et l\'annuler',
        consigne: () => [
            'Trois outils pour trouver le commit coupable. Choisissez celui qui vous parle.',
            '',
            '**1. Regarder ce qu\'un commit a changé**',
            '```',
            'git show <hash>',
            '```',
            'Affiche l\'auteur, la date, le message et le **diff** : les lignes retirées en `-`, les lignes ajoutées en `+`.',
            '',
            '**2. Chercher quand un mot est apparu ou a disparu**',
            '```',
            'git log -S "completed" --oneline',
            '```',
            'Liste uniquement les commits qui ont ajouté ou retiré le texte `completed`.',
            '',
            '**3. Laisser Git chercher à votre place**',
            '```',
            'git bisect start',
            'git bisect bad',
            'git bisect good v1.0.0',
            '```',
            'Git se place au milieu de l\'historique. Lancez `npm test`, puis dites-lui le résultat : `git bisect good` si c\'est vert, `git bisect bad` si c\'est rouge. Il coupe en deux à chaque fois, et après quelques essais il affiche le premier commit coupable. Plus rapide encore : `git bisect run npm test` fait tous les essais tout seul. Terminez toujours par `git bisect reset` pour revenir sur votre branche.',
            '',
            'Une fois le coupable trouvé, annulez-le **sans réécrire l\'historique** :',
            '```',
            'git revert <hash>',
            '```',
            'Git crée un nouveau commit qui fait exactement l\'inverse. Vérifiez avec `npm test` que tout est vert, puis poussez.',
            '',
            'Méfiez-vous des apparences : un message de commit inquiétant ne veut pas dire que le commit est coupable.',
        ],
        verifier: (c) => {
            if (c.annuleSuspect && !c.annuleCoupable) return { ok: false, aide: 'Vous avez annulé un innocent. Son message a l\'air suspect, mais regardez son diff : il ne fait que renommer une variable. Annulez votre revert (`git revert <hash-de-votre-revert>`) et cherchez encore.' };
            if (!c.annuleCoupable) return { ok: false, aide: 'Je ne trouve aucun `git revert` du bon commit sur votre branche. Essayez `git log -S "completed" --oneline` et regardez chaque commit avec `git show`.' };
            if (!c.tests()) return { ok: false, aide: 'Le bon commit est annulé, mais les tests échouent encore sur votre branche. Lancez `npm test` pour voir lequel.' };
            return ok(c.sujetCoupable);
        },
        bilan: 2,
    },
    {
        titre: 'Qui a poussé le coupable ?',
        consigne: () => [
            'Ajoutez la ligne `coupable: Prénom Nom` dans votre fichier : l\'auteur du commit que vous venez d\'annuler. `git show <hash>` l\'affiche sur la ligne `Author`.',
        ],
        verifier: (c) => juste('coupable', c.r.coupable) ? ok(juste('coupable', c.r.coupable))
            : { ok: false, aide: c.r.coupable ? 'Ce n\'est pas l\'auteur du commit coupable. Relancez `git show <hash>` et lisez la ligne `Author`.' : 'La ligne `coupable:` est vide.' },
        bilan: 3,
    },
    {
        titre: 'Qui avait écrit la bonne version ?',
        consigne: () => [
            'Avant le coupable, la ligne était correcte : `completed: false,`. Qui l\'avait écrite ? C\'est la personne à consulter avant de toucher à ce code.',
            '',
            '`git blame` affiche, pour chaque ligne d\'un fichier, le dernier commit qui l\'a modifiée et son auteur. Il faut le lancer sur le fichier tel qu\'il était **juste avant** le coupable (le `^` après un hash veut dire « le commit d\'avant ») :',
            '```',
            'git blame <hash-du-coupable>^ -- src/routes/addItem.js',
            '```',
            'Ajoutez la ligne `auteur-origine: Prénom Nom`. Commit et push.',
            '',
            'Dans VS Code, l\'extension GitLens affiche le blame directement dans l\'éditeur ; dans WebStorm, clic droit dans la marge › **Annotate with Git Blame**.',
        ],
        verifier: (c) => juste('auteur-origine', c.r['auteur-origine']) ? ok(juste('auteur-origine', c.r['auteur-origine']))
            : { ok: false, aide: c.r['auteur-origine'] ? 'Ce n\'est pas la bonne personne. N\'oubliez pas le `^` après le hash : sans lui, `git blame` montre le fichier après le coupable.' : 'La ligne `auteur-origine:` est vide.' },
        bilan: 4,
    },
    {
        titre: 'La date du crime (bonus)',
        consigne: () => [
            'Pour le rapport : ajoutez la ligne `date: AAAA-MM-JJ`, le jour où le commit coupable a été créé. Commit et push.',
        ],
        verifier: (c) => juste('date', c.r.date) ? ok(juste('date', c.r.date))
            : { ok: false, aide: c.r.date ? 'Ce n\'est pas la bonne date, ou pas le bon format (AAAA-MM-JJ, par exemple 2026-01-31).' : 'La ligne `date:` est vide.' },
        bilan: 5,
    },
];

function evaluer(ref, pseudo, racine, coupable, suspect) {
    const depuisMain = !!racine && ancetre(racine, ref);
    const corps = git('log', '--format=%B', `origin/main..${ref}`) || '';
    let t = null;
    const c = {
        pseudo, depuisMain,
        r: reponses(ref, pseudo),
        sujetCoupable: coupable.sujet,
        annuleCoupable: !!coupable.hash && corps.includes(`This reverts commit ${coupable.hash}`),
        annuleSuspect: !!suspect.hash && corps.includes(`This reverts commit ${suspect.hash}`),
        tests: () => (t === null ? (t = tester(ref)) : t),
    };
    let reussies = 0;
    let aide = '';
    const secrets = [];
    for (const m of MISSIONS) {
        const v = m.verifier(c);
        if (!v.ok) { aide = v.aide || ''; break; }
        secrets.push(v.secret);
        reussies++;
    }
    return { reussies, aide, c, secrets };
}

function main() {
    const acteur = process.env.ACTEUR;
    const pseudo = acteur.toLowerCase();
    const ref = (process.env.REF || '').replace('refs/heads/', '');
    const avant = process.env.AVANT || '';
    const res = { commentaire: '' };
    const nul = !avant || /^0+$/.test(avant);
    const fin = () => { fs.writeFileSync(process.env.SORTIE, JSON.stringify(res)); if (process.env.AFFICHER) console.log(res.commentaire); };

    const nouveaux = git('log', '--format=%H', nul ? `origin/main..origin/${ref}` : `${avant}..origin/${ref}`);
    if (!nouveaux) return fin();

    const L = [`@${acteur}`, ''];
    if (ref !== `enquete/${pseudo}`) {
        L.push(`La branche \`${ref}\` ne correspond à rien ici : je ne regarde que \`enquete/${pseudo}\` (pseudo en minuscules). Renommez-la ou recréez-la depuis \`origin/main\`.`);
        res.commentaire = L.join('\n');
        return fin();
    }

    const racine = (git('rev-list', '--max-parents=0', 'origin/main') || '').split('\n')[0];
    const coupable = commitPar(H.sujetCoupable);
    const suspect = commitPar(H.sujetSuspect);
    const apres = evaluer(`origin/${ref}`, pseudo, racine, coupable, suspect);
    const avantEtat = !nul && existe(avant) ? evaluer(avant, pseudo, racine, coupable, suspect).reussies : 0;
    const n = MISSIONS.length;

    L.push(`**Progression : ${apres.reussies} sur ${n}**`, '');
    if (apres.reussies > avantEtat) {
        for (let i = avantEtat; i < apres.reussies; i++) {
            L.push(`### Mission ${i + 1} réussie : ${MISSIONS[i].titre}`, '', ...dechiffrer(MISSIONS[i].bilan, apres.secrets[i]).flatMap((x) => [x, '']));
        }
        if (apres.reussies === n) {
            L.push('### Enquête résolue', '', 'Montrez ce message à votre enseignant.');
        } else {
            const m = MISSIONS[apres.reussies];
            L.push(`### Mission ${apres.reussies + 1} : ${m.titre}`, '', ...m.consigne(), '');
        }
    } else if (apres.reussies === n) {
        L.push('L\'enquête est déjà résolue. Rien de nouveau à vérifier.');
    } else {
        const m = MISSIONS[apres.reussies];
        L.push(`### Mission ${apres.reussies + 1} : pas encore`, '', `> ${apres.aide}`, '',
            '<details><summary>Rappel de la consigne</summary>', '', ...m.consigne(), '', '</details>', '');
    }
    if (apres.reussies < n) L.push('_Chaque étape se termine par un commit et un push : sans push, je ne vois rien._');
    res.commentaire = L.join('\n');
    fin();
}

main();
