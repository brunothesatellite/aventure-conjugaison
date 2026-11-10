/* ============================================================
   rewards.js — badges, boutique, familiers
   ============================================================ */
(function (Q) {
  "use strict";

  var BADGES = [
    {
      id: "moussaillon-present", nom: "Moussaillon du Présent", desc: "Terminer le premier niveau de l'Île du Présent",
      icone: "ancre", test: function (s) { return (s.progression["present-1"] || {}).etoiles >= 1; }
    },
    {
      id: "sans-faute", nom: "Sans faute", desc: "Obtenir 3 étoiles dans un niveau",
      icone: "trophee", test: function (s) {
        return Object.keys(s.progression).some(function (k) { return s.progression[k].etoiles >= 3; });
      }
    },
    {
      id: "infaillible", nom: "L'Infaillible", desc: "Réussir 10 bonnes réponses d'affilée",
      icone: "medaille", test: function (s) { return s.serie.record >= 10; }
    },
    {
      id: "gros-magot", nom: "Gros Magot", desc: "Gagner 200 pièces d'or en tout",
      icone: "coffre", test: function (s) { return s.orGagne >= 200; }
    },
    {
      id: "memoire-de-fer", nom: "Mémoire de fer", desc: "Rendre solides 20 conjugaisons",
      icone: "bouclier", test: function () { return Q.srs.stats().solides >= 20; }
    },
    {
      id: "premier-aiguille", nom: "Première aiguille", desc: "Battre un premier Gardien",
      icone: "boussole", test: function (s) { return s.aiguilles.length >= 1; }
    },
    {
      id: "roi-du-present", nom: "Roi du Présent", desc: "Obtenir les 12 étoiles de l'Île du Présent",
      icone: "couronne", test: function () { return Q.jeu.etoilesIle("ile-present") >= 12; }
    },
    {
      id: "veilleur-du-passe", nom: "Veilleur du passé", desc: "Battre le Hibou des Siècles",
      icone: "sablier", test: function (s) { return s.aiguilles.indexOf("imparfait") !== -1; }
    },
    {
      id: "pilote-de-l-avenir", nom: "Pilote de l'avenir", desc: "Battre le Kraken Prophète",
      icone: "voilier", test: function (s) { return s.aiguilles.indexOf("futur") !== -1; }
    },
    {
      id: "conteur-d-exploits", nom: "Conteur d'exploits", desc: "Battre le Vieux Loup de Mer",
      icone: "plume", test: function (s) { return s.aiguilles.indexOf("passe_compose") !== -1; }
    },
    {
      id: "explorateur", nom: "Explorateur", desc: "Conquérir deux îles entières",
      icone: "carte", test: function () {
        return Q.curriculum().ordre.filter(function (id) { return Q.jeu.ileConquise(id); }).length >= 2;
      }
    },
    {
      id: "amiral", nom: "Amiral des Verbes", desc: "Réunir les quatre aiguilles de la Boussole",
      icone: "laurier", test: function (s) { return s.aiguilles.length >= 4; }
    }
  ];

  var CATALOGUE = {
    familiers: [
      { id: "perroquet", nom: "Perroquet", prix: 60, icone: "perroquet", desc: "Relit la phrase à voix haute quand tu hésites.", effet: "relire" },
      { id: "dragonneau", nom: "Dragonneau", prix: 120, icone: "dragonneau", desc: "Élimine un mauvais choix, une fois par quête.", effet: "eliminer" },
      { id: "cheval", nom: "Cheval", prix: 200, icone: "cheval", desc: "Te donne la règle, une fois par quête.", effet: "regle" }
    ],
    cosmetiques: [
      { id: "chapeau", nom: "Chapeau de capitaine", prix: 40, icone: "mousse", desc: "Pour avoir l'air d'un vrai chef de bord." },
      { id: "cache-oeil", nom: "Cache-œil", prix: 50, icone: "cache-oeil", desc: "Un look de vieux loup de mer." },
      { id: "joyau", nom: "Joyau du trésor", prix: 80, icone: "joyau", desc: "Brille dans ton carnet de bord." }
    ]
  };

  Q.badges = {
    liste: BADGES,

    obtenu: function (id) {
      return Q.etat.badges.indexOf(id) !== -1;
    },

    /* Renvoie les badges nouvellement obtenus. */
    verifier: function () {
      var nouveaux = [];
      BADGES.forEach(function (b) {
        if (Q.etat.badges.indexOf(b.id) !== -1) return;
        var ok = false;
        try { ok = !!b.test(Q.etat); } catch (e) { ok = false; }
        if (ok) {
          Q.etat.badges.push(b.id);
          nouveaux.push(b);
        }
      });
      if (nouveaux.length) Q.jeu.sauver();
      return nouveaux;
    },

    parId: function (id) {
      return BADGES.filter(function (b) { return b.id === id; })[0] || null;
    }
  };

  Q.catalogue = CATALOGUE;

  Q.achat = {
    possede: function (type, id) {
      var liste = type === "familier" ? Q.etat.familiers : Q.etat.cosmetiques;
      return liste.indexOf(id) !== -1;
    },

    prix: function (type, id) {
      var liste = type === "familier" ? CATALOGUE.familiers : CATALOGUE.cosmetiques;
      var item = liste.filter(function (x) { return x.id === id; })[0];
      return item ? item.prix : 0;
    },

    acheter: function (type, id) {
      if (Q.achat.possede(type, id)) return { ok: false, raison: "deja" };
      var prix = Q.achat.prix(type, id);
      if (!Q.jeu.depenserOr(prix)) return { ok: false, raison: "or" };
      if (type === "familier") Q.etat.familiers.push(id);
      else Q.etat.cosmetiques.push(id);
      Q.jeu.sauver();
      return { ok: true, prix: prix };
    },

    /* Achat d'une récompense réelle définie par les parents */
    acheterRecompense: function (index) {
      var r = Q.etat.recompenses[index];
      if (!r) return { ok: false, raison: "absente" };
      if (!Q.jeu.depenserOr(r.prix)) return { ok: false, raison: "or" };
      r.achetee = Date.now();
      Q.jeu.sauver();
      return { ok: true, recompense: r };
    },

    aFamille: function (effet) {
      return Q.etat.familiers.some(function (id) {
        var f = CATALOGUE.familiers.filter(function (x) { return x.id === id; })[0];
        return f && f.effet === effet;
      });
    }
  };
})(window.Quete);
