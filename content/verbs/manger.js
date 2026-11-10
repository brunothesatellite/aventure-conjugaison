/* manger — 1er groupe. Piège : nous mangeons (le e garde le son [ʒ]). */
(function (Q) {
  Q.registerVerb({
    id: "manger",
    infinitif: "manger",
    groupe: 1,
    auxiliaire: "avoir",
    participe: "mangé",
    formes: {
      present: { je: "mange", tu: "manges", il: "mange", elle: "mange", nous: "mangeons", vous: "mangez", ils: "mangent", elles: "mangent" },
      imparfait: { je: "mangeais", tu: "mangeais", il: "mangeait", elle: "mangeait", nous: "mangions", vous: "mangiez", ils: "mangeaient", elles: "mangeaient" },
      futur: { je: "mangerai", tu: "mangeras", il: "mangera", elle: "mangera", nous: "mangerons", vous: "mangerez", ils: "mangeront", elles: "mangeront" },
      passe_compose: { je: "ai mangé", tu: "as mangé", il: "a mangé", elle: "a mangé", nous: "avons mangé", vous: "avez mangé", ils: "ont mangé", elles: "ont mangé" }
    },
    pieges: ["nous mangeons (un e)", "ils mangent (pas « mangent » avec un e muet ? si)"],
    note: "Pour garder le son [ʒ], on écrit nous mangeons avec un e."
  });
})(window.Quete);
