/* ============================================================
   test-navigateur.mjs — test de bout en bout sans framework.

   Usage :  node tools/test-navigateur.mjs

   Pilote Chromium (Edge ou Chrome) en mode headless via le
   protocole DevTools, puis vérifie : démarrage, profil, îles
   verrouillées, quête complète, étoiles, or, persistance,
   tous les écrans, espace parent, correction active, aides.
   Aucune erreur console ne doit apparaître.

   Le navigateur est cherché dans les emplacements habituels
   sous Windows, ou dans la variable d'environnement NAVIGATEUR.
   Code de sortie 1 si un test échoue.
   ============================================================ */

import { spawn } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function trouverNavigateur() {
  const candidats = [
    process.env.NAVIGATEUR,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  ].filter(Boolean);
  for (const c of candidats) {
    if (fs.existsSync(c)) return c;
  }
  console.error("Aucun navigateur Chromium trouvé. Définissez NAVIGATEUR=/chemin/vers/chrome");
  process.exit(1);
}

const NAVIGATEUR = trouverNavigateur();
const PORT = Number(process.env.PORT_TEST || 9333);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "quete-test-"));
const pageUrl = pathToFileURL(path.join(RACINE, "index.html")).href;

const edge = spawn(NAVIGATEUR, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  "--autoplay-policy=no-user-gesture-required",
  "--remote-debugging-port=" + PORT, "--user-data-dir=" + profile, "about:blank"
], { stdio: "ignore" });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await r.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* pas encore prêt */ }
    await wait(200);
  }
  throw new Error("DevTools indisponible");
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("WS")); });

let seq = 0;
const pending = new Map();
const exceptions = [];
const consoleErrors = [];

ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
    return;
  }
  if (m.method === "Runtime.exceptionThrown") {
    exceptions.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  }
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
  }
  if (m.method === "Log.entryAdded" && m.params.entry.level === "error") {
    consoleErrors.push(m.params.entry.text + " " + (m.params.entry.url || ""));
  }
};

function send(method, params = {}) {
  return new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  }
  return r.result.value;
}

await send("Runtime.enable");
await send("Page.enable");
await send("Log.enable");
await send("Page.navigate", { url: pageUrl });
for (let i = 0; i < 60; i++) {
  if (await evaluate("document.readyState")) {
    if ((await evaluate("document.readyState")) === "complete") break;
  }
  await wait(100);
}
await wait(400);

