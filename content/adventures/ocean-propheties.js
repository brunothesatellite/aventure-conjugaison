/* Aventure 3 — L'Océan des Prophéties (futur simple) */
(function (Q) {
  Q.registerAdventure({
    id: "ocean-propheties",
    temps: "futur",
    nom: "L'Océan des Prophéties",
    sousTitre: "Demain, bientôt, un jour…",
    description: "La nuit, les étoiles annoncent ce qui arrivera. Le futur, c'est le temps des projets et des promesses.",
    fond: "assets/img/worlds/ocean-propheties.svg",
    accent: "#1b3a63",
    intro: "Le ciel est noir, la mer est calme. Les étoiles dessinent demain : tu partiras, tu trouveras, tu reviendras.",
    niveaux: [
      { id: "futur-1", titre: "Les Étoiles de Demain", groupe: "Les auxiliaires", verbes: ["etre", "avoir"], difficulte: 1 },
      { id: "futur-2", titre: "La Flèche du Temps", groupe: "1er groupe (-er)", verbes: ["chanter", "jouer", "parler", "trouver"], difficulte: 2 },
      { id: "futur-3", titre: "La Voile des Serments", groupe: "2e groupe et verbes en -dre", verbes: ["finir", "choisir", "grandir", "prendre", "voir"], difficulte: 2 },
      { id: "futur-4", titre: "Les Prophéties du Kraken", groupe: "3e groupe irréguliers", verbes: ["pouvoir", "vouloir", "faire", "aller", "dire", "venir"], difficulte: 3 }
    ],
    gardien: {
      nom: "Le Kraken Prophète",
      description: "Ses tentacules montrent l'avenir. À toi de le lire au futur.",
      icone: "kraken",
      questions: 7
    },
    recompense: { aiguille: "futur", badge: "pilote-de-l-avenir" }
  });
})(window.Quete);
