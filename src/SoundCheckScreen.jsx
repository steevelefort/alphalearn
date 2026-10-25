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

// Façons de faire entendre un son, pour comparer : seul, après une pause (les guillemets
// en créent une, comme dans le jeu), ou au milieu d'une phrase, sans pause
const ListeningMode = Object.freeze({
  ALONE: 'alone',
  IN_SENTENCE_WITH_PAUSE: 'in-sentence-with-pause',
  IN_SENTENCE_WITHOUT_PAUSE: 'in-sentence-without-pause',
})

const LISTENING_MODE_LABELS = {
  [ListeningMode.ALONE]: 'Son seul : « keu »',
  [ListeningMode.IN_SENTENCE_WITH_PAUSE]: 'Phrase comme le jeu : « Trouve la lettre qui fait, le son « keu » ! »',
  [ListeningMode.IN_SENTENCE_WITHOUT_PAUSE]: 'Phrase, sans pause : « Trouve la lettre qui fait keu ! »',
}

// `sentenceStart` : le début de phrase du jeu (consigne pour un son, leçon pour une syllabe)
function createSentenceToSpeak(pronunciation, listeningMode, sentenceStart) {
  if (listeningMode === ListeningMode.IN_SENTENCE_WITH_PAUSE) {
    return `${sentenceStart}, ${announceSound(pronunciation)} !`
  }
  if (listeningMode === ListeningMode.IN_SENTENCE_WITHOUT_PAUSE) {
    return `${sentenceStart} ${pronunciation} !`
  }
  return pronunciation
}

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
  const [listeningMode, setListeningMode] = useState(ListeningMode.ALONE)

  return (
    <div className="sound-check-screen">
      <h1 className="sound-check-title">Écoute des sons</h1>
      <p className="sound-check-help">
        Touche un son pour l’entendre. Note ceux que la voix épelle ou lit mal, et compare avec les vrais mots (à droite).
      </p>
      {Object.values(ListeningMode).map((mode) => (
        <label key={mode} className="sound-check-option">
          <input
            type="radio"
            name="listening-mode"
            checked={listeningMode === mode}
            onChange={() => setListeningMode(mode)}
          />
          {LISTENING_MODE_LABELS[mode]}
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
    </div>
  )
}

export default SoundCheckScreen
