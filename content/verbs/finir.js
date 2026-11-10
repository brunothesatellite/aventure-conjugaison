/* finir — 2e groupe. Le -iss- apparaît au pluriel. */
(function (Q) {
  Q.registerVerb({
    id: "finir",
    infinitif: "finir",
    groupe: 2,
    auxiliaire: "avoir",
    participe: "fini",
    formes: {
      present: { je: "finis", tu: "finis", il: "finit", elle: "finit", nous: "finissons", vous: "finissez", ils: "finissent", elles: "finissent" },
      imparfait: { je: "finissais", tu: "finissais", il: "finissait", elle: "finissait", nous: "finissions", vous: "finissiez", ils: "finissaient", elles: "finissaient" },
      futur: { je: "finirai", tu: "finiras", il: "finira", elle: "finira", nous: "finirons", vous: "finirez", ils: "finiront", elles: "finiront" },
      passe_compose: { je: "ai fini", tu: "as fini", il: "a fini", elle: "a fini", nous: "avons fini", vous: "avez fini", ils: "ont fini", elles: "ont fini" }
    },
    pieges: ["nous finissons (deux s)", "il finit / ils finissent"],
    note: "2e groupe : nous finissons, vous finissez, ils finissent."
  });
})(window.Quete);
