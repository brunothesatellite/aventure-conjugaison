/* Hub d'une île : niveaux, étoiles, Gardien */
(function (Q) {
  "use strict";

  Q.screens.ile = function (el, params) {
    var a = Q.aventure(params.id);
    if (!a) { Q.router.go("map"); return; }

    var etoilesIle = Q.jeu.etoilesIle(a.id);
    var niveaux = a.niveaux.map(function (n, i) {
      var prog = Q.etat.progression[n.id] || { etoiles: 0, meilleur: 0 };
      var debloque = Q.jeu.niveauDebloque(a.id, n);
      return '<div class="niveau-ligne ' + (debloque ? "" : "niveau-ligne--verrou") + '">' +
        '<span class="niveau-ligne__num">' + (i + 1) + "</span>" +
        '<div class="niveau-ligne__corps">' +
          '<div class="niveau-ligne__titre">' + Q.ui.echapper(n.titre) + "</div>" +
          '<div class="niveau-ligne__meta">' + Q.ui.echapper(n.groupe) + " · " + n.verbes.length + " verbes</div>" +
        "</div>" +
        Q.ui.etoiles(prog.etoiles, 3) +
        '<button class="btn ' + (debloque ? "btn--primaire" : "btn--secondaire") + '" data-niveau="' + n.id + '"' +
          (debloque ? "" : " disabled") + ">" + (debloque ? "Jouer" : "Verrouillé") + "</button>" +
        "</div>";
    }).join("");

    var pret = Q.jeu.gardienDebloque(a.id);
    var dejaVaincu = Q.etat.aiguilles.indexOf(a.temps) !== -1;
    var gardienHtml = '<div class="carte carte--bois' + (dejaVaincu ? " gardien--vaincu" : "") + ' espace-haut">' +
      '<div class="rangee">' +
        '<span class="article__visuel" style="background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.35)">' + Q.ui.icon(a.gardien.icone) + "</span>" +
        "<div style=\"flex:1;min-width:200px\">" +
          '<h3 style="margin:0">' + Q.ui.echapper(a.gardien.nom) +
            (dejaVaincu
              ? ' <span class="gardien__vaincu">' + Q.ui.icon("coche") + " Vaincu</span>"
              : "") +
          "</h3>" +
          '<p class="discret" style="color:#f3e5c8;margin:2px 0 0">' + Q.ui.echapper(a.gardien.description) + "</p>" +
        "</div>" +
        '<button class="btn btn--primaire" data-gardien="1"' + (pret ? "" : " disabled") + ">" +
          (pret ? (dejaVaincu ? "Défier à nouveau" : "Défier") : "Termine les 4 niveaux") + "</button>" +
      "</div></div>";

    el.innerHTML = Q.ui.hud() +
      Q.ui.boutonRetour("map") +
      '<div class="ile-entete" style="background-image:url(\'' + a.fond + "');margin-top:12px\">" +
        '<div class="ile-entete__voile"><h1>' + Q.ui.echapper(a.nom) + "</h1>" +
        "<p>" + Q.ui.echapper(a.description) + "</p></div>" +
      "</div>" +
      '<div class="carte">' +
        '<div class="rangee rangee--entre" style="margin-bottom:12px">' +
          "<div><strong>" + Q.ui.echapper(a.sousTitre) + "</strong>" +
          '<div class="discret">Aiguille : ' + Q.ui.echapper(Q.ui.tempsLabel(a.temps)) + "</div></div>" +
          Q.ui.compteurEtoiles(etoilesIle, 12) +
        "</div>" +
        niveaux +
      "</div>" +
      gardienHtml;

    Array.prototype.forEach.call(el.querySelectorAll("[data-niveau]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-niveau");
        lancer({ aventureId: a.id, niveauId: id, mode: "niveau" });
      });
    });
    var g = el.querySelector("[data-gardien]");
    if (g) {
      g.addEventListener("click", function () {
        lancer({ aventureId: a.id, niveauId: null, mode: "gardien" });
      });
    }

    function lancer(options) {
      var quest = Q.session.construire(options);
      if (!quest || !quest.questions.length) {
        Q.ui.toast("Pas assez de phrases pour ce niveau.", "ko");
        return;
      }
      Q.etat.quest = quest;
      Q.jeu.sauver();
      Q.audio.son("fanfare");
      Q.router.go("quete");
    }
  };
})(window.Quete);
