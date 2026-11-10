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
      { id: "perroquet", nom: "Perroquet", prix: 60, icone: "perroquet", desc: "Donne un coup de pouce sur la bonne terminaison, une fois par quête.", effet: "relire" },
      { id: "dragonneau", nom: "Dragonneau", prix: 120, icone: "dragonneau", desc: "Élimine un mauvais choix, une fois par quête.", effet: "eliminer" },
      { id: "cheval", nom: "Cheval", prix: 200, icone: "cheval", desc: "Te donne la règle, une fois par quête.", effet: "regle" }
    ],
    cosmetiques: [
      { id: "bandeau", nom: "Bandeau à tête de mort", prix: 30, icone: "picto:tete-mort", desc: "Le bandeau des vrais pirates." },
      { id: "chapeau", nom: "Chapeau de capitaine", prix: 40, icone: "mousse", desc: "Pour avoir l'air d'un vrai chef de bord." },
      { id: "tatouage-ancre", nom: "Tatouage d'ancre", prix: 45, icone: "ancre", desc: "Un tatouage de marin, sans piqûre !" },
      { id: "cache-oeil", nom: "Cache-œil", prix: 50, icone: "picto:cache-oeil", desc: "Un look de vieux loup de mer." },
      { id: "couronne", nom: "Couronne du roi", prix: 600, icone: "picto:couronne", desc: "Réservée aux vrais rois de l'Archipel." },
      { id: "etoile-mer", nom: "Étoile de mer porte-bonheur", prix: 65, icone: "picto:etoile-mer", desc: "Elle porte chance dans les tempêtes." },
      { id: "collier", nom: "Collier de coquillages", prix: 70, icone: "coquillage", desc: "Rapporte la plage partout avec toi." },
      { id: "joyau", nom: "Joyau du trésor", prix: 80, icone: "joyau", desc: "Brille dans ton carnet de bord." },
      { id: "epee", nom: "Épée de corsaire", prix: 90, icone: "epee", desc: "Pour les duels... ou pour la pose." },
      { id: "sabre", nom: "Sabre du roi des mers", prix: 1600, icone: "picto:epee", desc: "Une lame légendaire, rien que pour toi." },
      { id: "drapeau", nom: "Drapeau noir", prix: 120, icone: "pirate", desc: "Le pavillon des aventuriers." },
      { id: "bouclier", nom: "Bouclier du gardien", prix: 150, icone: "bouclier", desc: "Aucun mauvais sort ne passe." },
      { id: "laurier", nom: "Couronne de laurier", prix: 2000, icone: "picto:laurier", desc: "La récompense des héros de l'Archipel." },
      { id: "plume", nom: "Plume de capitaine", prix: 220, icone: "picto:plume", desc: "Pour signer les cartes au trésor." },
      { id: "tatouage-dragon", nom: "Tatouage de dragon", prix: 260, icone: "dragon", desc: "Un dragon sur le bras, rien que ça." },
      { id: "sorciere", nom: "Chapeau de sorcière", prix: 350, icone: "picto:sorciere", desc: "Pointu, sombre, un peu magique." },
      { id: "armure", nom: "Armure de chevalier", prix: 450, icone: "picto:chevalier", desc: "Brillante comme au premier tournoi." },
      { id: "kraken", nom: "Anneau du kraken", prix: 750, icone: "picto:kraken", desc: "Un anneau rapporté du fond des mers." },
      { id: "magicien", nom: "Costume de magicien", prix: 900, icone: "picto:magicienne", desc: "Pour faire apparaître les bonnes réponses." },
      { id: "boucle-or", nom: "Bourse de pièces d'or", prix: 1300, icone: "picto:or", desc: "Le trésor des capitaines riches." }
    ]
  };

  /* Icônes proposées aux parents pour personnaliser les récompenses.
     Toutes existent déjà dans assets/img/icons (thème du jeu). */
  var ICONES_RECOMPENSE = [
    { id: "sablier", nom: "Temps d'écran" },
    { id: "haut-parleur", nom: "Film / dessin animé" },
    { id: "musique", nom: "Musique / chanson" },
    { id: "potion", nom: "Friandise / goûter" },
    { id: "carte", nom: "Jeu de société" },
    { id: "ile", nom: "Sortie en famille" },
    { id: "soleil", nom: "Activité dehors" },
    { id: "lune", nom: "Soirée tranquille" },
    { id: "cheval", nom: "Balade / sport" },
    { id: "voilier", nom: "Vacances / mer" },
    { id: "tortue", nom: "Animal / zoo" },
    { id: "coffre", nom: "Cadeau surprise" },
    { id: "joyau", nom: "Petit cadeau" },
    { id: "carnet", nom: "Livre / histoire" },
    { id: "plume", nom: "Dessin / création" },
    { id: "roue", nom: "Vélo / trottinette" },
    { id: "feu", nom: "Feu de camp / barbecue" },
    { id: "montagne", nom: "Randonnée" },
    { id: "cle", nom: "Choisir le programme" },
    { id: "trophee", nom: "Défi / exploit" }
  ];

  var ICONES_DEFAUT = ["sablier", "carte", "coffre"];

  Q.iconesRecompense = ICONES_RECOMPENSE;

  /* Icône d'une récompense, avec repli pour les anciennes sauvegardes. */
  Q.iconeRecompense = function (r, index) {
    var id = r && r.icone;
    var existe = ICONES_RECOMPENSE.some(function (x) { return x.id === id; });
    return existe ? id : (ICONES_DEFAUT[index] || "coffre");
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

    /* Achat d'une récompense réelle définie par les parents.
       On garde une trace horodatée pour l'historique du carnet. */
    acheterRecompense: function (index) {
      var r = Q.etat.recompenses[index];
      if (!r) return { ok: false, raison: "absente" };
      if (!Q.jeu.depenserOr(r.prix)) return { ok: false, raison: "or" };
      var achat = {
        texte: r.texte,
        prix: r.prix,
        icone: Q.iconeRecompense(r, index),
        date: Date.now()
      };
      if (!Array.isArray(Q.etat.recompensesAchetees)) Q.etat.recompensesAchetees = [];
      Q.etat.recompensesAchetees.push(achat);
      r.achetee = achat.date;
      Q.jeu.sauver();
      return { ok: true, recompense: r, achat: achat };
    },

    aFamille: function (effet) {
      return Q.etat.familiers.some(function (id) {
        var f = CATALOGUE.familiers.filter(function (x) { return x.id === id; })[0];
        return f && f.effet === effet;
      });
    }
  };
})(window.Quete);
