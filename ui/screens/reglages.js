/* Réglages : audio, voix, taille du texte, animations */
(function (Q) {
  "use strict";

  Q.screens.reglages = function (el) {
    var r = Q.etat.reglages;

    function bascule(id, actif, titre, sousTitre) {
      return '<div class="bascule">' +
        '<div class="bascule__texte">' + titre + "<small>" + sousTitre + "</small></div>" +
        '<button class="interrupteur" data-bascule="' + id + '" aria-pressed="' + (!!actif) + '" aria-label="' + titre + '"></button>' +
        "</div>";
    }

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
        '<div class="rangee espace-haut">' +
          '<button class="btn btn--mer" data-action="tester">' + Q.ui.icon("haut-parleur") + " Tester la voix</button>" +
        "</div>" +
        '<div class="encart espace-haut">La voix dépend de ton appareil. Si elle n\'est pas agréable, tu peux la couper : l\'application reste entièrement jouable sans son.</div>' +
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
