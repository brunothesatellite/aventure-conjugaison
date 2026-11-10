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
  "--allow-file-access-from-files", "--autoplay-policy=no-user-gesture-required",
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
  const choix = (q) => document.querySelector('[data-choix="' + CSS.escape(q.reponse) + '"], [data-terminaison="' + CSS.escape(q.reponse) + '"]');

  ok(!!window.Quete, "espace Quete chargé");
  ok(actif("home"), "écran d'accueil actif sans profil");

  Q.jeu.nouveau("Léa", "magicienne");
  ok(Q.jeu.aProfil(), "profil créé");
  Q.router.go("map");
  await pause(60);
  ok(actif("map"), "carte affichée");
  ok(document.querySelectorAll("[data-ile]").length === 4, "4 îles sur la carte");
  ok(document.querySelectorAll("[data-ile][disabled]").length === 3, "3 îles verrouillées au départ");

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

  const brut = localStorage.getItem("quete-verbes:v1");
  ok(!!brut, "sauvegarde écrite");
  ok(JSON.parse(brut).profil.nom === "Léa", "nom sauvegardé");

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

  // Quête ratée volontairement : 2 essais puis copie.
  Q.router.go("map");
  await pause(60);
  Q.etat.quest = Q.session.construire({ aventureId: "ile-present", niveauId: "present-1", mode: "niveau" });
  Q.router.go("quete");
  await pause(80);
  for (let n = 0; n < 2; n++) {
    const q = Q.etat.quest.questions[0];
    const boutons = Array.from(document.querySelectorAll(".option:not([disabled]), .terminaison:not([disabled])"));
    const faux = boutons.find((b) => (b.getAttribute("data-choix") || b.getAttribute("data-terminaison")) !== q.reponse);
    if (!faux) throw new Error("Aucun mauvais choix disponible (n=" + n + ")");
    faux.click();
    await pause(40);
  }
  ok(!!document.querySelector("[data-copier]"), "correction active proposée après 2 essais");
  document.querySelector("[data-copier]").click();
  await pause(40);
  ok(!!document.querySelector("[data-suite]"), "bouton Continuer après copie");
  ok(document.querySelector("#phrase .trou--rempli") !== null, "bonne réponse révélée dans la phrase");

  // Aides : achat d'un familier puis bouton d'aide disponible.
  Q.etat.or = 500;
  Q.achat.acheter("familier", "perroquet");
  Q.router.go("quete");
  await pause(80);
  ok(!!document.querySelector('[data-aide="lettre"]'), "aide du perroquet disponible");

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
    queteEnCours: !!(Q.etat.quest && !Q.etat.quest.fini)
  };
})()`);

console.log("Après rechargement :", JSON.stringify(apres));

const attendu = { profil: "Léa", etoiles: 3, queteEnCours: true };
const ecarts = Object.keys(attendu).filter((cle) => apres[cle] !== attendu[cle]);
if (apres.or < 440) ecarts.push("or (" + apres.or + ")");
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
