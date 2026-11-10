/* ============================================================
   storage.js — sauvegarde locale versionnée, multi-profils.

   Clé v2 : { version: 2, revision, actif: "p...", profils: { id: fiche } }
   Une fiche : { id, creeLe, derniere, etat }
   L'ancienne clé v1 (un seul profil) est migrée automatiquement
   et conservée comme secours.

   Robustesse :
   - un magasin illisible est recopié sous une clé « corrompu »
     avant de repartir de zéro ;
   - une corbeille garde les profils supprimés ;
   - l'export peut contenir tous les profils.
   Aucune donnée ne quitte l'appareil.
   ============================================================ */
(function (Q) {
  "use strict";

  var CLE = "quete-verbes:v1";              /* ancienne sauvegarde */
  var CLE_V2 = "quete-verbes:v2";           /* profils multiples */
  var CLE_CORBEILLE = "quete-verbes:corbeille";

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

  function storeVide() {
    return { version: 2, revision: 0, actif: null, profils: {} };
  }

  /* Copie une valeur illisible avant de l'écraser. */
  function mettreDeCote(cle, brut) {
    try {
      window.localStorage.setItem(cle + ":corrompu:" + Date.now(), String(brut).slice(0, 500000));
      Q.storage.corruption = true;
    } catch (e) {
      /* même la copie a échoué : on ne peut rien faire de plus */
    }
  }

  function lireBrut(cle) {
    if (!dispo) return null;
    var brut = null;
    try {
      brut = window.localStorage.getItem(cle);
      return brut ? JSON.parse(brut) : null;
    } catch (e) {
      console.warn("Sauvegarde illisible (" + cle + "). Une copie est conservée.", e);
      if (brut) mettreDeCote(cle, brut);
      return null;
    }
  }

  function ecrireBrut(cle, objet) {
    if (!dispo) return false;
    try {
      window.localStorage.setItem(cle, JSON.stringify(objet));
      return true;
    } catch (e) {
      console.warn("Impossible d'enregistrer la partie.", e);
      return false;
    }
  }

  Q.storage = {
    disponible: dispo,
    corruption: false,
    storeVide: storeVide,

    /* Charge le magasin de profils, en migrant l'ancienne sauvegarde. */
    lireStore: function () {
      var v2 = lireBrut(CLE_V2);
      if (v2 && typeof v2 === "object" && v2.profils && typeof v2.profils === "object") {
        if (typeof v2.revision !== "number") v2.revision = 0;
        if (!v2.actif) {
          var ids = Object.keys(v2.profils);
          if (ids.length === 1) v2.actif = ids[0];
        }
        return v2;
      }
      if (v2 !== null) mettreDeCote(CLE_V2, JSON.stringify(v2));

      var ancien = lireBrut(CLE);
      if (ancien && ancien.profil && ancien.profil.nom) {
        var id = "p" + String(ancien.profil.creeLe || Date.now()).slice(-9);
        var store = storeVide();
        store.actif = id;
        store.profils[id] = {
          id: id,
          creeLe: ancien.profil.creeLe || Date.now(),
          derniere: Date.now(),
          etat: ancien
        };
        ecrireBrut(CLE_V2, store);
        return store;
      }

      return storeVide();
    },

    ecrireStore: function (store) {
      if (!store || typeof store !== "object") return false;
      store.version = 2;
      if (!store.profils || typeof store.profils !== "object") store.profils = {};
      store.revision = (store.revision || 0) + 1;
      var ok = ecrireBrut(CLE_V2, store);
      Q.sauvegardeKO = !ok;
      return ok;
    },

    /* Corbeille : profils supprimés, restaurables. */
    archiverProfil: function (fiche) {
      var corbeille = lireBrut(CLE_CORBEILLE) || { profils: [] };
      if (!Array.isArray(corbeille.profils)) corbeille.profils = [];
      corbeille.profils.unshift(fiche);
      corbeille.profils = corbeille.profils.slice(0, 10);
      return ecrireBrut(CLE_CORBEILLE, corbeille);
    },

    lireCorbeille: function () {
      var c = lireBrut(CLE_CORBEILLE) || { profils: [] };
      return Array.isArray(c.profils) ? c.profils : [];
    },

    retirerCorbeille: function (id) {
      var c = lireBrut(CLE_CORBEILLE) || { profils: [] };
      c.profils = (c.profils || []).filter(function (p) { return p.id !== id; });
      return ecrireBrut(CLE_CORBEILLE, c);
    },

    /* L'ancienne API « lire/ecrire/effacer » a été retirée :
       elle permettait d'écraser la sauvegarde sans passer par les
       profils. La migration v1 reste lue ci-dessus. */

    exporter: function (objet) {
      return JSON.stringify({
        application: "quete-des-verbes",
        exporteLe: new Date().toISOString(),
        donnees: objet
      }, null, 2);
    },

    /* Export de tous les profils (l'import sait le reconnaître). */
    exporterStore: function (store) {
      return JSON.stringify({
        application: "quete-des-verbes",
        exporteLe: new Date().toISOString(),
        donnees: store
      }, null, 2);
    },

    /* Renvoie l'état importé, ou un magasin de profils, ou null. */
    importer: function (texte) {
      try {
        var obj = JSON.parse(texte);
        if (obj && obj.donnees) return obj.donnees;
        if (obj && obj.profils) return obj;
        if (obj && obj.profil) return obj;
        return null;
      } catch (e) {
        return null;
      }
    }
  };
})(window.Quete);
