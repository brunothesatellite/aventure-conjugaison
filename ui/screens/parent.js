/* Espace parent : code PIN, statistiques, récompenses, sauvegarde */
(function (Q) {
  "use strict";

  Q.parentDebloque = false;
  var saisiePin = "";

  Q.screens.parent = function (el) {
    if (!Q.etat.pin) { ecranCreationPin(el); return; }
    if (!Q.parentDebloque) { ecranSaisiePin(el); return; }
    tableauDeBord(el);
  };

  /* ---------- Création du code ---------- */
  function ecranCreationPin(el) {
    el.innerHTML = Q.ui.boutonRetour("map") +
      '<div class="carte" style="max-width:460px;margin:24px auto">' +
        '<h1>' + Q.ui.icon("cadenas") + " Espace parent</h1>" +
        '<p>Choisis un code à 4 chiffres. Il évite les clics par erreur : ce n\'est pas un coffre-fort.</p>' +
        '<label class="label" for="pin1">Code à 4 chiffres</label>' +
        '<input class="champ" id="pin1" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off">' +
        '<label class="label" for="pin2">Répète le code</label>' +
        '<input class="champ" id="pin2" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off">' +
        '<button class="btn btn--primaire btn--bloc espace-haut" data-action="creer">Créer le code</button>' +
      "</div>";
    el.querySelector('[data-action="creer"]').addEventListener("click", function () {
      var a = el.querySelector("#pin1").value.trim();
      var b = el.querySelector("#pin2").value.trim();
      if (!/^\d{4}$/.test(a) || a !== b) {
        Q.ui.toast("Les deux codes doivent être identiques (4 chiffres).", "ko");
        return;
      }
      Q.etat.pin = a;
      Q.jeu.sauver();
      Q.parentDebloque = true;
      tableauDeBord(el);
    });
  }

  /* ---------- Saisie du code ---------- */
  function ecranSaisiePin(el) {
    el.innerHTML = Q.ui.boutonRetour("map") +
      '<div class="carte" style="max-width:360px;margin:24px auto;text-align:center">' +
        "<h1>Espace parent</h1>" +
        '<div class="pin-points" id="points">' +
          [0, 1, 2, 3].map(function () { return '<span class="pin-point"></span>'; }).join("") +
        "</div>" +
        '<p class="discret" id="message-pin">Entre le code à 4 chiffres.</p>' +
        '<div class="pin-pave">' +
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) {
            return '<button class="btn btn--secondaire" data-chiffre="' + n + '">' + n + "</button>";
          }).join("") +
          '<button class="btn btn--fantome" data-action="effacer">⌫</button>' +
          '<button class="btn btn--secondaire" data-chiffre="0">0</button>' +
          '<button class="btn btn--fantome" data-action="annuler">✕</button>' +
        "</div>" +
      "</div>";

    function rafraichir() {
      var points = el.querySelectorAll(".pin-point");
      Array.prototype.forEach.call(points, function (p, i) {
        p.classList.toggle("plein", i < saisiePin.length);
      });
      if (saisiePin.length === 4) verifier();
    }

    function verifier() {
      if (saisiePin === Q.etat.pin) {
        Q.parentDebloque = true;
        saisiePin = "";
        Q.audio.son("ok");
        tableauDeBord(el);
      } else {
        Q.audio.son("ko");
        saisiePin = "";
        rafraichir();
        var msg = el.querySelector("#message-pin");
        msg.textContent = "Code incorrect. Réessaie.";
        msg.style.color = "var(--erreur)";
      }
    }

    Array.prototype.forEach.call(el.querySelectorAll("[data-chiffre]"), function (b) {
      b.addEventListener("click", function () {
        if (saisiePin.length >= 4) return;
        saisiePin += b.getAttribute("data-chiffre");
        rafraichir();
      });
    });
    el.querySelector('[data-action="effacer"]').addEventListener("click", function () {
      saisiePin = saisiePin.slice(0, -1);
      rafraichir();
    });
    el.querySelector('[data-action="annuler"]').addEventListener("click", function () {
      saisiePin = "";
      Q.router.go("map");
    });
    rafraichir();
  }

  /* ---------- Tableau de bord ---------- */
  function tableauDeBord(el) {
    var s = Q.etat.stats;
    var srs = Q.srs.stats();
    var erreurs = Object.keys(s.erreurs || {}).sort(function (a, b) { return s.erreurs[b] - s.erreurs[a]; }).slice(0, 6);

    var recompenses = [0, 1, 2].map(function (i) {
      var r = Q.etat.recompenses[i] || { texte: "", prix: [150, 300, 500][i] };
      var icone = Q.iconeRecompense(r, i);
      return '<div class="ligne-recompense">' +
        '<div class="rec-icone">' +
          '<span class="rec-icone__apercu" data-rec-apercu="' + i + '" aria-hidden="true">' + Q.ui.icon(icone) + "</span>" +
          '<select class="champ" data-rec-icone="' + i + '" aria-label="Icône de la récompense ' + (i + 1) + '">' +
            Q.iconesRecompense.map(function (ic) {
              return '<option value="' + ic.id + '"' + (ic.id === icone ? " selected" : "") + ">" +
                Q.ui.echapper(ic.nom) + "</option>";
            }).join("") +
          "</select>" +
        "</div>" +
        '<input type="text" data-rec-texte="' + i + '" maxlength="60" placeholder="Ex. : 15 minutes de console" value="' + Q.ui.echapper(r.texte) + '">' +
        '<input type="number" data-rec-prix="' + i + '" min="10" step="10" value="' + r.prix + '" aria-label="Prix en pièces">' +
        '<button class="btn btn--secondaire" data-rec-save="' + i + '">Enregistrer</button>' +
        "</div>";
    }).join("");

    el.innerHTML = Q.ui.boutonRetour("map") +
      '<div class="titre-section espace-haut-sm"><h1 style="margin:0">Espace parent</h1></div>' +
      '<p class="discret">Aucune donnée ne quitte cet appareil. Tout est stocké dans le navigateur.</p>' +
      ((Q.sauvegardeKO || !Q.storage.disponible)
        ? '<div class="encart encart--attention">La sauvegarde locale est indisponible ou a échoué. Exporte la progression avant de fermer le navigateur.</div>'
        : "") +

      '<div class="carte">' +
        '<h2>Progression</h2>' +
        '<div class="stats-grille">' +
          '<div class="stat"><div class="stat__valeur">' + (Q.etat.compteurs.quetes || 0) + '</div><div class="stat__label">quêtes jouées</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + (s.bonnes || 0) + '</div><div class="stat__label">bonnes réponses</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + (s.questions ? Math.round((s.premierCoup / Math.max(1, s.questions)) * 100) : 0) + ' %</div><div class="stat__label">réussite du 1er coup</div></div>' +
          '<div class="stat"><div class="stat__valeur">' + (srs.aRevoir || 0) + '</div><div class="stat__label">cartes à réviser</div></div>' +
        "</div>" +
        '<p class="discret espace-haut-sm">Îles conquises : ' +
          Q.curriculum().ordre.filter(function (id) { return Q.jeu.ileConquise(id); }).length + "/4 · Aiguilles : " + Q.etat.aiguilles.length + "/4 · Badges : " + Q.etat.badges.length + "/" + Q.badges.liste.length + "</p>" +
      "</div>" +

      '<div class="carte espace-haut"><h2>Points à revoir</h2>' +
        (erreurs.length
          ? '<table class="tableau"><thead><tr><th>Type d\'erreur</th><th>Occurrences</th></tr></thead><tbody>' +
            erreurs.map(function (k) { return "<tr><td>" + Q.ui.echapper(Q.feedback.typesErreurs[k] || k) + "</td><td>" + s.erreurs[k] + "</td></tr>"; }).join("") +
            "</tbody></table>"
          : '<p class="discret">Rien à signaler pour le moment.</p>') +
      "</div>" +

      '<div class="carte espace-haut"><h2>Récompenses réelles</h2>' +
        '<p class="discret">Trois récompenses à échanger contre de l\'or virtuel. L\'enfant imprime un parchemin à vous montrer.</p>' +
        recompenses +
      "</div>" +

      '<div class="carte espace-haut"><h2>Sauvegarde</h2>' +
        '<div class="rangee">' +
          '<button class="btn btn--secondaire" data-action="exporter">Exporter ce joueur</button>' +
          '<button class="btn btn--secondaire" data-action="exporter-tout">Exporter tous les joueurs</button>' +
          '<label class="btn btn--secondaire" style="margin:0">Importer un fichier<input type="file" accept="application/json,.json" id="fichier-import" class="sr-only"></label>' +
        "</div>" +
        '<div class="rangee espace-haut-sm">' +
          '<button class="btn btn--secondaire" data-action="verrouiller">' + Q.ui.icon("cadenas") + " Verrouiller l'espace</button>" +
          '<button class="btn btn--secondaire" data-action="pin">Changer le code</button>' +
          '<button class="btn btn--danger" data-action="reset">Supprimer ce joueur</button>' +
        "</div>" +
        '<div class="encart encart--attention espace-haut-sm">Le code PIN évite les clics par erreur, il ne protège pas contre un enfant déterminé. Pour une vraie protection, gardez l\'appareil hors de portée.</div>' +
      "</div>";

    Array.prototype.forEach.call(el.querySelectorAll("[data-rec-save]"), function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.getAttribute("data-rec-save"), 10);
        var texte = el.querySelector('[data-rec-texte="' + i + '"]').value.trim();
        var prix = parseInt(el.querySelector('[data-rec-prix="' + i + '"]').value, 10) || 150;
        var choix = el.querySelector('[data-rec-icone="' + i + '"]');
        var icone = Q.iconeRecompense({ icone: choix ? choix.value : null }, i);
        if (!texte) {
          Q.etat.recompenses[i] = null;
        } else {
          Q.etat.recompenses[i] = { texte: texte, prix: Math.max(10, prix), icone: icone };
        }
        Q.etat.recompenses = Q.etat.recompenses.filter(Boolean);
        Q.jeu.sauver();
        Q.ui.toast("Récompense enregistrée.", "ok");
      });
    });

    /* Aperçu immédiat de l'icône choisie. */
    Array.prototype.forEach.call(el.querySelectorAll("[data-rec-icone]"), function (sel) {
      sel.addEventListener("change", function () {
        var i = parseInt(sel.getAttribute("data-rec-icone"), 10);
        var apercu = el.querySelector('[data-rec-apercu="' + i + '"]');
        if (apercu) apercu.innerHTML = Q.ui.icon(Q.iconeRecompense({ icone: sel.value }, i));
      });
    });

    function telecharger(contenu, nom) {
      var blob = new Blob([contenu], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = nom;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    var exporter = el.querySelector('[data-action="exporter"]');
    if (exporter) exporter.addEventListener("click", function () {
      telecharger(
        Q.storage.exporter(Q.etat),
        "quete-des-verbes-" + new Date().toISOString().slice(0, 10) + ".json"
      );
      Q.ui.toast("Sauvegarde exportée.", "ok");
    });

    var exporterTout = el.querySelector('[data-action="exporter-tout"]');
    if (exporterTout) exporterTout.addEventListener("click", function () {
      telecharger(
        Q.storage.exporterStore(Q.profils),
        "quete-des-verbes-tous-les-joueurs-" + new Date().toISOString().slice(0, 10) + ".json"
      );
      Q.ui.toast("Tous les joueurs ont été exportés.", "ok");
    });

    var importInput = el.querySelector("#fichier-import");
    if (importInput) importInput.addEventListener("change", function () {
      var f = importInput.files && importInput.files[0];
      if (!f) return;
      var lecteur = new FileReader();
      lecteur.onload = function () {
        var donnees = Q.storage.importer(String(lecteur.result));
        if (!donnees) { Q.ui.toast("Fichier illisible.", "ko"); return; }
        Q.ui.confirmer(
          "Restaurer cette sauvegarde ?",
          "Un nouveau profil sera créé et deviendra actif. Les profils existants sont conservés.",
          "Restaurer"
        ).then(function (ok) {
          if (!ok) return;
          var id = donnees.profils ? Q.jeu.importerStore(donnees) : Q.jeu.importerEtat(donnees);
          if (!id) { Q.ui.toast("Ce fichier ne contient pas de profil.", "ko"); return; }
          Q.ui.toast("Profil restauré : " + Q.etat.profil.nom, "ok");
          Q.router.go("home");
        });
      };
      lecteur.readAsText(f);
      importInput.value = "";
    });

    var verrouiller = el.querySelector('[data-action="verrouiller"]');
    if (verrouiller) verrouiller.addEventListener("click", function () {
      Q.parentDebloque = false;
      saisiePin = "";
      Q.jeu.sauver();
      Q.audio.son("page");
      Q.ui.toast("Espace parent verrouillé : le code sera redemandé.", "ok");
      Q.router.go("map");
    });

    var pin = el.querySelector('[data-action="pin"]');
    if (pin) pin.addEventListener("click", function () {
      Q.etat.pin = null;
      Q.parentDebloque = false;
      Q.jeu.sauver();
      Q.router.rafraichir();
    });

    var reset = el.querySelector('[data-action="reset"]');
    if (reset) reset.addEventListener("click", function () {
      var nom = (Q.etat.profil && Q.etat.profil.nom) || "ce joueur";
      Q.ui.confirmer(
        "Supprimer " + nom + " ?",
        "Sa progression sera placée dans la corbeille : tu pourras la restaurer depuis l'écran des joueurs. Les autres profils sont conservés.",
        "Supprimer"
      ).then(function (ok) {
        if (!ok) return;
        var suivant = Q.jeu.reinitialiser();
        Q.parentDebloque = false;
        Q.router.go(suivant ? "profils" : "home");
      });
    });
  }
})(window.Quete);
