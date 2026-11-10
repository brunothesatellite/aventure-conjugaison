/* ============================================================
   storage.js — sauvegarde locale versionnée
   Aucune donnée ne quitte l'appareil.
   ============================================================ */
(function (Q) {
  "use strict";

  var CLE = "quete-verbes:v1";
  var dispo = (function () {
    try {
      var k = "__test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  })();

  Q.storage = {
    disponible: dispo,

    lire: function () {
      if (!dispo) return null;
      try {
        var brut = window.localStorage.getItem(CLE);
        return brut ? JSON.parse(brut) : null;
      } catch (e) {
        console.warn("Sauvegarde illisible, on repart de zéro.", e);
        return null;
      }
    },

    ecrire: function (objet) {
      if (!dispo) return false;
      try {
        window.localStorage.setItem(CLE, JSON.stringify(objet));
        return true;
      } catch (e) {
        console.warn("Impossible d'enregistrer la partie.", e);
        return false;
      }
    },

    effacer: function () {
      if (dispo) window.localStorage.removeItem(CLE);
    },

    exporter: function (objet) {
      return JSON.stringify({ application: "quete-des-verbes", exporteLe: new Date().toISOString(), donnees: objet }, null, 2);
    },

    /* Renvoie l'objet de données ou null si le fichier est invalide. */
    importer: function (texte) {
      try {
        var obj = JSON.parse(texte);
        if (obj && obj.donnees && obj.donnees.version) return obj.donnees;
        if (obj && obj.version) return obj;
        return null;
      } catch (e) {
        return null;
      }
    }
  };
})(window.Quete);
