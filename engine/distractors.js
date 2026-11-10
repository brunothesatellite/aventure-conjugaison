/* ============================================================
   distractors.js — fabrique de mauvais choix « intelligents »

   Règle d'or : on ne fabrique JAMAIS une forme en collant un
   radical et une terminaison au hasard. Chaque mauvais choix est
   soit une forme réellement conjuguée du verbe, soit une seule
   faute typique appliquée à la bonne réponse.

   Trois familles :
     A. autre personne, même verbe, même temps (toujours possible) ;
     B. même personne, autre temps déjà débloqué ;
     C. une seule faute de français plausible (accord, lettre muette,
        -er/-é/-ez, auxiliaire ont/on, consonne double…).
   ============================================================ */
(function (Q) {
  "use strict";

  var TEMPS = ["present", "imparfait", "futur", "passe_compose"];

  function norm(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function unicite(liste, reponse) {
    var vu = {};
    vu[norm(reponse)] = true;
    return liste.filter(function (x) {
      var n = norm(x);
      if (!n || vu[n]) return false;
      vu[n] = true;
      return true;
    });
  }

  /* Distance d'édition : sert au lint pour refuser toute forme
     inventée qui ne serait ni une conjugaison réelle ni une faute
     à une ou deux lettres de la bonne réponse. */
  function distance(a, b) {
    a = norm(a); b = norm(b);
    var ligne = [];
    for (var j = 0; j <= b.length; j++) ligne[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var precedente = ligne[0];
      ligne[0] = i;
      for (var k = 1; k <= b.length; k++) {
        var tmp = ligne[k];
        ligne[k] = Math.min(
          ligne[k] + 1,
          ligne[k - 1] + 1,
          precedente + (a.charAt(i - 1) === b.charAt(k - 1) ? 0 : 1)
        );
        precedente = tmp;
      }
    }
    return ligne[b.length];
  }

  /* ---------- Famille A : autres personnes, même temps ---------- */

  function autresPersonnes(phrase, verbe) {
    var out = [];
    var formes = verbe && verbe.formes && verbe.formes[phrase.temps];
    if (!formes) return out;
    Object.keys(formes).forEach(function (p) {
      if (p !== phrase.personne) out.push(formes[p]);
    });
    return out;
  }

  /* ---------- Famille B : même personne, autre temps ---------- */

  /* On ne propose que des temps déjà rencontrés par l'enfant.
     Dans le linter (sans Q.jeu), on considère tous les temps. */
  function tempsConnus(phrase) {
    var connus = [];
    var ordre = (typeof Q.curriculum === "function" && Q.curriculum().ordre) || [];
    var avecJeu = typeof Q.jeu !== "undefined" && Q.jeu && typeof Q.jeu.ileDebloquee === "function";

    ordre.forEach(function (id) {
      var a = typeof Q.aventure === "function" ? Q.aventure(id) : null;
      if (!a || !a.temps || a.temps === phrase.temps) return;
      if (avecJeu && !Q.jeu.ileDebloquee(id)) return;
      if (connus.indexOf(a.temps) === -1) connus.push(a.temps);
    });

    if (!avecJeu) {
      TEMPS.forEach(function (t) {
        if (t !== phrase.temps && connus.indexOf(t) === -1) connus.push(t);
      });
    }
    return connus;
  }

  function autresTemps(phrase, verbe) {
    var out = [];
    tempsConnus(phrase).forEach(function (t) {
      var f = verbe && verbe.formes && verbe.formes[t] && verbe.formes[t][phrase.personne];
      if (f) out.push(f);
    });
    return out;
  }

  /* ---------- Famille C : une seule faute typique ---------- */

  function fautesSimples(phrase, verbe, reponse) {
    var out = [];
    var f = String(reponse);
    var bas = f.toLowerCase();
    var pers = phrase.personne;
    var avecEtre = phrase.temps === "passe_compose" && verbe && verbe.auxiliaire === "etre";

    function ajouter(x) {
      if (x && x !== f && out.indexOf(x) === -1) out.push(x);
    }

    if (phrase.temps === "passe_compose") {
      /* Accord du participe avec être. */
      if (avecEtre) {
        if (/ées$/.test(bas)) ajouter(f.slice(0, -1));            /* arrivées → arrivée */
        if (/és$/.test(bas)) ajouter(f.slice(0, -1));              /* arrivés → arrivé */
        if (/ée$/.test(bas)) ajouter(f.slice(0, -1));              /* arrivée → arrivé */
        if (/is$/.test(bas) && (pers === "ils" || pers === "elles")) {
          ajouter(f.slice(0, -1));                                 /* partis → parti */
        }
        if (/é$/.test(bas) && (pers === "elle" || pers === "elles")) {
          ajouter(f + (pers === "elles" ? "es" : "e"));            /* arrivé → arrivée(s) */
        }
      }
      /* Participe écrit à l'infinitif : mangé → manger, fini → finir.
         On ne le propose que si les deux formes partagent leur radical,
         pour éviter des mélanges invraisemblables (eu → avoir). */
      var mots = f.split(" ");
      var aux = mots[0];
      var participe = mots.slice(1).join(" ");
      var basePart = participe.replace(/(e?s|e)$/, "");
      if (verbe && verbe.infinitif &&
          norm(verbe.infinitif) !== norm(participe) &&
          norm(verbe.infinitif).slice(0, 3) === norm(basePart).slice(0, 3)) {
        ajouter(aux + " " + verbe.infinitif);
      }

      /* Auxiliaire homophone : ont → on, sont → son, a → à. */
      var reste = mots.slice(1).join(" ");
      if (mots[0] === "ont") ajouter("on " + reste);
      if (mots[0] === "sont") ajouter("son " + reste);
      if (mots[0] === "a") ajouter("à " + reste);
      return out;
    }

    /* Confusion -ez / -er / -é : on utilise le vrai infinitif du verbe. */
    if (/ez$/.test(bas)) {
      if (verbe && verbe.infinitif && norm(verbe.infinitif) !== bas) {
        ajouter(verbe.infinitif);
      }
      if (verbe && verbe.groupe === 1) ajouter(f.slice(0, -2) + "é");
    }
    /* Lettre finale muette oubliée (seulement tu / nous, sinon
       « vous dites » donnerait « dite »). */
    if ((pers === "tu" || pers === "nous") && /[^s]s$/.test(bas) && f.length > 4) {
      ajouter(f.slice(0, -1));
    }
    if (/it$/.test(bas) && f.length >= 5) ajouter(f.slice(0, -1));
    if (/x$/.test(bas) && f.length >= 5) ajouter(f.slice(0, -1));

    /* Consonne double oubliée : appelle → appele / apelle. */
    var double = bas.match(/([bcdfglmnprstz])\1/);
    if (double) {
      var i = bas.indexOf(double[0]);
      ajouter(f.slice(0, i + 1) + f.slice(i + 2)); /* retire la 2e */
      ajouter(f.slice(0, i) + f.slice(i + 1));     /* retire la 1re */
    }

    return out;
  }

  /* ---------- Sélection ---------- */

  function familles(phrase) {
    var reponse = Q.formeAttendue(phrase);
    var verbe = Q.verbe(phrase.verbe);
    return {
      reponse: reponse,
      A: unicite(autresPersonnes(phrase, verbe), reponse),
      B: unicite(autresTemps(phrase, verbe), reponse),
      C: unicite(fautesSimples(phrase, verbe, reponse), reponse)
    };
  }

  Q.distracteurs = {
    melanger: melanger,
    distance: distance,
    familles: familles,

    /* Sélection détaillée : chaque choix porte sa famille (A, B ou C).
       Utilisée par pour() et par tools/audit-distracteurs.js. */
    pourAvecFamilles: function (phrase, nombre) {
      var n = nombre || 2;
      var f = familles(phrase);
      var choisis = [];
      var vus = {};
      vus[norm(f.reponse)] = true;

      function piocher(source, famille, maximum) {
        melanger(source).forEach(function (x) {
          if (choisis.length >= maximum) return;
          var k = norm(x);
          if (!k || vus[k]) return;
          vus[k] = true;
          choisis.push({ valeur: String(x).trim(), famille: famille });
        });
      }

      /* 1. Toujours une autre personne : le piège le plus juste. */
      piocher(f.A, "A", 1);
      /* 2. Puis un autre temps (présent, imparfait, futur)
            ou une faute typique au passé composé, où l'accord et
            les confusions -é/-er sont les plus utiles. */
      if (phrase.temps === "passe_compose") {
        piocher(f.C, "C", n);
        piocher(f.B, "B", n);
      } else {
        piocher(f.B, "B", n);
        piocher(f.C, "C", n);
      }
      /* 3. Compléter sans jamais sortir des trois familles. */
      piocher(f.A, "A", n);
      piocher(f.B, "B", n);
      piocher(f.C, "C", n);

      return choisis.slice(0, n);
    },

    pour: function (phrase, nombre) {
      return Q.distracteurs.pourAvecFamilles(phrase, nombre).map(function (c) {
        return c.valeur;
      });
    },

    /* Vérification utilisée par le lint : une seule bonne réponse,
       aucun doublon, et aucune forme inventée. */
    verifier: function (phrase) {
      var reponse = Q.formeAttendue(phrase);
      var options = [reponse].concat(Q.distracteurs.pour(phrase, 3));
      var vues = {};
      var doublons = 0;
      options.forEach(function (o) {
        if (vues[norm(o)]) doublons++;
        vues[norm(o)] = true;
      });

      var verbe = Q.verbe(phrase.verbe);
      var connues = {};
      if (verbe && verbe.formes) {
        Object.keys(verbe.formes).forEach(function (t) {
          Object.keys(verbe.formes[t] || {}).forEach(function (p) {
            connues[norm(verbe.formes[t][p])] = true;
          });
        });
      }
      /* L'infinitif et le participe sont de vraies formes du verbe,
         même s'ils n'apparaissent pas dans les tables de conjugaison. */
      var motsConnus = {};
      if (verbe) {
        if (verbe.infinitif) motsConnus[norm(verbe.infinitif)] = true;
        if (verbe.participe) motsConnus[norm(verbe.participe)] = true;
      }
      var suspects = options.slice(1).filter(function (o) {
        if (connues[norm(o)]) return false;
        var mots = norm(o).split(" ");
        if (motsConnus[mots[mots.length - 1]]) return false;
        return distance(o, reponse) > 2;
      });

      return { options: options, doublons: doublons, suspects: suspects };
    }
  };
})(window.Quete);
