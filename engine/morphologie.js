/* ============================================================
   morphologie.js — découpage radical / terminaison
   Sert au type d'exercice « assemblage ».

   Lot 1 : seules les formes dont le découpage est CERTIFIÉ peuvent
   devenir des questions d'assemblage. Les autres basculent en QCM.
   Une terminaison proposée doit toujours partager le radical
   affiché : on ne pioche plus dans un pool global.

   Lot 2 : les verbes irréguliers déclarent leurs radicaux dans
   content/verbs/*.js (champ « radicaux »), et être déclare « ét »
   pour l'imparfait.
   ============================================================ */
(function (Q) {
  "use strict";

  var PERSONNES = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];
  var TEMPS = ["present", "imparfait", "futur", "passe_compose"];

  /* Radicaux du futur simple des verbes irréguliers du jeu. */
  var FUTUR = {
    etre: "ser", avoir: "aur", aller: "ir", faire: "fer", dire: "dir",
    venir: "viendr", prendre: "prendr", voir: "verr", pouvoir: "pourr", vouloir: "voudr"
  };

  /* Ancien découpage heuristique, conservé pour compatibilité.
     Il n'est plus utilisé pour fabriquer des questions d'assemblage. */
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

  function norm(s) {
    return String(s || "").toLowerCase().trim();
  }

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

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

  /* ---------- Découpage certifié ---------- */

  /* Radical déclaré dans le contenu du verbe (verbes irréguliers). */
  function radicalCurated(temps, personne, verbe) {
    var table = verbe && verbe.radicaux && verbe.radicaux[temps];
    return (table && table[personne]) || null;
  }

  function radicalPour(temps, personne, verbe) {
    if (!verbe || !verbe.infinitif) return null;

    var cur = radicalCurated(temps, personne, verbe);
    if (cur) return cur;

    if (temps === "present") {
      if (verbe.groupe === 1) {
        var r1 = verbe.infinitif.slice(0, -2);
        if (personne === "nous") {
          if (/ger$/.test(verbe.infinitif)) return r1 + "e";
          if (/cer$/.test(verbe.infinitif)) return r1.slice(0, -1) + "ç";
        }
        return r1;
      }
      if (verbe.groupe === 2) return verbe.infinitif.slice(0, -2);
      return null; /* irrégulier sans radical déclaré : QCM */
    }

    if (temps === "imparfait") {
      if (verbe.id === "etre") return null; /* sans radical déclaré */
      var nous = verbe.formes && verbe.formes.present && verbe.formes.present.nous;
      if (!nous || nous.slice(-3) !== "ons") return null;
      var r = nous.slice(0, -3);
      var auPluriel = personne === "nous" || personne === "vous" ||
        personne === "ils" || personne === "elles";
      if (/ger$/.test(verbe.infinitif)) return auPluriel ? r.slice(0, -1) : r;
      if (/cer$/.test(verbe.infinitif)) return auPluriel ? r.slice(0, -1) + "c" : r;
      return r;
    }

    if (temps === "futur") {
      if (verbe.groupe === 1 || verbe.groupe === 2) return verbe.infinitif;
      return FUTUR[verbe.id] || null;
    }

    return null;
  }

  /* Découpe une forme quand le radical est certifié (règle ou table).
     La terminaison est simplement ce qui reste après le radical. */
  function decoupageRegulier(temps, personne, verbe) {
    var radical = radicalPour(temps, personne, verbe);
    if (!radical) return null;
    var forme = verbe.formes && verbe.formes[temps] && verbe.formes[temps][personne];
    if (!forme || norm(forme).indexOf(norm(radical)) !== 0) return null;
    var fin = forme.slice(radical.length);
    if (!fin) return null;
    return { radical: radical, terminaison: fin };
  }

  function decoupageFiable(phrase, verbe) {
    if (!phrase || !verbe || phrase.temps === "passe_compose") return null;
    var d = decoupageRegulier(phrase.temps, phrase.personne, verbe);
    if (!d) return null;
    var forme = Q.formeAttendue(phrase);
    if (!forme || norm(forme) !== norm(d.radical + d.terminaison)) return null;
    return { radical: d.radical, terminaison: d.terminaison, forme: forme };
  }

  /* ---------- Pool de terminaisons compatible avec le radical ---------- */

  function tempsDejaVus(phrase) {
    var ordre = (typeof Q.curriculum === "function" && Q.curriculum().ordre) || [];
    var avecJeu = typeof Q.jeu !== "undefined" && Q.jeu && typeof Q.jeu.ileCommencee === "function";
    var out = [];
    ordre.forEach(function (id) {
      var a = typeof Q.aventure === "function" ? Q.aventure(id) : null;
      if (!a || !a.temps || a.temps === phrase.temps) return;
      if (avecJeu && !Q.jeu.ileCommencee(id)) return;
      if (out.indexOf(a.temps) === -1) out.push(a.temps);
    });
    if (!avecJeu) {
      TEMPS.forEach(function (t) {
        if (t !== phrase.temps && out.indexOf(t) === -1) out.push(t);
      });
    }
    return out;
  }

  /* Une seule faute plausible sur la terminaison (lettre muette,
     consonne doublée, -ez/-er/-é). */
  function fautesTerminaison(fin, verbe) {
    var out = [];
    function ajouter(x) {
      if (x && x !== fin && out.indexOf(x) === -1) out.push(x);
    }
    if (/[^s]s$/.test(fin) && fin.length > 1) ajouter(fin.slice(0, -1));
    if (/t$/.test(fin) && fin.length > 1) ajouter(fin.slice(0, -1));
    if (fin === "x") { ajouter("s"); ajouter("t"); } /* je peux → je peus / je peut */
    if (/ez$/.test(fin) && verbe && verbe.groupe === 1) {
      ajouter(fin.slice(0, -2) + "er");
      ajouter(fin.slice(0, -2) + "é");
    }
    var dbl = fin.match(/([bcdfglmnprstz])\1/);
    if (dbl) {
      var i = fin.indexOf(dbl[0]);
      ajouter(fin.slice(0, i + 1) + fin.slice(i + 2));
      ajouter(fin.slice(0, i) + fin.slice(i + 1));
    }
    return out;
  }

  /* Renvoie jusqu'à 4 terminaisons (la bonne incluse), toutes
     compatibles avec le radical affiché. */
  function optionsAssemblage(phrase, verbe, d) {
    d = d || decoupageFiable(phrase, verbe);
    if (!d) return [];

    var A = [];
    var B = [];

    PERSONNES.forEach(function (p) {
      if (p === phrase.personne) return;
      var dp = decoupageRegulier(phrase.temps, p, verbe);
      if (dp && dp.radical === d.radical && dp.terminaison !== d.terminaison &&
          A.indexOf(dp.terminaison) === -1) {
        A.push(dp.terminaison);
      }
    });

    tempsDejaVus(phrase).forEach(function (t) {
      PERSONNES.forEach(function (p) {
        var dp = decoupageRegulier(t, p, verbe);
        if (dp && dp.radical === d.radical && dp.terminaison !== d.terminaison &&
            B.indexOf(dp.terminaison) === -1) {
          B.push(dp.terminaison);
        }
      });
    });

    var C = fautesTerminaison(d.terminaison, verbe);
    var choisis = [d.terminaison];
    var vus = {};
    vus[d.terminaison] = true;

    function prendre(liste, maximum) {
      melanger(liste).forEach(function (x) {
        if (choisis.length >= maximum || vus[x]) return;
        vus[x] = true;
        choisis.push(x);
      });
    }

    prendre(A, 2); /* une autre personne du même temps */
    prendre(B, 3); /* un autre temps, si le radical est identique */
    prendre(A, 4); /* une deuxième autre personne */
    prendre(C, 4); /* sinon une faute typique sur la terminaison */
    return choisis.slice(0, 4);
  }

  function assemblagePossible(phrase, verbe) {
    if (!phrase || !verbe) return null;
    var d = decoupageFiable(phrase, verbe);
    if (!d) return null;
    return { radical: d.radical, terminaison: d.terminaison, forme: d.forme };
  }

  Q.morphologie = {
    decouper: decouper,
    terminaisonsDuTemps: terminaisonsDuTemps,
    assemblagePossible: assemblagePossible,
    decoupageFiable: decoupageFiable,
    decoupageRegulier: decoupageRegulier,
    optionsAssemblage: optionsAssemblage,
    fautesTerminaison: fautesTerminaison
  };
})(window.Quete);
