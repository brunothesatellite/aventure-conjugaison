/* chanter — 1er groupe, régulier. */
(function (Q) {
  Q.registerVerb({
    id: "chanter",
    infinitif: "chanter",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "chanté",
    formes: {
      present: { je: "chante", tu: "chantes", il: "chante", elle: "chante", nous: "chantons", vous: "chantez", ils: "chantent", elles: "chantent" },
      imparfait: { je: "chantais", tu: "chantais", il: "chantait", elle: "chantait", nous: "chantions", vous: "chantiez", ils: "chantaient", elles: "chantaient" },
      futur: { je: "chanterai", tu: "chanteras", il: "chantera", elle: "chantera", nous: "chanterons", vous: "chanterez", ils: "chanteront", elles: "chanteront" },
      passe_compose: { je: "ai chanté", tu: "as chanté", il: "a chanté", elle: "a chanté", nous: "avons chanté", vous: "avez chanté", ils: "ont chanté", elles: "ont chanté" }
    },
    pieges: ["je chantais / tu chantais (identiques)", "nous chantions"],
    note: "À l'imparfait, je chantais et tu chantais s'écrivent pareil : seul le pronom change."
  });
})(window.Quete);
