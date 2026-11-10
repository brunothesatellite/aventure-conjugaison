/* ============================================================
   generer-icones-inline.js — injecte les pictos dans le jeu.

   Pourquoi ? Un SVG utilisé comme masque CSS (mask-image) est
   refusé par les navigateurs quand la page est ouverte en
   file:// (double-clic sur index.html). Les icônes devenaient
   donc invisibles. On les intègre ici en SVG inline : elles
   s'affichent partout et gardent la couleur du texte.

   Usage :  node tools/generer-icones-inline.js

   Lit   assets/img/icons/*.svg
   Écrit assets/icons-inline.js  (généré, ne pas éditer à la main)
   ============================================================ */

const fs = require("node:fs");
const path = require("node:path");

const RACINE = path.resolve(__dirname, "..");
const DOSSIER = path.join(RACINE, "assets", "img", "icons");
const SORTIE = path.join(RACINE, "assets", "icons-inline.js");

const fichiers = fs
  .readdirSync(DOSSIER)
  .filter((f) => f.toLowerCase().endsWith(".svg"))
  .sort();

const icones = {};
const problemes = [];

for (const fichier of fichiers) {
  const nom = fichier.replace(/\.svg$/i, "");
  const source = fs.readFileSync(path.join(DOSSIER, fichier), "utf8");

  const vb = (source.match(/viewBox="([^"]+)"/) || [])[1];
  const debut = source.indexOf(">") + 1;
  const fin = source.lastIndexOf("</svg>");
  if (!vb || debut <= 0 || fin === -1) {
    problemes.push(fichier);
    continue;
  }

  /* Le fond était blanc : on le retire pour hériter de currentColor. */
  const contenu = source
    .slice(debut, fin)
    .trim()
    .replace(/\sfill="#f{3,6}"/gi, "")
    .replace(/\sfill="white"/gi, "");

  icones[nom] = { vb: vb, c: contenu };
}

const entete = `/* ============================================================
   icons-inline.js — pictos game-icons intégrés au jeu.
   FICHIER GÉNÉRÉ par tools/generer-icones-inline.js
   Ne pas modifier à la main : relancer le générateur.
   Les SVG d'origine restent dans assets/img/icons/ (crédits :
   CREDITS.md, généré par tools/generer-manifest.js).
   ============================================================ */
(function (Q) {
  "use strict";
  Q.iconesSVG = ${JSON.stringify(icones)};
})(window.Quete);
`;

fs.writeFileSync(SORTIE, entete, "utf8");

const poids = (fs.statSync(SORTIE).size / 1024).toFixed(1);
console.log(
  `${Object.keys(icones).length} icônes intégrées → assets/icons-inline.js (${poids} Ko)`
);
if (problemes.length) {
  console.error("SVG illisibles : " + problemes.join(", "));
  process.exitCode = 1;
}
