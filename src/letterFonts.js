// Polices des blocs de lettres : on alterne d'un tour à l'autre, pour que l'enfant
// reconnaisse une lettre sous ses différentes formes. (Les polices sont chargées dans fonts.js.)
import './letterFonts.css'

export const LETTER_FONTS = [
  { name: 'print', className: 'letter-font-print' }, // a d'imprimerie, à deux étages (Nunito)
  { name: 'single-storey-a', className: 'letter-font-single-storey-a' }, // a fermé, rond avec une queue (Andika)
  { name: 'cursive', className: 'letter-font-cursive' }, // cursive scolaire simple (Playwrite FR Moderne)
]
