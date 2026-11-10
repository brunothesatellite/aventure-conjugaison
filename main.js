/* ============================================================
   main.js — démarrage de l'application
   Charge la sauvegarde, applique les réglages, branche la
   navigation globale, puis ouvre le bon écran.
   ============================================================ */
(function (Q) {
  "use strict";

  /* Applique les préférences visuelles sur <html>. */
  Q.appliquerReglages = function () {
    var r = (Q.etat && Q.etat.reglages) || {};
    var racine = document.documentElement;
    racine.setAttribute("data-taille", r.taille || "normal");
    racine.setAttribute("data-animations", r.animations === false ? "non" : "oui");
  };

  function ecranInitial() {
    if (!Q.jeu.aProfil()) return "home";
    var q = Q.etat.quest;
    if (q && !q.fini && q.questions && q.questions.length) return "quete";
    return "map";
  }

  function demarrer() {
    Q.jeu.charger();
    Q.appliquerReglages();
    if (!Q.storage.disponible) {
      /* Mode privé ou stockage bloqué : le jeu reste utilisable,
         mais la progression ne survivra pas à la fermeture. */
      setTimeout(function () {
        Q.ui.toast("La sauvegarde est bloquée par le navigateur.", "ko");
      }, 900);
    }
    Q.router.go(ecranInitial());
  }

  /* Navigation globale : tout élément [data-nav] change d'écran. */
  document.addEventListener("click", function (e) {
    var cible = e.target && e.target.closest ? e.target.closest("[data-nav]") : null;
    if (!cible) return;
    e.preventDefault();
    Q.audio.reveiller();
    Q.router.go(cible.getAttribute("data-nav"));
  });

  /* Échap ferme la fenêtre modale. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var modale = document.getElementById("modale");
    if (modale && !modale.hidden) Q.ui.fermerModale();
  });

  /* Le premier geste débloque l'AudioContext (règle des navigateurs). */
  ["pointerdown", "keydown"].forEach(function (evenement) {
    document.addEventListener(evenement, function reveiller() {
      Q.audio.reveiller();
      document.removeEventListener(evenement, reveiller);
    }, { once: true, passive: true });
  });

  /* On coupe la voix quand l'onglet passe en arrière-plan. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) Q.audio.couper();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})(window.Quete);
