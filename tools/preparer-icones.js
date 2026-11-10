/* ============================================================
   preparer-icones.js — nettoie les pictos game-icons.

   Les SVG de game-icons.net sont livrés avec un fond plein
   (carré noir ou disque) et un dessin blanc. Utilisés comme
   masque CSS, ce fond rendrait une pastille pleine. Ce script
   retire uniquement les formes qui couvrent tout le viewBox.

   Usage :  node tools/preparer-icones.js
   Les fichiers d'origine restent dans l'historique Git.
   ============================================================ */

"use strict";

var fs = require("fs");
var path = require("path");

var DOSSIER = path.resolve(__dirname, "..", "assets", "img", "icons");

function nombre(valeur) {
  var n = parseFloat(String(valeur || "").replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? null : n;
}

function attributs(balise) {
  var out = {};
  balise.replace(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g, function (_, cle, val) {
    out[cle] = val;
    return "";
  });
  return out;
}

/* Un élément couvre-t-il tout le cadre ? */
function couvreTout(balise, largeur, hauteur) {
  var a = attributs(balise);

  if (/^<rect/i.test(balise)) {
    var x = nombre(a.x) || 0;
    var y = nombre(a.y) || 0;
    var w = nombre(a.width);
    var h = nombre(a.height);
    return w >= largeur && h >= hauteur && x <= 0 && y <= 0;
  }

  if (/^<circle/i.test(balise)) {
    var cx = nombre(a.cx);
    var cy = nombre(a.cy);
    var r = nombre(a.r);
    return r != null && r * 2 >= largeur && cx === largeur / 2 && cy === hauteur / 2;
  }

  if (/^<path/i.test(balise)) {
    /* « M0 0h512v512H0z » : l'espace entre M0 et 0h compte,
       on compare donc sans aucun espace. */
    var d = String(a.d || "").replace(/\s+/g, "").toLowerCase();
    return d === "m00h" + largeur + "v" + hauteur + "h0z" ||
           d === "m0,0h" + largeur + "v" + hauteur + "h0z";
  }

  return false;
}

var transformes = 0;
var restants = [];

fs.readdirSync(DOSSIER).filter(function (f) { return /\.svg$/i.test(f); }).forEach(function (fichier) {
  var abs = path.join(DOSSIER, fichier);
  var svg = fs.readFileSync(abs, "utf8");

  var vb = svg.match(/viewBox="([^"]+)"/);
  if (!vb) { restants.push(fichier + " (sans viewBox)"); return; }
  var taille = vb[1].trim().split(/[\s,]+/).map(Number);
  var largeur = taille[2];
  var hauteur = taille[3];

  var avant = svg;
  /* Retire chaque forme de fond, quelle que soit la casse. */
  svg = svg.replace(/<rect\b[^>]*\/>/gi, function (balise) {
    return couvreTout(balise, largeur, hauteur) ? "" : balise;
  });
  svg = svg.replace(/<circle\b[^>]*\/>/gi, function (balise) {
    return couvreTout(balise, largeur, hauteur) ? "" : balise;
  });
  svg = svg.replace(/<path\b[^>]*\/>/gi, function (balise) {
    return couvreTout(balise, largeur, hauteur) ? "" : balise;
  });

  if (svg !== avant) {
    fs.writeFileSync(abs, svg, "utf8");
    transformes++;
  }

  /* Contrôle : il ne doit plus rester de forme plein cadre. */
  var reste = svg.match(/<circle\b[^>]*\/>|<rect\b[^>]*\/>|<path\b[^>]*\/>/gi) || [];
  if (reste.some(function (b) { return couvreTout(b, largeur, hauteur); })) {
    restants.push(fichier);
  }
});

console.log(transformes + " picto(s) nettoyé(s) sur " +
  fs.readdirSync(DOSSIER).filter(function (f) { return /\.svg$/i.test(f); }).length + ".");
if (restants.length) {
  console.error("Fond encore présent : " + restants.join(", "));
  process.exit(1);
}
