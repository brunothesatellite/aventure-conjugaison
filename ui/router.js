/* ============================================================
   router.js — navigation entre écrans
   ============================================================ */
(function (Q) {
  "use strict";

  Q.screens = Q.screens || {};

  Q.router = {
    ecran: null,
    params: null,

    go: function (nom, params) {
      var cible = document.getElementById("screen-" + nom);
      if (!cible || typeof Q.screens[nom] !== "function") {
        console.warn("Écran inconnu :", nom);
        return;
      }
      Q.audio.couper();
      Array.prototype.forEach.call(document.querySelectorAll(".screen"), function (s) {
        s.classList.remove("actif");
      });
      cible.classList.add("actif");
      cible.innerHTML = "";
      Q.router.ecran = nom;
      Q.router.params = params || {};
      try {
        Q.screens[nom](cible, Q.router.params);
      } catch (e) {
        console.error("Erreur d'affichage de l'écran " + nom, e);
        cible.innerHTML = '<div class="carte"><h2>Oups…</h2><p>Une erreur est survenue. <button class="btn btn--primaire" data-nav="map">Revenir à la carte</button></p><pre class="discret">' +
          Q.ui.echapper(String(e && e.message ? e.message : e)) + "</pre></div>";
      }
      document.body.setAttribute("data-ecran", nom);
      window.scrollTo(0, 0);
    },

    rafraichir: function () {
      if (Q.router.ecran) Q.router.go(Q.router.ecran, Q.router.params);
    }
  };
})(window.Quete);
