/* ============================================================
   feedback.js — micro-leçons et encouragements
   Jamais de « Faux » sec : on explique toujours en une phrase.
   ============================================================ */
(function (Q) {
  "use strict";

  var encouragements = [
    "Bien vu !",
    "Tu as trouvé !",
    "Exactement !",
    "Beau travail, moussaillon !",
    "C'est ça !",
    "Tu progresses, continue !"
  ];

  var regles = {
    present: {
      je: "Avec « je », le verbe se termine par -e, -s ou -x : je joue, je finis, je peux.",
      tu: "Avec « tu », le verbe prend presque toujours un -s : tu joues.",
      il: "Avec « il » ou « elle », le verbe se termine souvent par -e ou -t : il joue, il finit.",
      elle: "Avec « il » ou « elle », le verbe se termine souvent par -e ou -t : elle joue, elle finit.",
      nous: "Avec « nous », la terminaison est -ons : nous jouons.",
      vous: "Avec « vous », la terminaison est -ez : vous jouez.",
      ils: "Avec « ils » ou « elles », la terminaison est -ent : ils jouent.",
      elles: "Avec « ils » ou « elles », la terminaison est -ent : elles jouent."
    },
    imparfait: {
      defaut: "À l'imparfait, les terminaisons sont -ais, -ais, -ait, -ions, -iez, -aient.",
      nous: "Avec « nous », à l'imparfait, c'est -ions (et non -ons) : nous chantions.",
      vous: "Avec « vous », à l'imparfait, c'est -iez : vous chantiez.",
      ils: "Avec « ils » ou « elles », à l'imparfait, c'est -aient : ils chantaient.",
      elles: "Avec « ils » ou « elles », à l'imparfait, c'est -aient : elles chantaient."
    },
    futur: {
      defaut: "Au futur, on ajoute -ai, -as, -a, -ons, -ez, -ont.",
      je: "Pour « je », au futur, la terminaison est -ai : je jouerai.",
      tu: "Pour « tu », au futur, la terminaison est -as : tu joueras.",
      il: "Pour « il » ou « elle », au futur, la terminaison est -a : il jouera.",
      elle: "Pour « il » ou « elle », au futur, la terminaison est -a : elle jouera.",
      nous: "Pour « nous », au futur, la terminaison est -ons : nous jouerons.",
      vous: "Pour « vous », au futur, la terminaison est -ez : vous jouerez.",
      ils: "Pour « ils » ou « elles », au futur, la terminaison est -ont : ils joueront.",
      elles: "Pour « ils » ou « elles », au futur, la terminaison est -ont : elles joueront."
    },
    passe_compose: {
      defaut: "Au passé composé, on met l'auxiliaire avoir ou être, puis le participe passé : j'ai trouvé.",
      etre: "Ce verbe se conjugue avec être : le participe s'accorde avec le sujet (elle est arrivée).",
      accord: "Avec être, le participe s'accorde : elle est arrivée, elles sont arrivées."
    }
  };

  function choisir(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
  }

  function reglePour(phrase, verbe) {
    var t = regles[phrase.temps] || {};
    var specifique = t[phrase.personne];
    /* Sur le passé composé, l'auxiliaire être prime sur la terminaison. */
    if (phrase.temps === "passe_compose" && verbe && verbe.auxiliaire === "etre") {
      specifique = regles.passe_compose.etre;
    }
    if (phrase.temps === "passe_compose" && (phrase.tags || []).indexOf("accord") !== -1) {
      specifique = regles.passe_compose.accord;
    }
    return specifique || t.defaut || "";
  }

  /* Typologie d'erreur, stockée pour l'espace parent. */
  function analyser(phrase, donnee) {
    var attendu = Q.formeAttendue(phrase);
    var a = String(attendu).toLowerCase();
    var d = String(donnee || "").toLowerCase();
    var verbe = Q.verbe(phrase.verbe);
    if (phrase.temps === "passe_compose") {
      if (verbe && verbe.auxiliaire === "etre" && /^(ai|as|a|avons|avez|ont)\b/.test(d)) return "auxiliaire";
      if (verbe && verbe.auxiliaire === "avoir" && /^(suis|es|est|sommes|êtes|sont)\b/.test(d)) return "auxiliaire";
      if (/\w?er$/.test(d) && /é$/.test(a)) return "participe";
      if (a.length !== d.length && a.slice(0, -1) === d.slice(0, -1)) return "accord";
      return "participe";
    }
    if (d.length && a.length && a.slice(0, 3) === d.slice(0, 3) && a !== d) return "terminaison";
    if (a.replace(/-/g, "") === d.replace(/-/g, "")) return "terminaison";
    return "terminaison";
  }

  Q.feedback = {
    encouragement: function () { return choisir(encouragements); },

    regle: reglePour,

    analyser: function (phrase, donnee) {
      var type = analyser(phrase, donnee);
      var e = Q.etat.stats.erreurs || (Q.etat.stats.erreurs = {});
      e[type] = (e[type] || 0) + 1;
      return type;
    },

    /* Message d'aide après une erreur. essai = 1 (il peut réessayer) ou 2. */
    aide: function (phrase, essai) {
      var verbe = Q.verbe(phrase.verbe);
      var regle = reglePour(phrase, verbe);
      if (essai <= 1) {
        return {
          titre: "Presque !",
          texte: "Regarde bien la fin du verbe, puis réessaie.",
          regle: regle
        };
      }
      var bonus = verbe && verbe.note && verbe.note !== regle ? " " + verbe.note : "";
      return {
        titre: "La bonne réponse est « " + Q.formeAttendue(phrase) + " »",
        texte: "Copie-la pour la retenir, puis continue.",
        regle: regle + bonus
      };
    },

    succes: function (phrase) {
      var verbe = Q.verbe(phrase.verbe);
      var regle = reglePour(phrase, verbe);
      return {
        titre: Q.feedback.encouragement(),
        texte: "« " + Q.formeAttendue(phrase) + " » est la bonne forme.",
        regle: regle
      };
    },

    typesErreurs: {
      terminaison: "Terminaisons",
      radical: "Radical",
      auxiliaire: "Auxiliaire (avoir / être)",
      participe: "Participe passé",
      accord: "Accord du participe",
      temps: "Choix du temps",
      homophone: "Homophones"
    }
  };
})(window.Quete);
