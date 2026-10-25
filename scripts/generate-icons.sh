#!/usr/bin/env bash
# Génère les icônes et les écrans de démarrage de la PWA à partir d'une image carrée.
# Usage : scripts/generate-icons.sh chemin/vers/icone-grand-format.png
# Nécessite ImageMagick (commande « magick »).
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage : $0 chemin/vers/icone-grand-format.png (carrée, au moins 1024 px)" >&2
  exit 1
fi
source_image="$1"
project_root="$(cd "$(dirname "$0")/.." && pwd)"
icons_dir="$project_root/public/icons"
splash_dir="$project_root/public/splash"
background_image="$project_root/design/source-images/backgrounds/construction-site.png"
fill_color='#fff6e3'

mkdir -p "$icons_dir" "$splash_dir"

resize_icon() { # size output_file
  magick "$source_image" -resize "$1x$1" -strip -quality 92 "$2"
}

# Favicons (onglet du navigateur)
resize_icon 16 "$icons_dir/favicon-16.png"
resize_icon 32 "$icons_dir/favicon-32.png"
magick "$source_image" -strip -define icon:auto-resize=48,32,16 "$project_root/public/favicon.ico"

# iOS / iPadOS : iOS arrondit lui-même les coins, l'image doit rester carrée et opaque
resize_icon 180 "$icons_dir/apple-touch-icon.png"     # iPhone, iPad Retina (iPad 7, iPad Mini 2)
resize_icon 167 "$icons_dir/apple-touch-icon-167.png" # iPad Pro
resize_icon 152 "$icons_dir/apple-touch-icon-152.png" # anciens iPad Retina

# Manifeste (Android, Chrome, Edge)
resize_icon 192 "$icons_dir/icon-192.png"
resize_icon 512 "$icons_dir/icon-512.png"
# Version maskable : l'image est réduite à 80 % sur un fond uni, pour que le découpage
# en cercle ou en goutte d'Android ne coupe pas les lettres ABC.
magick -size 512x512 "xc:$fill_color" \( "$source_image" -resize 410x410 \) -gravity center -composite \
  -strip "$icons_dir/icon-maskable-512.png"

# Écrans de démarrage iOS (affichés pendant le chargement de l'appli lancée depuis l'écran d'accueil) :
# le décor du chantier, avec l'icône au centre aux coins arrondis.
generate_splash_screen() { # width height output_file
  local width=$1 height=$2 icon_size corner_radius
  icon_size=$(( (width < height ? width : height) * 35 / 100 ))
  corner_radius=$(( icon_size * 22 / 100 ))
  magick "$background_image" -resize "${width}x${height}^" -gravity center -extent "${width}x${height}" \
    \( "$source_image" -resize "${icon_size}x${icon_size}" \
       \( -size "${icon_size}x${icon_size}" xc:none -fill white \
          -draw "roundrectangle 0,0,$((icon_size-1)),$((icon_size-1)),$corner_radius,$corner_radius" \) \
       -alpha set -compose DstIn -composite \) \
    -compose Over -gravity center -composite -strip -quality 85 "$splash_dir/$3"
}
generate_splash_screen 1620 2160 ipad-10-2-portrait.jpg  # iPad 7, 8, 9 (10,2 pouces)
generate_splash_screen 2160 1620 ipad-10-2-landscape.jpg
generate_splash_screen 1536 2048 ipad-9-7-portrait.jpg   # iPad Mini 2 à 5, iPad 9,7 pouces
generate_splash_screen 2048 1536 ipad-9-7-landscape.jpg

echo "Icônes générées dans public/icons, écrans de démarrage dans public/splash."
