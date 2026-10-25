# Le chantier des lettres

**Le chantier des lettres** (dépôt `alphalearn`) est un jeu éducatif pour aider les jeunes enfants à apprendre le **son des lettres**. Il s'adresse à un public francophone qui commence tout juste à lire.

L'enfant y est guidé par **Bobi**, une petite pelleteuse jaune qui parle. Bobi prononce un son, par exemple « beu », et l'enfant doit retrouver, parmi plusieurs lettres affichées, celle qui fait ce son.

> 🚧 Projet en cours : l'écran d'accueil est terminé, l'écran de jeu est en construction.

## Comment le projet est fabriqué

### Du vibe-coding contrôlé

Le code est écrit automatiquement, **par petites étapes**, chacune **contrôlée par un développeur** :

1. Le développeur décrit une étape précise (un écran, un comportement, une correction).
2. L'assistant propose et écrit le code correspondant.
3. Le développeur relit, teste sur les vrais appareils, puis valide, corrige ou fait reprendre l'étape.

L'objectif est de garder un code propre et compréhensible, sans perdre la maîtrise du projet.

### Qui fait quoi

- **Graphismes** : générés avec **ChatGPT** (Bobi et ses expressions, le décor du chantier, le titre, l'icône de l'application).
- **Code** : produit en majorité par **Claude** (Anthropic), puis retouché au besoin par le développeur.
- **Direction, relecture et tests** : le développeur.

## Ce que fait l'application

- **Écran d'accueil** : l'enfant tape son prénom, puis Bobi lui dit bonjour à voix haute (synthèse vocale du navigateur).
- **Écran de jeu** (en construction) : Bobi dans le chantier, avec des lettres à retrouver d'après leur son.
- **Tablette tenue verticalement** : Bobi demande de tourner l'écran, car le jeu se joue en paysage.
- **Application installable** (PWA) : sur iPad, Safari → Partager → « Sur l'écran d'accueil ». Une fois installé sur l'écran d'accueil, le jeu devrait s'ouvrir en plein écran et pouvoir fonctionner sans connexion.

### Les lettres et les sons

`src/letters.js` décrit chaque lettre : son type (voyelle ou consonne), le texte que la synthèse vocale lit pour faire entendre son son, et quelques mots très simples (*papa*, *bobo*, *dodo*…). Les lettres **é**, **è** et **ê** y figurent comme des sons à part entière.

Pour ne pas piéger l'enfant, deux lettres qui font le même son (i et y, c, k et q, s et z…) ou des sons trop proches (b et p, m et n, é et è…) ne sont jamais proposées sur le même écran : c'est le rôle de `pickNonConfusableLetters()`.

## Appareils ciblés

Le jeu vise des **iPad**, y compris anciens :

- **iPad 7** : l'appareil principal ;
- **iPad Mini 2** (iOS 12, Safari 12) : l'appareil de test le plus contraignant.

Tout le code doit donc fonctionner sur **Safari 12** :

- `vite.config.js` compile le JavaScript et le CSS pour Safari 12 (`build.target`) ;
- dans le CSS, on évite notamment `inset`, `aspect-ratio` et `gap` en flexbox.

## Technique

- [React](https://react.dev) 19 et [Vite](https://vite.dev) 8, en JavaScript.
- Lint : [Oxlint](https://oxc.rs).
- Hébergement : GitHub Pages, à l'adresse `https://steevelefort.github.io/alphalearn/`.

### Commandes

```bash
npm install      # installer les dépendances (une seule fois)
npm run dev      # lancer en local : http://localhost:5173/alphalearn/
npm run lint     # vérifier le code
npm run build    # compiler dans dist/
npm run deploy   # compiler et publier sur GitHub Pages
```

En local, l'adresse se termine par `/alphalearn/` (réglage `base` de `vite.config.js`). Après un `npm run deploy`, il faut attendre 2 à 3 minutes avant que GitHub Pages serve la nouvelle version.

### Icônes et écrans de démarrage

Les icônes de l'application et les écrans de démarrage iOS sont générés à partir d'une seule image carrée, avec [ImageMagick](https://imagemagick.org) :

```bash
scripts/generate-icons.sh chemin/vers/icone-grand-format.png
```

### Organisation du code

```
src/
├── App.jsx                 composant principal, choisit l'écran affiché
├── WelcomeScreen.jsx       écran d'accueil (prénom, « C'est parti ! »)
├── WorkshopScreen.jsx      écran de jeu, dans le chantier
├── RotateDeviceScreen.jsx  « Tourne ton écran », affiché en portrait
├── Bobi.jsx                Bobi de face, par calques (corps, yeux, bouche qui parle)
├── letters.js              lettres, sons, mots, et tirage sans confusion
└── assets/                 images de Bobi, du décor et du titre
public/
├── manifest.webmanifest    description de l'application installable
├── sw.js                   service worker (fonctionnement hors ligne)
├── icons/                  icônes
└── splash/                 écrans de démarrage iOS
```

Le code est écrit en anglais, avec des noms explicites. Les textes destinés aux enfants restent en français.
