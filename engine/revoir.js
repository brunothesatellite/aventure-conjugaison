/* ============================================================
   revoir.js — exercices ratés, gardés en mémoire pour le carnet
   Une entrée = une phrase précise, avec sa dernière date et le
   nombre de fois où elle a été manquée.
   ============================================================ */
(function (Q) {
  "use strict";

  var MAX = 40;

  function entrees() {
    return Q.etat.aRevoir || (Q.etat.aRevoir = []);
  }

  /* Liste prête à afficher : entrée + phrase complète, la plus
     récemment ratée en premier. */
  Q.revoir = {
    liste: function (limite) {
      var enrichies = entrees().map(function (e) {
        return { entree: e, phrase: Q.phraseParId(e.id) };
      }).filter(function (x) {
        return !!x.phrase;
      }).sort(function (a, b) {
        return (b.entree.derniere || 0) - (a.entree.derniere || 0);
      });
      return limite ? enrichies.slice(0, limite) : enrichies;
    },

    /* Migration : les sauvegardes d'avant cette liste gardent les
       échecs dans les cartes de répétition espacée. On en tire les
       phrases encore fragiles pour ne pas repartir de zéro. */
    depuisSrs: function (limite) {
      var out = [];
      var phrases = Q.toutesLesPhrases();
      Object.keys(Q.etat.srs || {}).forEach(function (k) {
        var c = Q.etat.srs[k];
        if (!c || !c.echecs || (c.boite || 0) > 1) return;
        var m = k.split("|");
        var p = phrases.filter(function (x) {
          return x.verbe === m[0] && x.temps === m[1] && x.personne === m[2];
        })[0];
        if (!p) return;
        out.push({
          id: p.id,
          verbe: p.verbe,
          temps: p.temps,
          personne: p.personne,
          fois: c.echecs,
          derniere: Math.min(Date.now(), (c.du || Date.now()) - 43200000)
        });
      });
      out.sort(function (a, b) { return b.derniere - a.derniere; });
      return out.slice(0, limite || MAX);
    },

    /* Appelé quand un exercice est définitivement raté. */
    enregistrer: function (question) {
      if (!question || !question.phraseId) return null;
      var liste = entrees();
      var e = null;
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === question.phraseId) { e = liste[i]; break; }
      }
      if (!e) {
        e = {
          id: question.phraseId,
          verbe: question.verbe,
          temps: question.temps,
          personne: question.personne,
          fois: 0,
          derniere: 0
        };
        liste.push(e);
      }
      e.fois = (e.fois || 0) + 1;
      e.derniere = Date.now();
      if (liste.length > MAX) {
        liste.sort(function (a, b) { return (b.derniere || 0) - (a.derniere || 0); });
        liste.length = MAX;
      }
      return e;
    },

    /* Une réussite du premier coup montre que c'est revu : on
       retire la phrase de la liste. */
    reussi: function (question) {
      if (!question || !question.phraseId) return false;
      var liste = entrees();
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === question.phraseId) {
          liste.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  };
})(window.Quete);
