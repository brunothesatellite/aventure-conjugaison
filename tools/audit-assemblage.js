/* ============================================================
   audit-assemblage.js — relit toutes les questions d'assemblage.

   Usage :
     node tools/audit-assemblage.js
     node tools/audit-assemblage.js --temps=present
     node tools/audit-assemblage.js --verbe=choisir
     node tools/audit-assemblage.js --qcm

   Pour chaque question : radical, bonne terminaison, autres
   terminaisons (avec le mot complet), et si ce mot est une forme
   réelle du verbe ou une faute contrôlée.
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
    ["content/curriculum.js", "engine/morphologie.js"]
  );

var sandbox = { window: {}, console: console, Date: Date };
vm.createContext(sandbox);
FICHIERS.forEach(function (rel) {
  vm.runInContext(fs.readFileSync(path.join(RACINE, rel), "utf8"), sandbox, { filename: rel });
});

var Q = sandbox.window.Quete;
/* Dans le navigateur, ces fonctions dépendent de la progression. */
Q.jeu = {
  ileDebloquee: function () { return true; },
  ileCommencee: function () { return true; }
};
vm.runInContext("Math.random = function () { return 0.5; };", sandbox);

var args = process.argv.slice(2);
function option(nom) {
  var a = args.filter(function (x) { return x.indexOf("--" + nom + "=") === 0; })[0];
  return a ? a.split("=").slice(1).join("=") : "";
}
var filtreTemps = option("temps");
var filtreVerbe = option("verbe");
var seulementQcm = args.indexOf("--qcm") !== -1;

var phrases = Q.toutesLesPhrases().filter(function (p) {
  return (!filtreTemps || p.temps === filtreTemps) && (!filtreVerbe || p.verbe === filtreVerbe);
});

var STATS = { asm: 0, qcm: 0, raisons: {}, parTemps: {}, parGroupe: {} };
var lignesQcm = [];

function formesDe(verbe) {
  var set = {};
  Object.keys(verbe.formes).forEach(function (t) {
    Object.keys(verbe.formes[t] || {}).forEach(function (p) {
      if (verbe.formes[t][p]) set[verbe.formes[t][p].toLowerCase()] = true;
    });
  });
  return set;
}

phrases.forEach(function (p) {
  var v = Q.verbe(p.verbe);
  if (!v) return;
  var d = Q.morphologie.decoupageFiable(p, v);
  var asm = Q.morphologie.assemblagePossible(p, v);
  var options = asm ? Q.morphologie.optionsAssemblage(p, v, asm) : [];
  var type = (asm && options.length >= 3) ? "ASM" : "QCM";

  var cleTemps = p.temps;
  var cleGroupe = "groupe " + v.groupe;
  STATS.parTemps[cleTemps] = STATS.parTemps[cleTemps] || { asm: 0, qcm: 0 };
  STATS.parGroupe[cleGroupe] = STATS.parGroupe[cleGroupe] || { asm: 0, qcm: 0 };

  if (type === "QCM") {
    var raison;
    if (p.temps === "passe_compose") raison = "passé composé";
    else if (!d) raison = "découpage non certifié";
    else raison = "moins de 2 distracteurs";
    STATS.qcm++;
    STATS.raisons[raison] = (STATS.raisons[raison] || 0) + 1;
    STATS.parTemps[cleTemps].qcm++;
    STATS.parGroupe[cleGroupe].qcm++;
    lignesQcm.push({ id: p.id, verbe: p.verbe, temps: p.temps, personne: p.personne, forme: Q.formeAttendue(p), raison: raison });
    if (!seulementQcm) {
      console.log(
        "QCM  " + (p.verbe + " " + p.temps + " " + p.personne).padEnd(38) +
        (Q.formeAttendue(p) || "?").padEnd(18) + "  " + raison
      );
    }
    return;
  }

  STATS.asm++;
  STATS.parTemps[cleTemps].asm++;
  STATS.parGroupe[cleGroupe].asm++;
  if (seulementQcm) return;

  var connues = formesDe(v);
  var fautes = Q.morphologie.fautesTerminaison(asm.terminaison, v);
  var details = options.map(function (o) {
    var mot = asm.radical + o;
    var nature = connues[mot.toLowerCase()] ? "forme"
      : (fautes.indexOf(o) !== -1 ? "faute" : "INVALIDE");
    return (o === asm.terminaison ? "→ " : "  ") + o + " (" + mot + ", " + nature + ")";
  });
  console.log(
    "ASM  " + (p.verbe + " " + p.temps + " " + p.personne).padEnd(38) +
    (asm.radical + "-").padEnd(12) + details.join("  ")
  );
});

console.log("\nRésumé");
Object.keys(STATS.parTemps).sort().forEach(function (t) {
  var x = STATS.parTemps[t];
  console.log("  " + t.padEnd(16) + " : " + x.asm + " assemblages, " + x.qcm + " QCM");
});
Object.keys(STATS.parGroupe).sort().forEach(function (g) {
  var x = STATS.parGroupe[g];
  console.log("  " + g.padEnd(16) + " : " + x.asm + " assemblages, " + x.qcm + " QCM");
});

if (seulementQcm) {
  console.log("\nFormes en QCM (" + lignesQcm.length + ") :");
  lignesQcm.forEach(function (l) {
    console.log("  " + l.id.padEnd(38) + l.forme.padEnd(18) + l.raison);
  });
} else {
  console.log("\nRaisons du QCM :");
  Object.keys(STATS.raisons).sort().forEach(function (r) {
    console.log("  " + r + " : " + STATS.raisons[r]);
  });
}
