/* voler — 1er groupe. Deux sens : se déplacer dans l'air, ou dérober. */
(function (Q) {
  Q.registerVerb({
    id: "voler",
    infinitif: "voler",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "volé",
    formes: {
      present: { je: "vole", tu: "voles", il: "vole", elle: "vole", nous: "volons", vous: "volez", ils: "volent", elles: "volent" },
      imparfait: { je: "volais", tu: "volais", il: "volait", elle: "volait", nous: "volions", vous: "voliez", ils: "volaient", elles: "volaient" },
      futur: { je: "volerai", tu: "voleras", il: "volera", elle: "volera", nous: "volerons", vous: "volerez", ils: "voleront", elles: "voleront" },
      passe_compose: { je: "ai volé", tu: "as volé", il: "a volé", elle: "a volé", nous: "avons volé", vous: "avez volé", ils: "ont volé", elles: "ont volé" }
    },
    pieges: ["il vole (dans les airs ou un objet ?)", "nous volions"],
    note: "Voler a deux sens : un oiseau vole dans le ciel, un pirate vole un trésor."
  });
})(window.Quete);
