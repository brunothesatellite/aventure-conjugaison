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
            boutonAchat("familier", f.id, f.prix, "Adopter", "btn--primaire")) +
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
            boutonAchat("cosmetique", c.id, c.prix, "Acheter", "btn--secondaire")) +
        "</div>";
    }).join("");

    var recompenses = (Q.etat.recompenses || []).length
      ? Q.etat.recompenses.map(function (r, i) {
          return '<div class="article">' +
            '<div class="article__visuel">' + Q.ui.icon(Q.iconeRecompense(r, i)) + "</div>" +
            '<div class="article__nom">' + Q.ui.echapper(r.texte) + "</div>" +
            '<div class="article__desc">À montrer à un parent une fois échangé.</div>' +
            '<div class="article__prix">' + Q.ui.piece() + " " + r.prix + "</div>" +
            '<button class="btn btn--primaire" data-recompense="' + i + '"' + (Q.etat.or < r.prix ? ' disabled aria-disabled="true" title="Il te manque ' + (r.prix - Q.etat.or) + " pièces d'or\"" : "") + ">Échanger</button>" +
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
        if (b.disabled) return;
        var morceaux = b.getAttribute("data-acheter").split(":");
        var type = morceaux[0], id = morceaux[1];
        var prix = Q.achat.prix(type, id);
        var nom = nomArticle(type, id);
        if (prix > Q.etat.or) {
          Q.ui.toast("Il te manque " + manque(prix) + " pour " + nom + ".", "ko");
          return;
        }
        if (prix > 80) {
          var verbe = type === "familier" ? "Adopter" : "Acheter";
          Q.ui.confirmer(verbe + " " + nom + " ?", "Cela coûte " + prix + " pièces d'or. Il te restera " + (Q.etat.or - prix) + ".", type === "familier" ? "Oui, je l'adopte" : "Oui, je l'achète")
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
      return Q.ui.visuelArticle(icone, "ico--article");
    }

    function manque(prix) {
      var n = prix - Q.etat.or;
      return n + (n > 1 ? " pièces d'or" : " pièce d'or");
    }

    /* Bouton d'achat désactivé tant que la bourse est trop légère. */
    function boutonAchat(type, id, prix, libelle, classe) {
      var assez = Q.etat.or >= prix;
      return '<button class="btn ' + classe + '" data-acheter="' + type + ":" + id + '"' +
        (assez ? "" : ' disabled aria-disabled="true" title="Il te manque ' + manque(prix) + '"') +
        ">" + libelle + "</button>";
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
