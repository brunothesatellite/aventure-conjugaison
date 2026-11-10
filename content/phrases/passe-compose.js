/* ============================================================
   Phrases — PASSÉ COMPOSÉ
   On travaille l'auxiliaire, le participe en -é, et l'accord avec être.
   Les phrases avec accord portent une « reponse » explicite.
   ============================================================ */
(function (Q) {
  Q.registerPhrases("passe_compose", [
    /* Auxiliaire avoir */
    { id: "trouver-pc-je-01", verbe: "trouver", temps: "passe_compose", personne: "je", difficulte: 1, texte: "J'{trou} le coffre maudit !", tags: ["auxiliaire", "elision"] },
    { id: "trouver-pc-nous-01", verbe: "trouver", temps: "passe_compose", personne: "nous", difficulte: 1, texte: "Nous {trou} une île inconnue." },
    { id: "trouver-pc-ils-01", verbe: "trouver", temps: "passe_compose", personne: "ils", difficulte: 1, texte: "Ils {trou} la clé d'argent." },

    { id: "voler-pc-tu-01", verbe: "voler", temps: "passe_compose", personne: "tu", difficulte: 1, texte: "Tu {trou} les plans secrets de l'amiral." },
    { id: "voler-pc-il-01", verbe: "voler", temps: "passe_compose", personne: "il", difficulte: 1, texte: "Il {trou} la bague magique." },
    { id: "voler-pc-vous-01", verbe: "voler", temps: "passe_compose", personne: "vous", difficulte: 1, texte: "Vous {trou} la cargaison d'épices." },

    { id: "manger-pc-je-01", verbe: "manger", temps: "passe_compose", personne: "je", difficulte: 1, texte: "J'{trou} tout le gâteau du bord.", tags: ["elision"] },
    { id: "manger-pc-elles-01", verbe: "manger", temps: "passe_compose", personne: "elles", difficulte: 1, texte: "Elles {trou} les derniers biscuits." },

    { id: "jouer-pc-nous-01", verbe: "jouer", temps: "passe_compose", personne: "nous", difficulte: 1, texte: "Nous {trou} aux cartes toute la soirée." },

    { id: "finir-pc-tu-01", verbe: "finir", temps: "passe_compose", personne: "tu", difficulte: 2, texte: "Tu {trou} ton travail avant la nuit." },
    { id: "choisir-pc-il-01", verbe: "choisir", temps: "passe_compose", personne: "il", difficulte: 2, texte: "Il {trou} la plus belle épée." },
    { id: "grandir-pc-elles-01", verbe: "grandir", temps: "passe_compose", personne: "elles", difficulte: 2, texte: "Elles {trou} très vite cette année." },

    { id: "faire-pc-je-01", verbe: "faire", temps: "passe_compose", personne: "je", difficulte: 2, texte: "J'{trou} mes preuves sur le navire.", tags: ["elision"] },
    { id: "dire-pc-vous-01", verbe: "dire", temps: "passe_compose", personne: "vous", difficulte: 2, texte: "Vous {trou} la vérité au conseil." },
    { id: "prendre-pc-ils-01", verbe: "prendre", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} le trésor et sont partis." },
    { id: "voir-pc-je-01", verbe: "voir", temps: "passe_compose", personne: "je", difficulte: 2, texte: "J'{trou} un monstre au large.", tags: ["elision"] },
    { id: "pouvoir-pc-tu-01", verbe: "pouvoir", temps: "passe_compose", personne: "tu", difficulte: 2, texte: "Tu {trou} ouvrir le coffre." },
    { id: "vouloir-pc-nous-01", verbe: "vouloir", temps: "passe_compose", personne: "nous", difficulte: 2, texte: "Nous {trou} visiter la crique." },

    { id: "etre-pc-elle-01", verbe: "etre", temps: "passe_compose", personne: "elle", difficulte: 2, texte: "Elle {trou} la capitaine la plus brave." },
    { id: "avoir-pc-ils-01", verbe: "avoir", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} beaucoup de chance." },

    /* Auxiliaire être : l'accord est explicitement travaillé */
    { id: "arriver-pc-elle-01", verbe: "arriver", temps: "passe_compose", personne: "elle", difficulte: 3, texte: "Elle {trou} la première sur l'île.", tags: ["etre", "accord"] },
    { id: "arriver-pc-elles-01", verbe: "arriver", temps: "passe_compose", personne: "elles", difficulte: 3, texte: "Elles {trou} avant la nuit.", tags: ["etre", "accord"] },
    { id: "arriver-pc-ils-01", verbe: "arriver", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} au port avant midi.", tags: ["etre"] },
    { id: "aller-pc-ils-01", verbe: "aller", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} voir le vieux phare.", tags: ["etre"] },
    { id: "aller-pc-elles-01", verbe: "aller", temps: "passe_compose", personne: "elles", difficulte: 3, texte: "Elles {trou} à la taverne du port.", tags: ["etre", "accord"] },
    { id: "venir-pc-il-01", verbe: "venir", temps: "passe_compose", personne: "il", difficulte: 2, texte: "Il {trou} nous aider hier soir.", tags: ["etre"] },
    { id: "venir-pc-elles-01", verbe: "venir", temps: "passe_compose", personne: "elles", difficulte: 3, texte: "Elles {trou} avec un message.", tags: ["etre", "accord"] },

    { id: "jouer-pc-je-01", verbe: "jouer", temps: "passe_compose", personne: "je", difficulte: 1, texte: "J'{trou} aux cartes avec les marins.", tags: ["elision"] },
    { id: "finir-pc-ils-01", verbe: "finir", temps: "passe_compose", personne: "ils", difficulte: 1, texte: "Ils {trou} leur repas en silence." },
    { id: "choisir-pc-vous-01", verbe: "choisir", temps: "passe_compose", personne: "vous", difficulte: 2, texte: "Vous {trou} la route du nord." },
    { id: "grandir-pc-il-01", verbe: "grandir", temps: "passe_compose", personne: "il", difficulte: 1, texte: "Il {trou} de dix centimètres." },
    { id: "faire-pc-elle-01", verbe: "faire", temps: "passe_compose", personne: "elle", difficulte: 2, texte: "Elle {trou} un gâteau pour l'équipage." },
    { id: "dire-pc-ils-01", verbe: "dire", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} au revoir au capitaine." },
    { id: "prendre-pc-je-01", verbe: "prendre", temps: "passe_compose", personne: "je", difficulte: 2, texte: "J'{trou} mon courage à deux mains.", tags: ["elision"] },
    { id: "voir-pc-elle-01", verbe: "voir", temps: "passe_compose", personne: "elle", difficulte: 2, texte: "Elle {trou} une lumière dans la nuit." },
    { id: "pouvoir-pc-il-01", verbe: "pouvoir", temps: "passe_compose", personne: "il", difficulte: 2, texte: "Il {trou} ouvrir la porte du fort." },
    { id: "vouloir-pc-elles-01", verbe: "vouloir", temps: "passe_compose", personne: "elles", difficulte: 2, texte: "Elles {trou} danser toute la nuit." },
    { id: "etre-pc-ils-01", verbe: "etre", temps: "passe_compose", personne: "ils", difficulte: 2, texte: "Ils {trou} très courageux." },
    { id: "avoir-pc-je-01", verbe: "avoir", temps: "passe_compose", personne: "je", difficulte: 2, texte: "J'{trou} de la chance au large.", tags: ["elision"] },
    { id: "chanter-pc-je-01", verbe: "chanter", temps: "passe_compose", personne: "je", difficulte: 1, texte: "J'{trou} une chanson de corsaire.", tags: ["elision"] },
    { id: "chanter-pc-ils-01", verbe: "chanter", temps: "passe_compose", personne: "ils", difficulte: 1, texte: "Ils {trou} toute la nuit sur le pont." },
    { id: "parler-pc-tu-01", verbe: "parler", temps: "passe_compose", personne: "tu", difficulte: 1, texte: "Tu {trou} au perroquet du capitaine." },
    { id: "parler-pc-elles-01", verbe: "parler", temps: "passe_compose", personne: "elles", difficulte: 2, texte: "Elles {trou} du trésor pendant des heures." }
  ]);
})(window.Quete);
