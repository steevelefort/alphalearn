import { useState } from 'react'
import { putInFrenchQuotes } from './frenchQuotes'
import { letters } from './letters'
import { speakFrenchText } from './speech'
import './SoundCheckScreen.css'

// Écran caché, pour écouter tous les sons sur un appareil (ouvert avec « ?sons » dans l'adresse).
// Il sert à repérer les prononciations que la synthèse vocale lit mal ou épelle (« Y, E, U »),
// en les comparant à de vrais mots qui se prononcent pareil : « deux », « ou eux »,
// ou les petits mots en « e » (« le », « de »…) dont le e se prononce justement « eu ».
const REAL_WORD_ALTERNATIVES = {
  beu: ['bœufs'],
  deu: ['deux', 'de'],
  keu: ['queue', 'que'],
  gueu: ['gueux'],
  meu: ['meuh', 'me'],
  neu: ['nœud', 'ne'],
  seu: ['ceux', 'se'],
  veu: ['veux'],
  heu: ['euh'],
  leu: ['le'],
  teu: ['te'],
  oueu: ['ou eux'],
}

function createSentenceToSpeak(pronunciation, isSpokenInInstruction) {
  if (!isSpokenInInstruction) return pronunciation
  return `Trouve la lettre qui fait ${putInFrenchQuotes(pronunciation)} !`
}

function SoundButton({ pronunciation, label, isSpokenInInstruction }) {
  return (
    <button
      type="button"
      className="sound-check-button"
      onClick={() => speakFrenchText(createSentenceToSpeak(pronunciation, isSpokenInInstruction))}
    >
      {label}
    </button>
  )
}

function SoundCheckScreen() {
  const [isSpokenInInstruction, setIsSpokenInInstruction] = useState(false)

  return (
    <div className="sound-check-screen">
      <h1 className="sound-check-title">Écoute des sons</h1>
      <p className="sound-check-help">
        Touche un son pour l’entendre. Note ceux que la voix épelle ou lit mal, et compare avec les vrais mots (à droite).
      </p>
      <label className="sound-check-option">
        <input
          type="checkbox"
          checked={isSpokenInInstruction}
          onChange={(event) => setIsSpokenInInstruction(event.target.checked)}
        />
        Lire dans une consigne (« Trouve la lettre qui fait… »)
      </label>

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
                    isSpokenInInstruction={isSpokenInInstruction}
                  />
                  {(REAL_WORD_ALTERNATIVES[pronunciation] || []).map((alternative) => (
                    <SoundButton
                      key={alternative}
                      pronunciation={alternative}
                      label={alternative}
                      isSpokenInInstruction={isSpokenInInstruction}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}

export default SoundCheckScreen
