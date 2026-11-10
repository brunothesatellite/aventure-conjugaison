/* ============================================================
   state.js — état du jeu, or, progression, rangs, migration
   ============================================================ */
(function (Q) {
  "use strict";

  var VERSION = 1;

  function vierge() {
    return {
      version: VERSION,
      creeLe: Date.now(),
      profil: null,
      or: 0,
      orGagne: 0,
      aiguilles: [],
      progression: {},
      srs: {},
      badges: [],
      familiers: [],
      cosmetiques: [],
      recompenses: [],
      reglages: { son: true, voix: true, animations: true, taille: "normal" },
      stats: { questions: 0, premierCoup: 0, bonnes: 0, tempsJeu: 0, erreurs: {}, jours: [] },
      serie: { actuelle: 0, record: 0 },
      journal: [],
      pin: null,
      quest: null,
      compteurs: { quetes: 0, gardiens: 0, indices: 0 }
    };
  }

  Q.etat = vierge();

  function fusionner(base, sauve) {
    /* Fusion douce : les nouvelles clés du modèle sont ajoutées. */
    Object.keys(sauve || {}).forEach(function (k) {
      var v = sauve[k];
      if (v && typeof v === "object" && !Array.isArray(v) && base[k] && typeof base[k] === "object" && !Array.isArray(base[k])) {
        base[k] = fusionner(base[k], v);
      } else {
        base[k] = v;
      }
    });
    return base;
  }

  var jeu = (Q.jeu = {
    nouveau: function (nom, avatar) {
      Q.etat = vierge();
      Q.etat.profil = {
        nom: String(nom || "").trim().slice(0, 18) || "Moussaillon",
        avatar: avatar || "chevalier",
        creeLe: Date.now()
      };
      jeu.sauver();
      return Q.etat;
    },

    charger: function () {
      var sauve = Q.storage.lire();
      if (!sauve) {
        Q.etat = vierge();
        return Q.etat;
      }
      var base = vierge();
      Q.etat = fusionner(base, sauve);
      /* Migrations futures : if (Q.etat.version < 2) { ... } */
      Q.etat.version = VERSION;
      return Q.etat;
    },

    sauver: function () {
      return Q.storage.ecrire(Q.etat);
    },

    reinitialiser: function () {
      Q.etat = vierge();
      Q.storage.effacer();
    },

    aProfil: function () {
      return !!(Q.etat && Q.etat.profil && Q.etat.profil.nom);
    },

    ajouterOr: function (n) {
      n = Math.max(0, Math.round(n || 0));
      if (!n) return 0;
      Q.etat.or += n;
      Q.etat.orGagne += n;
      jeu.sauver();
      return n;
    },

    depenserOr: function (n) {
      n = Math.max(0, Math.round(n || 0));
      if (Q.etat.or < n) return false;
      Q.etat.or -= n;
      jeu.sauver();
      return true;
    },

    rang: function () {
      var rangs = (Q.curriculum().rangs || []).slice().sort(function (a, b) { return a.seuil - b.seuil; });
      var courant = rangs[0];
      var suivant = null;
      for (var i = 0; i < rangs.length; i++) {
        if (Q.etat.orGagne >= rangs[i].seuil) {
          courant = rangs[i];
          suivant = rangs[i + 1] || null;
        }
      }
      return { courant: courant, suivant: suivant, progression: suivant ? Math.min(1, (Q.etat.orGagne - courant.seuil) / (suivant.seuil - courant.seuil)) : 1 };
    },

    niveauProgression: function (id) {
      if (!Q.etat.progression[id]) Q.etat.progression[id] = { etoiles: 0, meilleur: 0, quetes: 0 };
      return Q.etat.progression[id];
    },

    etoilesIle: function (aventureId) {
      var a = Q.aventure(aventureId);
      if (!a) return 0;
      return a.niveaux.reduce(function (total, n) {
        return total + (Q.etat.progression[n.id] ? Q.etat.progression[n.id].etoiles : 0);
      }, 0);
    },

    ileConquise: function (aventureId) {
      var a = Q.aventure(aventureId);
      if (!a) return false;
      return a.niveaux.every(function (n) {
        return (Q.etat.progression[n.id] || {}).etoiles >= 1;
      });
    },

    ileDebloquee: function (aventureId) {
      var ordre = Q.curriculum().ordre;
      var pos = ordre.indexOf(aventureId);
      if (pos <= 0) return pos === 0;
      return jeu.etoilesIle(ordre[pos - 1]) >= Q.curriculum().prerequisIle;
    },

    niveauDebloque: function (aventureId, niveau) {
      var a = Q.aventure(aventureId);
      if (!a) return false;
      var index = a.niveaux.indexOf(niveau);
      if (index <= 0) return true;
      var precedent = a.niveaux[index - 1];
      return (Q.etat.progression[precedent.id] || {}).etoiles >= 1;
    },

    gardienDebloque: function (aventureId) {
      var a = Q.aventure(aventureId);
      if (!a) return false;
      return a.niveaux.every(function (n) {
        return (Q.etat.progression[n.id] || {}).etoiles >= 1;
      });
    },

    enregistrerQuete: function (aventureId, niveauId, resultat) {
      var p = jeu.niveauProgression(niveauId);
      p.quetes += 1;
      p.meilleur = Math.max(p.meilleur, resultat.premierCoup);
      p.etoiles = Math.max(p.etoiles, resultat.etoiles);
      Q.etat.compteurs.quetes += 1;
      Q.etat.stats.jours = Q.etat.stats.jours || [];
      var jour = new Date().toISOString().slice(0, 10);
      if (Q.etat.stats.jours.indexOf(jour) === -1) Q.etat.stats.jours.push(jour);
      if (resultat.gardien) Q.etat.compteurs.gardiens += 1;
      Q.etat.journal.unshift({
        date: Date.now(),
        aventure: aventureId,
        niveau: niveauId,
        etoiles: resultat.etoiles,
        premierCoup: resultat.premierCoup,
        total: resultat.total
      });
      Q.etat.journal = Q.etat.journal.slice(0, 40);
      jeu.sauver();
    },

    ajouterAiguille: function (temps) {
      if (Q.etat.aiguilles.indexOf(temps) === -1) {
        Q.etat.aiguilles.push(temps);
        jeu.sauver();
        return true;
      }
      return false;
    }
  });

  /* Accesseur court utilisé par les écrans */
  Q.etatVierge = vierge;
})(window.Quete);
