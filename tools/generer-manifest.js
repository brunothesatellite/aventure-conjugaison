/* ============================================================
   generer-manifest.js — inventaire des assets et crédits.

   Usage :  node tools/generer-manifest.js

   Produit :
     - assets/manifest.json : un enregistrement par fichier
       (id, fichier, type, licence, auteur, source) ;
     - CREDITS.md : le même contenu, lisible par un humain.

   Les auteurs des pictos sont lus dans tools/icon-authors.json.
   Ce fichier a été produit en comparant les tracés de chaque SVG
   avec le dépôt officiel game-icons/icons (correspondance exacte),
   ce qui garantit une attribution juste pour les 61 pictos.
   ============================================================ */

"use strict";

var fs = require("fs");
var path = require("path");

var RACINE = path.resolve(__dirname, "..");
var ASSETS = path.join(RACINE, "assets");

var LICENCES = {
  icons: {
    licence: "CC BY 3.0",
    source: "https://game-icons.net",
    texte: "assets/licenses/CC-BY-3.0.txt"
  },
  emoji: {
    licence: "CC BY 4.0",
    auteur: "Twitter, Inc. et contributeurs de Twemoji",
    source: "https://github.com/jdecked/twemoji",
    texte: "assets/licenses/twemoji-CC-BY-4.0.txt"
  },
  baloo: {
    licence: "SIL Open Font License 1.1",
    auteur: "Ek Type",
    source: "https://fonts.google.com/specimen/Baloo+2",
    texte: "assets/licenses/baloo2-OFL.txt"
  },
  nunito: {
    licence: "SIL Open Font License 1.1",
    auteur: "Vernon Adams, Cyreal, Jacques Le Bailly",
    source: "https://fonts.google.com/specimen/Nunito",
    texte: "assets/licenses/nunito-OFL.txt"
  }
};

/* Nom d'auteur lisible à partir du dossier game-icons. */
var AUTEURS = {
  lorc: "Lorc",
  delapouite: "Delapouite",
  sbed: "Sbed",
  cathelineau: "Cathelineau",
  badges: "Delapouite"
};

var auteurs = JSON.parse(fs.readFileSync(path.join(__dirname, "icon-authors.json"), "utf8"));

function lister(dossier) {
  var abs = path.join(ASSETS, dossier);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs)
    .filter(function (f) { return /\.(svg|woff2|webp|png)$/i.test(f); })
    .sort();
}

/* Chemin du fichier de picto d'origine sur game-icons.net. */
function sourceIcone(slug, auteur) {
  if (!slug) return LICENCES.icons.source;
  var morceaux = slug.split("|")[0].trim().split("/");
  var dossier = morceaux[0];
  var nom = morceaux[1];
  if (dossier === "badges") return "https://game-icons.net/badges.html";
  return "https://game-icons.net/1x1/" + dossier + "/" + nom + ".html";
}

var assets = [];

/* 1. Pictogrammes d'interface */
auteurs.forEach(function (a) {
  assets.push({
    type: "icone",
    id: "icon-" + a.fichier.replace(/\.svg$/i, ""),
    file: "img/icons/" + a.fichier,
    licence: LICENCES.icons.licence,
    auteur: AUTEURS[a.auteur] || a.auteur || "Game-icons.net",
    source: sourceIcone(a.slug, a.auteur)
  });
});

/* 2. Émojis Twemoji */
lister("img/emoji").forEach(function (f) {
  assets.push({
    type: "emoji",
    id: "emoji-" + f.replace(/\.svg$/i, ""),
    file: "img/emoji/" + f,
    licence: LICENCES.emoji.licence,
    auteur: LICENCES.emoji.auteur,
    source: LICENCES.emoji.source
  });
});

/* 3. Polices */
[
  ["font-baloo2-700", "fonts/baloo2-700.woff2", LICENCES.baloo],
  ["font-nunito-400-700", "fonts/nunito-400-700.woff2", LICENCES.nunito]
].forEach(function (f) {
  assets.push({
    type: "police",
    id: f[0],
    file: f[1],
    licence: f[2].licence,
    auteur: f[2].auteur,
    source: f[2].source
  });
});

/* 4. Illustrations d'îles (créations originales du projet) */
lister("img/worlds").forEach(function (f) {
  assets.push({
    type: "illustration",
    id: "monde-" + f.replace(/\.svg$/i, ""),
    file: "img/worlds/" + f,
    licence: "Œuvre originale du projet",
    auteur: "Bruno Thesatellite",
    source: "https://github.com/brunothesatellite/aventure-conjugaison"
  });
});

