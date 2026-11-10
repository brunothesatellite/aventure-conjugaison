/* Boutique : familiers, cosmétiques, récompenses des parents */
(function (Q) {
  "use strict";

  Q.screens.boutique = function (el) {
    var familles = Q.catalogue.familiers.map(function (f) {
      var possede = Q.achat.possede("familier", f.id);
      return '<div class="article ' + (possede ? "article--possede" : "") + '">' +
        '<div class="article__visuel">' + visuelDe(f.icone) + "</div>" +
        '<div class="article__nom">' + Q.ui.echapper(f.nom) + "</div>" +
        '<div class="article__desc">' + Q.ui.echapper(f.desc) + "</div>" +
        (possede
          ? '<span class="pastille-possede">' + Q.ui.icon("coche") + " à bord</span>"
          : '<div class="article__prix">' + Q.ui.piece() + " " + f.prix + "</div>" +
            '<button class="btn btn--primaire" data-acheter="familier:' + f.id + '">Adopter</button>') +
        "</div>";
    }).join("");

    var cosmetiques = Q.catalogue.cosmetiques.map(function (c) {
      var possede = Q.achat.possede("cosmetique", c.id);
      return '<div class="article ' + (possede ? "article--possede" : "") + '">' +
        '<div class="article__visuel">' + visuelDe(c.icone) + "</div>" +
        '<div class="article__nom">' + Q.ui.echapper(c.nom) + "</div>" +
        '<div class="article__desc">' + Q.ui.echapper(c.desc) + "</div>" +
        (possede
          ? '<span class="pastille-possede">' + Q.ui.icon("coche") + " possédé</span>"
          : '<div class="article__prix">' + Q.ui.piece() + " " + c.prix + "</div>" +
            '<button class="btn btn--secondaire" data-acheter="cosmetique:' + c.id + '">Acheter</button>') +
        "</div>";
    }).join("");

    var recompenses = (Q.etat.recompenses || []).length
      ? Q.etat.recompenses.map(function (r, i) {
          return '<div class="article">' +
            '<div class="article__visuel">' + Q.ui.icon(Q.iconeRecompense(r, i)) + "</div>" +
            '<div class="article__nom">' + Q.ui.echapper(r.texte) + "</div>" +
            '<div class="article__desc">À montrer à un parent une fois échangé.</div>' +
            '<div class="article__prix">' + Q.ui.piece() + " " + r.prix + "</div>" +
            '<button class="btn btn--primaire" data-recompense="' + i + '"' + (Q.etat.or < r.prix ? " disabled" : "") + ">Échanger</button>" +
            "</div>";
        }).join("")
      : '<div class="encart">Aucune récompense configurée pour le moment. Un parent peut en ajouter dans son espace (cadenas sur la carte).</div>';

    el.innerHTML = Q.ui.hud() +
      Q.ui.boutonRetour("map") +
      '<div class="titre-section espace-haut-sm"><h1 style="margin:0">La Cabane du Marchand</h1></div>' +
      '<p class="discret">Tu as <strong>' + Q.etat.or + " pièces d'or</strong>. Les familiers t'aident pendant les quêtes.</p>" +
      '<h2 class="espace-haut">Familiers</h2>' +
      '<div class="grille-articles">' + familles + "</div>" +
      '<h2 class="espace-haut">Déguisements <span class="discret">(' + Q.etat.cosmetiques.length + "/" + Q.catalogue.cosmetiques.length + ")</span></h2>" +
      '<div class="grille-articles">' + cosmetiques + "</div>" +
      '<h2 class="espace-haut">Récompenses</h2>' +
      '<div class="grille-articles">' + recompenses + "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-acheter]"), function (b) {
      b.addEventListener("click", function () {
        var morceaux = b.getAttribute("data-acheter").split(":");
        var type = morceaux[0], id = morceaux[1];
        var prix = Q.achat.prix(type, id);
        var nom = nomArticle(type, id);
        if (prix > 80) {
          Q.ui.confirmer("Adopter " + nom + " ?", "Cela coûte " + prix + " pièces d'or. Il te restera " + (Q.etat.or - prix) + ".", "Oui, adopter")
            .then(function (ok) { if (ok) acheter(type, id); });
        } else {
          acheter(type, id);
        }
      });
    });

    Array.prototype.forEach.call(el.querySelectorAll("[data-recompense]"), function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.getAttribute("data-recompense"), 10);
        var r = Q.achat.acheterRecompense(i);
        if (!r.ok) {
          Q.ui.toast(r.raison === "or" ? "Il te manque des pièces d'or." : "Récompense indisponible.", "ko");
          return;
        }
        Q.audio.son("fanfare");
        Q.ui.modale({
          titre: "Parchemin de réussite",
          contenu: Q.ui.parcheminRecompense(r.achat || r.recompense),
          actions: [
            { label: "Imprimer", classe: "btn--secondaire", action: function () { window.print(); }, fermer: false },
            { label: "Montrer à mes parents", classe: "btn--primaire" }
          ]
        });
        Q.router.rafraichir();
      });
    });

    function visuelDe(icone) {
      /* « picto: » = icône monochrome du jeu ; sinon c'est un Twemoji. */
      if (icone.indexOf("picto:") === 0) {
        return Q.ui.icon(icone.slice("picto:".length), "ico--article");
      }
      var map = { perroquet: "perroquet", dragonneau: "dragon", cheval: "cheval", mousse: "chapeau" };
      return Q.ui.emoji(map[icone] || icone, "");
    }

    function nomArticle(type, id) {
      var liste = type === "familier" ? Q.catalogue.familiers : Q.catalogue.cosmetiques;
      var item = liste.filter(function (x) { return x.id === id; })[0];
      return item ? item.nom : id;
    }

    function acheter(type, id) {
      var r = Q.achat.acheter(type, id);
      if (!r.ok) {
        Q.ui.toast(r.raison === "or" ? "Pas assez de pièces d'or." : "Tu l'as déjà !", "ko");
        return;
      }
      Q.audio.son("piece");
      Q.ui.toast("Bienvenue à bord !", "ok");
      Q.router.rafraichir();
    }
  };
})(window.Quete);
