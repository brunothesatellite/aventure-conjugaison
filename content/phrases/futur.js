/* ============================================================
   Phrases — FUTUR SIMPLE
   Pièges ciblés : -ai / -as / -a, radicaux irréguliers (ser-, aur-, ir-, fer-).
   ============================================================ */
(function (Q) {
  Q.registerPhrases("futur", [
    { id: "etre-futur-je-01", verbe: "etre", temps: "futur", personne: "je", difficulte: 2, texte: "Je {trou} le roi de ce royaume !", tags: ["auxiliaire", "radical"] },
    { id: "etre-futur-tu-01", verbe: "etre", temps: "futur", personne: "tu", difficulte: 2, texte: "Tu {trou} récompensé pour ton courage.", tags: ["auxiliaire"] },
    { id: "etre-futur-nous-01", verbe: "etre", temps: "futur", personne: "nous", difficulte: 2, texte: "Nous {trou} bientôt arrivés à bon port.", tags: ["auxiliaire"] },
    { id: "avoir-futur-il-01", verbe: "avoir", temps: "futur", personne: "il", difficulte: 2, texte: "Il {trou} droit à la couronne.", tags: ["auxiliaire", "radical"] },
    { id: "avoir-futur-vous-01", verbe: "avoir", temps: "futur", personne: "vous", difficulte: 2, texte: "Vous {trou} de l'or en abondance.", tags: ["auxiliaire"] },
    { id: "avoir-futur-ils-01", verbe: "avoir", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} la chance de voir la sirène.", tags: ["auxiliaire"] },

    { id: "aller-futur-je-01", verbe: "aller", temps: "futur", personne: "je", difficulte: 2, texte: "J'{trou} au bout du monde.", tags: ["elision", "radical"] },
    { id: "aller-futur-nous-01", verbe: "aller", temps: "futur", personne: "nous", difficulte: 2, texte: "Nous {trou} explorer les îles du sud." },
    { id: "aller-futur-ils-01", verbe: "aller", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} chercher le trésor du volcan." },

    { id: "faire-futur-tu-01", verbe: "faire", temps: "futur", personne: "tu", difficulte: 3, texte: "Tu {trou} un excellent capitaine.", tags: ["radical"] },
    { id: "faire-futur-ils-01", verbe: "faire", temps: "futur", personne: "ils", difficulte: 3, texte: "Ils {trou} route vers l'archipel." },

    { id: "dire-futur-vous-01", verbe: "dire", temps: "futur", personne: "vous", difficulte: 2, texte: "Vous {trou} au roi ce que vous avez vu." },

    { id: "venir-futur-je-01", verbe: "venir", temps: "futur", personne: "je", difficulte: 3, texte: "Je {trou} te chercher à l'aube.", tags: ["radical"] },
    { id: "venir-futur-elles-01", verbe: "venir", temps: "futur", personne: "elles", difficulte: 3, texte: "Elles {trou} au banquet ce soir." },

    { id: "prendre-futur-nous-01", verbe: "prendre", temps: "futur", personne: "nous", difficulte: 2, texte: "Nous {trou} la mer à la première lumière." },

    { id: "voir-futur-tu-01", verbe: "voir", temps: "futur", personne: "tu", difficulte: 3, texte: "Tu {trou} la terre depuis le mât.", tags: ["radical"] },
    { id: "voir-futur-ils-01", verbe: "voir", temps: "futur", personne: "ils", difficulte: 3, texte: "Ils {trou} la baleine souffler." },

    { id: "pouvoir-futur-vous-01", verbe: "pouvoir", temps: "futur", personne: "vous", difficulte: 3, texte: "Vous {trou} revenir quand vous voudrez.", tags: ["radical"] },
    { id: "vouloir-futur-je-01", verbe: "vouloir", temps: "futur", personne: "je", difficulte: 3, texte: "Je {trou} un familier pour m'aider.", tags: ["radical"] },
    { id: "vouloir-futur-elles-01", verbe: "vouloir", temps: "futur", personne: "elles", difficulte: 3, texte: "Elles {trou} visiter la crique interdite." },

    { id: "chanter-futur-nous-01", verbe: "chanter", temps: "futur", personne: "nous", difficulte: 1, texte: "Nous {trou} pour fêter la victoire." },
    { id: "chanter-futur-tu-01", verbe: "chanter", temps: "futur", personne: "tu", difficulte: 1, texte: "Tu {trou} la chanson des corsaires." },

    { id: "jouer-futur-je-01", verbe: "jouer", temps: "futur", personne: "je", difficulte: 1, texte: "Je {trou} aux dés avec l'équipage." },
    { id: "manger-futur-ils-01", verbe: "manger", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} du gâteau au miel." },
    { id: "parler-futur-je-01", verbe: "parler", temps: "futur", personne: "je", difficulte: 1, texte: "Je {trou} au gardien du phare." },

    { id: "finir-futur-tu-01", verbe: "finir", temps: "futur", personne: "tu", difficulte: 2, texte: "Tu {trou} ta carte avant la nuit." },
    { id: "choisir-futur-elle-01", verbe: "choisir", temps: "futur", personne: "elle", difficulte: 2, texte: "Elle {trou} une route plus sûre." },
    { id: "grandir-futur-ils-01", verbe: "grandir", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} en courage au fil des saisons." },

    { id: "trouver-futur-vous-01", verbe: "trouver", temps: "futur", personne: "vous", difficulte: 1, texte: "Vous {trou} le trésor, j'en suis sûr." },
    { id: "voler-futur-tu-01", verbe: "voler", temps: "futur", personne: "tu", difficulte: 1, texte: "Tu {trou} vers l'île au lever du jour." },
    { id: "arriver-futur-nous-01", verbe: "arriver", temps: "futur", personne: "nous", difficulte: 1, texte: "Nous {trou} avant la tempête." },

    { id: "jouer-futur-tu-01", verbe: "jouer", temps: "futur", personne: "tu", difficulte: 1, texte: "Tu {trou} au prochain tournoi." },
    { id: "parler-futur-nous-01", verbe: "parler", temps: "futur", personne: "nous", difficulte: 1, texte: "Nous {trou} de notre voyage." },
    { id: "trouver-futur-je-01", verbe: "trouver", temps: "futur", personne: "je", difficulte: 1, texte: "Je {trou} le chemin tout seul." },
    { id: "finir-futur-je-01", verbe: "finir", temps: "futur", personne: "je", difficulte: 2, texte: "Je {trou} ma carte du trésor." },
    { id: "choisir-futur-vous-01", verbe: "choisir", temps: "futur", personne: "vous", difficulte: 2, texte: "Vous {trou} le bon port." },
    { id: "grandir-futur-tu-01", verbe: "grandir", temps: "futur", personne: "tu", difficulte: 2, texte: "Tu {trou} encore cette année." },
    { id: "prendre-futur-ils-01", verbe: "prendre", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} la mer au lever du jour." },
    { id: "pouvoir-futur-je-01", verbe: "pouvoir", temps: "futur", personne: "je", difficulte: 3, texte: "Je {trou} nager jusqu'à l'île." },
    { id: "dire-futur-ils-01", verbe: "dire", temps: "futur", personne: "ils", difficulte: 2, texte: "Ils {trou} la vérité au conseil." }
  ]);
})(window.Quete);
