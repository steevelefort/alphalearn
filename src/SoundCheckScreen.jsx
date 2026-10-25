import { useState } from 'react'
import { getSpokenSyllable } from './correctAnswerLesson'
import { announceSound } from './letterRound'
import { letters } from './letters'
import { speakFrenchText } from './speech'
import { findSimpleSyllablesWithLetter } from './syllables'
import './SoundCheckScreen.css'

// Écran caché, pour écouter tous les sons sur un appareil (ouvert avec « ?sons » dans l'adresse).
// Il sert à repérer les prononciations que la synthèse vocale lit mal ou épelle (« Y, E, U »),
// en les comparant à de vrais mots qui se prononcent pareil : « deux », « ou eux »,
// ou les petits mots en « e » (« le », « de »…) dont le e se prononce justement « eu ».
const REAL_WORD_ALTERNATIVES = {
  beu: ['bœufs'],
  deu: ['deux', 'de'],
  keu: ['queue', 'que', 'queux', 'keuh', 'kœ'],
  gueu: ['gueux'],
  meu: ['meuh', 'me'],
  neu: ['nœud', 'ne'],
  seu: ['ceux', 'se'],
  veu: ['veux'],
  heu: ['euh'],
  leu: ['le'],
  teu: ['te', 'teuh', 'tœ', "t'eux"],
}

// Façons de faire entendre un son, pour comparer sur l'appareil. `sentenceStart` est le début
// de phrase du jeu (« Trouve la lettre qui fait » pour un son, « Ça fait » pour une syllabe).
// Les variantes du jeu gardent la pause après « fait » et changent seulement l'écriture du son.
const LISTENING_MODES = [
  { id: 'alone', label: 'Son seul : keu', createSentence: (start, sound) => sound },
  {
    id: 'game',
    label: 'Phrase comme le jeu : « …qui fait, le son « keu » ! »',
    createSentence: (start, sound) => `${start}, ${announceSound(sound)} !`,
  },
  {
    id: 'straight-quotes',
    label: 'Guillemets droits : « …qui fait, le son "keu" ! »',
    createSentence: (start, sound) => `${start}, le son "${sound}" !`,
  },
  {
    id: 'no-quotes',
    label: 'Sans guillemets : « …qui fait, le son keu ! »',
    createSentence: (start, sound) => `${start}, le son ${sound} !`,
  },
  {
    id: 'longer-pause',
    label: 'Pause plus longue : « …qui fait… le son « keu » ! »',
    createSentence: (start, sound) => `${start}… ${announceSound(sound)} !`,
  },
  {
    id: 'no-pause',
    label: 'Sans pause ni « le son » : « …qui fait keu ! »',
    createSentence: (start, sound) => `${start} ${sound} !`,
  },
]

function createSentenceToSpeak(pronunciation, listeningModeId, sentenceStart) {
  const listeningMode = LISTENING_MODES.find((mode) => mode.id === listeningModeId)
  return listeningMode.createSentence(sentenceStart, pronunciation)
}

// Phrases complètes qui se terminent par « keu » (le son le plus délicat sur iPad),
// pour choisir à l'oreille la meilleure combinaison de pause, de guillemets et d'annonce.
// `isUsedByGame` : la phrase que le jeu dit aujourd'hui.
const KEU_TRIAL_SENTENCES = [
  { text: 'Trouve la lettre qui fait keu !' },
  { text: 'Trouve la lettre qui fait « keu » !' },
  { text: 'Trouve la lettre qui fait "keu" !' },
  { text: 'Trouve la lettre qui fait, keu !' },
  { text: 'Trouve la lettre qui fait, « keu » !' },
  { text: 'Trouve la lettre qui fait, "keu" !' },
  { text: 'Trouve la lettre qui fait… keu !' },
  { text: 'Trouve la lettre qui fait… « keu » !' },
  { text: 'Trouve la lettre qui fait : keu !' },
  { text: 'Trouve la lettre qui fait : « keu » !' },
  { text: 'Trouve la lettre qui fait le son keu !' },
  { text: 'Trouve la lettre qui fait le son « keu » !' },
  { text: 'Trouve la lettre qui fait le son "keu" !' },
  { text: 'Trouve la lettre qui fait, le son keu !' },
  { text: 'Trouve la lettre qui fait, le son « keu » !', isUsedByGame: true },
  { text: 'Trouve la lettre qui fait, le son "keu" !' },
  { text: 'Trouve la lettre qui fait… le son keu !' },
  { text: 'Trouve la lettre qui fait… le son « keu » !' },
  { text: 'Trouve la lettre qui fait le son : keu !' },
  { text: 'Trouve la lettre qui fait le son : « keu » !' },
  { text: 'Trouve la lettre qui fait ce son-là : keu !' },
  { text: 'Écoute bien. Trouve la lettre qui fait keu !' },
  { text: 'Trouve la lettre qui fait keu.' },
  { text: 'Trouve la lettre qui fait « keu ».' },
  { text: 'Trouve la lettre qui fait, le son « keu ».' },
  { text: 'Quelle lettre fait le son keu ?' },
  { text: 'Quelle lettre fait, le son « keu » ?' },
  { text: 'Trouve la lettre qui fait le son « keu », keu !' },
]

