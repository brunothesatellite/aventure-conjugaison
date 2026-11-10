/* dire — 3e groupe, irrégulier. Piège classique : vous dites. */
(function (Q) {
  Q.registerVerb({
    id: "dire",
    infinitif: "dire",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "dit",
    formes: {
      present: { je: "dis", tu: "dis", il: "dit", elle: "dit", nous: "disons", vous: "dites", ils: "disent", elles: "disent" },
      imparfait: { je: "disais", tu: "disais", il: "disait", elle: "disait", nous: "disions", vous: "disiez", ils: "disaient", elles: "disaient" },
      futur: { je: "dirai", tu: "diras", il: "dira", elle: "dira", nous: "dirons", vous: "direz", ils: "diront", elles: "diront" },
      passe_compose: { je: "ai dit", tu: "as dit", il: "a dit", elle: "a dit", nous: "avons dit", vous: "avez dit", ils: "ont dit", elles: "ont dit" }
    },
    pieges: ["vous dites (pas « vous disez »)", "ils disent"],
    note: "Vous dites : c'est le grand piège du verbe dire."
  });
})(window.Quete);