const rapport = await evaluate(`(async () => {
  const Q = window.Quete;
  const out = { etapes: [] };
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const ok = (cond, msg) => { if (!cond) throw new Error("ÉCHEC: " + msg); out.etapes.push(msg); };
  const actif = (nom) => document.getElementById("screen-" + nom).classList.contains("actif");
  const choix = (q) => {
    const val = q.type === "assemblage" ? q.terminaison : q.reponse;
    return document.querySelector('[data-choix="' + CSS.escape(val) + '"], [data-terminaison="' + CSS.escape(val) + '"]');
  };

  ok(!!window.Quete, "espace Quete chargé");
  ok(actif("home"), "écran d'accueil actif sans profil");

  const prixDeco = Q.catalogue.cosmetiques.map((c) => c.prix);
  ok(Q.catalogue.cosmetiques.length >= 18, "au moins 18 déguisements");
  ok(prixDeco.some((p, i) => i > 0 && p < prixDeco[i - 1]), "prix des déguisements variés (pas toujours croissants)");
  ok(Math.max.apply(null, prixDeco) >= 1500, "au moins un déguisement très cher");
  ok(Q.catalogue.cosmetiques.every((c) => !!c.icone), "chaque déguisement a une icône");

  ok(Q.formePC(Q.verbe("aller"), "elle") === "est allée" &&
    Q.formePC(Q.verbe("arriver"), "elles") === "sont arrivées" &&
    Q.formePC(Q.verbe("venir"), "elle") === "est venue",
    "accords être au passé composé");

  Q.jeu.nouveau("Léa", "magicienne");
  ok(Q.jeu.aProfil(), "profil créé");
  Q.router.go("map");
  await pause(60);
  ok(actif("map"), "carte affichée");
  ok(document.querySelectorAll("[data-ile]").length === 4, "4 îles sur la carte");
  ok(document.querySelectorAll("[data-ile][disabled]").length === 3, "3 îles verrouillées au départ");
  ok(document.querySelector("[data-nav] .ico").tagName.toLowerCase() === "svg",
    "pictos en SVG inline (lisibles en file://)");

  document.querySelector('[data-ile="ile-present"]').click();
  await pause(60);
  ok(actif("ile"), "île ouverte");
  ok(document.querySelectorAll("[data-niveau]").length === 4, "4 niveaux listés");
  ok(document.querySelectorAll("[data-niveau][disabled]").length === 3, "3 niveaux verrouillés");

  document.querySelector('[data-niveau="present-1"]').click();
  await pause(80);
  ok(actif("quete"), "quête lancée");
  ok(Q.etat.quest.questions.length === 7, "7 questions");
  ok(document.querySelectorAll(".option, .terminaison").length >= 2, "boutons de réponse rendus");

  let tours = 0;
  while (Q.etat.quest && !Q.etat.quest.fini && tours < 15) {
    tours++;
    const q = Q.etat.quest.questions[Q.etat.quest.index];
    const b = choix(q);
    if (!b) throw new Error("Réponse introuvable: " + q.id + " / " + q.reponse + " / " + q.options.join(" | "));
    b.click();
    await pause(40);
    const suite = document.querySelector("[data-suite]");
    if (!suite) throw new Error("Bouton Continuer absent après " + q.id);
    suite.click();
    await pause(70);
  }
  ok(Q.etat.quest === null, "quête terminée");
  ok(actif("resultat"), "écran résultat affiché");
  ok(Q.etat.or > 0, "or gagné (" + Q.etat.or + ")");
  ok(Q.etat.progression["present-1"].etoiles === 3, "3 étoiles pour un sans-faute (aides non utilisées)");
  ok(document.querySelectorAll(".resultat__etoiles .etoile--pleine").length === 3, "3 étoiles affichées");
  ok(Q.etat.serie.record === 7, "série record de 7");

  const brut = localStorage.getItem("quete-verbes:v2");
  const magasin = brut ? JSON.parse(brut) : null;
  ok(!!magasin && !!magasin.actif && !!magasin.profils[magasin.actif], "sauvegarde multi-profils écrite");
  ok(magasin.profils[magasin.actif].etat.profil.nom === "Léa", "nom sauvegardé");

  // Tous les écrans doivent se rendre sans erreur.
  for (const nom of ["boutique", "carnet", "reglages", "map", "parent"]) {
    Q.router.go(nom);
    await pause(60);
    ok(actif(nom), "écran " + nom + " rendu");
    ok(!document.getElementById("screen-" + nom).textContent.includes("Oups"), "écran " + nom + " sans erreur");
  }

  // Espace parent : création de PIN puis tableau de bord.
  document.getElementById("pin1").value = "1234";
  document.getElementById("pin2").value = "1234";
  document.querySelector('[data-action="creer"]').click();
  await pause(60);
  ok(Q.etat.pin === "1234", "PIN enregistré");
  ok(document.body.textContent.includes("Récompenses réelles"), "tableau de bord parent affiché");

  // Récompense réelle avec une icône choisie dans la liste.
  document.querySelector('[data-rec-texte="0"]').value = "15 minutes de console";
  document.querySelector('[data-rec-prix="0"]').value = "200";
  document.querySelector('[data-rec-icone="0"]').value = "sablier";
  document.querySelector('[data-rec-save="0"]').click();
  await pause(60);
  ok(Q.etat.recompenses[0] && Q.etat.recompenses[0].icone === "sablier", "icône de récompense enregistrée");
  ok(!!document.querySelector('[data-rec-apercu="0"] svg'), "aperçu de l'icône affiché dans l'espace parent");

  // Bourse trop légère : les boutons d'achat sont désactivés.
  Q.etat.or = 10;
  Q.router.go("boutique");
  await pause(60);
  const boutonsAchat = Array.from(document.querySelectorAll("#screen-boutique [data-acheter]"));
  ok(boutonsAchat.length > 0 && boutonsAchat.every((b) => b.disabled), "achat bloqué quand la bourse est trop légère");

  Q.etat.or = 500;
  Q.router.go("boutique");
  await pause(60);
  ok(!!document.querySelector('[data-recompense="0"]'), "récompense visible à la boutique");
  ok(!!document.querySelector(".article__visuel svg"), "icône de récompense affichée à la boutique");
  ok(document.getElementById("screen-boutique").textContent.includes("(0/20)"), "compteur de déguisements affiché");
  await pause(200);
  const visuelsCasses = Array.from(document.querySelectorAll("#screen-boutique .article__visuel")).filter((v) => {
    const svg = v.querySelector("svg");
    if (svg) return svg.getBBox().width === 0;
    const img = v.querySelector("img");
    return !img || !img.complete || img.naturalWidth === 0;
  });
  ok(visuelsCasses.length === 0, "tous les visuels de la boutique s'affichent");

  // Achat : l'historique doit garder la récompense et sa date.
  document.querySelector('[data-recompense="0"]').click();
  await pause(80);
  ok(Q.etat.recompensesAchetees.length === 1, "achat enregistré dans l'historique");
  ok(!!document.querySelector(".parchemin-recompense__icone svg"), "parchemin affiché après l'achat");
  Q.ui.fermerModale();

  Q.router.go("carnet");
  await pause(60);
  ok(document.querySelectorAll(".rec-carnet").length === 1, "historique des récompenses visible dans le carnet");
  ok(/Échangée le/.test(document.querySelector(".rec-carnet__meta").textContent), "date de l'échange affichée");
  document.querySelector('[data-parchemin="0"]').click();
  await pause(60);
  ok(!!document.querySelector(".modale__contenu .parchemin-recompense"), "parchemin retrouvé depuis le carnet");
  Q.ui.fermerModale();

  // Verrouillage : le code doit être redemandé au prochain appui long.
  Q.router.go("parent");
  await pause(60);
  document.querySelector('[data-action="verrouiller"]').click();
  await pause(60);
  ok(Q.parentDebloque === false, "espace parent verrouillé");
  Q.router.go("parent");
  await pause(60);
  ok(!!document.getElementById("points"), "le code est redemandé après verrouillage");

  // Assemblage : seule la terminaison est demandée, elle doit être acceptée.
  const phraseAsm = Q.phraseParId("jouer-present-nous-01");
  Q.etat.quest = {
    aventureId: "ile-present", niveauId: "present-1", mode: "niveau", temps: "present",
    creeLe: Date.now(), index: 0, aides: { eliminer: 0, regle: 0, indice: 0 }, fini: false,
    questions: [{
      id: phraseAsm.id, phraseId: phraseAsm.id, verbe: "jouer", infinitif: "jouer", temps: "present",
      personne: "nous", texte: phraseAsm.texte, reponse: "jouons", difficulte: 1, source: "cible",
      explication: "", type: "assemblage", radical: "jou", terminaison: "ons",
      options: ["as", "ont", "ons", "ai"], consigne: "Assemble le verbe : choisis la bonne terminaison."
    }]
  };
  Q.router.go("quete");
  await pause(80);
  choix(Q.etat.quest.questions[0]).click();
  await pause(60);
  ok(Q.etat.quest.questions[0].reussi === true, "assemblage : la bonne terminaison est acceptée");
  ok(!!document.querySelector(".terminaison--bonne"), "assemblage : terminaison marquée correcte");

  // Quête ratée volontairement : 2 essais puis copie.
  Q.router.go("map");
  await pause(60);
  Q.etat.quest = Q.session.construire({ aventureId: "ile-present", niveauId: "present-1", mode: "niveau" });
  Q.router.go("quete");
  await pause(80);
  for (let n = 0; n < 2; n++) {
    const q = Q.etat.quest.questions[0];
    const boutons = Array.from(document.querySelectorAll(".option:not([disabled]), .terminaison:not([disabled])"));
    const attendu = q.type === "assemblage" ? q.terminaison : q.reponse;
    const faux = boutons.find((b) => (b.getAttribute("data-choix") || b.getAttribute("data-terminaison")) !== attendu);
    if (!faux) throw new Error("Aucun mauvais choix disponible (n=" + n + ")");
    faux.click();
    await pause(40);
  }
  ok(!!document.querySelector("[data-copier]"), "correction active proposée après 2 essais");
  document.querySelector("[data-copier]").click();
  await pause(40);
  ok(!!document.querySelector("[data-suite]"), "bouton Continuer après copie");
  ok(document.querySelector("#phrase .trou--rempli") !== null, "bonne réponse révélée dans la phrase");

  // Aides : perroquet (coup de pouce) et dragonneau (élimination).
  Q.etat.or = 500;
  Q.achat.acheter("familier", "perroquet");
  Q.achat.acheter("familier", "dragonneau");

  const dernierToast = () => {
    const t = document.querySelectorAll(".toast");
    return t.length ? t[t.length - 1].textContent : "";
  };

  const phraseJoue = Q.phraseParId("jouer-present-je-01");
  Q.etat.quest = {
    aventureId: "ile-present", niveauId: "present-1", mode: "niveau", temps: "present",
    creeLe: Date.now(), index: 0, aides: { eliminer: 0, regle: 0, indice: 0 }, fini: false,
    questions: [{
      id: phraseJoue.id, phraseId: phraseJoue.id, verbe: "jouer", infinitif: "jouer", temps: "present",
      personne: "je", texte: phraseJoue.texte, reponse: "joue", difficulte: 1, source: "cible",
      explication: "", type: "qcm", options: ["joues", "joue", "jouent"], lettres: ["A", "B", "C"],
      consigne: "Choisis la bonne forme du verbe."
    }]
  };
  Q.router.go("quete");
  await pause(80);
  ok(!!document.querySelector('[data-aide="lettre"]'), "aide du perroquet disponible");
  document.querySelector('[data-aide="lettre"]').click();
  await pause(60);
  ok(/se termine par « e »/.test(dernierToast()), "perroquet : coup de pouce sur la fin du mot");

  document.querySelector('[data-aide="eliminer"]').click();
  await pause(60);
  const retiree = document.querySelector("#options .option--retiree");
  ok(!!retiree, "dragonneau : un mauvais choix est éliminé");
  ok(retiree && retiree.getAttribute("data-choix") !== "joue", "dragonneau : la bonne réponse reste proposée");

  // En assemblage, le coup de pouce porte sur la terminaison.
  Q.etat.quest = {
    aventureId: "ile-present", niveauId: "present-1", mode: "niveau", temps: "present",
    creeLe: Date.now(), index: 0, aides: { eliminer: 0, regle: 0, indice: 0 }, fini: false,
    questions: [{
      id: phraseAsm.id, phraseId: phraseAsm.id, verbe: "jouer", infinitif: "jouer", temps: "present",
      personne: "nous", texte: phraseAsm.texte, reponse: "jouons", difficulte: 1, source: "cible",
      explication: "", type: "assemblage", radical: "jou", terminaison: "ons",
      options: ["as", "ont", "ons", "ai"], consigne: "Assemble le verbe : choisis la bonne terminaison."
    }]
  };
  Q.router.go("quete");
  await pause(80);
  document.querySelector('[data-aide="lettre"]').click();
  await pause(60);
  ok(/se termine par « ns »/.test(dernierToast()), "perroquet : coup de pouce sur la terminaison");

  // Défi mêlé : uniquement un temps déjà travaillé, pas seulement débloqué.
  Q.etat.progression = {};
  const nivPres = Q.aventure("ile-present").niveaux;
  [3, 3, 2, 0].forEach(function (n, i) {
    if (nivPres[i]) Q.etat.progression[nivPres[i].id] = { etoiles: n, meilleur: 7, quetes: 1 };
  });
  const qSansDefi = Q.session.construire({ aventureId: "ile-present", niveauId: "present-1", mode: "niveau" });
  ok(qSansDefi.questions.every(function (q) { return q.temps === "present"; }),
    "défi : pas de temps seulement débloqué");
  const nivImp = Q.aventure("vallee-souvenirs").niveaux[0].id;
  Q.etat.progression[nivImp] = { etoiles: 1, meilleur: 4, quetes: 1 };
  const qAvecDefi = Q.session.construire({ aventureId: "ile-present", niveauId: "present-1", mode: "niveau" });
  const questionsDefi = qAvecDefi.questions.filter(function (q) { return q.source === "defi"; });
  ok(questionsDefi.length === 1 && questionsDefi[0].temps === "imparfait",
    "défi : temps déjà travaillé accepté");
  Q.etat.quest = qAvecDefi;
  Q.etat.quest.index = qAvecDefi.questions.length - 1;
  Q.router.go("quete");
  await pause(80);
  ok(!!document.querySelector(".encart--defi"), "défi : bandeau explicatif affiché");

  // Gardien déjà vaincu : repère visuel, défi toujours possible.
  Q.aventure("ile-present").niveaux.forEach(function (n) {
    Q.etat.progression[n.id] = { etoiles: 3, meilleur: 7, quetes: 1 };
  });
  Q.etat.aiguilles = ["present"];
  Q.router.go("ile", { id: "ile-present" });
  await pause(80);
  ok(!!document.querySelector(".gardien--vaincu"), "gardien vaincu : carte marquée");
  ok(/Vaincu/.test((document.querySelector(".gardien__vaincu") || {}).textContent || ""),
    "gardien vaincu : pastille affichée");
  const boutonGardien = document.querySelector("[data-gardien]");
  ok(boutonGardien && !boutonGardien.disabled && /Défier à nouveau/.test(boutonGardien.textContent),
    "gardien vaincu : défi toujours possible");

  // Profils multiples : changer de joueur ne perd rien.
  const idLea = Q.profils.actif;
  const orLea = Q.etat.or;
  Q.jeu.nouveau("Noé", "pirate");
  ok(Q.etat.profil.nom === "Noé", "deuxième profil créé");
  ok(Q.jeu.listerProfils().length === 2, "deux profils listés");
  Q.jeu.activerProfil(idLea);
  ok(Q.etat.profil.nom === "Léa" && Q.etat.or === orLea, "retour à Léa sans perte");

  Q.router.go("profils");
  await pause(60);
  ok(document.querySelectorAll("[data-profil]").length === 2, "écran des joueurs liste les profils");
  ok(!!document.querySelector("#fichier-restauration"), "restauration disponible");

  const idRest = Q.jeu.importerEtat({
    version: 1,
    profil: { nom: "Restauré", avatar: "pirate", creeLe: Date.now() },
    or: 42
  });
  ok(!!idRest && Q.etat.profil.nom === "Restauré" && Q.etat.or === 42,
    "sauvegarde restaurée en nouveau profil");
  Q.jeu.activerProfil(idLea);

  const idNoe = Q.jeu.listerProfils().filter(function (p) { return p.nom === "Noé"; })[0].id;
  Q.jeu.activerProfil(idNoe);
  Q.jeu.reinitialiser();
  ok(Q.jeu.listerProfils().length === 2, "profil supprimé de la liste");
  const corbeille = Q.jeu.listerCorbeille();
  ok(corbeille.length >= 1 && corbeille[0].nom === "Noé", "profil placé dans la corbeille");
  const idNoeRestaure = Q.jeu.restaurerProfilCorbeille(corbeille[0].id);
  ok(!!idNoeRestaure && Q.etat.profil.nom === "Noé", "profil restauré depuis la corbeille");
  Q.jeu.activerProfil(idLea);
  ok(Q.etat.profil.nom === "Léa", "Léa active à la fin");

  // Panne d'écriture : l'échec doit être signalé, pas silencieux.
  const vraieEcriture = Q.storage.ecrireStore;
  Q.storage.ecrireStore = function () { return false; };
  Q.sauvegardeAvertie = false;
  Q.jeu.sauver();
  Q.storage.ecrireStore = vraieEcriture;
  ok(Q.sauvegardeKO === true, "échec de sauvegarde signalé");
  Q.jeu.sauver();
  ok(Q.sauvegardeKO === false, "sauvegarde rétablie après l'échec");

  // Lot 1 assemblage : uniquement des terminaisons compatibles avec le radical.
  const vraiHasard = Math.random;
  Math.random = function () { return 0; };
  const exChois = Q.exercices.construire(Q.phraseParId("choisir-present-je-01"), "test-lot1");
  const exFin = Q.exercices.construire(Q.phraseParId("finir-present-tu-01"), "test-lot1");
  const exJouer = Q.exercices.construire(Q.phraseParId("jouer-present-nous-01"), "test-lot1");
  const exAller = Q.exercices.construire(Q.phraseParId("aller-present-je-01"), "test-lot1");
  Math.random = vraiHasard;

  const formesDe = (verbeId) => {
    const v = Q.verbe(verbeId);
    const set = {};
    Object.keys(v.formes).forEach(function (t) {
      Object.keys(v.formes[t] || {}).forEach(function (p) {
        if (v.formes[t][p]) set[v.formes[t][p]] = true;
      });
    });
    return set;
  };
  const formesChoisir = formesDe("choisir");

  ok(exChois.type === "assemblage", "assemblage : forme régulière conservée");
  ok(exChois.radical === "chois" && exChois.terminaison === "is", "assemblage : découpage certifié chois-ir");
  ok(exChois.options.indexOf("x") === -1 && exChois.options.indexOf("a") === -1 &&
    exChois.options.indexOf("es") === -1, "assemblage : plus de terminaisons inventées");
  ok(exChois.options.every(function (o) {
    return !!formesChoisir[exChois.radical + o] || o === "i";
  }), "assemblage : toutes les options sont des formes réelles");
  ok(exFin.type === "assemblage" && exFin.radical === "fin", "assemblage : découpage certifié fin-ir");
  ok(exJouer.type === "assemblage" && exJouer.radical === "jou", "assemblage : radical jou- conservé");
  ok(exAller.type === "qcm", "assemblage : aller (irrégulier) basculé en QCM");

  // Les 12 nouveaux badges : on remplit leurs conditions puis on vérifie.
  const vraieStatsSrs = Q.srs.stats;
  Q.srs.stats = function () { return { solides: 40, aRevoir: 0 }; };
  Q.etat.compteurs.quetes = 30;
  Q.etat.compteurs.gardiens = 2;
  Q.etat.stats.jours = ["2026-11-01", "2026-11-02", "2026-11-03"];
  Q.curriculum().ordre.forEach(function (id) {
    const a = Q.aventure(id);
    a.niveaux.forEach(function (n) {
      Q.etat.progression[n.id] = { etoiles: 3, meilleur: 7, quetes: 2 };
    });
  });
  Q.etat.journal.unshift({
    date: Date.now(), aventure: "ile-present", niveau: null,
    etoiles: 3, premierCoup: 7, total: 7
  });
  Q.badges.verifier();
  Q.srs.stats = vraieStatsSrs;

  const badgesAttendus = [
    "apprenti-conteur", "vieux-loup-de-mer", "habitue-du-port",
    "chasseur-d-etoiles", "ciel-etoile", "roi-de-l-imparfait",
    "maitre-du-futur", "as-du-passe-compose", "chasseur-de-gardiens",
    "sans-une-egratignure", "memoire-legendaire", "revanche"
  ];
  const badgesManquants = badgesAttendus.filter(function (id) {
    return Q.etat.badges.indexOf(id) === -1;
  });
  ok(badgesManquants.length === 0,
    "12 nouveaux badges débloqués" + (badgesManquants.length ? " (manquants : " + badgesManquants.join(", ") + ")" : ""));

  return out;
})()`);

