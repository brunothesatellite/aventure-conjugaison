/* Écran de quête : question, aides, feedback, correction active */
(function (Q) {
  "use strict";

  var SOURCE_LABEL = {
    revue: "Révision",
    cible: "Entraînement",
    defi: "Défi",
    gardien: "Gardien"
  };

  Q.screens.quete = function (el) {
    var quest = Q.etat.quest;
    if (!quest || quest.fini) {
      Q.router.go("map");
      return;
    }
    dessiner();

    function questionCourante() {
      return quest.questions[quest.index];
    }

    function dessiner() {
      var q = questionCourante();
      if (!q) { Q.router.go("map"); return; }

      var segments = quest.questions.map(function (_, i) {
        var classe = i < quest.index ? "fait" : i === quest.index ? "encours" : "";
        return '<li class="' + classe + '"></li>';
      }).join("");

      var aides = construireAides(q);
      var reponseZone = q.type === "assemblage" ? zoneAssemblage(q) : zoneQcm(q);

      el.innerHTML = '<div class="quete">' +
        '<div class="quete__barre">' +
          '<button class="btn btn--fantome btn--rond" data-action="quitter" aria-label="Quitter la quête">' + '<span aria-hidden="true">✕</span>' + "</button>" +
          '<ul class="segments" aria-label="Progression dans la quête">' + segments + "</ul>" +
          '<span class="quete__compteur">' + (quest.index + 1) + " / " + quest.questions.length + "</span>" +
        "</div>" +

        '<div class="carte question-cadre">' +
          '<div class="rangee rangee--entre" style="margin-bottom:10px">' +
            '<span class="discret">' + Q.ui.tempsLabel(q.temps) + "</span>" +
            '<span class="discret">' + (SOURCE_LABEL[q.source] || "") + "</span>" +
          "</div>" +

          '<p class="texte-phrase" id="phrase">' +
            Q.ui.phraseHTML(q.texte, { reponse: q.termine ? q.reponse : null }) +
          "</p>" +

          '<div class="rangee">' +
            '<span class="verbe-inf">verbe : <strong>' + Q.ui.echapper(q.infinitif) + "</strong></span>" +
            '<button class="btn btn--fantome btn--rond" data-action="ecouter" aria-label="Écouter la phrase">' +
              Q.ui.icon("haut-parleur") + "</button>" +
          "</div>" +

          '<p class="discret" style="margin:12px 0 0">' + Q.ui.echapper(q.consigne || "") + "</p>" +

          reponseZone +
          aides +
          '<div class="zone-feedback" id="zone-feedback"></div>' +
        "</div>" +
      "</div>";

      binder(q);
      if (q.termine) restaurerEtatTermine(q);
    }

    function zoneQcm(q) {
      return '<div class="options" id="options">' + q.options.map(function (o, i) {
        return '<button class="option" data-choix="' + Q.ui.echapper(o) + '" data-index="' + i + '">' +
          '<span class="option__lettre">' + (q.lettres ? q.lettres[i] : i + 1) + "</span>" +
          "<span>" + Q.ui.echapper(o) + "</span></button>";
      }).join("") + "</div>";
    }

    function zoneAssemblage(q) {
      var choix = q.choixTerminaison || "";
      return '<div class="assemblage">' +
        '<span class="tuile tuile--radical">' + Q.ui.echapper(q.radical) + "</span>" +
        '<span class="tuile tuile--plus">+</span>' +
        '<span class="tuile tuile--vide ' + (choix ? "remplie" : "") + '" id="tuile-fin">' +
          (choix ? Q.ui.echapper(choix) : "?") + "</span>" +
        "</div>" +
        '<div class="terminaisons" id="terminaisons">' + q.options.map(function (o) {
          return '<button class="terminaison" data-terminaison="' + Q.ui.echapper(o) + '">' +
            Q.ui.echapper(o) + "</button>";
        }).join("") + "</div>";
    }

    function construireAides(q) {
      var html = '<div class="aides">';
      html += '<button class="aide-btn" data-aide="indice"' + (q.indiceVu ? " disabled" : "") + ">" +
        Q.ui.emoji("ampoule", "") + " Indice</button>";

      if (Q.achat.aFamille("eliminer")) {
        html += '<button class="aide-btn" data-aide="eliminer"' + ((quest.aides.eliminer || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("dragon", "") + " Éliminer un choix</button>";
      }
      if (Q.achat.aFamille("relire")) {
        html += '<button class="aide-btn" data-aide="lettre"' + ((quest.aides.lettre || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("perroquet", "") + " Première lettre</button>";
      }
      if (Q.achat.aFamille("regle")) {
        html += '<button class="aide-btn" data-aide="lire"' + ((quest.aides.regle || 0) >= 1 ? " disabled" : "") + ">" +
          Q.ui.emoji("cheval", "") + " Écouter la règle</button>";
      }
      return html + "</div>";
    }

    function feedbackHTML(f, type) {
      return '<div class="feedback feedback--' + type + '" role="status">' +
        '<p class="feedback__titre">' + f.titre + "</p>" +
        "<p>" + f.texte + "</p>" +
        (f.regle ? '<p class="feedback__regle">' + Q.ui.emoji("ampoule", "") + " " + f.regle + "</p>" : "") +
        "</div>";
    }

    function binder(q) {
      Array.prototype.forEach.call(el.querySelectorAll("[data-choix]"), function (b) {
        b.addEventListener("click", function () {
          repondre(b.getAttribute("data-choix"), b);
        });
      });
      Array.prototype.forEach.call(el.querySelectorAll("[data-terminaison]"), function (b) {
        b.addEventListener("click", function () {
          repondre(b.getAttribute("data-terminaison"), b);
        });
      });
      Array.prototype.forEach.call(el.querySelectorAll("[data-aide]"), function (b) {
        b.addEventListener("click", function () { utiliserAide(b.getAttribute("data-aide"), q, b); });
      });
      var ecouter = el.querySelector('[data-action="ecouter"]');
      if (ecouter) {
        ecouter.addEventListener("click", function () {
          Q.audio.parler(q.texte.replace("{trou}", " ... ") + ". Verbe " + q.infinitif + ".");
        });
      }
      var quitter = el.querySelector('[data-action="quitter"]');
      if (quitter) {
        quitter.addEventListener("click", function () {
          Q.ui.confirmer("Quitter la quête ?", "Tu pourras la reprendre plus tard, là où tu t'es arrêté.", "Quitter")
            .then(function (ok) { if (ok) Q.router.go("map"); });
        });
      }
    }

    function marquer(button, classe) {
      if (!button) return;
      button.classList.add(classe);
      button.disabled = true;
    }

    function repondre(choix, button) {
      var q = questionCourante();
      if (!q || q.termine) return;
      Q.audio.reveiller();

      if (q.type === "assemblage") {
        q.choixTerminaison = choix;
        var tuile = el.querySelector("#tuile-fin");
        if (tuile) { tuile.textContent = choix; tuile.classList.add("remplie"); }
      }

      var r = Q.session.repondre(choix);
      var zone = el.querySelector("#zone-feedback");

      if (r.correct) {
        Q.audio.son("ok");
        if (r.premierCoup) Q.audio.son("piece");
        marquer(button, q.type === "assemblage" ? "terminaison--bonne" : "option--bonne");
        desactiverTout();
        var f = Q.feedback.succes(Q.phraseParId(q.phraseId));
        zone.innerHTML = feedbackHTML(f, "ok") +
          '<div class="rangee rangee--droite espace-haut-sm">' +
          '<button class="btn btn--primaire" data-suite="1">Continuer →</button></div>';
        lierSuite();
        var phrase = el.querySelector("#phrase");
        if (phrase) phrase.innerHTML = Q.ui.phraseHTML(q.texte, { reponse: q.reponse });
        return;
      }

      Q.audio.son("ko");
      marquer(button, q.type === "assemblage" ? "terminaison--mauvaise" : "option--mauvaise");

      var aide = Q.feedback.aide(Q.phraseParId(q.phraseId), r.essais);
      zone.innerHTML = feedbackHTML(aide, "ko");

      if (r.essais >= 2) {
        /* Correction active : on révèle, puis l'enfant recopie. */
        desactiverTout();
        var bonneValeur = q.type === "assemblage" ? q.terminaison : q.reponse;
        var bonne = el.querySelector('[data-choix="' + CSS.escape(bonneValeur) + '"], [data-terminaison="' + CSS.escape(bonneValeur) + '"]');
        marquer(bonne, q.type === "assemblage" ? "terminaison--bonne" : "option--bonne");
        zone.innerHTML += '<div class="rangee espace-haut-sm">' +
          '<button class="btn btn--secondaire" data-copier="1">' + Q.ui.icon("plume") + " Je recopie la bonne réponse</button>" +
          "</div>";
        var copier = el.querySelector("[data-copier]");
        if (copier) {
          copier.addEventListener("click", function () {
            var phrase = el.querySelector("#phrase");
            if (phrase) phrase.innerHTML = Q.ui.phraseHTML(q.texte, { reponse: q.reponse });
            if (q.type === "assemblage") {
              var tuile = el.querySelector("#tuile-fin");
              if (tuile) { tuile.textContent = q.terminaison; tuile.classList.add("remplie"); }
            }
            q.copiee = true;
            Q.audio.son("page");
            copier.outerHTML = '<button class="btn btn--primaire" data-suite="1">Continuer →</button>';
            lierSuite();
          });
        }
      }
    }

    function desactiverTout() {
      Array.prototype.forEach.call(el.querySelectorAll(".option, .terminaison"), function (b) {
        b.disabled = true;
      });
      Array.prototype.forEach.call(el.querySelectorAll("[data-aide]"), function (b) {
        b.disabled = true;
      });
    }

    function lierSuite() {
      var suite = el.querySelector("[data-suite]");
      if (!suite) return;
      suite.addEventListener("click", function () {
        Q.audio.son("page");
        var r = Q.session.suivante();
        if (r.fini) {
          terminer(r.resultat);
        } else {
          dessiner();
        }
      });
    }

    function restaurerEtatTermine(q) {
      desactiverTout();
      var zone = el.querySelector("#zone-feedback");
      var f = q.reussi ? Q.feedback.succes(Q.phraseParId(q.phraseId)) : Q.feedback.aide(Q.phraseParId(q.phraseId), 2);
      zone.innerHTML = feedbackHTML(f, q.reussi ? "ok" : "ko") +
        '<div class="rangee rangee--droite espace-haut-sm">' +
        '<button class="btn btn--primaire" data-suite="1">Continuer →</button></div>';
      var bonne = el.querySelector('[data-choix="' + CSS.escape(q.reponse) + '"], [data-terminaison="' + CSS.escape(q.type === "assemblage" ? q.terminaison : q.reponse) + '"]');
      if (bonne) bonne.classList.add(q.type === "assemblage" ? "terminaison--bonne" : "option--bonne");
      lierSuite();
    }

    function utiliserAide(type, q, bouton) {
      var zone = el.querySelector("#zone-feedback");
      var phrase = Q.phraseParId(q.phraseId);
      if (type === "indice") {
        q.indiceVu = true;
        quest.aides.indice = (quest.aides.indice || 0) + 1;
        bouton.disabled = true;
        var regle = Q.feedback.regle(phrase, Q.verbe(q.verbe));
        zone.innerHTML = feedbackHTML({ titre: "Un petit coup de pouce", texte: "Tu peux le faire.", regle: regle }, "");
        Q.audio.son("page");
      }
      if (type === "eliminer") {
        quest.aides.eliminer = (quest.aides.eliminer || 0) + 1;
        bouton.disabled = true;
        /* On retire un mauvais choix réellement affiché (et non un
           distracteur régénéré, qui pourrait ne pas être à l'écran). */
        var bonne = q.type === "assemblage" ? q.terminaison : q.reponse;
        var mauvais = Q.distracteurs.melanger((q.options || []).filter(function (o) {
          return String(o).toLowerCase() !== String(bonne).toLowerCase();
        }))[0];
        var cible = mauvais
          ? el.querySelector('[data-choix="' + CSS.escape(String(mauvais)) + '"], [data-terminaison="' + CSS.escape(String(mauvais)) + '"]')
          : null;
        if (cible) { cible.classList.add("option--retiree"); cible.disabled = true; }
        Q.ui.toast("Le dragonneau a soufflé un mauvais choix !");
      }
      if (type === "lettre") {
        quest.aides.lettre = (quest.aides.lettre || 0) + 1;
        bouton.disabled = true;
        Q.ui.toast("Ça commence par « " + q.reponse.charAt(0) + " ».");
      }
      if (type === "lire") {
        quest.aides.regle = (quest.aides.regle || 0) + 1;
        bouton.disabled = true;
        var texte = Q.feedback.regle(phrase, Q.verbe(q.verbe));
        Q.audio.parler(texte);
        zone.innerHTML = feedbackHTML({ titre: "Le cheval lit la règle", texte: "", regle: texte }, "");
      }
      Q.jeu.sauver();
    }

    function terminer(res) {
      if (!res) { Q.router.go("map"); return; }
      if (!res.revision) {
        Q.jeu.enregistrerQuete(res.aventureId, res.niveauId, res);
        if (res.gardien) {
          var a = Q.aventure(res.aventureId);
          if (a) Q.jeu.ajouterAiguille(a.temps);
        }
      }
      res.nouveauxBadges = Q.badges.verifier();
      res.aidesUtilisees = (quest.aides.indice || 0) + (quest.aides.lettre || 0) + (quest.aides.eliminer || 0) + (quest.aides.regle || 0);
      Q.etat.quest = null;
      Q.jeu.sauver();
      Q.audio.son("fanfare");
      Q.router.go("resultat", { resultat: res });
    }
  };
})(window.Quete);
