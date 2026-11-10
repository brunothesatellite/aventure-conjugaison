/* arriver — 1er groupe, auxiliaire être au passé composé (accord du participe). */
(function (Q) {
  Q.registerVerb({
    id: "arriver",
    infinitif: "arriver",
    groupe: 1,
    auxiliaire: "etre",
    participe: "arrivé",
    formes: {
      present: { je: "arrive", tu: "arrives", il: "arrive", elle: "arrive", nous: "arrivons", vous: "arrivez", ils: "arrivent", elles: "arrivent" },
      imparfait: { je: "arrivais", tu: "arrivais", il: "arrivait", elle: "arrivait", nous: "arrivions", vous: "arriviez", ils: "arrivaient", elles: "arrivaient" },
      futur: { je: "arriverai", tu: "arriveras", il: "arrivera", elle: "arrivera", nous: "arriverons", vous: "arriverez", ils: "arriveront", elles: "arriveront" },
      passe_compose: { je: "suis arrivé", tu: "es arrivé", il: "est arrivé", elle: "est arrivée", nous: "sommes arrivés", vous: "êtes arrivés", ils: "sont arrivés", elles: "sont arrivées" }
    },
    pieges: ["je suis arrivé (être, pas avoir)", "elle est arrivée (accord)"],
    note: "Arriver se conjugue avec être. Avec être, le participe s'accorde : elle est arrivée."
  });
})(window.Quete);