console.log(JSON.stringify(rapport, null, 2));

// Rechargement : la progression doit revenir.
await send("Page.reload", { ignoreCache: false });
await wait(900);
const apres = await evaluate(`(async () => {
  const Q = window.Quete;
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  await pause(200);
  return {
    profil: Q.etat.profil && Q.etat.profil.nom,
    or: Q.etat.or,
    etoiles: Q.etat.progression["present-1"] && Q.etat.progression["present-1"].etoiles,
    ecran: document.querySelector(".screen.actif") && document.querySelector(".screen.actif").id,
    queteEnCours: !!(Q.etat.quest && !Q.etat.quest.fini),
    recompensesAchetees: (Q.etat.recompensesAchetees || []).length,
    iconeRecompense: (Q.etat.recompensesAchetees[0] || {}).icone
  };
})()`);

console.log("Après rechargement :", JSON.stringify(apres));

const attendu = {
  profil: "Léa", etoiles: 3, queteEnCours: true,
  recompensesAchetees: 1, iconeRecompense: "sablier"
};
const ecarts = Object.keys(attendu).filter((cle) => apres[cle] !== attendu[cle]);
if (apres.or < 300) ecarts.push("or (" + apres.or + ")");
if (ecarts.length) {
  console.error("État restauré incorrect : " + ecarts.join(", "));
  console.error(JSON.stringify(apres));
  exceptions.push("persistance après rechargement");
}

const erreursTotales = exceptions.concat(consoleErrors);
if (erreursTotales.length) {
  console.log("\nErreurs console :");
  erreursTotales.forEach((e) => console.log("  ✗ " + e));
}

ws.close();
edge.kill();
await wait(600);
try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* profil temporaire verrouillé : Windows le libérera */ }
console.log(erreursTotales.length ? "TEST EN ÉCHEC" : "TEST OK");
process.exit(erreursTotales.length ? 1 : 0);
