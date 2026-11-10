/* Carte de l'Archipel : chemin des îles, révision, accès annexes */
(function (Q) {
  "use strict";

  Q.screens.map = function (el) {
    if (!Q.jeu.aProfil()) {
      Q.router.go("home");
      return;
    }

    var ordre = Q.ordreAventures();
    var aiguilles = Q.etat.aiguilles.length;
    var dues = Q.srs.dues().length;
    var queteEnCours = Q.etat.quest && !Q.etat.quest.fini;

    var noeuds = ordre.map(function (a) {
      var debloque = Q.jeu.ileDebloquee(a.id);
      var etoiles = Q.jeu.etoilesIle(a.id);
      var conquise = Q.jeu.ileConquise(a.id);
      return '<button class="noeud ' + (debloque ? "" : "noeud--verrou") + '" data-ile="' + a.id + '"' +
        (debloque ? "" : " disabled aria-disabled=\"true\"") + ">" +
        '<span class="noeud__vignette" style="background-image:url(\'' + a.fond + '\')"></span>' +
        '<span class="noeud__corps">' +
        '<span class="noeud__nom">' + Q.ui.echapper(a.nom) + "</span>" +
        '<span class="noeud__temps">' + Q.ui.echapper(a.sousTitre) + "</span>" +
        '<span class="noeud__pied">' + Q.ui.compteurEtoiles(etoiles, 12) +
        (conquise ? ' <span class="aiguille-pilule">' + Q.ui.emoji("boussole", "") + " conquise</span>" : "") +
        "</span></span>" +
        (debloque ? "" : '<span class="noeud__cadenas">' + Q.ui.icon("cadenas") + "</span>") +
        "</button>";
    }).join("");

    var bandeauRevision = dues > 0
      ? '<div class="carte carte--souple rangee rangee--entre" style="gap:10px">' +
          "<div><strong>" + Q.ui.icon("sablier") + " Révision du jour</strong>" +
          '<div class="discret">' + dues + " conjugaison" + (dues > 1 ? "s" : "") + " à revoir pour ne pas oublier.</div></div>" +
          '<button class="btn btn--mer" data-action="revision">Réviser 2 min</button>' +
        "</div>"
      : '<div class="carte carte--souple rangee rangee--entre" style="gap:10px">' +
          "<div><strong>" + Q.ui.icon("coche") + " Tout est à jour</strong>" +
          '<div class="discret">Reviens demain : la mémoire aime les petits rappels.</div></div>' +
        "</div>";

    el.innerHTML = Q.ui.hud() +
      '<div class="titre-section"><h1 style="margin:0">Carte de l\'Archipel</h1></div>' +
      '<p class="discret" style="margin-top:-6px">Une île se débloque avec ' + Q.curriculum().prerequisIle + " étoiles sur 12. Chaque île garde une aiguille de la Boussole.</p>" +
      (queteEnCours ? '<div class="encart encart--info rangee rangee--entre" style="margin-bottom:14px;gap:10px">' +
        "<span>" + Q.ui.icon("carte") + " Une quête est en cours.</span>" +
        '<button class="btn btn--mer" data-action="reprendre-quete">Reprendre</button></div>' : "") +
      bandeauRevision +
      '<div class="chemin espace-haut">' + noeuds + "</div>" +
      '<div class="carte carte--souple espace-haut">' +
        '<div class="rangee" style="justify-content:space-between">' +
          '<button class="btn btn--secondaire" data-nav="carnet">' + Q.ui.icon("carnet") + " Carnet de bord</button>" +
          '<button class="btn btn--secondaire" data-nav="boutique">' + Q.ui.icon("coffre") + " Boutique</button>" +
          '<button class="btn btn--secondaire" data-nav="reglages">' + Q.ui.icon("engrenage") + " Réglages</button>" +
          '<button class="btn btn--fantome" id="btn-parent" title="Espace parent (appui long)">' + Q.ui.icon("cadenas") + " Parents</button>" +
        "</div>" +
      "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-ile]"), function (b) {
      b.addEventListener("click", function () {
        Q.audio.son("page");
        Q.router.go("ile", { id: b.getAttribute("data-ile") });
      });
    });

    Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-action");
        if (a === "reprendre-quete") Q.router.go("quete");
        if (a === "revision") {
          var quest = Q.session.construireRevision();
          if (!quest) {
            Q.ui.toast("Rien à réviser pour le moment.", "ok");
            return;
          }
          Q.etat.quest = quest;
          Q.jeu.sauver();
          Q.router.go("quete");
        }
      });
    });

    /* Espace parent : appui long (souris ou doigt), Entrée au clavier. */
    var btnParent = el.querySelector("#btn-parent");
    if (btnParent) {
      var minuteur = null;
      var ouvrir = function () {
        minuteur = null;
        Q.router.go("parent");
      };
      var demarrer = function () {
        minuteur = setTimeout(ouvrir, 1200);
      };
      var annuler = function () {
        if (minuteur) clearTimeout(minuteur);
        minuteur = null;
      };
      btnParent.addEventListener("pointerdown", demarrer);
      btnParent.addEventListener("pointerup", annuler);
      btnParent.addEventListener("pointerleave", annuler);
      btnParent.addEventListener("pointercancel", annuler);
      btnParent.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ouvrir(); }
      });
    }
  };
})(window.Quete);
