/**
 * Base de données des verbes pour l'application "La Quête des Verbes"
 * Thématique : Médiéval & Pirates (Niveau CE2)
 */

const VERBS_DB = {
  present: {
    id: "present",
    monde_nom: "L'Île du Présent",
    description: "Tout se passe ici et maintenant sur cette île de corsaires !",
    niveaux: [
      {
        id: 1,
        nom: "Les Ancres de l'Esprit",
        groupe: "Auxiliaires",
        verbes: [
          {
            infinitif: "être",
            conjugaisons: { je: "suis", tu: "es", il: "est", elle: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" },
            phrases: [
              { pronom: "je", texte: "___ un fier chevalier du roi.", reponse: "suis" },
              { pronom: "tu", texte: "___ le capitaine de ce navire !", reponse: "es" },
              { pronom: "il", texte: "___ sur le pont supérieur.", reponse: "est" },
              { pronom: "nous", texte: "___ prêts pour l'abordage.", reponse: "sommes" },
              { pronom: "vous", texte: "___ de courageux moussaillons.", reponse: "êtes" },
              { pronom: "ils", texte: "___ à la recherche du trésor.", reponse: "sont" }
            ]
          },
          {
            infinitif: "avoir",
            conjugaisons: { je: "ai", tu: "as", il: "a", elle: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" },
            phrases: [
              { pronom: "je", texte: "___ une carte au trésor secrète.", reponse: "ai" },
              { pronom: "tu", texte: "___ une épée bien aiguisée.", reponse: "as" },
              { pronom: "il", texte: "___ un perroquet sur l'épaule.", reponse: "a" },
              { pronom: "nous", texte: "___ besoin de nouvelles munitions.", reponse: "avons" },
              { pronom: "vous", texte: "___ une boussole magique.", reponse: "avez" },
              { pronom: "ils", texte: "___ des pièces d'or plein les poches.", reponse: "ont" }
            ]
          }
        ]
      },
      {
        id: 2,
        nom: "La Forêt des Verbes Verts",
        groupe: "1er Groupe (-ER)",
        verbes: [
          {
            infinitif: "jouer",
            conjugaisons: { je: "joue", tu: "joues", il: "joue", elle: "joue", nous: "jouons", vous: "jouez", ils: "jouent", elles: "jouent" },
            phrases: [
              { pronom: "je", texte: "___ aux dés dans la taverne.", reponse: "joue" },
              { pronom: "tu", texte: "___ de la flûte pour les marins.", reponse: "joues" },
              { pronom: "il", texte: "___ avec son bouclier en bois.", reponse: "joue" },
              { pronom: "nous", texte: "___ avec les cartes de l'archipel.", reponse: "jouons" },
              { pronom: "vous", texte: "___ un mauvais tour aux gardes.", reponse: "jouez" },
              { pronom: "ils", texte: "___ avec les singes de la jungle.", reponse: "jouent" }
            ]
          },
          {
            infinitif: "lancer",
            note: "Attention au ç devant le o !",
            conjugaisons: { je: "lance", tu: "lances", il: "lance", elle: "lance", nous: "lançons", vous: "lancez", ils: "lancent", elles: "lancent" },
            phrases: [
              { pronom: "tu", texte: "___ un grappin sur le pont adverse.", reponse: "lances" },
              { pronom: "nous", texte: "___ l'ancre au fond de la baie.", reponse: "lançons" },
              { pronom: "ils", texte: "___ des flèches sur la cible.", reponse: "lancent" }
            ]
          },
          {
            infinitif: "manger",
            note: "Attention au e après le g devant le o !",
            conjugaisons: { je: "mange", tu: "manges", il: "mange", elle: "mange", nous: "mangeons", vous: "mangez", ils: "mangent", elles: "mangent" },
            phrases: [
              { pronom: "il", texte: "___ une cuisse de sanglier rôti.", reponse: "mange" },
              { pronom: "nous", texte: "___ des biscuits de mer séchés.", reponse: "mangeons" },
              { pronom: "vous", texte: "___ de délicieux fruits tropicaux.", reponse: "mangez" }
            ]
          }
        ]
      },
      {
        id: 3,
        nom: "Les Remparts du Donjon",
        groupe: "2e Groupe (-IR)",
        verbes: [
          {
            infinitif: "finir",
            conjugaisons: { je: "finis", tu: "finis", il: "finit", elle: "finit", nous: "finissons", vous: "finissez", ils: "finissent", elles: "finissent" },
            phrases: [
              { pronom: "je", texte: "___ de nettoyer le canon.", reponse: "finis" },
              { pronom: "tu", texte: "___ ton assiette au banquet.", reponse: "finis" },
              { pronom: "il", texte: "___ sa ronde de nuit sur le mur.", reponse: "finit" },
              { pronom: "nous", texte: "___ de creuser pour déterrer le coffre.", reponse: "finissons" },
              { pronom: "vous", texte: "___ d'installer les tentes.", reponse: "finissez" },
              { pronom: "ils", texte: "___ leur potion magique.", reponse: "finissent" }
            ]
          },
          {
            infinitif: "grandir",
            conjugaisons: { je: "grandis", tu: "grandis", il: "grandit", elle: "grandit", nous: "grandissons", vous: "grandissez", ils: "grandissent", elles: "grandissent" },
            phrases: [
              { pronom: "tu", texte: "___ vite sous ton armure !", reponse: "grandis" },
              { pronom: "il", texte: "Le jeune dragon ___ à toute vitesse.", reponse: "grandit" },
              { pronom: "nous", texte: "___ en sagesse grâce au vieux mage.", reponse: "grandissons" }
            ]
          }
        ]
      },
      {
        id: 4,
        nom: "Le Repaire des Vieux Flibustiers",
        groupe: "3e Groupe (Irréguliers)",
        verbes: [
          {
            infinitif: "aller",
            conjugaisons: { je: "vais", tu: "vas", il: "va", elle: "va", nous: "allons", vous: "allez", ils: "vont", elles: "vont" },
            phrases: [
              { pronom: "je", texte: "___ défier le chevalier noir.", reponse: "vais" },
              { pronom: "tu", texte: "___ au port chercher des provisions.", reponse: "vas" },
              { pronom: "nous", texte: "___ explorer la grotte mystérieuse.", reponse: "allons" },
              { pronom: "ils", texte: "___ hisser la grand-voile.", reponse: "vont" }
            ]
          },
          {
            infinitif: "faire",
            conjugaisons: { je: "fais", tu: "fais", il: "fait", elle: "fait", nous: "faisons", vous: "faites", ils: "font", elles: "font" },
            phrases: [
              { pronom: "je", texte: "___ de mon mieux pour gagner.", reponse: "fais" },
              { pronom: "tu", texte: "___ un nœud marin solide.", reponse: "fais" },
              { pronom: "vous", texte: "___ trop de bruit dans le château !", reponse: "faites" },
              { pronom: "ils", texte: "___ couler le navire ennemi.", reponse: "font" }
            ]
          },
          {
            infinitif: "dire",
            conjugaisons: { je: "dis", tu: "dis", il: "dit", elle: "dit", nous: "disons", vous: "dites", ils: "disent", elles: "disent" },
            phrases: [
              { pronom: "tu", texte: "___ toujours la vérité au roi.", reponse: "dis" },
              { pronom: "vous", texte: "___ de lever l'ancre immédiatement !", reponse: "dites" },
              { pronom: "ils", texte: "___ que le monstre marin approche.", reponse: "disent" }
            ]
          }
        ]
      }
    ]
  },

  imparfait: {
    id: "imparfait",
    monde_nom: "La Vallée des Souvenirs",
    description: "Un voyage dans le passé, à l'époque où les légendes s'écrivaient.",
    niveaux: [
      {
        id: 1,
        nom: "Les Chroniques Antiques",
        groupe: "Auxiliaires",
        verbes: [
          {
            infinitif: "être",
            conjugaisons: { je: "étais", tu: "étais", il: "était", elle: "était", nous: "étions", vous: "étiez", ils: "étaient", elles: "étaient" },
            phrases: [
              { pronom: "je", texte: "J'___ autrefois un simple paysan.", reponse: "étais" },
              { pronom: "il", texte: "Le galion ___ immense et rapide.", reponse: "était" },
              { pronom: "nous", texte: "Nous ___ de vrais frères d'armes.", reponse: "étions" }
            ]
          },
          {
            infinitif: "avoir",
            conjugaisons: { je: "avais", tu: "avais", il: "avait", elle: "avait", nous: "avions", vous: "aviez", ils: "avaient", elles: "avaient" },
            phrases: [
              { pronom: "tu", texte: "Tu ___ une épée magique d'or blanc.", reponse: "avais" },
              { pronom: "vous", texte: "Vous ___ peur du terrible Kraken.", reponse: "aviez" },
              { pronom: "ils", texte: "Ils ___ une grande avance sur nous.", reponse: "avaient" }
            ]
          }
        ]
      },
      {
        id: 2,
        nom: "L'Ancien Campement",
        groupe: "1er et 2e Groupe",
        verbes: [
          {
            infinitif: "chanter",
            conjugaisons: { je: "chantais", tu: "chantais", il: "chantait", elle: "chantait", nous: "chantions", vous: "chantiez", ils: "chantaient", elles: "chantaient" },
            phrases: [
              { pronom: "je", texte: "Je ___ autour du feu de camp.", reponse: "chantais" },
              { pronom: "nous", texte: "Nous ___ des refrains de flibustiers.", reponse: "chantions" },
              { pronom: "ils", texte: "Les bardes ___ la gloire du souverain.", reponse: "chantaient" }
            ]
          },
          {
            infinitif: "choisir",
            conjugaisons: { je: "choisissais", tu: "choisissais", il: "choisissait", elle: "choisissait", nous: "choisissions", vous: "choisissiez", ils: "choisissaient", elles: "choisissaient" },
            phrases: [
              { pronom: "tu", texte: "Tu ___ le meilleur cheval de l'écurie.", reponse: "choisissais" },
              { pronom: "il", texte: "Le capitaine ___ sa route sur les cartes.", reponse: "choisissait" },
              { pronom: "vous", texte: "Vous ___ vos armes avant le duel.", reponse: "choisissiez" }
            ]
          }
        ]
      }
    ]
  },

  futur: {
    id: "futur",
    monde_nom: "L'Océan des Prophéties",
    description: "Regarde vers l'avenir, là où de nouvelles batailles t'attendent !",
    niveaux: [
      {
        id: 1,
        nom: "Les Étoiles de Demain",
        groupe: "Auxiliaires",
        verbes: [
          {
            infinitif: "être",
            conjugaisons: { je: "serai", tu: "seras", il: "sera", elle: "sera", nous: "serons", vous: "serez", ils: "seront", elles: "seront" },
            phrases: [
              { pronom: "je", texte: "Je ___ le roi de ce royaume !", reponse: "serai" },
              { pronom: "tu", texte: "Tu ___ récompensé pour ton courage.", reponse: "seras" },
              { pronom: "nous", texte: "Nous ___ bientôt arrivés à bon port.", reponse: "serons" }
            ]
          },
          {
            infinitif: "avoir",
            conjugaisons: { je: "aurai", tu: "auras", il: "aura", elle: "aura", nous: "aurons", vous: "aurez", ils: "auront", elles: "auront" },
            phrases: [
              { pronom: "il", texte: "Le gagnant ___ droit à la couronne.", reponse: "aura" },
              { pronom: "vous", texte: "Vous ___ de l'or en abondance.", reponse: "aurez" },
              { pronom: "ils", texte: "Ils ___ la chance de voir la sirène.", reponse: "auront" }
            ]
          }
        ]
      },
      {
        id: 2,
        nom: "La Flèche du Temps",
        groupe: "1er et 2e Groupe",
        verbes: [
          {
            infinitif: "attaquer",
            conjugaisons: { je: "attaquerai", tu: "attaqueras", il: "attaquera", elle: "attaquera", nous: "attaquerons", vous: "attaquerez", ils: "attaqueront", elles: "attaqueront" },
            phrases: [
              { pronom: "je", texte: "J'___ la forteresse à l'aube.", reponse: "attaquerai" },
              { pronom: "tu", texte: "Tu ___ le flanc gauche du navire.", reponse: "attaqueras" },
              { pronom: "nous", texte: "Nous ___ dès que le signal retentira.", reponse: "attaquerons" }
            ]
          },
          {
            infinitif: "obéir",
            conjugaisons: { je: "obéirai", tu: "obéiras", il: "obéira", elle: "obéira", nous: "obéirons", vous: "obéirez", ils: "obéiront", elles: "obéiront" },
            phrases: [
              { pronom: "il", texte: "L'équipage ___ aux ordres du capitaine.", reponse: "obéira" },
              { pronom: "vous", texte: "Vous ___ au code d'honneur des pirates.", reponse: "obéirez" },
              { pronom: "ils", texte: "Les soldats ___ aux lois du royaume.", reponse: "obéiront" }
            ]
          }
        ]
      }
    ]
  },

  passe_compose: {
    id: "passe_compose",
    monde_nom: "La Crique des Exploits Passés",
    description: "Raconte tes plus grandes victoires à l'aide des deux auxiliaires !",
    niveaux: [
      {
        id: 1,
        nom: "Le Butin Verrouillé",
        groupe: "1er Groupe (Participes en -É)",
        verbes: [
          {
            infinitif: "trouver",
            conjugaisons: { je: "ai trouvé", tu: "as trouvé", il: "a trouvé", elle: "a trouvé", nous: "avons trouvé", vous: "avez trouvé", ils: "ont trouvé", elles: "ont trouvé" },
            phrases: [
              { pronom: "je", texte: "J'___ le coffre maudit !", reponse: "ai trouvé" },
              { pronom: "nous", texte: "Nous ___ une île inconnue.", reponse: "avons trouvé" },
              { pronom: "ils", texte: "Ils ___ la clé d'argent.", reponse: "ont trouvé" }
            ]
          },
          {
            infinitif: "voler",
            conjugaisons: { je: "ai volé", tu: "as volé", il: "a volé", elle: "a volé", nous: "avons volé", vous: "avez volé", ils: "ont volé", elles: "ont volé" },
            phrases: [
              { pronom: "tu", texte: "Tu ___ les plans secrets de l'Amiral.", reponse: "as volé" },
              { pronom: "il", texte: "Le voleur ___ la bague magique.", reponse: "a volé" },
              { pronom: "vous", texte: "Vous ___ la cargaison d'épices.", reponse: "avez volé" }
            ]
          }
        ]
      }
    ]
  }
};

window.VERBS_DB = VERBS_DB;
