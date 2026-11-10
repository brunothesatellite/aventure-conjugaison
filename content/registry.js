/* ============================================================
   registry.js — registre de contenu de « La Quête des Verbes »
   Tout le contenu (verbes, phrases, aventures, progression) passe
   par ce registre. Ajouter du contenu = ajouter un fichier JS et
   une balise <script> dans index.html. Aucun import, aucun build.
   ============================================================ */
(function (global) {
  "use strict";

  var Q = (global.Quete = global.Quete || {});

  var content = (Q.content = Q.content || {
    verbs: {},
    phrases: {},
    adventures: {},
    curriculum: null
  });

  /* ---------- Enregistrement ---------- */

  Q.registerVerb = function (verbe) {
    if (!verbe || !verbe.id) throw new Error("Verbe invalide : id manquant");
    if (content.verbs[verbe.id]) throw new Error("Verbe déjà enregistré : " + verbe.id);
    content.verbs[verbe.id] = verbe;
  };

  Q.registerPhrases = function (temps, phrases) {
    if (!temps || !Array.isArray(phrases)) throw new Error("Appel registerPhrases invalide");
    if (!content.phrases[temps]) content.phrases[temps] = [];
    phrases.forEach(function (p) {
      if (!p.id) throw new Error("Phrase sans id dans " + temps);
      if (!p.texte || p.texte.indexOf("{trou}") === -1) {
        throw new Error("Phrase sans {trou} : " + p.id);
      }
      content.phrases[temps].push(p);
    });
  };

  Q.registerAdventure = function (aventure) {
    if (!aventure || !aventure.id) throw new Error("Aventure invalide");
    if (content.adventures[aventure.id]) throw new Error("Aventure déjà enregistrée : " + aventure.id);
    (aventure.niveaux || []).forEach(function (n) {
      if (n.prerequis && n.prerequis.length) {
        n.prerequis.forEach(function (pid) {
          if (!content.adventures[aventure.id].niveaux.some(function (x) { return x.id === pid; }) && !pid) {
            throw new Error("Prérequis introuvable pour " + n.id);
          }
        });
      }
    });
    content.adventures[aventure.id] = aventure;
  };

  Q.registerCurriculum = function (curriculum) {
    content.curriculum = curriculum;
  };

  /* ---------- Accès ---------- */

  Q.verbe = function (id) {
    return content.verbs[id] || null;
  };

  Q.aventure = function (id) {
    return content.adventures[id] || null;
  };

  Q.tempsDeLAventure = function (aventure) {
    return aventure ? aventure.temps : null;
  };

  Q.niveau = function (aventureId, niveauId) {
    var a = Q.aventure(aventureId);
    if (!a) return null;
    for (var i = 0; i < a.niveaux.length; i++) {
      if (a.niveaux[i].id === niveauId) return a.niveaux[i];
    }
    return null;
  };

  Q.phrasesDuNiveau = function (aventureId, niveauId) {
    var a = Q.aventure(aventureId);
    var n = Q.niveau(aventureId, niveauId);
    if (!a || !n) return [];
    var toutes = content.phrases[a.temps] || [];
    return toutes.filter(function (p) {
      return n.verbes.indexOf(p.verbe) !== -1;
    });
  };

  Q.toutesLesPhrases = function () {
    var out = [];
    Object.keys(content.phrases).forEach(function (temps) {
      content.phrases[temps].forEach(function (p) { out.push(p); });
    });
    return out;
  };

  Q.phraseParId = function (id) {
    return Q.toutesLesPhrases().filter(function (p) { return p.id === id; })[0] || null;
  };

  /* Forme attendue : on privilégie la réponse écrite dans la phrase
     (indispensable pour les accords du passé composé avec être). */
  Q.formeAttendue = function (phrase) {
    if (phrase.reponse) return phrase.reponse;
    var v = Q.verbe(phrase.verbe);
    if (!v || !v.formes || !v.formes[phrase.temps]) return "";
    return v.formes[phrase.temps][phrase.personne] || "";
  };

  /* Forme correcte du passé composé, avec l'accord du participe
     lorsque l'auxiliaire est être. Sert au lint et aux contrôles. */
  Q.formePC = function (verbe, personne) {
    if (!verbe || !verbe.formes || !verbe.formes.passe_compose) return null;
    var actuel = verbe.formes.passe_compose[personne];
    var participe = verbe.participe;
    if (!actuel || !participe) return null;
    var aux = actuel.split(" ")[0];
    var part = participe;
    if (verbe.auxiliaire === "etre") {
      if (personne === "elle") part += "e";
      else if (personne === "elles") part += "es";
      else if (personne === "ils" || personne === "nous" || personne === "vous") part += "s";
    }
    return aux + " " + part;
  };

  /* ---------- Niveaux débloqués ---------- */

  Q.curriculum = function () {
    return content.curriculum || { ordre: [], prerequisIle: 8 };
  };

  Q.ordreAventures = function () {
    return Q.curriculum().ordre.map(function (id) { return Q.aventure(id); }).filter(Boolean);
  };

  Q.aventureParTemps = function (temps) {
    var liste = Q.ordreAventures();
    for (var i = 0; i < liste.length; i++) if (liste[i].temps === temps) return liste[i];
    return null;
  };

  /* ---------- Validation (utilisée par tools/lint-content.js) ---------- */

  Q.validerContenu = function () {
    var erreurs = [];
    var personnes = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];
    var tempsAttendus = ["present", "imparfait", "futur", "passe_compose"];

    Object.keys(content.verbs).forEach(function (id) {
      var v = content.verbs[id];
      tempsAttendus.forEach(function (t) {
        if (!v.formes || !v.formes[t]) {
          erreurs.push("Verbe " + id + " : temps manquant " + t);
          return;
        }
        personnes.forEach(function (p) {
          if (!v.formes[t][p]) erreurs.push("Verbe " + id + " : " + t + "/" + p + " manquant");
        });
      });
      if (v.formes.passe_compose) {
        personnes.forEach(function (p) {
          var attendu = Q.formePC(v, p);
          if (attendu && v.formes.passe_compose[p] !== attendu) {
            erreurs.push("Verbe " + id + " : accord du passé composé " + p +
              " (« " + v.formes.passe_compose[p] + " », attendu « " + attendu + " »)");
          }
        });
      }
      if (v.auxiliaire === "etre" && v.formes.passe_compose) {
        var pc = v.formes.passe_compose;
        if (pc.je.indexOf("suis") !== 0 && pc.je.indexOf("ai") !== 0) {
          erreurs.push("Verbe " + id + " : passé composé incohérent avec l'auxiliaire être");
        }
      }
    });

    var tous = Q.toutesLesPhrases();
    var vus = {};
    tous.forEach(function (p) {
      if (!content.verbs[p.verbe]) erreurs.push("Phrase " + p.id + " : verbe inconnu " + p.verbe);
      if (!p.personne) erreurs.push("Phrase " + p.id + " : personne manquante");
      if (!Q.verbe(p.verbe) || !Q.verbe(p.verbe).formes[p.temps]) {
        erreurs.push("Phrase " + p.id + " : temps inconnu " + p.temps);
      }
      if (vus[p.id]) erreurs.push("Phrase en double : " + p.id);
      vus[p.id] = true;
      var forme = Q.formeAttendue(p);
      if (!forme) erreurs.push("Phrase " + p.id + " : réponse introuvable");
      /* Le pronom doit être visible dans la phrase (hors {trou}).
         « je » peut être élidé en « j' » devant une voyelle. */
      var debut = p.texte.split("{trou}")[0].toLowerCase();
      var p2 = (p.personne || "").toLowerCase();
      var famille = p2 === "il" || p2 === "elle" ? ["il", "elle"]
        : p2 === "ils" || p2 === "elles" ? ["ils", "elles"]
        : p2 === "je" ? ["je", "j'"]
        : [p2];
      var visible = famille.some(function (f) { return debut.indexOf(f) !== -1; });
      if (!visible) erreurs.push("Phrase " + p.id + " : pronom invisible avant le trou");
    });

    Object.keys(content.adventures).forEach(function (id) {
      var a = content.adventures[id];
      if (!content.phrases[a.temps] || !content.phrases[a.temps].length) {
        erreurs.push("Aventure " + id + " : aucune phrase pour " + a.temps);
      }
      (a.niveaux || []).forEach(function (n) {
        if (!n.verbes || !n.verbes.length) erreurs.push("Niveau " + n.id + " : aucun verbe");
        n.verbes.forEach(function (v) {
          if (!content.verbs[v]) erreurs.push("Niveau " + n.id + " : verbe inconnu " + v);
          var dispo = (content.phrases[a.temps] || []).filter(function (p) { return p.verbe === v; });
          if (dispo.length < 2) erreurs.push("Niveau " + n.id + " : moins de 2 phrases pour " + v);
        });
      });
    });

    return erreurs;
  };
})(typeof window !== "undefined" ? window : globalThis);
