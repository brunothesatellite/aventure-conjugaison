/* Aventure 2 — La Vallée des Souvenirs (imparfait) */
(function (Q) {
  Q.registerAdventure({
    id: "vallee-souvenirs",
    temps: "imparfait",
    nom: "La Vallée des Souvenirs",
    sousTitre: "Hier, autrefois, chaque jour…",
    description: "Dans la brume, les vieux murs racontent ce qui se passait avant. L'imparfait, c'est le temps des souvenirs qui durent.",
    fond: "assets/img/worlds/vallee-souvenirs.svg",
    accent: "#75687c",
    intro: "La brume se lève sur la vallée. Les pierres se souviennent : ici, on chantait, on jouait, on grandissait.",
    niveaux: [
      { id: "imparfait-1", titre: "Les Chroniques Antiques", groupe: "Les auxiliaires", verbes: ["etre", "avoir"], difficulte: 1 },
      { id: "imparfait-2", titre: "L'Ancien Campement", groupe: "1er groupe (-er)", verbes: ["chanter", "jouer", "manger", "parler"], difficulte: 1 },
      { id: "imparfait-3", titre: "La Salle des Souvenirs", groupe: "2e groupe (-ir)", verbes: ["finir", "choisir", "grandir"], difficulte: 2 },
      { id: "imparfait-4", titre: "Le Vieux Moulin", groupe: "3e groupe", verbes: ["aller", "faire", "dire", "venir", "voir"], difficulte: 2 }
    ],
    gardien: {
      nom: "Le Hibou des Siècles",
      description: "Il a tout vu, il y a longtemps. Il te fera raconter le passé.",
      icone: "sablier",
      questions: 7
    },
    recompense: { aiguille: "imparfait", badge: "veilleur-du-passe" }
  });
})(window.Quete);
