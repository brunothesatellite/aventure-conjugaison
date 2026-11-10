/* parler — 1er groupe, régulier. */
(function (Q) {
  Q.registerVerb({
    id: "parler",
    infinitif: "parler",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "parlé",
    formes: {
      present: { je: "parle", tu: "parles", il: "parle", elle: "parle", nous: "parlons", vous: "parlez", ils: "parlent", elles: "parlent" },
      imparfait: { je: "parlais", tu: "parlais", il: "parlait", elle: "parlait", nous: "parlions", vous: "parliez", ils: "parlaient", elles: "parlaient" },
      futur: { je: "parlerai", tu: "parleras", il: "parlera", elle: "parlera", nous: "parlerons", vous: "parlerez", ils: "parleront", elles: "parleront" },
      passe_compose: { je: "ai parlé", tu: "as parlé", il: "a parlé", elle: "a parlé", nous: "avons parlé", vous: "avez parlé", ils: "ont parlé", elles: "ont parlé" }
    },
    pieges: ["nous parlions", "ils parlent"],
    note: "Parler : radical parl- et terminaisons régulières du 1er groupe."
  });
})(window.Quete);
