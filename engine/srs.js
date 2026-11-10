/* ============================================================
   srs.js — répétition espacée (boîtes de Leitner)
   Une carte = un verbe × un temps × une personne.
   ============================================================ */
(function (Q) {
  "use strict";

  var JOUR = 86400000;
  var INTERVALLES = [0, 1, 3, 7, 21]; /* en jours, par boîte 0 → 4 */

  function cle(verbe, temps, personne) {
    return verbe + "|" + temps + "|" + personne;
  }

  function carte(k) {
    if (!Q.etat.srs[k]) Q.etat.srs[k] = { boite: 0, du: 0, vus: 0, reussites: 0, echecs: 0 };
    return Q.etat.srs[k];
  }

  Q.srs = {
    cle: cle,

    enregistrer: function (verbe, temps, personne, reussi) {
      var k = cle(verbe, temps, personne);
      var c = carte(k);
      c.vus += 1;
      if (reussi) {
        c.reussites += 1;
        c.boite = Math.min(4, c.boite + 1);
        c.du = Date.now() + INTERVALLES[c.boite] * JOUR;
      } else {
        c.echecs += 1;
        c.boite = Math.max(0, c.boite - 1);
        c.du = Date.now() + JOUR * 0.5;
      }
      return c;
    },

    dues: function (limite, tempsFiltre) {
      var maintenant = Date.now();
      var liste = Object.keys(Q.etat.srs)
        .map(function (k) {
          return { cle: k, carte: Q.etat.srs[k] };
        })
        .filter(function (x) {
          if (x.carte.du > maintenant) return false;
          if (!tempsFiltre) return true;
          return x.cle.split("|")[1] === tempsFiltre;
        })
        .sort(function (a, b) { return a.carte.du - b.carte.du; });
      return limite ? liste.slice(0, limite) : liste;
    },

    stats: function () {
      var cles = Object.keys(Q.etat.srs);
      var solides = cles.filter(function (k) { return Q.etat.srs[k].boite >= 3; }).length;
      var aRevoir = cles.filter(function (k) { return Q.etat.srs[k].du <= Date.now(); }).length;
      return { total: cles.length, solides: solides, aRevoir: aRevoir };
    },

    /* Combien de cartes sont solides pour un temps donné (indicateur de maîtrise). */
    maitrise: function (temps) {
      var cles = Object.keys(Q.etat.srs).filter(function (k) { return k.split("|")[1] === temps; });
      if (!cles.length) return 0;
      var somme = cles.reduce(function (t, k) { return t + Q.etat.srs[k].boite; }, 0);
      return somme / (cles.length * 4);
    }
  };
})(window.Quete);
