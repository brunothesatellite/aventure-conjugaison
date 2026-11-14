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
      recompensesAchetees: [],
      reglages: { son: true, voix: true, animations: true, taille: "normal", voixNom: null, voixVitesse: 0.92 },
      stats: { questions: 0, premierCoup: 0, bonnes: 0, tempsJeu: 0, erreurs: {}, jours: [] },
      aRevoir: [],
      aRevoirInit: true,
      serie: { actuelle: 0, record: 0 },
      journal: [],
      pin: null,
      quest: null,
      gardiens: {},
      compteurs: { quetes: 0, gardiens: 0, indices: 0 }
    };
  }

  Q.etat = vierge();

  /* Magasin de profils (plusieurs joueurs par appareil). */
  Q.profils = { version: 2, actif: null, profils: {} };

  function nouvelId() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function totalEtoiles(etat) {
    var total = 0;
    var ordre = (Q.curriculum && Q.curriculum().ordre) || [];
    ordre.forEach(function (id) {
      var a = Q.aventure(id);
      if (!a) return;
      (a.niveaux || []).forEach(function (n) {
        total += ((etat.progression || {})[n.id] || {}).etoiles || 0;
      });
    });
    return total;
  }

  function etatDepuisSauve(sauve) {
    var etat = fusionner(vierge(), sauve || {});
    assainir(etat);
    /* Migration : les récompenses achetées avant l'historique
       gardent leur date dans « achetee ». */
    if (!etat.recompensesAchetees.length) {
      etat.recompensesAchetees = (etat.recompenses || [])
        .filter(function (r) { return r && r.achetee; })
        .map(function (r) {
          return { texte: r.texte, prix: r.prix, icone: r.icone || null, date: r.achetee };
        });
    }
    /* Migration : la liste des exercices ratés n'existait pas avant.
       On la reconstitue une fois à partir des cartes déjà en échec. */
    if (!(sauve && sauve.aRevoirInit) && Q.revoir) {
      Q.revoir.amorcer(etat);
    }
    /* Migration : le compteur de victoires par Gardien n'existait pas.
       On le reconstitue avec le journal, et au moins 1 si l'aiguille
       de l'île a déjà été gagnée. */
    if (!(sauve && objet(sauve.gardiens))) {
      var victoires = {};
      (etat.journal || []).forEach(function (j) {
        if (j && j.aventure && !j.niveau) {
          victoires[j.aventure] = (victoires[j.aventure] || 0) + 1;
        }
      });
      (Q.ordreAventures ? Q.ordreAventures() : []).forEach(function (a) {
        if (etat.aiguilles.indexOf(a.temps) !== -1) {
          victoires[a.id] = Math.max(victoires[a.id] || 0, 1);
        }
      });
      etat.gardiens = victoires;
    }
    etat.version = VERSION;
    return etat;
  }

  function objet(v) {
    return !!v && typeof v === "object" && !Array.isArray(v);
  }

  /* Un fichier importé peut être incomplet ou abîmé : on remet des
     types sûrs pour que l'interface ne casse pas. */
  function assainir(etat) {
    if (!objet(etat.profil)) etat.profil = null;
    if (!objet(etat.progression)) etat.progression = {};
    if (!objet(etat.srs)) etat.srs = {};
    if (!objet(etat.reglages)) etat.reglages = {};
    etat.reglages = Object.assign(
      { son: true, voix: true, animations: true, taille: "normal", voixNom: null, voixVitesse: 0.92 },
      etat.reglages
    );
    if (!objet(etat.stats)) etat.stats = {};
    etat.stats = Object.assign(
      { questions: 0, premierCoup: 0, bonnes: 0, tempsJeu: 0, erreurs: {}, jours: [] },
      etat.stats
    );
    if (!objet(etat.stats.erreurs)) etat.stats.erreurs = {};
    if (!Array.isArray(etat.stats.jours)) etat.stats.jours = [];
    if (!objet(etat.serie)) etat.serie = { actuelle: 0, record: 0 };
    if (!objet(etat.compteurs)) etat.compteurs = { quetes: 0, gardiens: 0, indices: 0 };
    if (!objet(etat.gardiens)) etat.gardiens = {};
    Object.keys(etat.gardiens).forEach(function (k) {
      etat.gardiens[k] = Math.max(0, Math.round(Number(etat.gardiens[k]) || 0));
    });
    if (!Array.isArray(etat.aRevoir)) etat.aRevoir = [];
    etat.aRevoir = etat.aRevoir.filter(function (e) {
      return objet(e) && typeof e.id === "string" && e.id;
    });
    ["aiguilles", "badges", "familiers", "cosmetiques", "recompenses", "recompensesAchetees", "journal"].forEach(function (k) {
      if (!Array.isArray(etat[k])) etat[k] = [];
    });
    etat.or = Number(etat.or) || 0;
    etat.orGagne = Number(etat.orGagne) || 0;
    etat.serie.actuelle = Number(etat.serie.actuelle) || 0;
    etat.serie.record = Number(etat.serie.record) || 0;
    etat.compteurs.quetes = Number(etat.compteurs.quetes) || 0;
    etat.compteurs.gardiens = Number(etat.compteurs.gardiens) || 0;
    etat.compteurs.indices = Number(etat.compteurs.indices) || 0;
    return etat;
  }

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
      /* On sauvegarde le profil courant avant d'en créer un autre. */
      if (Q.etat && Q.etat.profil) jeu.sauver();
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();
      var etat = vierge();
      etat.profil = {
        nom: String(nom || "").trim().slice(0, 18) || "Moussaillon",
        avatar: avatar || "chevalier",
        creeLe: Date.now()
      };
      var id = nouvelId();
      Q.profils.profils[id] = {
        id: id,
        creeLe: etat.profil.creeLe,
        derniere: Date.now(),
        etat: etat
      };
      Q.profils.actif = id;
      Q.etat = etat;
      jeu.sauver();
      return Q.etat;
    },

    charger: function () {
      Q.profils = Q.storage.lireStore();
      if (!Q.profils.profils) Q.profils.profils = {};
      if (Q.profils.actif && Q.profils.profils[Q.profils.actif]) {
        Q.etat = etatDepuisSauve(Q.profils.profils[Q.profils.actif].etat);
      } else {
        Q.etat = vierge();
      }
      return Q.etat;
    },

    sauver: function () {
      if (!Q.etat || !Q.etat.profil) return false;
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();

      /* Si une autre fenêtre a écrit, on récupère au moins les profils
         qu'on ne connaissait pas encore (pas de perte des autres joueurs). */
      try {
        var dernier = Q.storage.lireStore();
        if (dernier && dernier.revision !== Q.profils.revision) {
          Object.keys(dernier.profils || {}).forEach(function (pid) {
            if (!Q.profils.profils[pid]) Q.profils.profils[pid] = dernier.profils[pid];
          });
          Q.profils.revision = dernier.revision || Q.profils.revision || 0;
        }
      } catch (e) {
        /* on garde la version en mémoire */
      }

      var id = Q.profils.actif;
      if (!id || !Q.profils.profils[id]) {
        id = nouvelId();
        Q.profils.actif = id;
      }
      var fiche = Q.profils.profils[id] || { id: id, creeLe: Date.now() };
      fiche.id = id;
      fiche.creeLe = fiche.creeLe || Q.etat.profil.creeLe || Date.now();
      fiche.derniere = Date.now();
      fiche.etat = Q.etat;
      Q.profils.profils[id] = fiche;
      Q.profils.version = 2;

      var ok = Q.storage.ecrireStore(Q.profils);
      if (!ok) {
        Q.sauvegardeKO = true;
        if (!Q.sauvegardeAvertie && typeof Q.ui !== "undefined" && Q.ui.toast) {
          Q.sauvegardeAvertie = true;
          Q.ui.toast("Sauvegarde impossible : exporte ta progression depuis l'espace parent.", "ko");
        }
      } else {
        Q.sauvegardeKO = false;
      }
      return ok;
    },

    activerProfil: function (id) {
      if (!id || !Q.profils.profils || !Q.profils.profils[id]) return false;
      if (Q.profils.actif === id && Q.etat.profil) return true;
      if (Q.etat && Q.etat.profil) jeu.sauver();
      var fiche = Q.profils.profils[id];
      Q.profils.actif = id;
      Q.etat = etatDepuisSauve(fiche.etat);
      fiche.derniere = Date.now();
      fiche.etat = Q.etat;
      Q.storage.ecrireStore(Q.profils);
      return true;
    },

    listerProfils: function () {
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();
      return Object.keys(Q.profils.profils || {}).map(function (id) {
        var fiche = Q.profils.profils[id] || {};
        var e = fiche.etat || {};
        return {
          id: id,
          nom: (e.profil && e.profil.nom) || "Moussaillon",
          avatar: (e.profil && e.profil.avatar) || "chevalier",
          creeLe: fiche.creeLe,
          derniere: fiche.derniere || fiche.creeLe || 0,
          etoiles: totalEtoiles(e),
          or: e.or || 0,
          aiguilles: (e.aiguilles || []).length,
          badges: (e.badges || []).length
        };
      }).sort(function (a, b) { return (b.derniere || 0) - (a.derniere || 0); });
    },

    listerCorbeille: function () {
      return Q.storage.lireCorbeille().map(function (f) {
        var e = f.etat || {};
        return {
          id: f.id,
          nom: (e.profil && e.profil.nom) || "Moussaillon",
          avatar: (e.profil && e.profil.avatar) || "chevalier",
          supprimeLe: f.supprimeLe || 0
        };
      });
    },

    restaurerProfilCorbeille: function (id) {
      var fiche = Q.storage.lireCorbeille().filter(function (f) { return f.id === id; })[0];
      if (!fiche) return null;
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();
      Q.storage.retirerCorbeille(id);
      var nouvel = nouvelId();
      fiche.id = nouvel;
      fiche.derniere = Date.now();
      delete fiche.supprimeLe;
      Q.profils.profils[nouvel] = fiche;
      Q.profils.actif = nouvel;
      Q.etat = etatDepuisSauve(fiche.etat);
      jeu.sauver();
      return nouvel;
    },

    supprimerProfil: function (id) {
      if (!id || !Q.profils.profils || !Q.profils.profils[id]) return Q.profils.actif;
      var fiche = Q.profils.profils[id];
      Q.storage.archiverProfil({
        id: fiche.id,
        creeLe: fiche.creeLe,
        derniere: fiche.derniere,
        etat: fiche.etat,
        supprimeLe: Date.now()
      });
      delete Q.profils.profils[id];
      if (Q.profils.actif === id) {
        var ids = Object.keys(Q.profils.profils);
        ids.sort(function (a, b) {
          return ((Q.profils.profils[b].derniere || 0) - (Q.profils.profils[a].derniere || 0));
        });
        Q.profils.actif = ids[0] || null;
        Q.etat = Q.profils.actif
          ? etatDepuisSauve(Q.profils.profils[Q.profils.actif].etat)
          : vierge();
      }
      Q.storage.ecrireStore(Q.profils);
      return Q.profils.actif;
    },

    reinitialiser: function () {
      var id = Q.profils.actif;
      if (id) return jeu.supprimerProfil(id);
      Q.etat = vierge();
      return null;
    },

    importerEtat: function (donnees) {
      if (!donnees || !donnees.profil || !donnees.profil.nom) return null;
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();
      var etat = etatDepuisSauve(donnees);
      var id = nouvelId();
      Q.profils.profils[id] = {
        id: id,
        creeLe: etat.profil.creeLe || Date.now(),
        derniere: Date.now(),
        etat: etat
      };
      Q.profils.actif = id;
      Q.etat = etat;
      jeu.sauver();
      return id;
    },

    importerStore: function (store) {
      if (!store || !store.profils || typeof store.profils !== "object") return null;
      if (!Q.profils || !Q.profils.profils) Q.profils = Q.storage.lireStore();
      var ids = Object.keys(store.profils);
      if (!ids.length) return null;
      var correspondance = {};
      var dernierActif = null;
      ids.forEach(function (ancienId) {
        var fiche = store.profils[ancienId];
        if (!fiche || !fiche.etat || !fiche.etat.profil) return;
        var nouvel = nouvelId();
        correspondance[ancienId] = nouvel;
        Q.profils.profils[nouvel] = {
          id: nouvel,
          creeLe: fiche.creeLe || fiche.etat.profil.creeLe || Date.now(),
          derniere: fiche.derniere || Date.now(),
          etat: etatDepuisSauve(fiche.etat)
        };
        if (store.actif === ancienId) dernierActif = nouvel;
      });
      var cles = Object.keys(correspondance);
      if (!cles.length) return null;
      var actif = dernierActif || correspondance[cles[0]];
      Q.profils.actif = actif;
      Q.etat = etatDepuisSauve(Q.profils.profils[actif].etat);
      jeu.sauver();
      return actif;
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

    /* Une île est « commencée » quand l'enfant y a terminé au moins
       un niveau. Sert au défi mêlé : on ne mélange pas un temps
       seulement débloqué mais jamais travaillé. */
    ileCommencee: function (aventureId) {
      return jeu.etoilesIle(aventureId) >= 1;
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

    /* Nombre de fois où le Gardien de cette île a été vaincu. */
    victoiresGardien: function (aventureId) {
      return Math.max(0, Math.round(Number((Q.etat.gardiens || {})[aventureId]) || 0));
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
      if (resultat.gardien) {
        Q.etat.compteurs.gardiens += 1;
        Q.etat.gardiens[aventureId] = (Q.etat.gardiens[aventureId] || 0) + 1;
      }
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
