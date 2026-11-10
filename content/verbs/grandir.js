/* grandir — 2e groupe, régulier. */
(function (Q) {
  Q.registerVerb({
    id: "grandir",
    infinitif: "grandir",
    groupe: 2,
    auxiliaire: "avoir",
    participe: "grandi",
    formes: {
      present: { je: "grandis", tu: "grandis", il: "grandit", elle: "grandit", nous: "grandissons", vous: "grandissez", ils: "grandissent", elles: "grandissent" },
      imparfait: { je: "grandissais", tu: "grandissais", il: "grandissait", elle: "grandissait", nous: "grandissions", vous: "grandissiez", ils: "grandissaient", elles: "grandissaient" },
      futur: { je: "grandirai", tu: "grandiras", il: "grandira", elle: "grandira", nous: "grandirons", vous: "grandirez", ils: "grandiront", elles: "grandiront" },
      passe_compose: { je: "ai grandi", tu: "as grandi", il: "a grandi", elle: "a grandi", nous: "avons grandi", vous: "avez grandi", ils: "ont grandi", elles: "ont grandi" }
    },
    pieges: ["il grandit (un t)", "nous grandissons"],
    note: "Grandir : le -iss- du 2e groupe revient avec nous, vous, ils."
  });
})(window.Quete);
