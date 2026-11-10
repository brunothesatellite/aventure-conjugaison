/* ============================================================
   audit-distracteurs.js — relit les mauvais choix, phrase par phrase.

   Usage :
     node tools/audit-distracteurs.js            (toutes les îles)
     node tools/audit-distracteurs.js --debut    (seule l'île du Présent)
     node tools/audit-distracteurs.js --verbe=parler

   Affiche pour chaque question la bonne réponse, les deux mauvais
   choix proposés avec leur famille (A, B, C) et les réserves
   disponibles. Sert à relire les 170 questions d'un coup d'œil.
   ============================================================ */

"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var RACINE = path.resolve(__dirname, "..");

function fichiers(dossier) {
  var abs = path.join(RACINE, dossier);
  return fs.readdirSync(abs)
    .filter(function (f) { return /\.js$/.test(f); })
    .sort()
    .map(function (f) { return dossier + "/" + f; });
}

var FICHIERS = ["content/registry.js"]
  .concat(
    fichiers("content/verbs"),
    fichiers("content/phrases"),
    fichiers("content/adventures"),
    ["content/curriculum.js", "engine/morphologie.js", "engine/distractors.js"]
  );

var sandbox = { window: {}, console: console, Date: Date };
vm.createContext(sandbox);
FICHIERS.forEach(function (rel) {
  vm.runInContext(fs.readFileSync(path.join(RACINE, rel), "utf8"), sandbox, { filename: rel });
});

var Q = sandbox.window.Quete;

var args = process.argv.slice(2);
var debut = args.indexOf("--debut") !== -1;
var filtreVerbe = (args.filter(function (a) { return a.indexOf("--verbe=") === 0; })[0] || "").split("=")[1];

if (debut) {
  var premiere = Q.curriculum().ordre[0];
  Q.jeu = { ileDebloquee: function (id) { return id === premiere; } };
}

/* Tirage reproductible d'une exécution à l'autre. */
vm.runInContext("Math.random = function () { return 0.5; };", sandbox);

var phrases = Q.toutesLesPhrases().filter(function (p) {
  return !filtreVerbe || p.verbe === filtreVerbe;
});

var paires = {};
var sansB = 0;
var sansC = 0;

console.log(
  "Distracteurs — " + phrases.length + " questions, " +
  (debut ? "début de jeu (île du Présent seule)" : "toutes les îles débloquées") + "\n"
);

phrases.forEach(function (p) {
  var fam = Q.distracteurs.familles(p);
  var choix = Q.distracteurs.pourAvecFamilles(p, 2);
  var etiquettes = choix.map(function (c) { return c.famille; }).join("+");
  paires[etiquettes] = (paires[etiquettes] || 0) + 1;
  if (!fam.B.length) sansB++;
  if (!fam.C.length) sansC++;

  console.log(
    (p.verbe + " " + p.temps + " " + p.personne).padEnd(34) +
    (fam.reponse || "?").padEnd(18) +
    choix.map(function (c) { return c.valeur + " (" + c.famille + ")"; }).join("  ·  ").padEnd(40) +
    "  | A:" + (fam.A.length) + " B:" + (fam.B.length) + " C:" + (fam.C.length)
  );
});

console.log("\nRépartition : " + Object.keys(paires).sort().map(function (k) {
  return k + "=" + paires[k];
}).join("  ·  "));
console.log("Questions sans réserve B : " + sansB + " · sans réserve C : " + sansC);
