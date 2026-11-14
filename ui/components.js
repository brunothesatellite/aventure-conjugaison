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

  /* Visuel d'un article de la boutique (familier ou déguisement) :
     « picto: » = icône monochrome du jeu, sinon un Twemoji. */
  ui.visuelArticle = function (icone, classe) {
    icone = String(icone || "");
    if (icone.indexOf("picto:") === 0) {
      return ui.icon(icone.slice("picto:".length), classe);
    }
    var map = { perroquet: "perroquet", dragonneau: "dragon", cheval: "cheval", mousse: "chapeau" };
    return ui.emoji(map[icone] || icone, "", classe);
  };

  /* ---------- Aperçu flottant (déguisements, badges) ----------

     Une seule bulle pour toute l'application : au survol (souris)
     ou au focus (clavier), une carte façon boutique / carnet
     apparaît au-dessus de l'icône. Sur écran tactile, un appui
     l'ouvre et un appui ailleurs la referme. */

  var bulleApercu = null;

  function creerBulle() {
    if (bulleApercu && document.body.contains(bulleApercu)) return bulleApercu;
    bulleApercu = document.createElement("div");
    bulleApercu.className = "apercu-fixe";
    bulleApercu.setAttribute("role", "tooltip");
    bulleApercu.hidden = true;
    document.body.appendChild(bulleApercu);
    return bulleApercu;
  }

  function htmlApercu(type, id) {
    if (type === "badge") {
      var b = Q.badges && Q.badges.parId(id);
      if (!b) return "";
      return '<div class="apercu apercu--badge">' +
        '<span class="apercu__visuel">' + ui.icon(b.icone) + "</span>" +
        '<span class="apercu__nom">' + ui.echapper(b.nom) + "</span>" +
        '<span class="apercu__desc">' + ui.echapper(b.desc) + "</span>" +
        "</div>";
    }
    var c = (Q.catalogue.cosmetiques || []).filter(function (x) { return x.id === id; })[0];
    if (!c) return "";
    return '<div class="apercu apercu--article">' +
      '<span class="apercu__visuel">' + ui.visuelArticle(c.icone, "") + "</span>" +
      '<span class="apercu__nom">' + ui.echapper(c.nom) + "</span>" +
      '<span class="apercu__desc">' + ui.echapper(c.desc) + "</span>" +
      '<span class="pastille-possede">' + ui.icon("coche") + " possédé</span>" +
      "</div>";
  }

  function placerBulle(cible) {
    var bulle = creerBulle();
    var r = cible.getBoundingClientRect();
    var b = bulle.getBoundingClientRect();
    var marge = 8;
    var gauche = r.left + r.width / 2 - b.width / 2;
    gauche = Math.max(marge, Math.min(gauche, window.innerWidth - b.width - marge));
    var haut = r.top - b.height - marge;
    if (haut < marge) haut = Math.min(window.innerHeight - b.height - marge, r.bottom + marge);
    bulle.style.left = Math.round(gauche) + "px";
    bulle.style.top = Math.round(haut) + "px";
  }

  ui.apercu = function (cible) {
    var spec = String(cible.getAttribute("data-apercu") || "").split(":");
    var html = htmlApercu(spec[0], spec[1]);
    if (!html) return;
    var bulle = creerBulle();
    bulle.innerHTML = html;
    bulle.style.left = "-9999px";
    bulle.style.top = "0";
    bulle.hidden = false;
    bulle.__cible = cible;
    placerBulle(cible);
  };

  ui.cacherApercu = function () {
    if (!bulleApercu) return;
    bulleApercu.hidden = true;
    bulleApercu.innerHTML = "";
    bulleApercu.__cible = null;
  };

  /* Branche l'aperçu sur tous les éléments [data-apercu] d'un écran. */
  ui.lierApercus = function (racine) {
    Array.prototype.forEach.call(racine.querySelectorAll("[data-apercu]"), function (b) {
      b.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "touch") return;
        ui.apercu(b);
      });
      b.addEventListener("pointerleave", function (e) {
        if (e.pointerType === "touch") return;
        ui.cacherApercu();
      });
      b.addEventListener("focus", function () {
        var visible = true;
        try { visible = b.matches(":focus-visible"); } catch (err) { visible = true; }
        if (visible) ui.apercu(b);
      });
      b.addEventListener("blur", ui.cacherApercu);
      b.addEventListener("click", function () {
        /* Sur écran tactile, l'appui ouvre puis referme la carte. */
        if (window.matchMedia && window.matchMedia("(hover: hover)").matches) return;
        if (bulleApercu && bulleApercu.__cible === b && !bulleApercu.hidden) ui.cacherApercu();
        else ui.apercu(b);
      });
    });
  };

  document.addEventListener("pointerdown", function (e) {
    if (!bulleApercu || bulleApercu.hidden) return;
    if (e.target && e.target.closest && e.target.closest("[data-apercu]")) return;
    ui.cacherApercu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") ui.cacherApercu();
  });
  window.addEventListener("scroll", function () { ui.cacherApercu(); }, true);
  window.addEventListener("resize", function () { ui.cacherApercu(); });

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
