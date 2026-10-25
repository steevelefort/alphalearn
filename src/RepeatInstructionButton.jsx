import SpeakerIcon from './SpeakerIcon'
import './RepeatInstructionButton.css'

// Gros bouton haut-parleur : Bobi répète la consigne
function RepeatInstructionButton({ onPress }) {
  return (
    <button type="button" className="repeat-instruction-button" aria-label="Répéter la consigne" onClick={onPress}>
      <SpeakerIcon />
    </button>
  )
}

export default RepeatInstructionButton
