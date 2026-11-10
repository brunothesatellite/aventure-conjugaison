/* prendre — 3e groupe. On garde le d au présent, sauf au pluriel. */
(function (Q) {
  Q.registerVerb({
    id: "prendre",
    infinitif: "prendre",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "pris",
    formes: {
      present: { je: "prends", tu: "prends", il: "prend", elle: "prend", nous: "prenons", vous: "prenez", ils: "prennent", elles: "prennent" },
      imparfait: { je: "prenais", tu: "prenais", il: "prenait", elle: "prenait", nous: "prenions", vous: "preniez", ils: "prenaient", elles: "prenaient" },
      futur: { je: "prendrai", tu: "prendras", il: "prendra", elle: "prendra", nous: "prendrons", vous: "prendrez", ils: "prendront", elles: "prendront" },
      passe_compose: { je: "ai pris", tu: "as pris", il: "a pris", elle: "a pris", nous: "avons pris", vous: "avez pris", ils: "ont pris", elles: "ont pris" }
    },
    radicaux: {
      present: {
        je: "prend", tu: "prend",
        nous: "pren", vous: "pren",
        ils: "prenn", elles: "prenn"
      }
    },
    pieges: ["je prends (avec un d)", "ils prennent (deux n)"],
    note: "Prendre : un d au singulier (je prends, il prend), deux n au pluriel (ils prennent)."
  });
})(window.Quete);
