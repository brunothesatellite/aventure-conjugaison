/* Réglages : audio, voix, vitesse de lecture, taille du texte, animations */
(function (Q) {
  "use strict";

  /* Évite de réinstaller un écouteur « voiceschanged » à chaque rendu. */
  var attenteVoix = false;

  Q.screens.reglages = function (el) {
    var r = Q.etat.reglages;

    function bascule(id, actif, titre, sousTitre) {
      return '<div class="bascule">' +
        '<div class="bascule__texte">' + titre + "<small>" + sousTitre + "</small></div>" +
        '<button class="interrupteur" data-bascule="' + id + '" aria-pressed="' + (!!actif) + '" aria-label="' + titre + '"></button>' +
        "</div>";
    }

    /* ---------- Voix disponibles ---------- */

    var voix = Q.audio.listerVoix();
    var synthese = Q.audio.syntheseDisponible();
    var choixVoix;

    if (!synthese) {
      choixVoix = '<p class="discret">Cet appareil ne propose pas de synthèse vocale : ' +
        "les boutons 🔊 resteront silencieux, le jeu fonctionne sans.</p>";
    } else if (!voix.length) {
      choixVoix = '<p class="discret">Les voix de cet appareil sont en cours de chargement. ' +
        "Rouvre cet écran dans un instant.</p>";
      if (!attenteVoix) {
        attenteVoix = true;
        window.speechSynthesis.onvoiceschanged = function () {
          attenteVoix = false;
          if (Q.router.ecran === "reglages") Q.router.rafraichir();
        };
      }
    } else {
      /* Deux prénoms identiques (par exemple fr-FR et fr-CA) : on
         précise alors la région, sinon le menu serait ambigu. */
      var occurrences = {};
      voix.forEach(function (v) { occurrences[v.court] = (occurrences[v.court] || 0) + 1; });

      choixVoix = '<label class="label" for="choix-voix">Voix</label>' +
        '<select class="champ" id="choix-voix">' +
          '<option value="">Automatique (la meilleure disponible)</option>' +
          voix.map(function (v) {
            var choisi = r.voixNom === v.nom ? " selected" : "";
            var libelle = occurrences[v.court] > 1 ? v.court + " — " + v.langue : v.court;
            return '<option value="' + Q.ui.echapper(v.nom) + '"' + choisi + ">" +
              Q.ui.echapper(libelle) + "</option>";
          }).join("") +
        "</select>";
    }

    var centiemes = Math.round((Number(r.voixVitesse) || 0.92) * 100);
    var libelleVitesse = (centiemes / 100).toFixed(2).replace(".", ",") + "×";

    var reglette = synthese
      ? '<div class="espace-haut-sm">' +
          '<label class="label" for="vitesse-voix">Vitesse de lecture : ' +
            '<strong id="vitesse-valeur">' + libelleVitesse + "</strong></label>" +
          '<input class="reglette" type="range" id="vitesse-voix" min="70" max="130" step="5" value="' +
            centiemes + '" aria-label="Vitesse de lecture">' +
          '<div class="rangee rangee--entre discret"><span>plus lent</span><span>plus rapide</span></div>' +
        "</div>"
      : "";

    el.innerHTML = Q.ui.boutonRetour("map") +
      '<div class="titre-section espace-haut-sm"><h1 style="margin:0">Réglages</h1></div>' +
      '<div class="carte">' +
        bascule("son", r.son, "Sons du jeu", "Petits bruitages de réussite et de pièce") +
        bascule("voix", r.voix, "Lecture à voix haute", "Le bouton 🔊 lit la phrase") +
        bascule("animations", r.animations, "Animations", "Décoche si l'écran bouge trop") +
        '<div class="bascule"><div class="bascule__texte">Taille du texte<small>Choisis ce qui est le plus confortable</small></div>' +
          '<div class="rangee">' +
            '<button class="btn btn--secondaire" data-taille="petit">A-</button>' +
            '<button class="btn btn--secondaire" data-taille="normal">A</button>' +
            '<button class="btn btn--secondaire" data-taille="grand">A+</button>' +
          "</div></div>" +
      "</div>" +

      '<div class="carte espace-haut"><h2>' + Q.ui.icon("haut-parleur") + " Voix de lecture</h2>" +
        '<p class="discret" style="margin-top:-4px">La voix et la vitesse sont enregistrées dans ton profil, sur cet appareil.</p>' +
        choixVoix +
        reglette +
        '<div class="rangee espace-haut-sm">' +
          '<button class="btn btn--mer" data-action="tester">' + Q.ui.icon("haut-parleur") + " Tester la voix</button>" +
        "</div>" +
        '<div class="encart espace-haut-sm">La liste dépend des voix installées sur l\'appareil. ' +
        "Si aucune ne convient, coupe la lecture à voix haute : l'application reste entièrement jouable sans son.</div>" +
      "</div>" +

      '<div class="carte espace-haut"><h2>Ma partie</h2>' +
        '<p class="discret">Profil : ' + Q.ui.echapper(Q.etat.profil ? Q.etat.profil.nom : "—") + " · " + Q.etat.or + " pièces d'or</p>" +
        '<button class="btn btn--secondaire" data-action="joueurs">Changer de joueur</button>' +
        '<p class="discret espace-haut-sm">La suppression d\'un joueur se fait dans l\'espace parent (cadenas sur la carte).</p>' +
      "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-bascule]"), function (b) {
      b.addEventListener("click", function () {
        var cle = b.getAttribute("data-bascule");
        Q.etat.reglages[cle] = !Q.etat.reglages[cle];
        b.setAttribute("aria-pressed", Q.etat.reglages[cle]);
        Q.jeu.sauver();
        Q.appliquerReglages();
        Q.audio.son("page");
      });
    });

    Array.prototype.forEach.call(el.querySelectorAll("[data-taille]"), function (b) {
      b.addEventListener("click", function () {
        Q.etat.reglages.taille = b.getAttribute("data-taille");
        Q.jeu.sauver();
        Q.appliquerReglages();
        Q.ui.toast("Taille du texte modifiée.");
      });
    });

    var selecteur = el.querySelector("#choix-voix");
    if (selecteur) {
      selecteur.addEventListener("change", function () {
        Q.etat.reglages.voixNom = selecteur.value || null;
        Q.jeu.sauver();
        Q.audio.parler("Voix choisie. Bienvenue à bord !");
        Q.ui.toast("Voix enregistrée.", "ok");
      });
    }

    var curseur = el.querySelector("#vitesse-voix");
    if (curseur) {
      curseur.addEventListener("input", function () {
        var valeur = Number(curseur.value) / 100;
        Q.etat.reglages.voixVitesse = valeur;
        var affichage = el.querySelector("#vitesse-valeur");
        if (affichage) affichage.textContent = valeur.toFixed(2).replace(".", ",") + "×";
      });
      curseur.addEventListener("change", function () {
        Q.jeu.sauver();
        Q.audio.parler("Voici la vitesse de lecture.");
      });
    }

    var tester = el.querySelector('[data-action="tester"]');
    if (tester) tester.addEventListener("click", function () {
      Q.audio.parler("Bonjour ! Je suis la voix de la Quête des Verbes.");
    });

    var joueurs = el.querySelector('[data-action="joueurs"]');
    if (joueurs) joueurs.addEventListener("click", function () {
      Q.router.go("profils");
    });
  };
})(window.Quete);
