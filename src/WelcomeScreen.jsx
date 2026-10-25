import { useState } from 'react'
import backgroundImage from './assets/backgrounds/construction-site.png'
import titleImage from './assets/title/title.png'
import Bobi from './Bobi'
import { PlayIcon } from './InlineIcons'
import './WelcomeScreen.css'

const FIRST_NAME_STORAGE_KEY = 'firstName'

// localStorage peut lever une exception (navigation privée sur les vieux Safari) :
// le prénom n'est alors simplement pas retenu.
function readStoredFirstName() {
  try {
    return localStorage.getItem(FIRST_NAME_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function storeFirstName(firstName) {
  try {
    localStorage.setItem(FIRST_NAME_STORAGE_KEY, firstName)
  } catch {
    // Rien à faire : le prénom sera redemandé la prochaine fois
  }
}

function sayHelloAndInviteToLearn(firstName, { onSpeechStart, onSpeechEnd }) {
  const utterance = new SpeechSynthesisUtterance(`Bonjour ${firstName}, allons apprendre à lire !`)
  utterance.lang = 'fr-FR'
  utterance.onstart = onSpeechStart
  utterance.onend = onSpeechEnd
  speechSynthesis.speak(utterance)
}

function WelcomeScreen({ onTransitionToGameEnd }) {
  const [firstName, setFirstName] = useState(readStoredFirstName)
  const [isTransitionToGameStarted, setIsTransitionToGameStarted] = useState(false)
  const [isBobiSpeaking, setIsBobiSpeaking] = useState(false)

  function updateFirstName(event) {
    setFirstName(event.target.value)
    storeFirstName(event.target.value)
  }

  function startTransitionToGame() {
    setIsTransitionToGameStarted(true)
    sayHelloAndInviteToLearn(firstName.trim(), {
      onSpeechStart: () => setIsBobiSpeaking(true),
      onSpeechEnd: () => setIsBobiSpeaking(false),
    })
  }

  // Fin du fondu crème final, porté par le calque ::after de l'écran.
  // On ne teste pas event.pseudoElement, mal pris en charge par les vieux Safari :
  // la colonne fait aussi un fondu d'opacité, mais son événement a la colonne pour cible.
  function detectFinalFadeEnd(event) {
    if (event.target === event.currentTarget && event.propertyName === 'opacity') {
      onTransitionToGameEnd(firstName.trim())
    }
  }

  return (
    <div
      className={isTransitionToGameStarted ? 'welcome-screen is-moving-forward' : 'welcome-screen'}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onTransitionEnd={detectFinalFadeEnd}
    >
      <Bobi isAmazed={isTransitionToGameStarted} isSpeaking={isBobiSpeaking} className="welcome-bobi" />
      <div className="welcome-column">
        <img src={titleImage} className="welcome-title" alt="Le chantier des lettres. On apprend ensemble ?" />
        <input
          type="text"
          className="welcome-first-name"
          placeholder="Ton prénom"
          aria-label="Prénom de l’enfant"
          value={firstName}
          onChange={updateFirstName}
        />
        <button
          type="button"
          className="welcome-play-button"
          disabled={!firstName.trim()}
          onClick={startTransitionToGame}
        >
          <PlayIcon /> C’est parti !
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen
