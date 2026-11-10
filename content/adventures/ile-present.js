/* Aventure 1 — L'Île du Présent */
(function (Q) {
  Q.registerAdventure({
    id: "ile-present",
    temps: "present",
    nom: "L'Île du Présent",
    sousTitre: "Tout se passe ici et maintenant",
    description: "Les palmiers murmurent au présent. Ici, chaque geste se passe maintenant : on hisse, on mange, on joue.",
    fond: "assets/img/worlds/ile-present.svg",
    accent: "#0e7490",
    intro: "Bienvenue sur l'île des corsaires ! L'aiguille du Présent est plantée dans le sable, tout près du fort.",
    niveaux: [
      { id: "present-1", titre: "Les Ancres de l'Esprit", groupe: "Les auxiliaires", verbes: ["etre", "avoir"], difficulte: 1 },
      { id: "present-2", titre: "La Forêt des Verbes Verts", groupe: "1er groupe (-er)", verbes: ["jouer", "manger", "chanter", "parler", "trouver", "voler", "arriver"], difficulte: 1 },
      { id: "present-3", titre: "Les Remparts du Donjon", groupe: "2e groupe (-ir)", verbes: ["finir", "choisir", "grandir"], difficulte: 2 },
      { id: "present-4", titre: "Le Repaire des Flibustiers", groupe: "3e groupe", verbes: ["aller", "faire", "dire", "venir", "prendre", "voir", "pouvoir", "vouloir"], difficulte: 2 }
    ],
    gardien: {
      nom: "Le Crabe Chronomètre",
      description: "Il mélange les verbes du présent pour tester ta mémoire.",
      icone: "crabe",
      questions: 7
    },
    recompense: { aiguille: "present", badge: "moussaillon-present" }
  });
})(window.Quete);
