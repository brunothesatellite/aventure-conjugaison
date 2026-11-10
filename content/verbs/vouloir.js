/* vouloir — 3e groupe, irrégulier. */
(function (Q) {
  Q.registerVerb({
    id: "vouloir",
    infinitif: "vouloir",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "voulu",
    formes: {
      present: { je: "veux", tu: "veux", il: "veut", elle: "veut", nous: "voulons", vous: "voulez", ils: "veulent", elles: "veulent" },
      imparfait: { je: "voulais", tu: "voulais", il: "voulait", elle: "voulait", nous: "voulions", vous: "vouliez", ils: "voulaient", elles: "voulaient" },
      futur: { je: "voudrai", tu: "voudras", il: "voudra", elle: "voudra", nous: "voudrons", vous: "voudrez", ils: "voudront", elles: "voudront" },
      passe_compose: { je: "ai voulu", tu: "as voulu", il: "a voulu", elle: "a voulu", nous: "avons voulu", vous: "avez voulu", ils: "ont voulu", elles: "ont voulu" }
    },
    pieges: ["je veux / nous voulons", "ils veulent"],
    note: "Vouloir : je veux, nous voulons, ils veulent. Le radical change au pluriel."
  });
})(window.Quete);
