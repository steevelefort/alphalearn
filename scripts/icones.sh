#!/usr/bin/env bash
# Génère les icônes et les écrans de démarrage de la PWA à partir d'une image carrée.
# Usage : scripts/icones.sh chemin/vers/icone-grand-format.png
# Nécessite ImageMagick (commande « magick »).
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage : $0 chemin/vers/icone-grand-format.png (carrée, au moins 1024 px)" >&2
  exit 1
fi
source="$1"
racine="$(cd "$(dirname "$0")/.." && pwd)"
icones="$racine/public/icons"
splash="$racine/public/splash"
decor="$racine/src/assets/decors/chantier.png"
fond='#fff6e3'

mkdir -p "$icones" "$splash"

redim() { # taille fichier
  magick "$source" -resize "$1x$1" -strip -quality 92 "$2"
}

# Favicons (onglet du navigateur)
redim 16 "$icones/favicon-16.png"
redim 32 "$icones/favicon-32.png"
magick "$source" -strip -define icon:auto-resize=48,32,16 "$racine/public/favicon.ico"

# iOS / iPadOS : iOS arrondit lui-même les coins, l'image doit rester carrée et opaque
redim 180 "$icones/apple-touch-icon.png"  # iPhone, iPad Retina (iPad 7, iPad Mini 2)
redim 167 "$icones/apple-touch-icon-167.png" # iPad Pro
redim 152 "$icones/apple-touch-icon-152.png" # anciens iPad Retina

# Manifeste (Android, Chrome, Edge). L'image va jusqu'aux bords, elle sert aussi de « maskable ».
redim 192 "$icones/icon-192.png"
redim 512 "$icones/icon-512.png"
# Version maskable : l'image est réduite à 80 % sur un fond uni, pour que le découpage
# en cercle ou en goutte d'Android ne coupe pas les lettres ABC.
magick -size 512x512 "xc:$fond" \( "$source" -resize 410x410 \) -gravity center -composite \
  -strip "$icones/icon-maskable-512.png"

# Écrans de démarrage iOS (affichés pendant le chargement de l'appli lancée depuis l'écran d'accueil) :
# le décor du chantier, avec l'icône au centre aux coins arrondis.
ecran() { # largeur hauteur fichier
  local l=$1 h=$2 cote rayon
  cote=$(( (l < h ? l : h) * 35 / 100 ))
  rayon=$(( cote * 22 / 100 ))
  magick "$decor" -resize "${l}x${h}^" -gravity center -extent "${l}x${h}" \
    \( "$source" -resize "${cote}x${cote}" \
       \( -size "${cote}x${cote}" xc:none -fill white -draw "roundrectangle 0,0,$((cote-1)),$((cote-1)),$rayon,$rayon" \) \
       -alpha set -compose DstIn -composite \) \
    -compose Over -gravity center -composite -strip -quality 85 "$splash/$3"
}
ecran 1620 2160 ipad-10-2-portrait.jpg  # iPad 7, 8, 9 (10,2 pouces)
ecran 2160 1620 ipad-10-2-paysage.jpg
ecran 1536 2048 ipad-9-7-portrait.jpg   # iPad Mini 2 à 5, iPad 9,7 pouces
ecran 2048 1536 ipad-9-7-paysage.jpg

echo "Icônes générées dans public/icons, écrans de démarrage dans public/splash."
