/* ============================================================
   morphologie.js — découpage radical / terminaison
   Sert au type d'exercice « assemblage » et aux distracteurs.
   ============================================================ */
(function (Q) {
  "use strict";

  var SAUF = ["etre", "avoir"]; /* trop irréguliers pour l'assemblage au présent */

  var terminaisons = {
    present: {
      je: ["e", "is", "s", "x", "ai"],
      tu: ["es", "is", "s", "x", "as"],
      il: ["e", "it", "t", "a", "d"],
      elle: ["e", "it", "t", "a", "d"],
      nous: ["ons", "issons", "mes", "vons"],
      vous: ["ez", "issez", "tes", "vez"],
      ils: ["ent", "issent", "ont", "ont"],
      elles: ["ent", "issent", "ont", "ont"]
    },
    imparfait: {
      je: ["ais"], tu: ["ais"], il: ["ait"], elle: ["ait"],
      nous: ["ions"], vous: ["iez"], ils: ["aient"], elles: ["aient"]
    },
    futur: {
      je: ["ai"], tu: ["as"], il: ["a"], elle: ["a"],
      nous: ["ons"], vous: ["ez"], ils: ["ont"], elles: ["ont"]
    }
  };

  function decouper(temps, personne, forme) {
    var liste = terminaisons[temps] && terminaisons[temps][personne];
    if (!liste || !forme) return null;
    var f = String(forme).toLowerCase();
    var meilleur = null;
    liste.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (fin) {
      if (f.slice(-fin.length) === fin) {
        var radical = f.slice(0, f.length - fin.length);
        if (radical.length >= 2 && (!meilleur || fin.length > meilleur.terminaison.length)) {
          meilleur = { radical: radical, terminaison: fin };
        }
      }
    });
    return meilleur;
  }

  function terminaisonsDuTemps(temps) {
    var t = terminaisons[temps];
    if (!t) return [];
    var vues = {};
    var out = [];
    Object.keys(t).forEach(function (p) {
      t[p].forEach(function (fin) {
        if (!vues[fin]) { vues[fin] = true; out.push(fin); }
      });
    });
    return out;
  }

  function assemblagePossible(phrase, verbe) {
    if (!phrase || !verbe) return null;
    if (phrase.temps === "passe_compose") return null; /* deux mots : on garde le QCM */
    if (phrase.temps === "present" && SAUF.indexOf(verbe.id) !== -1) return null;
    var forme = Q.formeAttendue(phrase);
    var d = decouper(phrase.temps, phrase.personne, forme);
    if (!d) return null;
    return { radical: d.radical, terminaison: d.terminaison, forme: forme };
  }

  Q.morphologie = {
    decouper: decouper,
    terminaisonsDuTemps: terminaisonsDuTemps,
    assemblagePossible: assemblagePossible
  };
})(window.Quete);
