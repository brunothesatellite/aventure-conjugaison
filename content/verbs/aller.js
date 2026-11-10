/* aller — 3e groupe, irrégulier, auxiliaire être au passé composé. */
(function (Q) {
  Q.registerVerb({
    id: "aller",
    infinitif: "aller",
    groupe: 3,
    auxiliaire: "etre",
    participe: "allé",
    formes: {
      present: { je: "vais", tu: "vas", il: "va", elle: "va", nous: "allons", vous: "allez", ils: "vont", elles: "vont" },
      imparfait: { je: "allais", tu: "allais", il: "allait", elle: "allait", nous: "allions", vous: "alliez", ils: "allaient", elles: "allaient" },
      futur: { je: "irai", tu: "iras", il: "ira", elle: "ira", nous: "irons", vous: "irez", ils: "iront", elles: "iront" },
      passe_compose: { je: "suis allé", tu: "es allé", il: "est allé", elle: "est allée", nous: "sommes allés", vous: "êtes allés", ils: "sont allés", elles: "sont allées" }
    },
    radicaux: { present: { nous: "all", vous: "all" } },
    pieges: ["je vais / nous allons", "j'irai (futur)"],
    note: "Aller est très irrégulier : je vais, nous allons, j'irai. Au passé composé, il se conjugue avec être."
  });
})(window.Quete);
