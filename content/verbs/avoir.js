/* avoir — auxiliaire, 3e groupe. Sert à former tous les temps composés. */
(function (Q) {
  Q.registerVerb({
    id: "avoir",
    infinitif: "avoir",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "eu",
    formes: {
      present: { je: "ai", tu: "as", il: "a", elle: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" },
      imparfait: { je: "avais", tu: "avais", il: "avait", elle: "avait", nous: "avions", vous: "aviez", ils: "avaient", elles: "avaient" },
      futur: { je: "aurai", tu: "auras", il: "aura", elle: "aura", nous: "aurons", vous: "aurez", ils: "auront", elles: "auront" },
      passe_compose: { je: "ai eu", tu: "as eu", il: "a eu", elle: "a eu", nous: "avons eu", vous: "avez eu", ils: "ont eu", elles: "ont eu" }
    },
    radicaux: { present: { nous: "av", vous: "av" } },
    pieges: ["j'ai (pas « je ai »)", "tu as / il a"],
    note: "« J'ai » : le verbe avoir commence par une voyelle, on enlève le e de « je »."
  });
})(window.Quete);
