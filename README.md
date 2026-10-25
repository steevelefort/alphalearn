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
- **Sons** : effets sonores libres de droits, trouvés sur OpenGameArt (voir [Crédits](#crédits)).
- **Direction, relecture et tests** : le développeur.

## Ce que fait l'application

- **Écran d'accueil** : l'enfant tape son prénom, puis Bobi lui dit bonjour à voix haute (synthèse vocale du navigateur).
- **Écran de jeu** (en construction) : Bobi dans le chantier, avec des lettres à retrouver d'après leur son.
- **Tablette tenue verticalement** : Bobi demande de tourner l'écran, car le jeu se joue en paysage.
- **Application installable** (PWA) : sur iPad, Safari → Partager → « Sur l'écran d'accueil ». Une fois installé sur l'écran d'accueil, le jeu devrait s'ouvrir en plein écran et pouvoir fonctionner sans connexion.

### Les lettres et les sons

`src/letters.js` décrit chaque lettre : son type (voyelle ou consonne), le texte que la synthèse vocale lit pour faire entendre son son, et quelques mots très simples (*papa*, *bobo*, *dodo*…). Les lettres **é**, **è** et **ê** y figurent comme des sons à part entière.

Pour ne pas piéger l'enfant, deux lettres qui font le même son (i et y, c, k et q, s et z…) ou des sons trop proches (b et p, m et n, é et è…) ne sont jamais proposées sur le même écran : c'est le rôle de `areLettersConfusable()`.

Les lettres sont tirées de façon équilibrée (`balancedLetterDraw.js`) : le jeu compte combien de fois chaque lettre est apparue et a été demandée, et choisit en priorité les moins sorties. Sur une partie, chaque lettre finit par être vue et demandée, sans qu'une lettre revienne sans cesse. Ces compteurs sont gardés sur l'appareil (`drawCountsStorage.js`), comme le prénom : l'équilibre se poursuit d'une partie à l'autre.

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

### Images

Les originaux (exports de ChatGPT) sont dans `design/source-images/`, en dehors de `src/` : ils ne sont jamais inclus dans le site. Le script suivant produit les images du jeu dans `src/assets/`, sans perte visible :

```bash
nix shell nixpkgs#oxipng --command scripts/optimize-images.sh
```

- dimensions réduites à ce qui est utile : 2 pixels par point affiché sur iPad 7, au-delà l'écran ne peut rien montrer de plus. Ça allège aussi la mémoire, importante sur l'iPad Mini 2 ;
- PNG recompressés sans perte, décor en JPEG ;
- PNG et JPEG uniquement : Safari 12 (iPad Mini 2) ne lit pas le WebP.

Après un nouvel export, il suffit de remplacer le fichier dans `design/source-images/` et de relancer le script. Une nouvelle image doit avoir sa largeur maximale dans le script (`max_width_for`).

### Organisation du code

```
src/
├── App.jsx                 composant principal, choisit l'écran affiché
├── WelcomeScreen.jsx       écran d'accueil (prénom, « C'est parti ! »)
├── WorkshopScreen.jsx      écran de jeu, dans le chantier
├── RotateDeviceScreen.jsx  « Tourne ton écran », affiché en portrait
├── Bobi.jsx                Bobi de face, par calques (corps, yeux, bouche qui parle)
├── letters.js              lettres, sons, mots, et règle anti-confusion
├── balancedLetterDraw.js   tirage équilibré des lettres de chaque tour
├── drawCountsStorage.js    compteurs du tirage gardés sur l'appareil
├── fonts.js                chargement des polices du jeu
├── letterFonts.js          polices des lettres, qui alternent d'un tour à l'autre
└── assets/                 images optimisées (produites par scripts/optimize-images.sh), sons
design/
└── source-images/          originaux des images (non inclus dans le site)
public/
├── manifest.webmanifest    description de l'application installable
├── sw.js                   service worker (fonctionnement hors ligne)
├── icons/                  icônes
└── splash/                 écrans de démarrage iOS
```

Le code est écrit en anglais, avec des noms explicites. Les textes destinés aux enfants restent en français.

## Crédits

### Polices

Le jeu n'utilise aucune police du système : il a la même apparence sur tous les appareils. Les polices sont incluses dans le site via les paquets [Fontsource](https://fontsource.org) (jeu de caractères latin seulement), pour fonctionner hors ligne. Les lettres des blocs alternent entre les trois, d'un tour à l'autre.

| Police | Rôle | Auteur | Licence |
|---|---|---|---|
| [Nunito](https://fonts.google.com/specimen/Nunito) | interface (boutons, prénom, score) ; lettres avec le a d'imprimerie (à deux étages) | The Nunito Project Authors | [SIL OFL 1.1](https://openfontlicense.org) |
| [Andika](https://software.sil.org/andika/) | fenêtre de bonne réponse (lettre, syllabe, mot) ; lettres avec le a fermé. Conçue pour l'apprentissage de la lecture | SIL International | [SIL OFL 1.1](https://openfontlicense.org) |
| [Playwrite FR Moderne](https://fonts.google.com/specimen/Playwrite+FR+Moderne) | lettres en cursive scolaire simple | Google Inc. (dessin : TypeTogether) | [SIL OFL 1.1](https://openfontlicense.org) |

### Sons

Les sons sont dans `src/assets/sounds/`. Ils ont tous été convertis en MP3 (lisible par Safari 12), avec un volume harmonisé. Certains ont aussi été raccourcis, avec un fondu en fin de son. Seuls les sons importés dans `src/soundEffects.js` sont inclus dans le site ; les autres restent disponibles pour les essais.

| Fichier | Utilisation | Œuvre originale | Auteur | Licence | Modifications |
|---|---|---|---|---|---|
| `success-magic-chime.mp3` | bonne réponse (utilisé) | [Shimmer glitter magic](https://opengameart.org/node/2286) | The Berklee College of Music (publié par qubodup) | [CC-BY 3.0](https://creativecommons.org/licenses/by/3.0/) | converti de FLAC en MP3, volume ajusté |
| `failure-double-bass-descending.mp3` | mauvaise réponse (utilisé) | `jingles_PIZZA07`, pack [85 Short music jingles](https://opengameart.org/node/22000) | [Kenney](https://www.kenney.nl) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | transposé de deux octaves vers le grave (même durée) et doublé à l'octave supérieure pour rester audible sur les haut-parleurs de tablette, converti d'OGG en MP3, volume ajusté |
| `failure-low-strings-descending.mp3` | mauvaise réponse (alternative, moins grave) | `jingles_PIZZA07`, pack [85 Short music jingles](https://opengameart.org/node/22000) | [Kenney](https://www.kenney.nl) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | transposé d'une octave vers le grave (même durée), converti d'OGG en MP3, volume ajusté |
| `failure-short-descending-tone.mp3` | mauvaise réponse (alternative) | `question_002`, pack [Interface Sounds](https://opengameart.org/content/interface-sounds) | [Kenney](https://www.kenney.nl) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | converti d'OGG en MP3, volume ajusté |
| `success-puzzle-jingle.mp3` | bonne réponse (alternative) | Cozy Puzzle Clear (Jingle), collection [Cozy Puzzle Jingle & Result](https://opengameart.org/content/cozy-puzzle-jingle-result) | MintoDog | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | raccourci à 2,5 s avec fondu, volume ajusté |
| `failure-puzzle-jingle.mp3` | mauvaise réponse (alternative) | Cozy Puzzle Failure (Jingle), collection [Cozy Puzzle Jingle & Result](https://opengameart.org/content/cozy-puzzle-jingle-result) | MintoDog | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | raccourci à 2,2 s avec fondu, volume ajusté |

Les sons en CC0 peuvent être utilisés sans attribution ; ils sont crédités ici par reconnaissance envers leurs auteurs. Le son en CC-BY 3.0 exige cette attribution.

