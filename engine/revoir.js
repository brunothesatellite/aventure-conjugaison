/* ============================================================
   revoir.js — exercices ratés, gardés en mémoire pour le carnet
   Une entrée = une phrase précise, avec sa dernière date, le
   nombre de fois où elle a été manquée et la date de la dernière
   réussite du premier coup (elle reste affichée, marquée « revu »).
   ============================================================ */
(function (Q) {
  "use strict";

  var MAX = 40;

  function entrees() {
    return Q.etat.aRevoir || (Q.etat.aRevoir = []);
  }

  /* Liste prête à afficher : entrée + phrase complète. Les
     exercices encore à revoir passent avant ceux déjà revus ;
     à statut égal, le plus récent d'abord. */
  Q.revoir = {
    liste: function (limite) {
      var enrichies = entrees().map(function (e) {
        return { entree: e, phrase: Q.phraseParId(e.id) };
      }).filter(function (x) {
        return !!x.phrase;
      }).sort(function (a, b) {
        var revuA = a.entree.reussiLe ? 1 : 0;
        var revuB = b.entree.reussiLe ? 1 : 0;
        if (revuA !== revuB) return revuA - revuB;
        return (b.entree.derniere || 0) - (a.entree.derniere || 0);
      });
      return limite ? enrichies.slice(0, limite) : enrichies;
    },

    /* Migration : les sauvegardes d'avant cette liste gardent les
       échecs dans les cartes de répétition espacée. On en tire les
       conjugaisons déjà manquées pour ne pas repartir de zéro.
       « srs » est passé explicitement : au chargement, Q.etat n'est
       pas encore l'état en cours de reconstruction. */
    depuisSrs: function (srs, limite) {
      var out = [];
      var cartes = srs || Q.etat.srs || {};
      var phrases = Q.toutesLesPhrases();
      Object.keys(cartes).forEach(function (k) {
        var c = cartes[k];
        if (!c || !c.echecs) return;
        var m = k.split("|");
        var p = phrases.filter(function (x) {
          return x.verbe === m[0] && x.temps === m[1] && x.personne === m[2];
        })[0];
        if (!p) return;
        /* La date exacte du raté n'est pas connue : on ne l'affiche
           que si la carte est encore en boîte 0 (échec récent). */
        var quand = (c.du || 0) - 43200000;
        out.push({
          id: p.id,
          verbe: p.verbe,
          temps: p.temps,
          personne: p.personne,
          fois: c.echecs,
          derniere: quand > 0 && quand <= Date.now() ? quand : 0,
          reussiLe: null
        });
      });
      out.sort(function (a, b) { return b.derniere - a.derniere; });
      return out.slice(0, limite || MAX);
    },

    /* Une seule migration par profil : l'appelant vérifie le repère
       « aRevoirInit » de la sauvegarde d'origine. */
    amorcer: function (etat) {
      if (!etat) return false;
      var liste = etat.aRevoir || (etat.aRevoir = []);
      var connus = {};
      liste.forEach(function (e) { connus[e.id] = true; });
      Q.revoir.depuisSrs(etat.srs, MAX).forEach(function (e) {
        if (!connus[e.id]) liste.push(e);
      });
      liste.sort(function (a, b) { return (b.derniere || 0) - (a.derniere || 0); });
      if (liste.length > MAX) liste.length = MAX;
      etat.aRevoirInit = true;
      return true;
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
          derniere: 0,
          reussiLe: null
        };
        liste.push(e);
      }
      e.fois = (e.fois || 0) + 1;
      e.derniere = Date.now();
      e.reussiLe = null;
      if (liste.length > MAX) {
        liste.sort(function (a, b) { return (b.derniere || 0) - (a.derniere || 0); });
        liste.length = MAX;
      }
      return e;
    },

    /* Réussie du premier coup : la phrase reste dans le carnet,
       marquée comme revue, pour que le parent garde la trace. */
    reussi: function (question) {
      if (!question || !question.phraseId) return false;
      var liste = entrees();
      for (var i = 0; i < liste.length; i++) {
        if (liste[i].id === question.phraseId) {
          liste[i].reussiLe = Date.now();
          return true;
        }
      }
      return false;
    }
  };
})(window.Quete);
