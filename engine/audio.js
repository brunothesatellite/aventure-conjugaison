/* ============================================================
   audio.js — synthèse vocale + petits sons générés (aucun fichier)
   ============================================================ */
(function (Q) {
  "use strict";

  var ctx = null;
  var voix = null;

  function contexte() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function note(frequence, debut, duree, volume, type) {
    var c = contexte();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = frequence;
    gain.gain.setValueAtTime(0, c.currentTime + debut);
    gain.gain.linearRampToValueAtTime(volume, c.currentTime + debut + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + debut + duree);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime + debut);
    osc.stop(c.currentTime + debut + duree + 0.02);
  }

  function choisirVoix() {
    if (!("speechSynthesis" in window)) return null;
    var liste = window.speechSynthesis.getVoices() || [];
    var fr = liste.filter(function (v) { return (v.lang || "").toLowerCase().indexOf("fr") === 0; });
    if (!fr.length) return null;
    var preferee = fr.filter(function (v) { return /Amelie|Amélie|Audrey|Thomas|Google|Microsoft/i.test(v.name); });
    return preferee[0] || fr[0];
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = function () { voix = choisirVoix(); };
    voix = choisirVoix();
  }

  Q.audio = {
    disponible: !!contexte,

    son: function (nom) {
      if (!Q.etat.reglages.son) return;
      switch (nom) {
        case "ok":
          note(659, 0, 0.14, 0.16, "triangle");
          note(880, 0.1, 0.2, 0.14, "triangle");
          break;
        case "ko":
          note(220, 0, 0.18, 0.12, "sine");
          note(185, 0.12, 0.22, 0.1, "sine");
          break;
        case "piece":
          note(1046, 0, 0.08, 0.1, "square");
          note(1568, 0.06, 0.1, 0.08, "square");
          break;
        case "page":
          note(420, 0, 0.05, 0.06, "triangle");
          break;
        case "fanfare":
          [523, 659, 784, 1046].forEach(function (f, i) { note(f, i * 0.11, 0.24, 0.13, "triangle"); });
          break;
        case "echec":
          [330, 294, 262].forEach(function (f, i) { note(f, i * 0.12, 0.26, 0.1, "sine"); });
          break;
        default:
          note(440, 0, 0.06, 0.06, "sine");
      }
    },

    parler: function (texte) {
      if (!Q.etat.reglages.voix || !("speechSynthesis" in window)) return;
      var propre = String(texte || "").replace(/\{trou\}/g, " ... ").replace(/[«»]/g, " ");
      if (!propre.trim()) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(propre);
        u.lang = "fr-FR";
        u.rate = 0.92;
        u.pitch = 1.02;
        if (!voix) voix = choisirVoix();
        if (voix) u.voice = voix;
        window.speechSynthesis.speak(u);
      } catch (e) {
        /* silencieux : la voix est un bonus, jamais un blocage */
      }
    },

    couper: function () {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },

    /* À appeler au premier clic : débloque l'AudioContext sur mobile. */
    reveiller: function () {
      var c = contexte();
      if (c && c.state === "suspended") c.resume();
    }
  };
})(window.Quete);
