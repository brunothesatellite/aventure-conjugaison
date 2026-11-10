/* Écran d'accueil : prénom, avatar, reprise de partie */
(function (Q) {
  "use strict";

  var AVATARS = ["chevalier", "magicienne", "pirate", "sirene", "explorateur", "mousse"];

  Q.screens.home = function (el) {
    var p = Q.etat.profil;
    var choix = p ? p.avatar : "chevalier";

    var contenu;
    if (p) {
      var rang = Q.jeu.rang();
      contenu = '<div class="centre">' +
        '<div class="hud__avatar" style="width:92px;height:92px;margin:0 auto 10px;font-size:2rem">' + Q.ui.emoji(Q.ui.avatarEmoji(p.avatar), "") + "</div>" +
        "<h2>Bon retour, " + Q.ui.echapper(p.nom) + " !</h2>" +
        '<p class="discret">' + Q.ui.echapper(rang.courant.nom) + " · " + Q.etat.or + " pièces d'or · " +
          Q.etat.aiguilles.length + "/4 aiguilles</p>" +
        '<div class="pile espace-haut">' +
        '<button class="btn btn--primaire btn--lg btn--bloc" data-action="reprendre">' + Q.ui.emoji("boussole", "") + " Reprendre l'aventure</button>" +
        (Q.etat.quest && !Q.etat.quest.fini
          ? '<button class="btn btn--mer btn--bloc" data-action="quete">Reprendre la quête en cours</button>'
          : "") +
        '<button class="btn btn--fantome btn--bloc" data-action="nouveau">Changer de joueur</button>' +
        "</div></div>";
    } else {
      contenu = '<label class="label" for="prenom">Ton prénom</label>' +
        '<input class="champ" id="prenom" maxlength="18" placeholder="Ex. : Léa" autocomplete="off" aria-label="Ton prénom">' +
        '<span class="label">Choisis ton avatar</span>' +
        '<div class="avatars">' + AVATARS.map(function (id) {
          return '<button class="avatar-choix ' + (id === choix ? "choisi" : "") + '" data-avatar="' + id + '" aria-pressed="' + (id === choix) + '">' +
            Q.ui.emoji(Q.ui.avatarEmoji(id), Q.ui.avatarNom(id)) +
            "<span>" + Q.ui.avatarNom(id) + "</span></button>";
        }).join("") + "</div>" +
        '<button class="btn btn--primaire btn--lg btn--bloc espace-haut" data-action="commencer">' +
        Q.ui.emoji("ancre", "") + " Commencer l'aventure</button>" +
        '<p class="discret centre" style="margin-top:14px">Pas de compte, pas de publicité : tout reste sur cet appareil.</p>';
    }

    el.innerHTML = '<div class="accueil">' +
      '<div class="accueil__logo">' + Q.ui.emoji("ancre", "") + " La Quête des Verbes</div>" +
      '<p class="accueil__sous-titre">Traverse l\'Archipel des Temps et répare la Boussole brisée.</p>' +
      '<div class="carte">' + contenu + "</div>" +
      "</div>";

    var selection = choix;
    Array.prototype.forEach.call(el.querySelectorAll("[data-avatar]"), function (b) {
      b.addEventListener("click", function () {
        selection = b.getAttribute("data-avatar");
        Array.prototype.forEach.call(el.querySelectorAll("[data-avatar]"), function (x) {
          x.classList.toggle("choisi", x === b);
          x.setAttribute("aria-pressed", x === b);
        });
        Q.audio.son("page");
      });
    });

    function commencer() {
      var champ = el.querySelector("#prenom");
      var nom = champ ? champ.value : "";
      if (!nom || !nom.trim()) {
        if (champ) { champ.focus(); champ.classList.add("secoue"); }
        Q.ui.toast("Écris ton prénom pour commencer.", "ko");
        return;
      }
      Q.jeu.nouveau(nom, selection);
      Q.audio.son("fanfare");
      Q.router.go("map");
    }

    Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-action");
        if (a === "commencer") commencer();
        if (a === "reprendre") Q.router.go("map");
        if (a === "quete") Q.router.go("quete");
        if (a === "nouveau") {
          Q.ui.confirmer("Changer de joueur ?", "La progression de ce joueur sera conservée dans ce navigateur, mais un seul profil est actif à la fois.", "Changer")
            .then(function (ok) {
              if (!ok) return;
              Q.jeu.reinitialiser();
              Q.router.rafraichir();
            });
        }
      });
    });

    var champ = el.querySelector("#prenom");
    if (champ) {
      champ.focus();
      champ.addEventListener("keydown", function (e) {
        if (e.key === "Enter") commencer();
      });
    }
  };
})(window.Quete);
