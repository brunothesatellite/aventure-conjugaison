/* Écran « Qui joue ? » : plusieurs profils locaux, restauration. */
(function (Q) {
  "use strict";

  function avatarDe(avatar) {
    return Q.ui.emoji(Q.ui.avatarEmoji(avatar || "chevalier"), "");
  }

  function dateCourte(ts) {
    return ts ? Q.ui.dateFr(ts) : "—";
  }

  Q.screens.profils = function (el) {
    var profils = Q.jeu.listerProfils();
    var corbeille = Q.jeu.listerCorbeille();
    var actif = Q.profils.actif;

    var liste = profils.length
      ? profils.map(function (p) {
          return '<button class="profil-choix' + (p.id === actif ? " profil-choix--actif" : "") + '" data-profil="' + p.id + '">' +
            '<span class="profil-choix__avatar">' + avatarDe(p.avatar) + "</span>" +
            '<span class="profil-choix__corps">' +
              '<span class="profil-choix__nom">' + Q.ui.echapper(p.nom) +
                (p.id === actif ? ' <span class="profil-choix__actif">actif</span>' : "") + "</span>" +
              '<span class="profil-choix__meta">' + p.etoiles + " étoiles · " + p.or + " pièces · " + p.aiguilles + "/4 aiguilles</span>" +
              '<span class="profil-choix__meta">Dernière partie : ' + dateCourte(p.derniere) + "</span>" +
            "</span>" +
            '<span class="profil-choix__action">Jouer</span>' +
          "</button>";
        }).join("")
      : '<p class="discret centre">Aucun joueur enregistré sur cet appareil.</p>';

    var corbeilleHtml = corbeille.length
      ? '<div class="encart espace-haut-sm">' +
          '<div class="rangee rangee--entre">' +
            '<span>Dernier profil supprimé : <strong>' + Q.ui.echapper(corbeille[0].nom) + "</strong></span>" +
            '<button class="btn btn--secondaire btn--petit" data-restaurer="' + corbeille[0].id + '">Restaurer</button>' +
          "</div>" +
        "</div>"
      : "";

    el.innerHTML = '<div class="accueil">' +
      '<div class="accueil__logo">' + Q.ui.emoji("ancre", "") + " La Quête des Verbes</div>" +
      '<p class="accueil__sous-titre">Qui joue aujourd\'hui ?</p>' +
      '<div class="carte">' +
        '<h2 style="margin-top:0">Choisis ton joueur</h2>' +
        '<div class="profils-liste">' + liste + "</div>" +
        '<div class="pile espace-haut">' +
          '<button class="btn btn--primaire btn--bloc" data-action="nouveau">+ Nouveau joueur</button>' +
          '<label class="btn btn--secondaire btn--bloc" style="margin:0">Restaurer une sauvegarde' +
            '<input type="file" accept="application/json,.json" id="fichier-restauration" class="sr-only">' +
          "</label>" +
        "</div>" +
        corbeilleHtml +
        '<p class="discret centre" style="margin-top:14px">Chaque joueur a sa propre progression. Tout reste sur cet appareil.</p>' +
      "</div>" +
    "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-profil]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-profil");
        if (Q.jeu.activerProfil(id)) {
          Q.audio.son("page");
          Q.router.go("home");
        } else {
          Q.ui.toast("Ce profil est introuvable.", "ko");
        }
      });
    });

    var nouveau = el.querySelector('[data-action="nouveau"]');
    if (nouveau) nouveau.addEventListener("click", function () {
      Q.audio.son("page");
      Q.router.go("home", { nouveau: true });
    });

    var importInput = el.querySelector("#fichier-restauration");
    if (importInput) importInput.addEventListener("change", function () {
      var f = importInput.files && importInput.files[0];
      if (!f) return;
      var lecteur = new FileReader();
      lecteur.onload = function () {
        var donnees = Q.storage.importer(String(lecteur.result));
        if (!donnees) {
          Q.ui.toast("Fichier illisible.", "ko");
          return;
        }
        var id = donnees.profils ? Q.jeu.importerStore(donnees) : Q.jeu.importerEtat(donnees);
        if (!id) {
          Q.ui.toast("Ce fichier ne contient pas de profil.", "ko");
          return;
        }
        Q.ui.toast("Profil restauré : " + Q.etat.profil.nom, "ok");
        Q.router.go("home");
      };
      lecteur.readAsText(f);
      importInput.value = "";
    });

    Array.prototype.forEach.call(el.querySelectorAll("[data-restaurer]"), function (b) {
      b.addEventListener("click", function () {
        var id = Q.jeu.restaurerProfilCorbeille(b.getAttribute("data-restaurer"));
        if (id) {
          Q.ui.toast("Profil restauré.", "ok");
          Q.router.go("home");
        } else {
          Q.ui.toast("Profil introuvable dans la corbeille.", "ko");
        }
      });
    });
  };
})(window.Quete);
