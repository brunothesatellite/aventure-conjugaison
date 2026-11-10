# Spécifications Techniques : Webapp "La Quête des Verbes" (CE2 - Médiéval & Pirates)

## 📌 Présentation du Projet
L'objectif est de créer une application web éducative (Single Page Application) pour un enfant de 8 ans en classe de CE2. L'application utilise les codes de la gamification (thématique médiévale et pirates) pour rendre l'apprentissage des conjugaisons ludique et motivant.

### Contraintes Techniques :
*   **Architecture :** Fichiers statiques légers (HTML5, CSS3 via Tailwind CSS CDN, JavaScript Vanilla ES6+).
*   **Persistance :** Sauvegarde locale automatique via l'API `localStorage` du navigateur.
*   **Accessibilité :** Adapté aux enfants (gros boutons, interface épurée, code couleur fixe pour les pronoms).
*   **Indépendance :** Pas de base de données externe ni de serveur (idéal pour tourner sur OpenCode).

---

## 🗺️ Phase 1 : Structure Unique (`index.html`)

Génère un fichier `index.html` basé sur Tailwind CSS (via CDN) structuré en conteneurs d'écrans (`<div id="screen-xxx" class="hidden">`). Un seul écran doit être visible à la fois.

### Spécifications graphiques (Thème Médiéval / Pirate) :
*   Arrière-plan global chaleureux style vieux parchemin (`bg-amber-50`).
*   Bordures typées vieux bois ou pierre (`border-amber-800`).
*   Boutons massifs avec des états de survol interactifs (`hover:scale-105 transition-transform`).

### Écrans à intégrer :
1.  **Écran de Connexion / Accueil (`#screen-home`) :** 
    *   Formulaire simple pour entrer le prénom du joueur.
    *   Sélection de l'avatar parmi 3 emojis/icônes : Chevalier ⚔️, Magicienne 🧙‍♀️, Capitaine Pirate 🏴‍☠️.
    *   Bouton géant "Commencer l'Aventure".
2.  **Écran Carte du Monde (`#screen-map`) :**
    *   Affichage du profil (Avatar, Prénom, Pièces d'Or 🪙, Niveau).
    *   Grille de 4 cartes/boutons représentant les Mondes (Présent, Imparfait, Futur, Passé Composé).
    *   Affichage des badges débloqués dans un coin du tableau de bord.
3.  **Écran Zone de Combat/Exercice (`#screen-game`) :**
    *   Barre de progression visuelle de la quête en cours (ex: Question 3/5).
    *   Zone d'affichage de l'énigme : la phrase à trou thématisée avec le verbe à l'infinitif entre parenthèses.
    *   Zone d'interaction : Boutons de choix multiples (les terminaisons ou formes verbales complètes) cliquables.
    *   Zone de retour pédagogique (indices affichés dynamiquement).
4.  **Écran "La Taverne & Parchemin" (`#screen-shop`) :**
    *   Espace boutique pour acheter des familiers (Perroquet 🦜, Dragonneau 🐉, Cheval 🐎) avec l'or du jeu.
    *   Zone parent sécurisée par un mini-calcul (ex: 7 x 8) pour configurer les récompenses réelles.

---

## ⚙️ Phase 2 : Moteur Logique et Sauvegarde (`app.js`)

Crée le script principal `app.js` qui pilote l'état global du jeu, la navigation et interagit avec la base de données définie dans `verbs.js`.

### 1. Structure de l'État Global (State) :
```javascript
let gameState = {
  playerName: "",
  avatar: "",
  gold: 0,
  currentWorld: "present",
  currentLevelIndex: 0,
  streak: 0, // Bonnes réponses d'affilée
  unlockedBadges: [],
  inventory: []
};
```

### 2. Fonctions clés à coder :
*   `showScreen(screenId)` : Masque toutes les sections possédant la classe `hidden` et retire cette classe pour l'identifiant passé en paramètre.
*   `saveGame()` et `loadGame()` : Sérialise l'objet `gameState` en JSON pour l'enregistrer ou le lire depuis le `localStorage`.
*   `initGame()` : Vérifie si un profil existe au chargement de la page. Si oui, redirige directement vers l'Écran Carte du Monde (`#screen-map`).

---

## ⚔️ Phase 3 : Moteur d'Exercices et Pédagogie (`app.js` - Suite)

Développe la logique de génération des questions de conjugaison. Ce module s'active lorsque l'enfant sélectionne un niveau dans un monde.

### Logique du sélecteur d'énigmes :
1.  Une session de jeu comporte **5 questions** tirées aléatoirement parmi les verbes du niveau sélectionné.
2.  Pour chaque question, extraire le pronom, le texte de la phrase d'exemple et la bonne réponse.
3.  **Générateur de distracteurs (faux choix) :**
    *   Générer 2 ou 3 mauvaises propositions cohérentes (ex: pour le verbe *être* au présent avec *tu*, si la bonne réponse est `es`, les distracteurs peuvent être `est` et `suis`).
    *   Mélanger le tableau des options avant d'injecter les boutons dans le DOM.

### Gestion des réponses :
*   **Si la réponse est correcte :** 
    *   Ajouter +10 pièces d'or au `gameState`.
    *   Déclencher une animation visuelle (pluie d'or ou flash vert).
    *   Passer à la question suivante après 1,5 seconde.
*   **Si la réponse est incorrecte :**
    *   Ne pas pénaliser drastiquement (pas de perte d'or).
    *   Afficher un message d'aide bienveillant basé sur le pronom (ex: *"Aïe ! Rappelle-toi qu'avec 'tu', le verbe prend presque toujours un 's' à la fin. Essaie encore !"*).
    *   Laisser l'enfant corriger son erreur immédiatement.

---

## 🏆 Phase 4 : Rétention et Récompenses (`app.js` - Fin)

Intègre les mécaniques de gamification pour encourager l'assiduité de l'enfant de 8 ans.

### 1. Système de Badges :
Vérifier après chaque question si les conditions de déblocage d'un badge sont validées :
*   `Moussaillon du Présent` : Compléter le niveau 1 du Monde du Présent.
*   `L'Infaillible` : Atteindre un `streak` de 10 bonnes réponses consécutives.
*   `Gros Magot` : Posséder plus de 200 pièces d'or en réserve.

### 2. Le Parchemin des Parents :
*   Permettre aux parents de saisir 3 récompenses personnalisées dans l'interface (ex: *"15 minutes de console"*, *"Le choix du dessert ce soir"*).
*   Associer un coût en pièces d'or virtuelles à ces récompenses (ex: 150 pièces d'or).
*   Lorsque l'enfant clique sur "Acheter", si son solde d'or est suffisant, l'application génère un reçu visuel (un parchemin de réussite) à montrer à ses parents.

---

## 🎨 Phase 5 : Design et Améliorations UX

Ajuste les éléments d'interface pour maximiser le confort de jeu et l'immersion :
*   **Couleurs des pronoms :** Assurer que les pronoms de conjugaison bénéficient de couleurs distinctes et constantes (ex: `Je` / `Tu` / `Il` en bleu marine fort, `Nous` / `Vous` / `Ils` en vert émeraude foncé) pour aider la mémoire visuelle.
*   **Audio (Synthèse vocale native) :** Ajouter un petit bouton de haut-parleur 🔊 à côté de la phrase à trou utilisant l'API `window.speechSynthesis` afin de lire la phrase complète à l'enfant s'il éprouve des difficultés de lecture.
