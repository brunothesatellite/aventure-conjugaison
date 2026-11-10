/* ============================================================
   exercises.js — fabrique de questions
   Deux types : QCM (choisir la forme) et assemblage (radical + terminaison).
   ============================================================ */
(function (Q) {
  "use strict";

  var LETTRES = ["A", "B", "C", "D"];

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function doitAssembler(phrase, verbe, difficulte) {
    if (!Q.etat.reglages) return false;
    var possible = Q.morphologie.assemblagePossible(phrase, verbe);
    if (!possible) return false;
    /* Plus l'enfant avance, plus l'assemblage apparaît. */
    var chance = difficulte >= 3 ? 0.5 : difficulte === 2 ? 0.4 : 0.25;
    return Math.random() < chance;
  }

  Q.exercices = {
    construire: function (phrase, source) {
      var verbe = Q.verbe(phrase.verbe);
      var reponse = Q.formeAttendue(phrase);
      var difficulte = phrase.difficulte || 1;
      var base = {
        id: phrase.id,
        phraseId: phrase.id,
        verbe: phrase.verbe,
        infinitif: verbe ? verbe.infinitif : phrase.verbe,
        temps: phrase.temps,
        personne: phrase.personne,
        texte: phrase.texte,
        reponse: reponse,
        difficulte: difficulte,
        source: source || "cible",
        explication: phrase.explication || (verbe ? verbe.note : "") || ""
      };

      var asm = Q.morphologie.assemblagePossible(phrase, verbe);
      if (asm && doitAssembler(phrase, verbe, difficulte)) {
        var pool = Q.morphologie.terminaisonsDuTemps(phrase.temps)
          .filter(function (t) { return t !== asm.terminaison; });
        var optionsTerm = melanger([asm.terminaison].concat(melanger(pool).slice(0, 3)));
        return Object.assign(base, {
          type: "assemblage",
          radical: asm.radical,
          terminaison: asm.terminaison,
          options: optionsTerm,
          consigne: "Assemble le verbe : choisis la bonne terminaison."
        });
      }

      var mauvais = Q.distracteurs.pour(phrase, 2);
      var options = melanger([reponse].concat(mauvais));
      return Object.assign(base, {
        type: "qcm",
        options: options,
        lettres: LETTRES.slice(0, options.length),
        consigne: "Choisis la bonne forme du verbe."
      });
    },

    /* Couleur et repère du pronom, utilisés par l'interface. */
    classePronom: function (personne) {
      if (personne === "je" || personne === "tu") return "pronom--je";
      if (personne === "il" || personne === "elle") return "pronom--il";
      if (personne === "nous" || personne === "vous") return "pronom--nous";
      return "pronom--ils";
    }
  };
})(window.Quete);
