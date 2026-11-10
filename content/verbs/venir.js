/* venir — 3e groupe, auxiliaire être au passé composé. */
(function (Q) {
  Q.registerVerb({
    id: "venir",
    infinitif: "venir",
    groupe: 3,
    auxiliaire: "etre",
    participe: "venu",
    formes: {
      present: { je: "viens", tu: "viens", il: "vient", elle: "vient", nous: "venons", vous: "venez", ils: "viennent", elles: "viennent" },
      imparfait: { je: "venais", tu: "venais", il: "venait", elle: "venait", nous: "venions", vous: "veniez", ils: "venaient", elles: "venaient" },
      futur: { je: "viendrai", tu: "viendras", il: "viendra", elle: "viendra", nous: "viendrons", vous: "viendrez", ils: "viendront", elles: "viendront" },
      passe_compose: { je: "suis venu", tu: "es venu", il: "est venu", elle: "est venu", nous: "sommes venus", vous: "êtes venus", ils: "sont venus", elles: "sont venus" }
    },
    pieges: ["ils viennent", "je viendrai (futur)"],
    note: "Venir change de radical : je viens, nous venons, ils viennent."
  });
})(window.Quete);
