/* ============================================================
   distractors.js — fabrique de mauvais choix « intelligents »
   Règle d'or : une seule bonne réponse, jamais de doublon.
   ============================================================ */
(function (Q) {
  "use strict";

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

  var AUX = {
    avoir: { je: "ai", tu: "as", il: "a", elle: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" },
    etre: { je: "suis", tu: "es", il: "est", elle: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" }
  };

  function candidatsPasseCompose(phrase, verbe, reponse) {
    var out = [];
    var mots = norm(reponse).split(" ");
    var aux = mots[0];
    var participe = mots.slice(1).join(" ");
    var autre = verbe && verbe.auxiliaire === "etre" ? "avoir" : "etre";

    /* 1. Mauvais auxiliaire, même participe */
    var mauvaisAux = AUX[autre][phrase.personne];
    if (mauvaisAux) out.push(mauvaisAux + " " + participe);

    /* 2. Autres personnes (vrais formes) */
    if (verbe && verbe.formes && verbe.formes.passe_compose) {
      Object.keys(verbe.formes.passe_compose).forEach(function (p) {
        if (p !== phrase.personne) out.push(verbe.formes.passe_compose[p]);
      });
    }

    /* 3. Participe mal orthographié : -er, -ez, -ée, -és */
    if (/é$/.test(participe)) {
      out.push(aux + " " + participe.slice(0, -1) + "er");
      out.push(aux + " " + participe.slice(0, -1) + "ez");
      out.push(aux + " " + participe.slice(0, -1) + "ée");
    }
    /* 4. Participe pris à l'infinitif du verbe */
    if (verbe && verbe.infinitif && norm(verbe.infinitif) !== participe) {
      out.push(aux + " " + verbe.infinitif);
    }
    return out;
  }

  function candidatsSimples(phrase, verbe, reponse) {
    var out = [];
    /* 1. Autres personnes du même verbe et du même temps (le vrai piège) */
    if (verbe && verbe.formes && verbe.formes[phrase.temps]) {
      Object.keys(verbe.formes[phrase.temps]).forEach(function (p) {
        if (p === phrase.personne) return;
        out.push(verbe.formes[phrase.temps][p]);
      });
    }

    /* 2. Radical correct + autre terminaison du temps */
    var d = Q.morphologie.decouper(phrase.temps, phrase.personne, reponse);
    if (d) {
      Q.morphologie.terminaisonsDuTemps(phrase.temps).forEach(function (fin) {
        if (fin !== d.terminaison) out.push(d.radical + fin);
      });
      /* 3. Pièges de radical : -ger / -cer */
      if (verbe && /ger$/.test(verbe.infinitif) && phrase.personne === "nous") {
        out.push(d.radical.replace(/e$/, "") + "ons");
      }
    }
    return out;
  }

  Q.distracteurs = {
    melanger: melanger,

    pour: function (phrase, nombre) {
      var reponse = Q.formeAttendue(phrase);
      var verbe = Q.verbe(phrase.verbe);
      var n = nombre || 2;
      var bruts = phrase.temps === "passe_compose"
        ? candidatsPasseCompose(phrase, verbe, reponse)
        : candidatsSimples(phrase, verbe, reponse);

      var propres = unicite(bruts.map(function (s) { return String(s).trim(); }), reponse);

      /* On privilégie les formes réelles du verbe (les plus pédagogiques),
         puis on complète avec des variantes de terminaison si besoin. */
      var choisis = melanger(propres).slice(0, n);

      if (choisis.length < n) {
        var secours = ["suis", "est", "sont", "avons", "avez", "ont", "es", "a", "vais", "va"];
        secours.forEach(function (s) {
          if (choisis.length < n && norm(s) !== norm(reponse) && choisis.map(norm).indexOf(norm(s)) === -1) {
            choisis.push(s);
          }
        });
      }
      return choisis;
    },

    /* Vérification utilisée par le lint : une seule bonne réponse. */
    verifier: function (phrase) {
      var reponse = Q.formeAttendue(phrase);
      var options = [reponse].concat(Q.distracteurs.pour(phrase, 3));
      var vues = {};
      var doublons = 0;
      options.forEach(function (o) {
        if (vues[norm(o)]) doublons++;
        vues[norm(o)] = true;
      });
      return { options: options, doublons: doublons };
    }
  };
})(window.Quete);