// Toutes les syllabes que la leçon peut montrer, tirées des mots de chaque lettre, sans doublon
const ALL_LESSON_SYLLABLES = [
  ...new Set(
    letters.flatMap((letter) =>
      letter.words.flatMap((word) => findSimpleSyllablesWithLetter(word, letter.symbol).map((syllable) => syllable.text)),
    ),
  ),
].sort()

function SoundButton({ pronunciation, label, listeningMode, sentenceStart = 'Trouve la lettre qui fait' }) {
  return (
    <button
      type="button"
      className="sound-check-button"
      onClick={() => speakFrenchText(createSentenceToSpeak(pronunciation, listeningMode, sentenceStart))}
    >
      {label}
    </button>
  )
}

function SoundCheckScreen() {
  const [listeningMode, setListeningMode] = useState(LISTENING_MODES[0].id)

  return (
    <div className="sound-check-screen">
      <h1 className="sound-check-title">Écoute des sons</h1>
      <p className="sound-check-help">
        Touche un son pour l’entendre. Note ceux que la voix épelle ou lit mal, et compare avec les vrais mots (à droite).
      </p>
      {LISTENING_MODES.map((mode) => (
        <label key={mode.id} className="sound-check-option">
          <input
            type="radio"
            name="listening-mode"
            checked={listeningMode === mode.id}
            onChange={() => setListeningMode(mode.id)}
          />
          {mode.label}
        </label>
      ))}

      <div className="sound-check-grid">
        {letters
          .filter((letter) => letter.sounds.length > 0)
          .map((letter) => (
            <div key={letter.symbol} className="sound-check-letter">
              <span className="sound-check-symbol">{letter.symbol}</span>
              {letter.sounds.map(({ pronunciation }) => (
                <div key={pronunciation} className="sound-check-row">
                  <SoundButton
                    pronunciation={pronunciation}
                    label={pronunciation}
                    listeningMode={listeningMode}
                  />
                  {(REAL_WORD_ALTERNATIVES[pronunciation] || []).map((alternative) => (
                    <SoundButton
                      key={alternative}
                      pronunciation={alternative}
                      label={alternative}
                      listeningMode={listeningMode}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
      </div>

      <h2 className="sound-check-subtitle">Syllabes de la leçon</h2>
      <p className="sound-check-help">
        Comme dans la leçon : « Ça fait… ». Quand la voix lit une autre graphie, elle est indiquée après la flèche.
      </p>
      <div className="sound-check-grid">
        {ALL_LESSON_SYLLABLES.map((syllableText) => {
          const spokenSyllable = getSpokenSyllable(syllableText)
          const label = spokenSyllable === syllableText ? syllableText : `${syllableText} → ${spokenSyllable}`
          return (
            <SoundButton
              key={syllableText}
              pronunciation={spokenSyllable}
              label={label}
              listeningMode={listeningMode}
              sentenceStart="Ça fait"
            />
          )
        })}
      </div>

      <h2 className="sound-check-subtitle">Phrases d’essai</h2>
      <p className="sound-check-help">
        Toutes se terminent par « keu ». Note le numéro de celle qui sonne le mieux, sur chaque appareil.
      </p>
      <ol className="sound-check-sentences">
        {KEU_TRIAL_SENTENCES.map((sentence) => (
          <li key={sentence.text}>
            <button type="button" className="sound-check-sentence-button" onClick={() => speakFrenchText(sentence.text)}>
              {sentence.text}
              {sentence.isUsedByGame && <span className="sound-check-game-tag"> (phrase actuelle du jeu)</span>}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default SoundCheckScreen
