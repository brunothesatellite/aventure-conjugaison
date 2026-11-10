/* ============================================================
   lint-content.js — vérification du contenu, sans navigateur.

   Usage :  node tools/lint-content.js

   Le script charge les fichiers de contenu et de moteur dans un
   contexte isolé (module vm), puis vérifie :
     - la structure de chaque verbe (4 temps × 8 personnes) ;
     - la cohérence des phrases (temps, personne, {trou}, pronom) ;
     - la couverture des niveaux (assez de phrases par verbe) ;
     - les distracteurs (pas de doublon, une seule bonne réponse) ;
     - le découpage radical / terminaison de l'exercice d'assemblage.
   Code de sortie 1 en cas d'erreur : utilisable dans un hook Git.
   ============================================================ */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var RACINE = path.resolve(__dirname, "..");

/* Ordre de chargement identique à celui de index.html (partie moteur). */
var FICHIERS = [
  "content/registry.js"
].concat(
  fichiers("content/verbs"),
  fichiers("content/phrases"),
  fichiers("content/adventures"),
  [
    "content/curriculum.js",
    "engine/storage.js",
    "engine/state.js",
    "engine/srs.js",
    "engine/morphologie.js",
    "engine/feedback.js",
    "engine/distractors.js",
    "engine/exercises.js"
  ]
);

function fichiers(dossier) {
  var abs = path.join(RACINE, dossier);
  return fs.readdirSync(abs)
    .filter(function (f) { return /\.js$/.test(f); })
    .sort()
    .map(function (f) { return dossier + "/" + f; });
}

/* ---------- Chargement ---------- */

var sandbox = {
  window: {},
  console: console,
  setTimeout: function () {},
  clearTimeout: function () {},
  Date: Date
};
sandbox.window.setTimeout = sandbox.setTimeout;
sandbox.window.clearTimeout = sandbox.clearTimeout;
vm.createContext(sandbox);

var erreursChargement = [];
FICHIERS.forEach(function (rel) {
  var abs = path.join(RACINE, rel);
  var code = fs.readFileSync(abs, "utf8");
  try {
    vm.runInContext(code, sandbox, { filename: rel });
  } catch (e) {
    erreursChargement.push(rel + " : " + (e && e.stack ? e.stack.split("\n")[0] : e));
  }
});

if (erreursChargement.length) {
  console.error("Fichiers en erreur :");
  erreursChargement.forEach(function (e) { console.error("  ✗ " + e); });
  process.exit(1);
}

var Q = sandbox.window.Quete;
if (!Q) {
  console.error("✗ Le registre (window.Quete) est introuvable.");
  process.exit(1);
}

/* ---------- Vérifications ---------- */

var erreurs = [];
var avertissements = [];

function erreur(msg) { erreurs.push(msg); }
function attention(msg) { avertissements.push(msg); }

/* 1. Structure des verbes */
erreurs = erreurs.concat(Q.validerContenu());

var TEMPS = ["present", "imparfait", "futur", "passe_compose"];
var PERSONNES = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];

Object.keys(Q.content.verbs).forEach(function (id) {
  var v = Q.content.verbs[id];
  if (!v.infinitif) erreur("Verbe " + id + " : infinitif manquant");
  if (!v.note) attention("Verbe " + id + " : pas de note pédagogique");
  if (!v.pieges || !v.pieges.length) attention("Verbe " + id + " : aucun piège documenté");

  TEMPS.forEach(function (t) {
    if (!v.formes[t]) return;
    var formes = v.formes[t];
    /* Les variantes il/elle et ils/elles doivent être identiques au présent. */
    if (formes.il !== formes.elle) erreur("Verbe " + id + " : " + t + " il ≠ elle");
    if (formes.ils !== formes.elles && t !== "passe_compose") {
      attention("Verbe " + id + " : " + t + " ils ≠ elles");
    }
    /* Cohérence de l'auxiliaire au passé composé. */
    if (t === "passe_compose") {
      var aux = { avoir: /^(ai|as|a|avons|avez|ont)\b/, etre: /^(suis|es|est|sommes|êtes|sont)\b/ }[v.auxiliaire];
      if (aux) {
        PERSONNES.forEach(function (p) {
          if (!aux.test(formes[p])) {
            erreur("Verbe " + id + " : passé composé de " + p + " (« " + formes[p] + " ») incohérent avec l'auxiliaire " + v.auxiliaire);
          }
        });
      } else {
        erreur("Verbe " + id + " : auxiliaire inconnu « " + v.auxiliaire + " »");
      }
    }
  });
});

