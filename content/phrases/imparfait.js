/* ============================================================
   Phrases — IMPARFAIT
   Pièges ciblés : -ais / -ait / -aient, et « nous » en -ions.
   ============================================================ */
(function (Q) {
  Q.registerPhrases("imparfait", [
    { id: "etre-imparfait-je-01", verbe: "etre", temps: "imparfait", personne: "je", difficulte: 1, texte: "J'{trou} autrefois un simple paysan.", tags: ["auxiliaire", "elision"] },
    { id: "etre-imparfait-il-01", verbe: "etre", temps: "imparfait", personne: "il", difficulte: 1, texte: "Il {trou} immense et rapide.", tags: ["auxiliaire"] },
    { id: "etre-imparfait-nous-01", verbe: "etre", temps: "imparfait", personne: "nous", difficulte: 2, texte: "Nous {trou} de vrais frères d'armes.", tags: ["auxiliaire"] },
    { id: "avoir-imparfait-tu-01", verbe: "avoir", temps: "imparfait", personne: "tu", difficulte: 1, texte: "Tu {trou} une épée magique en or blanc.", tags: ["auxiliaire"] },
    { id: "avoir-imparfait-vous-01", verbe: "avoir", temps: "imparfait", personne: "vous", difficulte: 2, texte: "Vous {trou} peur du terrible kraken.", tags: ["auxiliaire"] },
    { id: "avoir-imparfait-ils-01", verbe: "avoir", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} une grande avance sur nous.", tags: ["auxiliaire"] },

    { id: "chanter-imparfait-je-01", verbe: "chanter", temps: "imparfait", personne: "je", difficulte: 1, texte: "Je {trou} autour du feu de camp." },
    { id: "chanter-imparfait-nous-01", verbe: "chanter", temps: "imparfait", personne: "nous", difficulte: 3, texte: "Nous {trou} des refrains de flibustiers.", tags: ["terminaison"] },
    { id: "chanter-imparfait-ils-01", verbe: "chanter", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} la gloire du roi." },

    { id: "jouer-imparfait-nous-01", verbe: "jouer", temps: "imparfait", personne: "nous", difficulte: 3, texte: "Nous {trou} sur la plage à la tombée du jour.", tags: ["terminaison"] },
    { id: "jouer-imparfait-ils-01", verbe: "jouer", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} aux cartes avec les marins." },

    { id: "manger-imparfait-ils-01", verbe: "manger", temps: "imparfait", personne: "ils", difficulte: 3, texte: "Ils {trou} des fruits de mer au campement.", tags: ["radical"] },
    { id: "manger-imparfait-je-01", verbe: "manger", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} des biscuits secs sur le pont." },

    { id: "parler-imparfait-nous-01", verbe: "parler", temps: "imparfait", personne: "nous", difficulte: 3, texte: "Nous {trou} des légendes du kraken.", tags: ["terminaison"] },

    { id: "finir-imparfait-je-01", verbe: "finir", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} toujours mes corvées avant midi." },
    { id: "finir-imparfait-elles-01", verbe: "finir", temps: "imparfait", personne: "elles", difficulte: 3, texte: "Elles {trou} leurs potions au coucher du soleil." },

    { id: "choisir-imparfait-tu-01", verbe: "choisir", temps: "imparfait", personne: "tu", difficulte: 3, texte: "Tu {trou} le meilleur cheval de l'écurie." },
    { id: "choisir-imparfait-il-01", verbe: "choisir", temps: "imparfait", personne: "il", difficulte: 3, texte: "Il {trou} sa route sur les vieilles cartes." },
    { id: "choisir-imparfait-vous-01", verbe: "choisir", temps: "imparfait", personne: "vous", difficulte: 3, texte: "Vous {trou} vos armes avant le duel." },

    { id: "grandir-imparfait-tu-01", verbe: "grandir", temps: "imparfait", personne: "tu", difficulte: 3, texte: "Tu {trou} vite, disait le vieux mage." },

    { id: "aller-imparfait-nous-01", verbe: "aller", temps: "imparfait", personne: "nous", difficulte: 2, texte: "Nous {trou} souvent au marché du port." },
    { id: "aller-imparfait-ils-01", verbe: "aller", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} à la pêche chaque matin." },

    { id: "faire-imparfait-je-01", verbe: "faire", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} mes exercices sur le pont." },
    { id: "faire-imparfait-ils-01", verbe: "faire", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} le guet sur les remparts." },

    { id: "dire-imparfait-vous-01", verbe: "dire", temps: "imparfait", personne: "vous", difficulte: 2, texte: "Vous {trou} toujours la vérité." },

    { id: "voir-imparfait-je-01", verbe: "voir", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} les étoiles depuis la vigie." },
    { id: "voir-imparfait-ils-01", verbe: "voir", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} la tempête arriver." },

    { id: "pouvoir-imparfait-tu-01", verbe: "pouvoir", temps: "imparfait", personne: "tu", difficulte: 2, texte: "Tu {trou} soulever ce coffre seul." },
    { id: "vouloir-imparfait-nous-01", verbe: "vouloir", temps: "imparfait", personne: "nous", difficulte: 2, texte: "Nous {trou} découvrir de nouvelles terres." },

    { id: "prendre-imparfait-il-01", verbe: "prendre", temps: "imparfait", personne: "il", difficulte: 2, texte: "Il {trou} toujours le même raccourci." },
    { id: "venir-imparfait-elles-01", verbe: "venir", temps: "imparfait", personne: "elles", difficulte: 3, texte: "Elles {trou} de la taverne." },

    { id: "trouver-imparfait-je-01", verbe: "trouver", temps: "imparfait", personne: "je", difficulte: 1, texte: "Je {trou} des coquillages sur la plage." },
    { id: "voler-imparfait-ils-01", verbe: "voler", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} au-dessus des vagues." },
    { id: "arriver-imparfait-nous-01", verbe: "arriver", temps: "imparfait", personne: "nous", difficulte: 2, texte: "Nous {trou} toujours les derniers au port." },

    { id: "parler-imparfait-je-01", verbe: "parler", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} aux mouettes du port." },
    { id: "grandir-imparfait-il-01", verbe: "grandir", temps: "imparfait", personne: "il", difficulte: 2, texte: "Il {trou} au milieu des pirates." },
    { id: "venir-imparfait-je-01", verbe: "venir", temps: "imparfait", personne: "je", difficulte: 2, texte: "Je {trou} chaque semaine au marché." },
    { id: "dire-imparfait-ils-01", verbe: "dire", temps: "imparfait", personne: "ils", difficulte: 2, texte: "Ils {trou} que la mer était calme." }
  ]);
})(window.Quete);
