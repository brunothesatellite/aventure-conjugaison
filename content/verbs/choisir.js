/* choisir — 2e groupe, régulier. */
(function (Q) {
  Q.registerVerb({
    id: "choisir",
    infinitif: "choisir",
    groupe: 2,
    auxiliaire: "avoir",
    participe: "choisi",
    formes: {
      present: { je: "choisis", tu: "choisis", il: "choisit", elle: "choisit", nous: "choisissons", vous: "choisissez", ils: "choisissent", elles: "choisissent" },
      imparfait: { je: "choisissais", tu: "choisissais", il: "choisissait", elle: "choisissait", nous: "choisissions", vous: "choisissiez", ils: "choisissaient", elles: "choisissaient" },
      futur: { je: "choisirai", tu: "choisiras", il: "choisira", elle: "choisira", nous: "choisirons", vous: "choisirez", ils: "choisiront", elles: "choisiront" },
      passe_compose: { je: "ai choisi", tu: "as choisi", il: "a choisi", elle: "a choisi", nous: "avons choisi", vous: "avez choisi", ils: "ont choisi", elles: "ont choisi" }
    },
    pieges: ["je choisis / il choisit (s ou t ?)", "nous choisissons"],
    note: "Choisir : je choisis avec un s, il choisit avec un t."
  });
})(window.Quete);
