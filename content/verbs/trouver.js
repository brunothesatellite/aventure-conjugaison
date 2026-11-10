/* trouver — 1er groupe, régulier. Sert beaucoup au passé composé. */
(function (Q) {
  Q.registerVerb({
    id: "trouver",
    infinitif: "trouver",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "trouvé",
    formes: {
      present: { je: "trouve", tu: "trouves", il: "trouve", elle: "trouve", nous: "trouvons", vous: "trouvez", ils: "trouvent", elles: "trouvent" },
      imparfait: { je: "trouvais", tu: "trouvais", il: "trouvait", elle: "trouvait", nous: "trouvions", vous: "trouviez", ils: "trouvaient", elles: "trouvaient" },
      futur: { je: "trouverai", tu: "trouveras", il: "trouvera", elle: "trouvera", nous: "trouverons", vous: "trouverez", ils: "trouveront", elles: "trouveront" },
      passe_compose: { je: "ai trouvé", tu: "as trouvé", il: "a trouvé", elle: "a trouvé", nous: "avons trouvé", vous: "avez trouvé", ils: "ont trouvé", elles: "ont trouvé" }
    },
    pieges: ["j'ai trouvé (é, pas er)", "nous trouvions"],
    note: "Après avoir, on écrit -é : j'ai trouvé. On ne dit pas « j'ai trouver »."
  });
})(window.Quete);
