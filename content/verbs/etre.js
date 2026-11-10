/* être — auxiliaire, 3e groupe. Le verbe le plus fréquent de la langue. */
(function (Q) {
  Q.registerVerb({
    id: "etre",
    infinitif: "être",
    groupe: 3,
    auxiliaire: "avoir",
    participe: "été",
    formes: {
      present: { je: "suis", tu: "es", il: "est", elle: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" },
      imparfait: { je: "étais", tu: "étais", il: "était", elle: "était", nous: "étions", vous: "étiez", ils: "étaient", elles: "étaient" },
      futur: { je: "serai", tu: "seras", il: "sera", elle: "sera", nous: "serons", vous: "serez", ils: "seront", elles: "seront" },
      passe_compose: { je: "ai été", tu: "as été", il: "a été", elle: "a été", nous: "avons été", vous: "avez été", ils: "ont été", elles: "ont été" }
    },
    radicaux: {
      imparfait: {
        je: "ét", tu: "ét", il: "ét", elle: "ét",
        nous: "ét", vous: "ét", ils: "ét", elles: "ét"
      }
    },
    pieges: ["tu es / il est", "vous êtes (pas « vous êtes » avec un -s ? si, il en faut un)"],
    note: "Avec « tu », être devient « es ». Avec « vous », c'est « êtes »."
  });
})(window.Quete);
