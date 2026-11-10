/* Bilan de quête : étoiles, or, erreurs à revoir, badges */
(function (Q) {
  "use strict";

  Q.screens.resultat = function (el, params) {
    var res = params.resultat;
    if (!res) { Q.router.go("map"); return; }

    var a = res.aventureId ? Q.aventure(res.aventureId) : null;
    var titre = res.revision ? "Révision terminée !" : res.gardien ? "Gardien vaincu !" : "Quête terminée !";
    var sousTitre = res.revision ? "Ta mémoire te remercie." :
      res.parfait ? "Sans aucune erreur du premier coup, bravo !" :
      res.premierCoup >= res.total - 1 ? "Presque parfait, continue comme ça." :
      "Chaque essai compte : tu progresses.";

    var revoir = (res.revoir || []).filter(function (x) { return x.phrase; }).slice(0, 4);
    var revoirHtml = revoir.length
      ? '<div class="carte carte--souple revoir"><h3>' + Q.ui.icon("carnet") + " À revoir</h3>" +
        revoir.map(function (x) {
          return '<div class="revoir__ligne"><span>' +
            Q.ui.phraseHTML(x.phrase.texte, {}) + "</span>" +
            '<span class="pousse revoir__bonne">' + Q.ui.echapper(Q.formeAttendue(x.phrase)) + "</span></div>";
        }).join("") + "</div>"
      : "";

    var aiguilleHtml = "";
    if (res.gardien && a) {
      aiguilleHtml = '<div class="encart encart--info rangee" style="justify-content:center;gap:8px">' +
        Q.ui.emoji("boussole", "") + " <strong>Aiguille « " + Q.ui.echapper(Q.ui.tempsLabel(a.temps)) + " » récupérée !</strong></div>";
    }

    el.innerHTML = '<div class="resultat">' +
      "<h1>" + titre + "</h1>" +
      '<p class="discret">' + sousTitre + "</p>" +
      '<div class="resultat__etoiles">' + Q.ui.etoiles(res.etoiles, 3) + "</div>" +
      '<p class="discret">' + res.premierCoup + " bonne" + (res.premierCoup > 1 ? "s" : "") +
        " réponse" + (res.premierCoup > 1 ? "s" : "") + " du premier coup sur " + res.total + "</p>" +
      aiguilleHtml +
      '<div class="carte espace-haut">' +
        '<div class="stats-grille">' +
          '<div class="stat"><div class="stat__valeur">+' + ((res.orGagne || 0) + (res.bonus || 0)) + '</div><div class="stat__label">pièces d\'or</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + Q.ui.duree(res.duree) + '</div><div class="stat__label">durée</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + Q.etat.serie.record + '</div><div class="stat__label">record d\'affilée</div></div>' +
        "</div>" +
        revoirHtml +
        '<div class="rangee espace-haut" style="justify-content:center">' +
          (res.revision ? "" : '<button class="btn btn--primaire btn--lg" data-action="rejouer">' + Q.ui.emoji("boussole", "") + " Rejouer</button>") +
          '<button class="btn btn--secondaire btn--lg" data-nav="map">Carte</button>' +
          '<button class="btn btn--secondaire btn--lg" data-nav="boutique">Boutique</button>' +
        "</div>" +
      "</div>" +
    "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-action]"), function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-action") !== "rejouer") return;
        if (!res.aventureId || !res.niveauId) { Q.router.go("map"); return; }
        var quest = Q.session.construire({ aventureId: res.aventureId, niveauId: res.niveauId, mode: res.gardien ? "gardien" : "niveau" });
        if (!quest) { Q.ui.toast("Impossible de relancer cette quête.", "ko"); return; }
        Q.etat.quest = quest;
        Q.jeu.sauver();
        Q.router.go("quete");
      });
    });

    if (res.nouveauxBadges && res.nouveauxBadges.length) {
      var liste = res.nouveauxBadges.map(function (b) {
        return '<div class="rangee" style="gap:12px;align-items:center;padding:8px 0">' +
          '<span class="badge-item__medaille badge-item--obtenu" style="margin:0">' + Q.ui.icon(b.icone) + "</span>" +
          "<div><strong>" + Q.ui.echapper(b.nom) + "</strong><div class=\"discret\">" + Q.ui.echapper(b.desc) + "</div></div>" +
          "</div>";
      }).join("");
      Q.ui.modale({
        titre: "Nouveau badge !",
        contenu: liste,
        actions: [{ label: "Youpi !", classe: "btn--primaire" }]
      });
      Q.audio.son("fanfare");
    }
  };
})(window.Quete);
