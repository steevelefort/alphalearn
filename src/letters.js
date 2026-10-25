// Lettres et sons du jeu.
// - symbol : ce qu'on affiche à l'écran
// - type : voyelle ou consonne (y, é, è et ê comptent comme des voyelles)
// - sounds : les sons que la lettre peut faire (le g fait « gueu » ou « jeu »). Chaque son a :
//   - pronunciation : le texte lu par la synthèse vocale pour le faire entendre.
//     Les voyelles prennent un h (« hé », « ho ») : seules, certaines voix les lisent
//     comme un nom de lettre (« é » devient « e accent aigu »).
//     Sauf le i : « hi » est un mot anglais (« salut »), lu « haï ». Et le nom de la lettre i
//     se prononce justement « i ».
//   - phonemes : de quoi il est fait. Deux lettres qui partagent un phonème
//     (c et k, s et z, i et y…) ne doivent pas être proposées en même temps.
//   Une liste vide veut dire que la lettre est muette (h).
// - words : des mots français très courts et faciles qui contiennent ce son.
//   Pas de voyelles composées (on, an, en, in, un, ou, au, ai, oi, eu, ill…) :
//   on en tire des syllabes simples, qui doivent se lire comme elles s'écrivent.
export const LetterType = Object.freeze({
  VOWEL: 'vowel',
  CONSONANT: 'consonant',
})

const { VOWEL, CONSONANT } = LetterType

function sound(pronunciation, ...phonemes) {
  return { pronunciation, phonemes }
}

export const letters = [
  { symbol: 'a', type: VOWEL, sounds: [sound('ha', 'a')], words: ['papa', 'ami', 'lama', 'sofa'] },
  { symbol: 'b', type: CONSONANT, sounds: [sound('beu', 'b')], words: ['bobo', 'bébé', 'Bobi'] },
  { symbol: 'c', type: CONSONANT, sounds: [sound('keu', 'k'), sound('seu', 's')], words: ['coco', 'café', 'cacao'] },
  { symbol: 'd', type: CONSONANT, sounds: [sound('deu', 'd')], words: ['dodo', 'dé', 'domino', 'dada'] },
  { symbol: 'e', type: VOWEL, sounds: [sound('heu', 'eu')], words: ['menu', 'petit'] },
  { symbol: 'é', type: VOWEL, sounds: [sound('hé', 'é')], words: ['bébé', 'été', 'épi', 'vélo'] },
  { symbol: 'è', type: VOWEL, sounds: [sound('hè', 'è')], words: ['père', 'mère', 'zèbre'] },
  { symbol: 'ê', type: VOWEL, sounds: [sound('hè', 'è')], words: ['tête', 'fête', 'rêve'] },
  { symbol: 'f', type: CONSONANT, sounds: [sound('feu', 'f')], words: ['fini', 'sofa', 'café', 'futé'] },
  { symbol: 'g', type: CONSONANT, sounds: [sound('gueu', 'g'), sound('jeu', 'j')], words: ['rigolo', 'légo', 'gâté'] },
  { symbol: 'h', type: CONSONANT, sounds: [], words: ['hamac'] },
  { symbol: 'i', type: VOWEL, sounds: [sound('i', 'i')], words: ['mimi', 'midi', 'kiwi', 'ici'] },
  { symbol: 'j', type: CONSONANT, sounds: [sound('jeu', 'j')], words: ['judo', 'joli', 'pyjama'] },
  { symbol: 'k', type: CONSONANT, sounds: [sound('keu', 'k')], words: ['kiwi', 'kaki', 'moka', 'koala'] },
  { symbol: 'l', type: CONSONANT, sounds: [sound('leu', 'l')], words: ['lama', 'lavabo', 'vélo', 'salami'] },
  { symbol: 'm', type: CONSONANT, sounds: [sound('meu', 'm')], words: ['moto', 'mémé', 'mimi', 'ami'] },
  { symbol: 'n', type: CONSONANT, sounds: [sound('neu', 'n')], words: ['numéro', 'domino', 'kimono'] },
  { symbol: 'o', type: VOWEL, sounds: [sound('ho', 'o')], words: ['dodo', 'moto', 'vélo', 'domino'] },
  { symbol: 'p', type: CONSONANT, sounds: [sound('peu', 'p')], words: ['papa', 'papi', 'pépé', 'puma'] },
  { symbol: 'q', type: CONSONANT, sounds: [sound('keu', 'k')], words: ['coq', 'qui'] },
  { symbol: 'r', type: CONSONANT, sounds: [sound('reu', 'r')], words: ['radio', 'rôti', 'ravi', 'numéro'] },
  { symbol: 's', type: CONSONANT, sounds: [sound('seu', 's'), sound('zeu', 'z')], words: ['soda', 'sofa', 'sumo', 'salami'] },
  { symbol: 't', type: CONSONANT, sounds: [sound('teu', 't')], words: ['tata', 'tutu', 'titi', 'taxi'] },
  { symbol: 'u', type: VOWEL, sounds: [sound('hu', 'u')], words: ['tutu', 'judo', 'puma', 'mur'] },
  { symbol: 'v', type: CONSONANT, sounds: [sound('veu', 'v')], words: ['vélo', 'lavabo', 'ravi'] },
  { symbol: 'w', type: CONSONANT, sounds: [sound('oueu', 'w'), sound('veu', 'v')], words: ['kiwi', 'wapiti', 'wifi'] },
  { symbol: 'x', type: CONSONANT, sounds: [sound('kseu', 'k', 's')], words: ['taxi', 'saxo', 'boxe'] },
  { symbol: 'y', type: VOWEL, sounds: [sound('i', 'i'), sound('yeu', 'y')], words: ['yoyo', 'pyjama', 'stylo'] },
  { symbol: 'z', type: CONSONANT, sounds: [sound('zeu', 'z')], words: ['zéro', 'zébu', 'zigzag'] },
]

// Phonèmes différents mais faciles à confondre à l'oreille, surtout avec la synthèse vocale
const SIMILAR_PHONEME_PAIRS = [
  ['b', 'p'],
  ['d', 't'],
  ['f', 'v'],
  ['k', 'g'],
  ['m', 'n'],
  ['é', 'è'],
]

function arePhonemesSimilar(firstPhoneme, secondPhoneme) {
  return SIMILAR_PHONEME_PAIRS.some(
    ([pairFirst, pairSecond]) =>
      (pairFirst === firstPhoneme && pairSecond === secondPhoneme) ||
      (pairFirst === secondPhoneme && pairSecond === firstPhoneme),
  )
}

function getAllPhonemes(letter) {
  return letter.sounds.flatMap((letterSound) => letterSound.phonemes)
}

// Vrai si les deux lettres ne doivent pas être proposées sur le même écran
export function areLettersConfusable(firstLetter, secondLetter, { avoidSimilarSounds = true } = {}) {
  const secondLetterPhonemes = getAllPhonemes(secondLetter)
  return getAllPhonemes(firstLetter).some((firstPhoneme) =>
    secondLetterPhonemes.some(
      (secondPhoneme) =>
        firstPhoneme === secondPhoneme || (avoidSimilarSounds && arePhonemesSimilar(firstPhoneme, secondPhoneme)),
    ),
  )
}
