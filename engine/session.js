/* ============================================================
   session.js — composition d'une quête de 7 questions
   2 révisions espacées + 4 questions du niveau + 1 défi mêlé.
   ============================================================ */
(function (Q) {
  "use strict";

  function melanger(tab) {
    var a = tab.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function parId(liste) {
    var m = {};
    liste.forEach(function (p) { m[p.id] = p; });
    return m;
  }

  function phrasePourCarte(k) {
    var morceaux = String(k).split("|");
    var trouve = Q.toutesLesPhrases().filter(function (p) {
      return p.verbe === morceaux[0] && p.temps === morceaux[1] && p.personne === morceaux[2];
    });
    return trouve.length ? melanger(trouve)[0] : null;
  }

  var session = (Q.session = {
    construire: function (options) {
      var a = Q.aventure(options.aventureId);
      if (!a) return null;
      var config = Q.curriculum();
      var total = config.questionsParQuete || 7;
      var nbRevues = Math.min(config.revuesParQuete || 2, total - 2);
      var gardien = options.mode === "gardien";
      var niveau = gardien ? null : Q.niveau(options.aventureId, options.niveauId);
      if (!gardien && !niveau) return null;

      var pool = gardien
        ? (Q.content.phrases[a.temps] || []).filter(function (p) { return p.temps === a.temps; })
        : Q.phrasesDuNiveau(options.aventureId, options.niveauId);

      if (!pool.length) return null;

      var utilisables = pool.slice();
      var questions = [];
      var dejaVu = {};

      /* 1. Révisions espacées dues */
      var dues = Q.srs.dues(6, a.temps);
      for (var i = 0; i < dues.length && questions.length < nbRevues; i++) {
        var p = phrasePourCarte(dues[i].cle);
        if (p && !dejaVu[p.id] && utilisables.some(function (x) { return x.id === p.id; })) {
          dejaVu[p.id] = true;
          questions.push(Q.exercices.construire(p, "revue"));
        }
      }

      /* 2. Questions du niveau */
      var cibles = melanger(utilisables.filter(function (p) { return !dejaVu[p.id]; }));
      var besoin = total - questions.length - 1; /* on garde 1 place pour le défi */
      while (cibles.length && questions.length < besoin) {
        var c = cibles.shift();
        dejaVu[c.id] = true;
        questions.push(Q.exercices.construire(c, "cible"));
      }

      /* 3. Défi mêlé : un autre temps déjà débloqué */
      var autreTemps = Q.curriculum().ordre
        .filter(function (id) { return id !== options.aventureId && Q.jeu.ileDebloquee(id); })
        .map(function (id) { return Q.aventure(id).temps; })
        .filter(function (t) { return t !== a.temps; });
      if (autreTemps.length) {
        var tempsDefi = melanger(autreTemps)[0];
        var phrasesDefi = melanger((Q.content.phrases[tempsDefi] || []).filter(function (p) { return !dejaVu[p.id]; }));
        if (phrasesDefi.length) {
          dejaVu[phrasesDefi[0].id] = true;
          questions.push(Q.exercices.construire(phrasesDefi[0], "defi"));
        }
      }

      /* 4. Compléter si le niveau manque de phrases */
      var secours = melanger(utilisables);
      while (questions.length < total && secours.length) {
        var s = secours.shift();
        if (!dejaVu[s.id]) {
          dejaVu[s.id] = true;
          questions.push(Q.exercices.construire(s, "cible"));
        }
      }

      /* Les révisions restent en début de quête (échauffement). */
      var revues = questions.filter(function (q) { return q.source === "revue"; });
      var autres = questions.filter(function (q) { return q.source !== "revue"; });
      var defi = autres.filter(function (q) { return q.source === "defi"; });
      var milieu = melanger(autres.filter(function (q) { return q.source !== "defi"; }));

      return {
        aventureId: options.aventureId,
        niveauId: options.niveauId,
        mode: gardien ? "gardien" : "niveau",
        temps: a.temps,
        creeLe: Date.now(),
        questions: revues.concat(milieu, defi),
        index: 0,
        aides: { eliminer: 0, regle: 0, indice: 0 },
        fini: false
      };
    },

    courante: function () {
      var q = Q.etat.quest;
      if (!q || q.fini) return null;
      return q.questions[q.index] || null;
    },

    repondre: function (choix) {
      var q = Q.etat.quest;
      if (!q) return null;
      var question = q.questions[q.index];
      if (!question || question.termine) return null;

      question.essais = (question.essais || 0) + 1;
      /* En assemblage, l'enfant ne choisit que la terminaison :
         on la compare à la terminaison attendue, pas à la forme entière. */
      var attendu = question.type === "assemblage" ? question.terminaison : question.reponse;
      var correct = String(choix).toLowerCase() === String(attendu).toLowerCase();

      if (correct) {
        question.termine = true;
        question.reussi = true;
        var gain = question.essais === 1 ? (question.difficulte >= 3 ? 3 : 2) : 1;
        q.orGagne = (q.orGagne || 0) + gain;
        Q.jeu.ajouterOr(gain);
        if (question.essais === 1) {
          question.premierCoup = true;
          Q.etat.serie.actuelle += 1;
          Q.etat.serie.record = Math.max(Q.etat.serie.record, Q.etat.serie.actuelle);
          Q.etat.stats.premierCoup += 1;
          Q.srs.enregistrer(question.verbe, question.temps, question.personne, true);
        } else {
          Q.srs.enregistrer(question.verbe, question.temps, question.personne, true);
        }
        Q.etat.stats.questions += 1;
        Q.etat.stats.bonnes += 1;
        Q.jeu.sauver();
        return { correct: true, premierCoup: !!question.premierCoup, question: question };
      }

      Q.etat.stats.questions += 1;
      if (question.essais >= 2) {
        question.termine = true;
        question.reussi = false;
        question.copiee = false;
        Q.etat.serie.actuelle = 0;
        Q.srs.enregistrer(question.verbe, question.temps, question.personne, false);
        Q.feedback.analyser(Q.phraseParId(question.phraseId), choix);
      }
      Q.jeu.sauver();
      return { correct: false, essais: question.essais, question: question };
    },

    suivante: function () {
      var q = Q.etat.quest;
      if (!q) return null;
      q.index += 1;
      if (q.index >= q.questions.length) {
        q.fini = true;
        q.finiLe = Date.now();
        var res = session.resultat(q);
        var bonus = (res.parfait ? 10 : 0) + (res.gardien ? 25 : 0);
        if (bonus) Q.jeu.ajouterOr(bonus);
        res.bonus = bonus;
        res.orGagne = q.orGagne || 0;
        q.resultat = res;
        Q.jeu.sauver();
        return { fini: true, resultat: res };
      }
      Q.jeu.sauver();
      return { fini: false };
    },

    /* Révision express : uniquement les cartes dues (répétition espacée). */
    construireRevision: function (limite) {
      var dues = Q.srs.dues(16);
      var questions = [];
      var vus = {};
      dues.forEach(function (d) {
        var p = phrasePourCarte(d.cle);
        if (p && !vus[p.id]) {
          vus[p.id] = true;
          questions.push(Q.exercices.construire(p, "revue"));
        }
      });
      if (!questions.length) return null;
      return {
        aventureId: null,
        niveauId: null,
        mode: "revision",
        temps: "mixte",
        creeLe: Date.now(),
        questions: melanger(questions).slice(0, limite || 7),
        index: 0,
        aides: { eliminer: 0, regle: 0, indice: 0 },
        fini: false
      };
    },

    resultat: function (q) {
      q = q || Q.etat.quest;
      if (!q) return null;
      var total = q.questions.length;
      var premierCoup = q.questions.filter(function (x) { return x.premierCoup; }).length;
      var bonnes = q.questions.filter(function (x) { return x.reussi; }).length;
      var config = Q.curriculum().seuilsEtoiles || { deux: 6, trois: 7 };
      var etoiles = 1;
      if (premierCoup >= config.deux) etoiles = 2;
      if (premierCoup >= config.trois) etoiles = 3;
      if (bonnes === 0) etoiles = 1;
      var aidesUtilisees = (q.aides.indice || 0) + (q.aides.regle || 0) + (q.aides.lettre || 0) + (q.aides.eliminer || 0);
      if (aidesUtilisees > 0 && etoiles === 3) etoiles = 2;
      var revoir = q.questions
        .filter(function (x) { return !x.premierCoup; })
        .map(function (x) {
          return { question: x, phrase: Q.phraseParId(x.phraseId) };
        });
      return {
        aventureId: q.aventureId,
        niveauId: q.niveauId,
        mode: q.mode,
        total: total,
        premierCoup: premierCoup,
        bonnes: bonnes,
        etoiles: etoiles,
        parfait: premierCoup === total,
        gardien: q.mode === "gardien",
        revision: q.mode === "revision",
        orGagne: q.orGagne || 0,
        revoir: revoir,
        duree: Math.round((Date.now() - q.creeLe) / 1000)
      };
    }
  });
})(window.Quete);
