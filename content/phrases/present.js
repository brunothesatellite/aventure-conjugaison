/* ============================================================
   Phrases — PRÉSENT DE L'INDICATIF
   Chaque phrase contient son pronom : la question n'est jamais ambiguë.
   Le champ « personne » sert à la logique (distracteurs, couleurs, stats).
   ============================================================ */
(function (Q) {
  Q.registerPhrases("present", [
    /* Auxiliaires */
    { id: "etre-present-je-01", verbe: "etre", temps: "present", personne: "je", difficulte: 1, texte: "Je {trou} ton guide pour cette aventure.", tags: ["auxiliaire"] },
    { id: "etre-present-tu-01", verbe: "etre", temps: "present", personne: "tu", difficulte: 1, texte: "Tu {trou} aux commandes de ce navire !", tags: ["auxiliaire"] },
    { id: "etre-present-il-01", verbe: "etre", temps: "present", personne: "il", difficulte: 1, texte: "Il {trou} sur le pont supérieur.", tags: ["auxiliaire"] },
    { id: "etre-present-nous-01", verbe: "etre", temps: "present", personne: "nous", difficulte: 2, texte: "Nous {trou} là pour l'abordage.", tags: ["auxiliaire"] },
    { id: "etre-present-vous-01", verbe: "etre", temps: "present", personne: "vous", difficulte: 2, texte: "Vous {trou} sur le navire du capitaine.", tags: ["auxiliaire"] },
    { id: "etre-present-ils-01", verbe: "etre", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} à la recherche du trésor.", tags: ["auxiliaire"] },
    { id: "avoir-present-je-01", verbe: "avoir", temps: "present", personne: "je", difficulte: 1, texte: "J'{trou} une carte au trésor secrète.", tags: ["auxiliaire", "elision"] },
    { id: "avoir-present-tu-01", verbe: "avoir", temps: "present", personne: "tu", difficulte: 1, texte: "Tu {trou} une épée bien aiguisée.", tags: ["auxiliaire"] },
    { id: "avoir-present-il-01", verbe: "avoir", temps: "present", personne: "il", difficulte: 1, texte: "Il {trou} un perroquet sur l'épaule.", tags: ["auxiliaire"] },
    { id: "avoir-present-nous-01", verbe: "avoir", temps: "present", personne: "nous", difficulte: 2, texte: "Nous {trou} besoin de nouvelles munitions.", tags: ["auxiliaire"] },
    { id: "avoir-present-vous-01", verbe: "avoir", temps: "present", personne: "vous", difficulte: 2, texte: "Vous {trou} une boussole magique.", tags: ["auxiliaire"] },
    { id: "avoir-present-ils-01", verbe: "avoir", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} des pièces d'or plein les poches.", tags: ["auxiliaire"] },

    /* 1er groupe */
    { id: "jouer-present-je-01", verbe: "jouer", temps: "present", personne: "je", difficulte: 1, texte: "Je {trou} aux dés dans la taverne." },
    { id: "jouer-present-tu-01", verbe: "jouer", temps: "present", personne: "tu", difficulte: 1, texte: "Tu {trou} de la flûte pour les marins." },
    { id: "jouer-present-nous-01", verbe: "jouer", temps: "present", personne: "nous", difficulte: 2, texte: "Nous {trou} aux cartes de l'archipel." },
    { id: "jouer-present-ils-01", verbe: "jouer", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} avec les singes de la jungle." },
    { id: "manger-present-il-01", verbe: "manger", temps: "present", personne: "il", difficulte: 2, texte: "Il {trou} une cuisse de sanglier rôti." },
    { id: "manger-present-nous-01", verbe: "manger", temps: "present", personne: "nous", difficulte: 3, texte: "Nous {trou} des biscuits de mer.", tags: ["radical"] },
    { id: "manger-present-vous-01", verbe: "manger", temps: "present", personne: "vous", difficulte: 2, texte: "Vous {trou} de délicieux fruits tropicaux." },
    { id: "chanter-present-je-01", verbe: "chanter", temps: "present", personne: "je", difficulte: 1, texte: "Je {trou} pour encourager l'équipage." },
    { id: "chanter-present-elles-01", verbe: "chanter", temps: "present", personne: "elles", difficulte: 2, texte: "Elles {trou} une chanson de corsaires." },
    { id: "parler-present-je-01", verbe: "parler", temps: "present", personne: "je", difficulte: 1, texte: "Je {trou} au perroquet du capitaine." },
    { id: "parler-present-tu-01", verbe: "parler", temps: "present", personne: "tu", difficulte: 1, texte: "Tu {trou} trop fort dans la vigie." },

    /* 2e groupe */
    { id: "finir-present-tu-01", verbe: "finir", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} ton assiette au banquet." },
    { id: "finir-present-nous-01", verbe: "finir", temps: "present", personne: "nous", difficulte: 3, texte: "Nous {trou} de creuser pour trouver le coffre.", tags: ["radical"] },
    { id: "finir-present-ils-01", verbe: "finir", temps: "present", personne: "ils", difficulte: 3, texte: "Ils {trou} leur potion magique." },
    { id: "choisir-present-je-01", verbe: "choisir", temps: "present", personne: "je", difficulte: 2, texte: "Je {trou} mon épée dans le coffre." },
    { id: "choisir-present-vous-01", verbe: "choisir", temps: "present", personne: "vous", difficulte: 3, texte: "Vous {trou} vos armes avant le duel." },
    { id: "grandir-present-il-01", verbe: "grandir", temps: "present", personne: "il", difficulte: 2, texte: "Il {trou} vite auprès du vieux mage." },
    { id: "grandir-present-nous-01", verbe: "grandir", temps: "present", personne: "nous", difficulte: 3, texte: "Nous {trou} en sagesse grâce au vieux mage." },

    /* 3e groupe */
    { id: "aller-present-je-01", verbe: "aller", temps: "present", personne: "je", difficulte: 2, texte: "Je {trou} défier le chevalier noir." },
    { id: "aller-present-tu-01", verbe: "aller", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} au port chercher des provisions." },
    { id: "aller-present-nous-01", verbe: "aller", temps: "present", personne: "nous", difficulte: 2, texte: "Nous {trou} explorer la grotte mystérieuse." },
    { id: "aller-present-ils-01", verbe: "aller", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} hisser la grand-voile." },
    { id: "faire-present-tu-01", verbe: "faire", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} un nœud marin solide." },
    { id: "faire-present-vous-01", verbe: "faire", temps: "present", personne: "vous", difficulte: 3, texte: "Vous {trou} trop de bruit dans le château !", tags: ["irregulier"] },
    { id: "faire-present-ils-01", verbe: "faire", temps: "present", personne: "ils", difficulte: 3, texte: "Ils {trou} couler le navire ennemi." },
    { id: "dire-present-tu-01", verbe: "dire", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} toujours la vérité au roi." },
    { id: "dire-present-vous-01", verbe: "dire", temps: "present", personne: "vous", difficulte: 3, texte: "Vous {trou} qu'il faut lever l'ancre !", tags: ["irregulier"] },
    { id: "dire-present-ils-01", verbe: "dire", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} que le monstre approche." },
    { id: "venir-present-je-01", verbe: "venir", temps: "present", personne: "je", difficulte: 2, texte: "Je {trou} du village voisin." },
    { id: "venir-present-ils-01", verbe: "venir", temps: "present", personne: "ils", difficulte: 3, texte: "Ils {trou} chaque matin au marché." },
    { id: "prendre-present-je-01", verbe: "prendre", temps: "present", personne: "je", difficulte: 2, texte: "Je {trou} mon bouclier et mon épée." },
    { id: "prendre-present-nous-01", verbe: "prendre", temps: "present", personne: "nous", difficulte: 2, texte: "Nous {trou} le raccourci par la falaise." },
    { id: "voir-present-tu-01", verbe: "voir", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} le phare au loin." },
    { id: "voir-present-ils-01", verbe: "voir", temps: "present", personne: "ils", difficulte: 3, texte: "Ils {trou} une île à l'horizon." },
    { id: "pouvoir-present-je-01", verbe: "pouvoir", temps: "present", personne: "je", difficulte: 2, texte: "Je {trou} soulever ce coffre sans aide." },
    { id: "pouvoir-present-vous-01", verbe: "pouvoir", temps: "present", personne: "vous", difficulte: 2, texte: "Vous {trou} rester au camp." },
    { id: "vouloir-present-tu-01", verbe: "vouloir", temps: "present", personne: "tu", difficulte: 2, texte: "Tu {trou} devenir capitaine." },
    { id: "vouloir-present-elles-01", verbe: "vouloir", temps: "present", personne: "elles", difficulte: 3, texte: "Elles {trou} apprendre la navigation." },
    { id: "trouver-present-vous-01", verbe: "trouver", temps: "present", personne: "vous", difficulte: 1, texte: "Vous {trou} une clé rouillée sous le pont." },
    { id: "voler-present-il-01", verbe: "voler", temps: "present", personne: "il", difficulte: 2, texte: "Il {trou} dans le ciel au-dessus du port.", tags: ["sens"] },
    { id: "arriver-present-ils-01", verbe: "arriver", temps: "present", personne: "ils", difficulte: 1, texte: "Ils {trou} enfin sur l'île." },
    { id: "trouver-present-ils-01", verbe: "trouver", temps: "present", personne: "ils", difficulte: 2, texte: "Ils {trou} un coffre sous le sable." },
    { id: "voler-present-elles-01", verbe: "voler", temps: "present", personne: "elles", difficulte: 2, texte: "Elles {trou} au-dessus des vagues." },
    { id: "arriver-present-elle-01", verbe: "arriver", temps: "present", personne: "elle", difficulte: 1, texte: "Elle {trou} enfin au port." },
    { id: "chanter-present-elle-01", verbe: "chanter", temps: "present", personne: "elle", difficulte: 1, texte: "Elle {trou} une chanson pour l'équipage." }
  ]);
})(window.Quete);
