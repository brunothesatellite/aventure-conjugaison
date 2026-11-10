/* faire — 3e groupe, irrégulier, très fréquent. */
(function (Q) {
  Q.registerVerb({
    id: "faire",
    infinitif: "faire",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "fait",
    formes: {
      present: { je: "fais", tu: "fais", il: "fait", elle: "fait", nous: "faisons", vous: "faites", ils: "font", elles: "font" },
      imparfait: { je: "faisais", tu: "faisais", il: "faisait", elle: "faisait", nous: "faisions", vous: "faisiez", ils: "faisaient", elles: "faisaient" },
      futur: { je: "ferai", tu: "feras", il: "fera", elle: "fera", nous: "ferons", vous: "ferez", ils: "feront", elles: "feront" },
      passe_compose: { je: "ai fait", tu: "as fait", il: "a fait", elle: "a fait", nous: "avons fait", vous: "avez fait", ils: "ont fait", elles: "ont fait" }
    },
    radicaux: {
      present: {
        je: "fai", tu: "fai", il: "fai", elle: "fai",
        nous: "fais",
        ils: "fon", elles: "fon"
      }
    },
    pieges: ["vous faites (pas « vous faisez »)", "ils font"],
    note: "Vous faites : c'est une forme irrégulière à retenir par cœur."
  });
})(window.Quete);
