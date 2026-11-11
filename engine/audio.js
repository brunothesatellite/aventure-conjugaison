/* ============================================================
   audio.js — synthèse vocale + petits sons générés (aucun fichier)

   La voix et la vitesse sont lues dans les réglages à chaque
   lecture : changer la voix prend effet immédiatement, sans
   rechargement, et le choix est sauvegardé avec le profil.
   ============================================================ */
(function (Q) {
  "use strict";

  var ctx = null;

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

  /* ---------- Voix ---------- */

  function syntheseDisponible() {
    return "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function";
  }

  function toutesLesVoix() {
    if (!syntheseDisponible()) return [];
    try {
      return (window.speechSynthesis.getVoices() || []).slice();
    } catch (e) {
      return [];
    }
  }

  function voixFrancaises() {
    return toutesLesVoix().filter(function (v) {
      return String(v.lang || "").toLowerCase().indexOf("fr") === 0;
    });
  }

  function voixParNom(nom) {
    if (!nom) return null;
    var liste = toutesLesVoix();
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].name === nom) return liste[i];
    }
    return null;
  }

  function voixAutomatique() {
    var fr = voixFrancaises();
    if (!fr.length) return null;
    var preferee = fr.filter(function (v) {
      return /Amelie|Amélie|Audrey|Thomas|Google|Microsoft/i.test(v.name);
    });
    return preferee[0] || fr[0];
  }

  function voixCourante() {
    var reg = (Q.etat && Q.etat.reglages) || {};
    return voixParNom(reg.voixNom) || voixAutomatique();
  }

  function vitesse() {
    var v = Number((Q.etat && Q.etat.reglages && Q.etat.reglages.voixVitesse));
    if (!v || v < 0.5 || v > 1.6) return 0.92;
    return v;
  }

  /* « Microsoft VivienneMultilingual Online (Natural) - French (France) (fr-FR) »
     → « Vivienne ». On ne garde que le prénom : le nom technique est
     illisible dans un menu. */
  var VENDEURS = /^(Microsoft|Google|Apple|Amazon|Mozilla|eSpeak|Samsung|Huawei|Nuance)\s+/i;
  var MOTS_TECH = /\b(online|natural|multilingual|neural|standard|compact|mobile|desktop|premium|enhanced|continuous|vocoder|voice)\b/gi;
  var LANGUES = /^(fran[cç]ais|french|fr|english|anglais|espa[nñ]ol|deutsch|italiano)$/i;

  function nomCourt(nom) {
    var s = String(nom || "").split(" - ")[0];
    s = s.replace(/\([^)]*\)/g, " ");
    s = s.replace(VENDEURS, "");
    s = s.replace(/Multilingual/gi, " ");
    s = s.replace(MOTS_TECH, " ");
    s = s.replace(/\s+/g, " ").trim();
    var mot = s.split(" ")[0] || "";
    if (!mot || LANGUES.test(mot)) mot = s || String(nom || "");
    return mot.charAt(0).toUpperCase() + mot.slice(1);
  }

  Q.audio = {
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
      if (!Q.etat.reglages.voix || !syntheseDisponible()) return;
      var propre = String(texte || "").replace(/\{trou\}/g, " ... ").replace(/[«»]/g, " ");
      if (!propre.trim()) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(propre);
        var v = voixCourante();
        u.lang = (v && v.lang) || "fr-FR";
        u.rate = vitesse();
        u.pitch = 1.02;
        if (v) u.voice = v;
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
    },

    /* ---------- API pour l'écran Réglages ---------- */

    syntheseDisponible: syntheseDisponible,

    /* Voix françaises installées sur l'appareil, avec un libellé court. */
    listerVoix: function () {
      return voixFrancaises().map(function (v) {
        return { nom: v.name, langue: v.lang, court: nomCourt(v.name) };
      });
    },

    /* La voix réellement utilisée (pour l'affichage). */
    voixUtilisee: function () {
      var v = voixCourante();
      return v ? { nom: v.name, langue: v.lang, court: nomCourt(v.name) } : null;
    },

    /* Libellé court d'une voix : « Microsoft Julie Online (Natural) » → « Julie ». */
    nomCourt: nomCourt
  };
})(window.Quete);
