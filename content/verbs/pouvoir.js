/* pouvoir — 3e groupe, irrégulier. */
(function (Q) {
  Q.registerVerb({
    id: "pouvoir",
    infinitif: "pouvoir",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "pu",
    formes: {
      present: { je: "peux", tu: "peux", il: "peut", elle: "peut", nous: "pouvons", vous: "pouvez", ils: "peuvent", elles: "peuvent" },
      imparfait: { je: "pouvais", tu: "pouvais", il: "pouvait", elle: "pouvait", nous: "pouvions", vous: "pouviez", ils: "pouvaient", elles: "pouvaient" },
      futur: { je: "pourrai", tu: "pourras", il: "pourra", elle: "pourra", nous: "pourrons", vous: "pourrez", ils: "pourront", elles: "pourront" },
      passe_compose: { je: "ai pu", tu: "as pu", il: "a pu", elle: "a pu", nous: "avons pu", vous: "avez pu", ils: "ont pu", elles: "ont pu" }
    },
    radicaux: {
      present: {
        je: "peu", tu: "peu", il: "peu", elle: "peu",
        nous: "pouv", vous: "pouv",
        ils: "peuv", elles: "peuv"
      }
    },
    pieges: ["je peux / nous pouvons", "ils peuvent"],
    note: "Pouvoir : je peux, tu peux, il peut, mais nous pouvons et ils peuvent."
  });
})(window.Quete);
