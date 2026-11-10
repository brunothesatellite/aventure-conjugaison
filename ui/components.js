/* ============================================================
   components.js — briques d'interface partagées
   ============================================================ */
(function (Q) {
  "use strict";

  var ui = (Q.ui = {});

  ui.echapper = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* Les pictos sont intégrés en SVG inline (assets/icons-inline.js).
     Un SVG chargé comme masque CSS est bloqué en file:// : les icônes
     devenaient invisibles au double-clic sur index.html. */
  ui.svg = function (nom, classe) {
    var ico = Q.iconesSVG && Q.iconesSVG[nom];
    if (!ico) return '<span class="' + (classe || "") + '" aria-hidden="true"></span>';
    return '<svg class="' + (classe || "") + '" viewBox="' + ico.vb +
      '" fill="currentColor" aria-hidden="true" focusable="false">' + ico.c + "</svg>";
  };

  ui.icon = function (nom, classe) {
    return ui.svg(nom, "ico" + (classe ? " " + classe : ""));
  };

  ui.emoji = function (nom, alt, classe) {
    return '<img class="emoji ' + (classe || "") + '" src="assets/img/emoji/' + nom + '.svg" alt="' +
      ui.echapper(alt || "") + '">';
  };

  /* Libellé d'un temps, partagé par tous les écrans. */
  var TEMPS_LABEL = {
    present: "Présent",
    imparfait: "Imparfait",
    futur: "Futur simple",
    passe_compose: "Passé composé",
    mixte: "Révision mêlée"
  };

  ui.tempsLabel = function (t) {
    return TEMPS_LABEL[t] || t;
  };

  /* Une pièce d'or lisible même en petit : Twemoji plutôt qu'un
     picto détaillé qui se transforme en pâté à 20 px. */
  ui.piece = function () {
    return ui.emoji("piece", "");
  };

  ui.or = function (n) {
    return '<span class="hud__compteur hud__compteur--or">' + ui.piece() + " <span>" + n + "</span></span>";
  };

  ui.etoiles = function (n, max) {
    var html = '<span class="etoiles" role="img" aria-label="' + n + " étoile" + (n > 1 ? "s" : "") + " sur " + (max || 3) + '">';
    for (var i = 0; i < (max || 3); i++) {
      html += ui.svg("etoile", "etoile" + (i < n ? " etoile--pleine" : ""));
    }
    return html + "</span>";
  };

  ui.compteurEtoiles = function (n, max) {
    return '<span class="aiguille-pilule ' + (n === 0 ? "aiguille-pilule--vide" : "") + '">' +
      ui.icon("etoile") + " " + n + "/" + max + "</span>";
  };

  ui.classePronom = function (p) {
    if (p === "je" || p === "tu") return "pronom--je";
    if (p === "il" || p === "elle") return "pronom--il";
    if (p === "nous" || p === "vous") return "pronom--nous";
    return "pronom--ils";
  };

  /* Transforme « Tu {trou} le capitaine » en HTML avec le pronom coloré
     et le trou (vide ou rempli). */
  ui.phraseHTML = function (texte, options) {
    options = options || {};
    var morceaux = String(texte).split("{trou}");
    var avant = ui.echapper(morceaux[0]);
    var apres = ui.echapper(morceaux.slice(1).join(""));

    /* Les formes longues d'abord : « Elles » avant « Elle », sinon le
       « s » final resterait hors du mot coloré. */
    var trouve = avant.match(/^(J'|Elles|Elle|Ils|Il|Nous|Vous|Tu|Je|On)/i);
    if (trouve) {
      var mot = trouve[1];
      var base = mot.replace("'", "").toLowerCase();
      avant = avant.replace(trouve[0], '<span class="pronom ' + ui.classePronom(base) + '">' + mot + "</span>");
    }

    var contenu = options.reponse
      ? '<span class="trou trou--rempli">' + ui.echapper(options.reponse) + "</span>"
      : '<span class="trou" aria-label="mot à compléter">?</span>';

    return avant + contenu + apres;
  };

  ui.hud = function () {
    var p = Q.etat.profil || { nom: "Moussaillon", avatar: "chevalier" };
    var rang = Q.jeu.rang();
    var aiguilles = Q.etat.aiguilles.length;
    return '<div class="hud">' +
      '<button class="btn btn--fantome" data-nav="home" style="gap:8px;padding:4px 10px 4px 4px" aria-label="Accueil">' +
        '<span class="hud__avatar">' + ui.emoji(ui.avatarEmoji(p.avatar), "") + "</span>" +
        '<span style="text-align:left"><span class="hud__nom">' + ui.echapper(p.nom) + "</span><br>" +
        '<span class="hud__rang">' + ui.echapper(rang.courant.nom) + "</span></span>" +
      "</button>" +
      '<span class="pousse"></span>' +
      ui.or(Q.etat.or) +
      '<span class="hud__compteur" title="Aiguilles de la Boussole">' + ui.emoji("boussole", "") + " " + aiguilles + "/4</span>" +
      "</div>";
  };

  ui.avatarEmoji = function (id) {
    var map = {
      chevalier: "epee", magicienne: "magicienne", pirate: "pirate",
      sirene: "sirene", explorateur: "boussole", mousse: "chapeau"
    };
    return map[id] || "epee";
  };

  ui.avatarNom = function (id) {
    var map = { chevalier: "Chevalier", magicienne: "Magicienne", pirate: "Capitaine pirate", sirene: "Sirène", explorateur: "Exploratrice", mousse: "Mousse" };
    return map[id] || "Moussaillon";
  };

  ui.toast = function (message, type) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.className = "toast visible" + (type ? " toast--" + type : "");
    t.textContent = message;
    clearTimeout(t.__minuteur);
    t.__minuteur = setTimeout(function () { t.className = "toast"; }, 2600);
  };

  ui.pluieDePieces = function () {
    var zone = document.getElementById("pluie");
    if (!zone) return;
    for (var i = 0; i < 12; i++) {
      var s = document.createElement("span");
      s.textContent = "🪙";
      s.style.left = Math.round(Math.random() * 96) + "%";
      s.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
      zone.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 1900); })(s);
    }
  };

  ui.modale = function (options) {
    var racine = document.getElementById("modale");
    if (!racine) return;
    var actions = (options.actions || []).map(function (a, i) {
      return '<button class="btn ' + (a.classe || "btn--secondaire") + '" data-action="' + i + '">' + a.label + "</button>";
    }).join("");

    racine.innerHTML = '<div class="modale__boite" role="dialog" aria-modal="true" aria-label="' +
      ui.echapper(options.titre || "Information") + '">' +
      (options.titre ? "<h2>" + options.titre + "</h2>" : "") +
      '<div class="modale__contenu">' + (options.contenu || "") + "</div>" +
      (actions ? '<div class="modale__actions">' + actions + "</div>" : "") +
      "</div>";
    racine.hidden = false;
    document.body.classList.add("modale-ouverte");

    var boutons = racine.querySelectorAll("[data-action]");
    Array.prototype.forEach.call(boutons, function (b, i) {
      b.addEventListener("click", function () {
        var a = options.actions[i];
        if (a && a.action) a.action();
        if (!a || a.fermer !== false) ui.fermerModale();
      });
    });
    var premier = racine.querySelector("button");
    if (premier) premier.focus();
  };

  ui.fermerModale = function () {
    var racine = document.getElementById("modale");
    if (racine) {
      racine.hidden = true;
      racine.innerHTML = "";
      document.body.classList.remove("modale-ouverte");
    }
  };

  ui.confirmer = function (titre, texte, oui) {
    return new Promise(function (resoudre) {
      ui.modale({
        titre: titre,
        contenu: "<p>" + texte + "</p>",
        actions: [
          { label: oui || "Oui", classe: "btn--primaire", action: function () { resoudre(true); } },
          { label: "Annuler", classe: "btn--secondaire", action: function () { resoudre(false); } }
        ]
      });
    });
  };

  ui.duree = function (secondes) {
    var m = Math.floor((secondes || 0) / 60);
    var s = (secondes || 0) % 60;
    return m + " min " + (s < 10 ? "0" : "") + s + " s";
  };

  ui.dateFr = function (ts) {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return "";
    }
  };

  /* Parchemin de récompense, partagé par la boutique et le carnet. */
  ui.parcheminRecompense = function (r) {
    r = r || {};
    var nom = (Q.etat.profil && Q.etat.profil.nom) || "Moussaillon";
    return '<div class="parchemin-recompense">' +
      '<p class="discret">La Quête des Verbes</p>' +
      '<div class="parchemin-recompense__icone">' + ui.icon(Q.iconeRecompense(r, 0)) + "</div>" +
      "<h3>" + ui.echapper(r.texte || "Récompense") + "</h3>" +
      "<p>Accordé à <strong>" + ui.echapper(nom) + "</strong></p>" +
      "<p>pour " + (r.prix || 0) + " pièces d'or durement gagnées.</p>" +
      '<span class="parchemin-recompense__tampon">VALIDÉ</span>' +
      '<p class="discret" style="margin-top:10px">' +
        (ui.dateFr(r.date || r.achetee) || ui.dateFr(Date.now())) + "</p>" +
      "</div>";
  };

  /* Délégation simple pour les boutons « retour ». */
  ui.boutonRetour = function (cible) {
    return '<button class="btn btn--fantome" data-nav="' + (cible || "map") + '">← Retour</button>';
  };
})(window.Quete);