/* 5. Textes de licence */
Object.keys(LICENCES).forEach(function (cle) {
  var l = LICENCES[cle];
  assets.push({
    type: "licence",
    id: "licence-" + cle,
    file: l.texte.replace(/^assets\//, ""),
    licence: l.licence,
    auteur: l.auteur || "—",
    source: l.source
  });
});

var manifeste = {
  version: 1,
  genereLe: new Date().toISOString().slice(0, 10),
  note: "Chaque fichier d'assets est déclaré ici avec sa licence, son auteur et sa source. " +
    "Les chemins sont relatifs au dossier assets/. " +
    "Les SVG game-icons.net ont été livrés avec un fond plein, retiré par tools/preparer-icones.js ; " +
    "ils sont utilisés comme masques CSS et recolorés par le texte.",
  assets: assets
};

fs.writeFileSync(
  path.join(ASSETS, "manifest.json"),
  JSON.stringify(manifeste, null, 2) + "\n",
  "utf8"
);

/* ---------- CREDITS.md ---------- */

function tableau(lignes) {
  var entete = "| Fichier | Auteur | Licence | Source |\n|---|---|---|---|\n";
  return entete + lignes.map(function (a) {
    return "| `" + a.file + "` | " + a.auteur + " | " + a.licence + " | " + a.source + " |";
  }).join("\n") + "\n";
}

function parType(type) {
  return assets.filter(function (a) { return a.type === type; });
}

var icones = parType("icone");
var emojis = parType("emoji");

var md = [];
md.push("# Crédits et licences");
md.push("");
md.push("« La Quête des Verbes » assemble des ressources libres de droits. Ce fichier est");
md.push("généré depuis `assets/manifest.json` par `node tools/generer-manifest.js` :");
md.push("merci de ne pas le modifier à la main.");
md.push("");
md.push("## En un coup d'œil");
md.push("");
md.push("| Ressource | Nombre | Licence | Auteur |");
md.push("|---|---|---|---|");
md.push("| Pictogrammes d'interface | " + icones.length + " | CC BY 3.0 | Lorc, Delapouite, Sbed, Cathelineau |");
md.push("| Émojis | " + emojis.length + " | CC BY 4.0 | Twitter, Inc. et contributeurs de Twemoji |");
md.push("| Polices | 2 | SIL OFL 1.1 | Ek Type ; Vernon Adams, Cyreal, Jacques Le Bailly |");
md.push("| Illustrations d'îles | " + parType("illustration").length + " | Œuvre originale | Bruno Thesatellite |");
md.push("");
md.push("## Pictogrammes — game-icons.net");
md.push("");
md.push("Les icônes sont publiées sous **Creative Commons Attribution 3.0** (CC BY 3.0).");
md.push("Le fond plein fourni avec chaque fichier a été retiré, les fichiers ont été renommés");
md.push("en français et sont utilisés comme masques CSS, recolorés par la couleur du texte.");
md.push("Ces modifications n'altèrent pas le dessin d'origine.");
md.push("");
md.push("> Icons made by Lorc, Delapouite, Sbed and Cathelineau. Available on https://game-icons.net");
md.push("");
md.push(tableau(icones));
md.push("## Émojis — Twemoji");
md.push("");
md.push("Les émojis sont publiés sous **Creative Commons Attribution 4.0** (CC BY 4.0).");
md.push("Ils ont été renommés en français, sans modification du dessin.");
md.push("");
md.push("> Emoji images from Twemoji (Twitter, Inc. and contributors), CC BY 4.0.");
md.push("");
md.push(tableau(emojis));
md.push("## Polices");
md.push("");
md.push("Les deux polices sont distribuées sous **SIL Open Font License 1.1**, qui autorise");
md.push("l'auto-hébergement dans une application. Les textes de licence sont dans");
md.push("`assets/licenses/`.");
md.push("");
md.push(tableau(parType("police")));
md.push("## Illustrations d'îles");
md.push("");
md.push("Les quatre décors du dossier `img/worlds/` sont des créations originales dessinées pour ce");
md.push("projet, en SVG, dans un esprit album jeunesse. Ils sont libres de réutilisation avec");
md.push("attribution, dans le cadre de la licence choisie pour le projet.");
md.push("");
md.push(tableau(parType("illustration")));
md.push("## Textes de licence");
md.push("");
md.push(tableau(parType("licence")));
md.push("## Sons");
md.push("");
md.push("Aucun fichier audio : les effets sonores et la voix sont générés à la volée avec");
md.push("l'API Web Audio et la synthèse vocale du navigateur. Aucune licence tierce.");
md.push("");

fs.writeFileSync(path.join(RACINE, "CREDITS.md"), md.join("\n"), "utf8");

console.log(assets.length + " assets déclarés.");
console.log("  pictos : " + icones.length);
console.log("  émojis : " + emojis.length);
console.log("  polices : " + parType("police").length);
console.log("  illustrations : " + parType("illustration").length);
console.log("  licences : " + parType("licence").length);
console.log("→ assets/manifest.json et CREDITS.md écrits.");