/* 2. Phrases : forme attendue et pronom */
var toutes = Q.toutesLesPhrases();
var parVerbeTemps = {};
toutes.forEach(function (p) {
  var v = Q.verbe(p.verbe);
  if (v && v.formes[p.temps] && !p.reponse) {
    var attendue = v.formes[p.temps][p.personne];
    if (!attendue) {
      erreur("Phrase " + p.id + " : personne inconnue « " + p.personne + " »");
    }
  }
  if (p.reponse && v && v.formes[p.temps]) {
    var base = v.formes[p.temps][p.personne];
    if (base && base !== p.reponse && (p.tags || []).indexOf("accord") === -1) {
      attention("Phrase " + p.id + " : réponse explicite « " + p.reponse + " » différente de la table (« " + base + " »)");
    }
  }
  if (p.difficulte != null && (p.difficulte < 1 || p.difficulte > 3)) {
    erreur("Phrase " + p.id + " : difficulté hors bornes (" + p.difficulte + ")");
  }
  if (/\{trou\}[^]*\{trou\}/.test(p.texte)) {
    erreur("Phrase " + p.id + " : plusieurs {trou}");
  }
  var cle = p.verbe + "|" + p.temps;
  parVerbeTemps[cle] = (parVerbeTemps[cle] || 0) + 1;
});

/* 3. Aventures : couverture et gardien */
Object.keys(Q.content.adventures).forEach(function (id) {
  var a = Q.content.adventures[id];
  if (!a.gardien) erreur("Aventure " + id + " : gardien manquant");
  if (!a.fond) erreur("Aventure " + id + " : fond manquant");
  var total = 0;
  a.niveaux.forEach(function (n) {
    total += n.verbes.length;
  });
  /* Chaque île doit proposer au moins 15 phrases pour 7 questions. */
  var dispo = (Q.content.phrases[a.temps] || []).length;
  if (dispo < 15) erreur("Aventure " + id + " : seulement " + dispo + " phrases (minimum 15)");
  if (a.niveaux.length !== 4) attention("Aventure " + id + " : " + a.niveaux.length + " niveaux (4 attendus)");
});

/* 4. Distracteurs et exercices, sur les deux branches (QCM et assemblage).
      Math.random est figé pour rendre le test reproductible. */
function figerAleatoire(valeur) {
  vm.runInContext("Math.random = function () { return " + valeur + "; };", sandbox);
}

function verifierExercices(valeur, etiquette) {
  figerAleatoire(valeur);
  toutes.forEach(function (p) {
    var res = Q.distracteurs.verifier(p);
    if (res.doublons > 0) {
      erreur("Phrase " + p.id + " : " + res.doublons + " doublon(s) dans les options (" + res.options.join(" | ") + ")");
    }
    if (res.options.length < 3) {
      erreur("Phrase " + p.id + " : seulement " + res.options.length + " options");
    }

    var exercice = Q.exercices.construire(p, "lint");
    if (exercice.type === "qcm") {
      var bonnes = exercice.options.filter(function (o) {
        return String(o).toLowerCase() === String(exercice.reponse).toLowerCase();
      });
      if (bonnes.length !== 1) {
        erreur("Phrase " + p.id + " [" + etiquette + "] : " + bonnes.length + " bonne(s) réponse(s) dans les options");
      }
      if (exercice.options.length < 3) {
        erreur("Phrase " + p.id + " : QCM avec " + exercice.options.length + " options");
      }
      return;
    }

    /* Assemblage : radical + terminaison doit reformer la réponse,
       et une seule terminaison doit être correcte. */
    if (exercice.radical + exercice.terminaison !== exercice.reponse) {
      erreur("Phrase " + p.id + " : assemblage " + exercice.radical + " + " + exercice.terminaison + " ≠ " + exercice.reponse);
    }
    if (exercice.options.indexOf(exercice.terminaison) === -1) {
      erreur("Phrase " + p.id + " : la bonne terminaison n'est pas proposée");
    }
    var bonnesTerm = exercice.options.filter(function (o) { return o === exercice.terminaison; });
    if (bonnesTerm.length !== 1) {
      erreur("Phrase " + p.id + " : " + bonnesTerm.length + " bonne(s) terminaison(s) proposée(s)");
    }
  });
}

verifierExercices(0, "assemblage forcé");
verifierExercices(0.99, "QCM forcé");

/* 5. Couverture minimale : chaque île doit pouvoir remplir une quête. */
Object.keys(Q.content.adventures).forEach(function (id) {
  var a = Q.content.adventures[id];
  a.niveaux.forEach(function (n) {
    var pool = Q.phrasesDuNiveau(id, n.id);
    if (pool.length < 4) {
      erreur("Niveau " + n.id + " : " + pool.length + " phrase(s), trop peu pour une quête");
    }
  });
});

/* ---------- Rapport ---------- */

var nbVerbes = Object.keys(Q.content.verbs).length;
var nbNiveaux = Object.keys(Q.content.adventures).reduce(function (t, id) {
  return t + Q.content.adventures[id].niveaux.length;
}, 0);

console.log("Contenu : " + nbVerbes + " verbes, " + toutes.length + " phrases, " +
  Object.keys(Q.content.adventures).length + " aventures, " + nbNiveaux + " niveaux.");

if (avertissements.length) {
  console.log("\nAvertissements (" + avertissements.length + ") :");
  avertissements.forEach(function (a) { console.log("  · " + a); });
}

if (erreurs.length) {
  console.error("\nErreurs (" + erreurs.length + ") :");
  erreurs.forEach(function (e) { console.error("  ✗ " + e); });
  process.exit(1);
}

console.log("\n✓ Contenu valide.");
