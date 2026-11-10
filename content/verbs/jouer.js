/* jouer — 1er groupe, régulier. Verbe modèle. */
(function (Q) {
  Q.registerVerb({
    id: "jouer",
    infinitif: "jouer",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "joué",
    formes: {
      present: { je: "joue", tu: "joues", il: "joue", elle: "joue", nous: "jouons", vous: "jouez", ils: "jouent", elles: "jouent" },
      imparfait: { je: "jouais", tu: "jouais", il: "jouait", elle: "jouait", nous: "jouions", vous: "jouiez", ils: "jouaient", elles: "jouaient" },
      futur: { je: "jouerai", tu: "joueras", il: "jouera", elle: "jouera", nous: "jouerons", vous: "jouerez", ils: "joueront", elles: "joueront" },
      passe_compose: { je: "ai joué", tu: "as joué", il: "a joué", elle: "a joué", nous: "avons joué", vous: "avez joué", ils: "ont joué", elles: "ont joué" }
    },
    pieges: ["tu joues (un s)", "nous jouons"],
    note: "1er groupe : le radical est jou- et les terminaisons sont régulières."
  });
})(window.Quete);
