#!/usr/bin/env bash
# Produit les images du jeu (src/assets) à partir des originaux (design/source-images), sans perte visible :
# - dimensions réduites à ce qui est utile : 2 pixels par point affiché sur iPad 7 (1080 × 810 points),
#   au-delà l'écran ne peut rien montrer de plus. Ça allège aussi la mémoire, important sur l'iPad Mini 2 ;
# - PNG recompressés sans perte (oxipng) : les pixels restent identiques ;
# - décor en JPEG (pas de transparence), à sa taille d'origine.
# Formats choisis pour Safari 12 (iPad Mini 2) : PNG et JPEG classique, pas de WebP.
# Les originaux ne sont jamais modifiés. Relancer le script après chaque nouvel export d'image.
# Usage : scripts/optimize-images.sh
# Nécessite ImageMagick (« magick ») et oxipng. Sans oxipng installé :
#   nix shell nixpkgs#oxipng --command scripts/optimize-images.sh
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$project_root/design/source-images"
output_dir="$project_root/src/assets"

# Largeur maximale utile, en pixels, selon l'endroit où l'image est affichée
max_width_for() {
  case "$1" in
    eyes/*) echo 800 ;;                          # yeux du Bobi de face (accueil) : ~400 points au plus
    mouths/*) echo 700 ;;                        # bouche du Bobi de face : ~350 points au plus
    bobi/body.png) echo 800 ;;                   # corps dans l'atelier : ~380 points
    bobi/blade.png | bobi/back-arm-*) echo 450 ;; # lame et bras dans l'atelier : ~215 points
    bobi/front-view.png) echo 1254 ;;            # Bobi de face : jusqu'à ~730 points à l'accueil, taille d'origine
    title/title.png) echo 1100 ;;                # titre de l'accueil : ~540 points
    *) echo "Pas de largeur prévue pour $1 : ajoute-la dans max_width_for" >&2; exit 1 ;;
  esac
}

optimize_png() { # chemin relatif
  local relative_path=$1 max_width
  max_width=$(max_width_for "$relative_path")
  mkdir -p "$(dirname "$output_dir/$relative_path")"
  # « > » : on ne fait que réduire, jamais agrandir. Couleurs converties en sRGB avant de retirer les métadonnées.
  magick "$source_dir/$relative_path" -colorspace sRGB -resize "${max_width}x${max_width}>" -depth 8 -strip \
    "$output_dir/$relative_path"
  oxipng --quiet --opt 4 --strip safe "$output_dir/$relative_path"
}

optimize_background_jpeg() { # chemin relatif du PNG original
  local relative_path=$1
  mkdir -p "$(dirname "$output_dir/$relative_path")"
  magick "$source_dir/$relative_path" -colorspace sRGB -strip -quality 88 -sampling-factor 4:2:0 -interlace none \
    "$output_dir/${relative_path%.png}.jpg"
}

cd "$source_dir"
find . -name '*.png' ! -path './backgrounds/*' | sort | while read -r image; do
  optimize_png "${image#./}"
done
for background in backgrounds/*.png; do
  optimize_background_jpeg "$background"
done

echo "Images optimisées dans src/assets ($(du -sh --exclude=sounds "$output_dir" | cut -f1), sons compris : $(du -sh "$output_dir" | cut -f1))."
