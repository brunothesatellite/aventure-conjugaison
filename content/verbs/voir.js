/* voir — 3e groupe. Futur en verr-. */
(function (Q) {
  Q.registerVerb({
    id: "voir",
    infinitif: "voir",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "vu",
    formes: {
      present: { je: "vois", tu: "vois", il: "voit", elle: "voit", nous: "voyons", vous: "voyez", ils: "voient", elles: "voient" },
      imparfait: { je: "voyais", tu: "voyais", il: "voyait", elle: "voyait", nous: "voyions", vous: "voyiez", ils: "voyaient", elles: "voyaient" },
      futur: { je: "verrai", tu: "verras", il: "verra", elle: "verra", nous: "verrons", vous: "verrez", ils: "verront", elles: "verront" },
      passe_compose: { je: "ai vu", tu: "as vu", il: "a vu", elle: "a vu", nous: "avons vu", vous: "avez vu", ils: "ont vu", elles: "ont vu" }
    },
    radicaux: {
      present: {
        je: "voi", tu: "voi", il: "voi", elle: "voi",
        nous: "voy", vous: "voy",
        ils: "voi", elles: "voi"
      }
    },
    pieges: ["nous voyons (un y)", "je verrai (deux r)"],
    note: "Voir : nous voyons avec un y, mais je verrai au futur avec deux r."
  });
})(window.Quete);
