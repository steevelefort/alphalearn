import { useEffect, useState } from 'react'
import decor from './assets/decors/chantier.png'
import titre from './assets/titre/titre.png'
import Bobi from './Bobi'
import './Accueil.css'

function Accueil({ onStart, onEnd }) {
  const [content, setContent] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [parle, setParle] = useState(false)

  useEffect(() => {
    setPrenom(localStorage.getItem('prenom') ?? '')
  }, [])

  return (
    <div
      className={content ? 'accueil avance' : 'accueil'}
      style={{ backgroundImage: `url(${decor})` }}
      onTransitionEnd={(e) => {
        // Fin du fondu crème final (calque ::after)
        if (e.nativeEvent.pseudoElement === '::after') onEnd?.()
      }}
    >
      <Bobi content={content} parle={parle} className="accueil-bobi" />
      <div className="accueil-colonne">
        <img src={titre} className="accueil-titre" alt="Le chantier des lettres. On apprend ensemble ?" />
        <input
          type="text"
          className="accueil-prenom"
          placeholder="Ton prénom"
          aria-label="Prénom de l’enfant"
          value={prenom}
          onChange={(e) => {
            setPrenom(e.target.value)
            localStorage.setItem('prenom', e.target.value)
          }}
        />
        <button
          type="button"
          className="accueil-play"
          disabled={!prenom.trim()}
          onClick={() => {
            setContent(true)
            const utterance = new SpeechSynthesisUtterance(`Bonjour ${prenom.trim()}, allons apprendre !`)
            utterance.lang = 'fr-FR'
            utterance.onstart = () => setParle(true)
            utterance.onend = () => setParle(false)
            speechSynthesis.speak(utterance)
            onStart?.(prenom)
          }}
        >
          ▶ C’est parti !
        </button>
      </div>
    </div>
  )
}

export default Accueil
